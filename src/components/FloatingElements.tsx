
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full animate-bounce delay-1500"></div>
      
      {/* Floating squares */}
      <div className="absolute top-60 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rotate-45 animate-pulse delay-700"></div>
      <div className="absolute bottom-60 right-1/4 w-10 h-10 bg-gradient-to-r from-green-400/20 to-teal-400/20 rotate-45 animate-bounce delay-200"></div>
      
      {/* Large background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20"
           style={{
             backgroundImage: `
               linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }}>
      </div>
    </div>
  );
};

export default FloatingElements;
