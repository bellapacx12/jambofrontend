import { Eye } from 'lucide-react';

export default function SpectatorOverlay() {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
      <Eye size={48} className="text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Watching Only</h2>
      <p className="text-center text-gray-300 text-sm px-8 leading-relaxed">
        የዚህ ዙር ጨዋታ ተጀምሯል። አዲስ ዙር እስኪጀምር እዚህ ይጠብቁ።
      </p>
      <p className="text-center text-gray-500 text-xs mt-2 px-8">
        This round has already started. Please wait here for a new round to begin.
      </p>
    </div>
  );
}
