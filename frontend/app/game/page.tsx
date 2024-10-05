"use client";

import { SERVER_URL } from "@/constants";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Game() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Create a game
  useEffect(() => {
    (async () => {
      const gameCode = await (await fetch(`${SERVER_URL}/create_game`)).json();
      setGameCode(gameCode.game_code);
      router.push(`${pathname}/#g=${gameCode.game_code}`);
    })();
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      {gameCode ? (
        <div className="flex flex-col items-center">
          <h1>Game code:</h1>
          <p className="font-mono text-6xl font-black">{gameCode}</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Loader2 className="animate-spin" /> Joining game...
        </div>
      )}
    </div>
  );
}
