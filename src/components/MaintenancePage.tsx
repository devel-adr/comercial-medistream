
import { useState } from 'react';
import { Settings, Clock, Wrench, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import FloatingElements from './FloatingElements';

const MaintenancePage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      toast({
        title: "¡Perfecto!",
        description: "Te notificaremos cuando estemos de vuelta.",
      });
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Animated Icons */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Settings className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce delay-150">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center animate-pulse delay-300">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Estamos en
            </span>
            <br />
            <span className="text-white">Mantenimiento</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in delay-200">
            Estamos mejorando nuestros servicios para ofrecerte una mejor experiencia
          </p>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12 animate-fade-in delay-300">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Actualizaciones</h3>
              <p className="text-gray-300 text-sm">Implementando nuevas funcionalidades</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Optimización</h3>
              <p className="text-gray-300 text-sm">Mejorando el rendimiento</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Pronto</h3>
              <p className="text-gray-300 text-sm">Volveremos muy pronto</p>
            </div>
          </div>

          {/* Email Notification */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 animate-fade-in delay-500">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-purple-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">
                Te avisamos cuando estemos listos
              </h3>
            </div>
            
            {!isSubscribed ? (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-purple-400"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 transition-all duration-300 hover:scale-105"
                >
                  Notificarme
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>¡Gracias! Te avisaremos cuando estemos listos.</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-gray-400 animate-fade-in delay-700">
            <p className="mb-2">Síguenos en nuestras redes sociales para más actualizaciones</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-purple-400 transition-colors duration-300 hover:scale-110 transform">
                Twitter
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300 hover:scale-110 transform">
                LinkedIn
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300 hover:scale-110 transform">
                Instagram
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
