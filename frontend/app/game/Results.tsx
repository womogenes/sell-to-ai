import { useEffect } from 'react';

export default function Results({ gameState }: any) {
  useEffect(() => {
    if (!gameState.round_ended[gameState.round_count]) return;
  }, [gameState]);

  return (
    <div className="mx-auto flex h-full w-full max-w-lg grow flex-col justify-center p-6">
      <div className="min-h-96">
        <h1 className="mb-2 text-2xl font-bold">
          Round {gameState.round_count}
        </h1>
        <p>{gameState.scenario}</p>

        {gameState.players.map((name: string) => {
          return (
            <div className="my-4" key={name}>
              <p>{name}</p>
              <p className="">
                <span className="text-neutral-400">item:</span>&nbsp;
                <span className="font-bold text-yellow-600">
                  {gameState.items[name]}
                </span>
              </p>
              <p>
                <span className="text-neutral-400">
                  pitch: {!gameState.pitches[name] && '<no pitch given>'}
                </span>
                <span>{gameState.pitches[name]}</span>
              </p>
            </div>
          );
        })}

        <p className="mb-4">
          <span className="text-neutral-400">Alice's thoughts:</span>&nbsp;
          {gameState.thoughts}
        </p>

        <p>
          <span className="text-neutral-400">winner:</span>&nbsp;
          <span className="font-bold text-yellow-600">{gameState.winner}</span>
        </p>
      </div>
    </div>
  );
}
