import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

const AnimatedNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initNodes = () => {
      const nodeCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
      nodesRef.current = [];
      
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: []
        });
      }
    };

    const findConnections = () => {
      const maxDistance = Math.min(150, Math.max(80, canvas.width / 10));
      
      nodesRef.current.forEach((node, i) => {
        node.connections = [];
        nodesRef.current.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              node.connections.push(j);
            }
          }
        });
      });
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(20, 83, 103, 1)'; // Base teal color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodesRef.current.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Update connections periodically
      if (Math.random() < 0.02) {
        findConnections();
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(94, 234, 212, 0.3)'; // Teal-300 with opacity
      ctx.lineWidth = 1;
      
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          if (connectionIndex > i) { // Avoid drawing same line twice
            const otherNode = nodesRef.current[connectionIndex];
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Fade line based on distance
            const opacity = Math.max(0, 1 - distance / 150);
            ctx.globalAlpha = opacity * 0.4;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      ctx.globalAlpha = 0.8;
      nodesRef.current.forEach(node => {
        // Glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        gradient.addColorStop(0, 'rgba(94, 234, 212, 0.8)'); // Teal-300
        gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.4)'); // Teal-400
        gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = 'rgba(94, 234, 212, 1)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initNodes();
    findConnections();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initNodes();
      findConnections();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        background: 'linear-gradient(135deg, #134e4a 0%, #155e63 35%, #0f766e 100%)',
        zIndex: 0
      }}
    />
  );
};

export default AnimatedNetworkBackground;
