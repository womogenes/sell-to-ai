'use client';

import { SERVER_URL, SERVER_WEBSOCKET_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Lobby from './Lobby';
import PlayerList from './PlayerList';
import { Loader2 } from 'lucide-react';

export default function Game() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string>(
    localStorage.getItem('username') || '',
  );
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // UI states
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
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
      setIsConnected(true);
    };
    socket.onmessage = (e: { data: string }) => {
      try {
        const data = JSON.parse(e.data);
        if (!data) return;
        console.log('ws data:', data);

        // Handle errors
        if (data.error) console.log('Error:', data.error);

        // Server always sends list of players
        if (data.players) setPlayers(data.players ?? []);

        if (data.type === 'connect') {
          if (!username) localStorage.getItem('username');
          if (username && !data.players.includes(username)) joinGame();
          setIsGameStarted(data.game_started);
        }
        if (data.type === 'join' && data.players.includes(username)) {
          setHasJoined(true);
          setIsJoining(false);
        }
        if (data.type === 'game_started') {
          console.log('tasks:', data.tasks);
          setIsGameStarted(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
  }, [socket, username]);

  // Join game handler
  const joinGame = () => {
    setIsJoining(true);
    socket.send(JSON.stringify({ username }));
  };

  const startGame = () => {
    socket.send(JSON.stringify({ type: 'start_game' }));
  };

  return (
    <div className="flex h-full">
      {isGameStarted ? (
        <div className="flex w-full items-center justify-center">
          The game has started.
        </div>
      ) : isConnected ? (
        <Lobby
          gameCode={gameCode}
          username={username}
          setUsername={setUsername}
          isJoining={isJoining}
          hasJoined={hasJoined}
          startGame={startGame}
          joinGame={joinGame}
        />
      ) : (
        <div className="flex w-full items-center justify-center">
          <Loader2 className="mr-2 animate-spin" /> Connecting to server...
        </div>
      )}

      {/* List of players */}
      <PlayerList players={players} />
    </div>
  );
}
