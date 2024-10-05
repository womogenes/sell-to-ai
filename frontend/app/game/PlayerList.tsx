export default function PlayerList({ players }: { players: any[] }) {
  return (
    <div className="my-auto flex flex-col gap-2">
      <h1 className="text-xl font-bold">
        Players{' '}
        <span className="font-normal text-neutral-400">
          ({players.length}/10)
        </span>
      </h1>

      <div className="flex w-80 flex-col gap-y-2">
        {players.map((name: string) => {
          return (
            <div
              className="flex items-center gap-0 rounded-l-full bg-neutral-100"
              key={name}
            >
              <img
                className="m-2 ml-3 mr-1 aspect-square h-6 w-6 rounded-full"
                src={`https://robohash.org/${name}.png?set=set3`}
                alt="profile"
              />{' '}
              {name}
            </div>
          );
        })}
        {[...new Array(10 - players.length)].map((_, i) => {
          return (
            <div
              className="flex rounded-l-full bg-neutral-100 px-10 py-2 text-neutral-400"
              key={i}
            >
              waiting for players...
            </div>
          );
        })}
      </div>
    </div>
  );
}
