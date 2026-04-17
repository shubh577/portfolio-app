"use client";

import { motion } from "framer-motion";
import { useStore, Station } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { Home, Layers, Code, Orbit } from "lucide-react";

export function HUD() {
  const { currentStation, setStation, isHoveringNode } = useStore();

  const navItems: { id: Station; label: string; icon: React.ReactNode }[] = [
    { id: "core", label: "Sector Core", icon: <Home className="w-5 h-5" /> },
    { id: "projects", label: "Projects", icon: <Layers className="w-5 h-5" /> },
    { id: "skills", label: "Skill Orbit", icon: <Orbit className="w-5 h-5" /> },
    { id: "timeline", label: "Timeline", icon: <Code className="w-5 h-5" /> },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex flex-col justify-between p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0"
      >
        <div className="glass px-6 py-4 rounded-2xl pointer-events-auto">
          <h1 className="text-xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-linear-to-r from-[--neon-teal] to-[--deep-purple]">
            INIT_SEQUENCE
          </h1>
          <p className="text-sm text-foreground/70 uppercase tracking-widest mt-1">
            Status: Online
          </p>
        </div>

        <div className="glass px-4 py-3 md:px-6 md:py-4 rounded-xl pointer-events-auto flex flex-wrap justify-center gap-2 md:gap-4 w-full md:w-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setStation(item.id)}
              className={cn(
                "group flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-300",
                currentStation === item.id
                  ? "text-[--neon-teal] bg-[--neon-teal]/10"
                  : "text-foreground/50 hover:text-foreground hover:bg-white/5"
              )}
            >
              {item.icon}
              <span className="text-xs font-mono uppercase tracking-widest group-hover:text-[--neon-teal] transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-end pointer-events-auto"
      >
        <div className="text-xs font-mono text-[--neon-teal]/70 hidden md:flex flex-col gap-1">
          <p>SYS.COORD: [X: 13, Y: 42, Z: 89]</p>
          <p>UPLINK: STABLE</p>
        </div>

        <motion.div
          animate={{
            opacity: isHoveringNode ? 1 : 0,
            y: isHoveringNode ? 0 : 20,
          }}
          className="glass px-8 py-6 rounded-2xl max-w-sm"
        >
          <h3 className="text-lg font-bold text-[--neon-teal] mb-2 uppercase tracking-wide">
            Data Node Selected
          </h3>
          <p className="text-sm text-foreground/80">
            Accessing project archives. Encrypted AI modules loaded.
            Further inspection required...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
