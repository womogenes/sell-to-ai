from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, Tuple
import uuid
import json
from main import ConvincingGame
from collections import namedtuple
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self, game_code: str):
        self.game_code = game_code
        self.connections: Dict[WebSocket, str] = {}

    def add_connection(self, websocket: WebSocket, username: str):
        self.connections[websocket] = username

    def remove_connection(self, websocket: WebSocket):
        if websocket in self.connections:
            del self.connections[websocket]

    async def broadcast(self, message: str):
        for connection in self.connections:
            await connection.send_text(message)

    async def broadcast_user_message(self, websocket: WebSocket, message: str):
        username = self.connections.get(websocket, "Unknown")
        await self.broadcast(f"{username} says: {message}")

GameSession = namedtuple('GameSession', ['connection_manager', 'convincing_game'])

class GameManager:
    def __init__(self):
        self.games: Dict[str, GameSession] = {}

    def create_game(self, game_code: str = None) -> str:
        if game_code == None:
            game_code = str(random.randrange(0, 10000)).zfill(4)
        self.games[game_code] = GameSession(connection_manager=ConnectionManager(game_code), convincing_game=ConvincingGame())
        return game_code

    def get_connection_manager(self, game_code: str) -> ConnectionManager:
        return self.games.get(game_code).connection_manager
    
    def get_game(self, game_code: str) -> ConvincingGame:
        return self.games.get(game_code).convincing_game

    def remove_game(self, game_code: str):
        if game_code in self.games:
            del self.games[game_code]

game_manager = GameManager()

@app.websocket("/ws/{game_code}")
async def websocket_endpoint(websocket: WebSocket, game_code: str):
    await websocket.accept()
    
    connection_manager = game_manager.get_connection_manager(game_code)
    if not connection_manager:
        await websocket.send_text(f"Game {game_code} not found")
        await websocket.close()
        return
    players_list = list(connection_manager.connections.values())
    await websocket.send_text(json.dumps({"type": "connect", "players": players_list}))
    try:
        username_data = await websocket.receive_text()
        username_json = json.loads(username_data)
        username = username_json["username"]
    except (json.JSONDecodeError, KeyError):
        await websocket.send_text("Invalid JSON format or missing 'username' key")
        await websocket.close()
        return

    connection_manager.add_connection(websocket, username)
    players_list = list(connection_manager.connections.values())
    await connection_manager.broadcast(json.dumps({"type": "join", "players": players_list}))

    try:
        while True:
            try:
                data = await websocket.receive_text()
                print(f"Received from {username}: {data}")
                data = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_text("Error decoding JSON")
                continue

            #await connection_manager.broadcast_user_message(websocket, data)
    except WebSocketDisconnect:
        connection_manager.remove_connection(websocket)
        users_list = list(connection_manager.connections.values())
        await connection_manager.broadcast(json.dumps({"type": "disconnect", "users": users_list}))

@app.get("/create_game")
async def create_game():
    game_code = game_manager.create_game()
    return {"game_code": game_code}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)