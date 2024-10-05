"use client";

import { SERVER_URL } from "@/constants";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Game() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  // Create a game
  useEffect(() => {
    const gameCode = /#g=(.+)/g.exec(window.location.hash)?.[1];
    if (gameCode) {
      setGameCode(gameCode);
      return;
    }
    (async () => {
      const gameCode = await (await fetch(`${SERVER_URL}/create_game`)).json();
      setGameCode(gameCode.game_code);
      router.push(`${pathname}/#g=${gameCode.game_code}`);
    })();
  }, [router]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex h-20 items-center">
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

      <img
        src="https://i.pinimg.com/originals/a9/eb/c4/a9ebc49718ce98c61a8563c945712eee.png"
        alt="monopoly man running"
        width={200}
      />

      <div className="relative flex flex-col items-center gap-4">
        <label
          className="absolute left-2 -translate-y-1/2 bg-white px-2 text-sm font-medium text-neutral-800"
          htmlFor="username-input"
        >
          Enter your name
        </label>
        <Textarea
          className="resize-none px-3.5 py-3"
          placeholder="Your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          maxLength={15}
          spellCheck={false}
          autoComplete="off"
          id="username-input"
        />
        <Button disabled={username === ""}>Confirm</Button>
      </div>
    </div>
  );
}
