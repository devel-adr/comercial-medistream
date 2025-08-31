
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
      const nodeCount = 50;
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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(6, 78, 59, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Update node positions
      nodes.forEach((node) => {
        // Mouse attraction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.02;
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        // Apply velocity with damping
        node.vx *= 0.98;
        node.vy *= 0.98;
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -0.8;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -0.8;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.4;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      ctx.globalAlpha = 1;
      nodes.forEach((node) => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNear = distance < 100;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, isNear ? 4 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isNear ? 'rgba(45, 212, 191, 0.9)' : 'rgba(45, 212, 191, 0.6)';
        ctx.fill();
        
        if (isNear) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Network Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #155e75 100%)' }}
      />
      
      {/* Additional animated elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-teal-200 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-2xl transform hover:scale-105 transition-transform">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">MEDISTREAM</h1>
          <p className="text-emerald-200 text-lg">Portal de Acceso Seguro</p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mt-4 rounded-full"></div>
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
                  className="pl-12 h-14 bg-white/10 border-white/30 text-white placeholder:text-white/70 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 backdrop-blur-sm"
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
                  className="pl-12 h-14 bg-white/10 border-white/30 text-white placeholder:text-white/70 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 backdrop-blur-sm"
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
              className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
              <div className="w-8 h-1 bg-emerald-400 rounded-full"></div>
              <div className="w-4 h-1 bg-emerald-300 rounded-full"></div>
              <div className="w-2 h-1 bg-emerald-200 rounded-full"></div>
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
