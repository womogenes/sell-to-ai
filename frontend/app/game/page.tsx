'use client';

import { SERVER_URL, SERVER_WEBSOCKET_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { io } from 'socket.io-client';
import { cn } from '@/lib/utils';

export default function Game() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // UI states
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Important game-state variables
  const [players, setPlayers] = useState<any>([]);
  const [socket, setSocket] = useState<any>(null);

  // Create a game
  useEffect(() => {
    (async () => {
      let gameCode = params.get('g');
      if (gameCode) {
        setGameCode(gameCode);
      } else {
        gameCode = (await (await fetch(`${SERVER_URL}/create_game`)).json())
          .game_code;
        setGameCode(gameCode);
        router.push(`${pathname}/?g=${gameCode}`);
      }

      const socket = new WebSocket(`${SERVER_WEBSOCKET_URL}/ws/${gameCode}`);
      setSocket(socket);
    })();

    // return () => socket?.close();
  }, []);

  // On socket change
  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log('Connected to websocket server');
    };
    socket.onmessage = (e: { data: string }) => {
      const data = JSON.parse(e.data);
      if (!data) return;
      console.log('ws data:', data);

      // Server always sends list of players
      setPlayers(data.players ?? []);
      if (data.type === 'join' && data.players.includes(username)) {
        setIsConnected(true);
        setIsConnecting(false);
      }
    };
  }, [socket, username]);

  // Join game handler
  const joinGame = () => {
    setIsConnecting(true);
    socket.send(JSON.stringify({ username: username }));
  };

  return (
    <div className="flex h-full">
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
        <div className="h-20">
          {isConnected ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  className="aspect-square h-10 w-10 rounded-full border p-1"
                  src={`https://robohash.org/${username}.png?set=set3`}
                  alt="profile"
                />
                <p>{username}</p>
              </div>

              <Button>Start game</Button>
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

      {/* List of players */}
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
    </div>
  );
}
