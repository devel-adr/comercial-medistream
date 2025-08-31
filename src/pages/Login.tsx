
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Lock, Mail } from 'lucide-react';
import AnimatedNetworkBackground from '@/components/AnimatedNetworkBackground';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Network Background */}
      <AnimatedNetworkBackground />
      
      <div className="w-full max-w-sm relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-6 mx-auto">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wider">MEDISTREAM</h1>
          <p className="text-teal-200 text-sm mb-4">Portal de Acceso Seguro</p>
          <div className="w-16 h-0.5 bg-teal-400 mx-auto"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 h-12 bg-white/5 border-white/20 text-white placeholder:text-white/60 rounded-lg focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-12 h-12 bg-white/5 border-white/20 text-white placeholder:text-white/60 rounded-lg focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>

            {error && (
              <Alert className="bg-red-500/20 border-red-500/30 text-white">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm mb-3">
              Departamento comercial
            </p>
            <div className="flex justify-center items-center space-x-1">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/40 text-xs">
            © 2025 Medistream System. Acceso autorizado únicamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
