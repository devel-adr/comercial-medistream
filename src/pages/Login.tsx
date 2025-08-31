
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      {/* Network pattern background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-30">
          {/* Network nodes */}
          {[...Array(25)].map((_, i) => {
            const x = (i % 5) * 25 + Math.random() * 15;
            const y = Math.floor(i / 5) * 25 + Math.random() * 15;
            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="2"
                  fill="#10b981"
                  className="animate-pulse"
                  style={{
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
                {/* Connection lines */}
                {i < 20 && (
                  <line
                    x1={`${x}%`}
                    y1={`${y}%`}
                    x2={`${((i + 1) % 5) * 25 + Math.random() * 15}%`}
                    y2={`${Math.floor((i + 1) / 5) * 25 + Math.random() * 15}%`}
                    stroke="#10b981"
                    strokeWidth="0.5"
                    opacity="0.6"
                  />
                )}
                {i % 5 !== 4 && i < 20 && (
                  <line
                    x1={`${x}%`}
                    y1={`${y}%`}
                    x2={`${((i + 5) % 25 % 5) * 25 + Math.random() * 15}%`}
                    y2={`${Math.floor((i + 5) / 5) * 25 + Math.random() * 15}%`}
                    stroke="#10b981"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                )}
              </g>
            );
          })}
        </svg>
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
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 rounded-2xl focus:border-teal-400 focus:ring-teal-400 backdrop-blur-sm px-4"
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 rounded-2xl focus:border-teal-400 focus:ring-teal-400 backdrop-blur-sm px-4"
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
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-2xl shadow-lg transition-all duration-300"
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

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Departamento médico
            </p>
            <div className="flex justify-center items-center mt-3 space-x-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
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
