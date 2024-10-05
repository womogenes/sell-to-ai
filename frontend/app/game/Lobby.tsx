import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function Lobby({
  gameCode,
  username,
  setUsername,
  isConnected,
  isConnecting,
  startGame,
  joinGame,
}: {
  gameCode: string | null;
  username: string;
  setUsername: Function;
  isConnected: boolean;
  isConnecting: boolean;
  startGame: any;
  joinGame: any;
}) {
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

        <img
          src="https://i.pinimg.com/originals/a9/eb/c4/a9ebc49718ce98c61a8563c945712eee.png"
          alt="monopoly man running"
          width={200}
        />

        {/* Name input or profile display */}
        <div className="h-32 pt-2">
          {isConnected ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  className="aspect-square h-10 w-10 rounded-full border p-1"
                  src={`https://robohash.org/${username}.png?set=set3`}
                  alt="profile"
                />
                <p>{username}</p>
              </div>

              <Button onClick={startGame}>Start game</Button>
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
                disabled={isConnecting}
                id="username-input"
              />
              <Button
                disabled={username === '' || isConnecting}
                onClick={joinGame}
              >
                <Loader2
                  className={cn(
                    'mr-2 h-4 w-4',
                    isConnecting ? 'block animate-spin' : 'hidden',
                  )}
                />{' '}
                Join game
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
