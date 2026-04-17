import { HUD } from "@/components/ui/HUD";
import { Universe } from "@/components/3d/Universe";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      <HUD />
      <Universe />
    </main>
  );
}
