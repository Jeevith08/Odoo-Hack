import { motion } from "framer-motion";

export function GlobeIcon({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(214, 100%, 68%)" />
            <stop offset="50%" stopColor="hsl(255, 100%, 74%)" />
            <stop offset="100%" stopColor="hsl(180, 72%, 67%)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" stroke="url(#globeGradient)" strokeWidth="2" fill="none" />
        <ellipse cx="50" cy="50" rx="20" ry="45" stroke="url(#globeGradient)" strokeWidth="1.5" fill="none" />
        <ellipse cx="50" cy="50" rx="45" ry="20" stroke="url(#globeGradient)" strokeWidth="1.5" fill="none" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="url(#globeGradient)" strokeWidth="1" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="url(#globeGradient)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}
