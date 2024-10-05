'use client';

import { SERVER_URL, SERVER_WEBSOCKET_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Lobby from './Lobby';
import PlayerList from './PlayerList';

export default function Game() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // UI states
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

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
      try {
        const data = JSON.parse(e.data);
        if (!data) return;
        console.log('ws data:', data);

        // Server always sends list of players
        if (data.players) setPlayers(data.players ?? []);

        // Set username according to localStorage if it exists
        if (
          data.type === 'connect' &&
          username &&
          !data.players.includes(username)
        ) {
          joinGame();
        }
        if (data.type === 'join' && data.players.includes(username)) {
          setIsConnected(true);
          setIsConnecting(false);
        }
        if (data.type === 'game_started') {
          console.log('tasks:', data.tasks);
        }
      } catch (e) {
        console.log(e);
      }
    };
  }, [socket, username]);

  // Join game handler
  const joinGame = () => {
    setIsConnecting(true);
    socket.send(JSON.stringify({ username }));
  };

  const startGame = () => {
    socket.send(JSON.stringify({ type: 'start_game' }));
  };

  return (
    <div className="flex h-full">
      {isGameStarted ? (
        <></>
      ) : (
        <Lobby
          gameCode={gameCode}
          username={username}
          setUsername={setUsername}
          isConnected={isConnected}
          isConnecting={isConnecting}
          startGame={startGame}
          joinGame={joinGame}
        />
      )}

      {/* List of players */}
      <PlayerList players={players} />
    </div>
  );
}
