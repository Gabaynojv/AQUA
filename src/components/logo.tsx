import { Droplet } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 group">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
        <Droplet className="h-5 w-5 text-white" />
      </div>
      <span className="font-bold text-xl font-headline bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
        AquaFlow
      </span>
    </div>
  );
}
