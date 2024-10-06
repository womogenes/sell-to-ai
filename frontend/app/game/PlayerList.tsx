import { cn } from '@/lib/utils';
import { DollarSign, X } from 'lucide-react';

export default function PlayerList({
  players,
  username,
  isGameStarted,
  gameState,
}: {
  players: any[];
  username: string;
  isGameStarted: boolean;
  gameState: any;
}) {
  return (
    <>
      <h1 className="text-xl font-bold">
        Players{' '}
        <span className="font-normal text-neutral-400">
          {!isGameStarted ? `(${players.length}/10)` : `(${players.length})`}
        </span>
      </h1>

      <div className="flex w-full flex-col gap-y-2">
        {players.map((name: string) => {
          return (
            <div
              className={cn(
                username === name
                  ? 'bg-orange-100 text-orange-900'
                  : 'bg-neutral-100',
                'flex items-center gap-0 rounded-full md:rounded-r-none',
              )}
              key={name}
            >
              <img
                className="m-1 ml-3 mr-1 aspect-square h-7 w-7 rounded-full"
                src={`https://robohash.org/${name}.png?set=set3`}
                alt="profile"
              />{' '}
              <span className="w-24">{name}</span>
              {/* Scoreboard */}
              <div className="flex items-center gap-2">
                {gameState.scores[name].map((score: number, i: number) => {
                  return (
                    <div key={i}>
                      {score === 0 && <X className="h-4 w-4" />}
                      {score === 1 && (
                        <DollarSign className="h-4 w-4 text-green-800" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {[...new Array(10 - players.length)].map((_, i) => {
          return (
            <div
              className={cn(
                'flex rounded-full bg-neutral-100 px-11 py-2 text-neutral-400 md:rounded-r-none',
                isGameStarted ? 'hidden md:invisible md:block' : 'visible',
              )}
              key={i}
            >
              waiting for players...
            </div>
          );
        })}
      </div>
    </>
  );
}
