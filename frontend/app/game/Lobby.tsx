import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import halMonopolyMan2 from '@/public/hal_monopoly_man_2.png';
import Image from 'next/image';

export default function Lobby({
  gameCode,
  username,
  setUsername,
  hasJoined,
  isJoining,
  startGame,
  joinGame,
}: {
  gameCode: string | null;
  username: string;
  setUsername: any;
  hasJoined: boolean;
  isJoining: boolean;
  startGame: any;
  joinGame: any;
}) {
  const [hasStartedGame, setHasStartedGame] = useState<boolean>(false);

  return (
    <>
      {/* Main body */}
      <div className="flex h-full grow flex-col items-center justify-center gap-4 p-6">
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

        <Image src={halMonopolyMan2} alt="monopoly man running" width={200} />

        {/* Name input or profile display */}
        <div className="h-32 pt-2">
          {hasJoined ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  className="aspect-square h-10 w-10 rounded-full border p-1"
                  src={`https://robohash.org/${username}.png?set=set3`}
                  alt="profile"
                />
                <p>{username}</p>
              </div>

              <Button
                onClick={() => {
                  setHasStartedGame(true);
                  startGame();
                }}
                disabled={hasStartedGame}
              >
                Start game{' '}
                {hasStartedGame && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          ) : (
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    joinGame();
                  }
                }}
                maxLength={15}
                spellCheck={false}
                autoComplete="off"
                disabled={isJoining}
                id="username-input"
              />
              <Button
                disabled={username === '' || isJoining}
                onClick={joinGame}
              >
                Join game
                <Loader2
                  className={cn(
                    'ml-2 h-4 w-4',
                    isJoining ? 'block animate-spin' : 'hidden',
                  )}
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
