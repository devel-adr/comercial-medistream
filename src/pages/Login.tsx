import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Lock, Mail } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<Node[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      const nodeCount = 80;
      nodesRef.current = [];
      
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          connections: []
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const animate = () => {
      timeRef.current += 0.01;
      
      // Clear canvas with teal gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0d4d4d');
      gradient.addColorStop(0.5, '#0f5f5f');
      gradient.addColorStop(1, '#1a6b6b');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Update node positions with constant movement
      nodes.forEach((node, index) => {
        // Add wave motion for constant movement
        const waveX = Math.sin(timeRef.current + index * 0.1) * 0.3;
        const waveY = Math.cos(timeRef.current + index * 0.15) * 0.3;
        
        node.vx += waveX * 0.02;
        node.vy += waveY * 0.02;

        // Mouse attraction/repulsion
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200 * 0.03;
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        // Apply velocity with slight damping to keep movement smooth
        node.vx *= 0.995;
        node.vy *= 0.995;
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges instead of bouncing for continuous movement
        if (node.x < -50) node.x = canvas.width + 50;
        if (node.x > canvas.width + 50) node.x = -50;
        if (node.y < -50) node.y = canvas.height + 50;
        if (node.y > canvas.height + 50) node.y = -50;
      });

      // Draw connections with animated opacity
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const baseOpacity = (150 - distance) / 150 * 0.6;
            const pulseOpacity = Math.sin(timeRef.current * 2 + i * 0.1) * 0.2 + 0.3;
            const finalOpacity = Math.min(baseOpacity * pulseOpacity, 0.8);
            
            ctx.strokeStyle = `rgba(45, 212, 191, ${finalOpacity})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with pulsing animation
      nodes.forEach((node, index) => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNear = distance < 120;
        
        const pulse = Math.sin(timeRef.current * 3 + index * 0.2) * 0.5 + 1;
        const baseRadius = isNear ? 4 : 2;
        const radius = baseRadius * pulse;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        const nodeOpacity = 0.7 + Math.sin(timeRef.current * 2 + index * 0.1) * 0.3;
        ctx.fillStyle = isNear ? 
          `rgba(45, 212, 191, ${Math.min(nodeOpacity + 0.3, 1)})` : 
          `rgba(45, 212, 191, ${nodeOpacity})`;
        ctx.fill();
        
        if (isNear) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(45, 212, 191, ${0.4 * pulse})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Error de autenticación');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Network Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Additional animated overlay for depth */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-200 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl mb-4 shadow-2xl transform hover:scale-105 transition-transform">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">MEDISTREAM</h1>
          <p className="text-teal-200 text-lg">Portal de Acceso Seguro</p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-14 bg-white/10 border-white/30 text-white placeholder:text-white/70 rounded-xl focus:border-teal-400 focus:ring-teal-400 backdrop-blur-sm"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12 h-14 bg-white/10 border-white/30 text-white placeholder:text-white/70 rounded-xl focus:border-teal-400 focus:ring-teal-400 backdrop-blur-sm"
                />
              </div>
            </div>

            {error && (
              <Alert className="bg-red-500/20 border-red-500/50 text-white backdrop-blur-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              Base de datos de laboratorios farmacéuticos
            </p>
            <div className="flex justify-center items-center mt-4 space-x-4">
              <div className="w-8 h-1 bg-teal-400 rounded-full"></div>
              <div className="w-4 h-1 bg-teal-300 rounded-full"></div>
              <div className="w-2 h-1 bg-teal-200 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            © 2025 Medistream System. Acceso autorizado únicamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
