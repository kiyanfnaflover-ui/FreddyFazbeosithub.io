import React from 'react';

const CrtOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden opacity-30 mix-blend-hard-light">
      {/* Scanlines */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />
      {/* Flicker Animation */}
      <div className="absolute inset-0 bg-white opacity-[0.02] animate-[flicker_0.15s_infinite]" />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)'
        }}
      />
      
      <style>{`
        @keyframes flicker {
          0% { opacity: 0.02; }
          50% { opacity: 0.05; }
          100% { opacity: 0.02; }
        }
      `}</style>
    </div>
  );
};

export default CrtOverlay;