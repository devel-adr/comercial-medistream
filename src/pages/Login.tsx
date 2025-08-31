
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
      {/* Dynamic animated network background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-40">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Animated network nodes and connections */}
          {[...Array(30)].map((_, i) => {
            const baseX = (i % 6) * 20;
            const baseY = Math.floor(i / 6) * 20;
            const animationDelay = Math.random() * 10;
            const animationDuration = 8 + Math.random() * 4;
            
            return (
              <g key={i}>
                {/* Animated node */}
                <circle
                  cx={`${baseX}%`}
                  cy={`${baseY}%`}
                  r="2"
                  fill="#10b981"
                  filter="url(#glow)"
                  className="animate-pulse"
                  style={{
                    animationDelay: `${animationDelay}s`,
                    animationDuration: `${animationDuration}s`
                  }}
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values={`0,0; ${Math.sin(i) * 20},${Math.cos(i) * 15}; 0,0`}
                    dur={`${animationDuration}s`}
                    repeatCount="indefinite"
                    begin={`${animationDelay}s`}
                  />
                  <animate
                    attributeName="r"
                    values="1.5;3;1.5"
                    dur={`${animationDuration * 0.7}s`}
                    repeatCount="indefinite"
                    begin={`${animationDelay}s`}
                  />
                </circle>

                {/* Animated connection lines */}
                {i < 25 && (i + 1) % 6 !== 0 && (
                  <line
                    x1={`${baseX}%`}
                    y1={`${baseY}%`}
                    x2={`${baseX + 20}%`}
                    y2={`${baseY}%`}
                    stroke="#10b981"
                    strokeWidth="0.8"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.3;0.8;0.3"
                      dur={`${animationDuration}s`}
                      repeatCount="indefinite"
                      begin={`${animationDelay + 1}s`}
                    />
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="translate"
                      values={`0,0; ${Math.sin(i + 1) * 10},${Math.cos(i + 1) * 8}; 0,0`}
                      dur={`${animationDuration}s`}
                      repeatCount="indefinite"
                      begin={`${animationDelay}s`}
                    />
                  </line>
                )}

                {/* Vertical connections */}
                {i < 24 && (
                  <line
                    x1={`${baseX}%`}
                    y1={`${baseY}%`}
                    x2={`${baseX}%`}
                    y2={`${baseY + 20}%`}
                    stroke="#10b981"
                    strokeWidth="0.8"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.2;0.7;0.2"
                      dur={`${animationDuration * 1.2}s`}
                      repeatCount="indefinite"
                      begin={`${animationDelay + 2}s`}
                    />
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="translate"
                      values={`0,0; ${Math.cos(i) * 8},${Math.sin(i) * 12}; 0,0`}
                      dur={`${animationDuration * 1.1}s`}
                      repeatCount="indefinite"
                      begin={`${animationDelay}s`}
                    />
                  </line>
                )}

                {/* Diagonal connections */}
                {i < 23 && (i + 1) % 6 !== 0 && (
                  <line
                    x1={`${baseX}%`}
                    y1={`${baseY}%`}
                    x2={`${baseX + 20}%`}
                    y2={`${baseY + 20}%`}
                    stroke="#10b981"
                    strokeWidth="0.5"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur={`${animationDuration * 1.5}s`}
                      repeatCount="indefinite"
                      begin={`${animationDelay + 3}s`}
                    />
                  </line>
                )}
              </g>
            );
          })}

          {/* Additional floating particles */}
          {[...Array(15)].map((_, i) => (
            <circle
              key={`particle-${i}`}
              cx="0"
              cy="0"
              r="1"
              fill="#0d9488"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values={`${Math.random() * 100},${Math.random() * 100}; ${Math.random() * 100},${Math.random() * 100}; ${Math.random() * 100},${Math.random() * 100}`}
                dur={`${15 + Math.random() * 10}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 5}s`}
              />
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur={`${3 + Math.random() * 2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
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
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
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
