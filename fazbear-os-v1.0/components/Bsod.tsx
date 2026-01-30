import React, { useEffect } from 'react';

interface BsodProps {
    onClick: () => void;
}

const Bsod: React.FC<BsodProps> = ({ onClick }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            onClick();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClick]);

    return (
        <div className="fixed inset-0 bg-[#000080] z-[100000] p-8 font-mono text-white cursor-none" onClick={onClick}>
            <div className="max-w-3xl mx-auto">
                <p className="bg-[#c0c0c0] text-[#000080] inline-block px-1 mb-8 font-bold">Windows</p>
                <p className="mb-8">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.</p>
                
                <ul className="list-disc pl-5 mb-8 space-y-2">
                    <li>Press any key to terminate the current application.</li>
                    <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
                </ul>
                
                <p className="text-center animate-pulse mt-20">Press any key to continue _</p>
            </div>
        </div>
    );
};

export default Bsod;