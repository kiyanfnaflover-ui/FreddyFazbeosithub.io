import React from 'react';

interface GlitchOverlayProps {
    active: boolean;
    intensity: 'low' | 'med' | 'high';
}

const GlitchOverlay: React.FC<GlitchOverlayProps> = ({ active, intensity }) => {
    if (!active) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100000] overflow-hidden mix-blend-exclusion">
            {/* Chromatic Aberration Layers */}
            <div className="absolute inset-0 bg-red-500 opacity-20 translate-x-[2px] animate-[shake_0.1s_infinite]"></div>
            <div className="absolute inset-0 bg-blue-500 opacity-20 -translate-x-[2px] animate-[shake_0.1s_infinite_reverse]"></div>
            
            {/* Random Noise Blocks */}
            <div className="absolute top-[10%] left-[20%] w-[200px] h-[20px] bg-white opacity-50 animate-[glitchBlock_0.2s_infinite]"></div>
            <div className="absolute top-[60%] right-[10%] w-[100px] h-[50px] bg-black opacity-50 animate-[glitchBlock_0.3s_infinite]"></div>
            
            <style>{`
                @keyframes shake {
                    0% { transform: translate(2px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(0px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(2px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(2px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                @keyframes glitchBlock {
                    0% { opacity: 0; clip-path: inset(20% 0 80% 0); }
                    20% { opacity: 0.8; clip-path: inset(60% 0 10% 0); }
                    40% { opacity: 0; clip-path: inset(40% 0 50% 0); }
                    60% { opacity: 0.8; clip-path: inset(80% 0 5% 0); }
                    80% { opacity: 0; clip-path: inset(10% 0 60% 0); }
                    100% { opacity: 0.8; clip-path: inset(30% 0 40% 0); }
                }
            `}</style>
        </div>
    );
};

export default GlitchOverlay;