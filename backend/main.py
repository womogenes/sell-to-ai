from typing import List, Dict
import random
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

class ConvincingGame:
    def __init__(self):
        self.players: List[str] = []
        self.prompts: Dict[str, str] = {}
        self.pitches: Dict[str, str] = {}
        self.items: List[str] = self.get_items()
        self.winner: str = None
        self.game_started: bool = False

    def get_items(self):
        return ["tent", "sleeping bag", "flashlight", "first aid kit", "food supplies"]

    def start_game(self):
        if self.game_started:
            return self.pitches
        if len(self.players) > len(self.items):
            return "Not enough items for all players."
        
        random.shuffle(self.items)
        for i, player in enumerate(self.players):
            self.prompts[player] = f"Alice is going camping in Antarctica and needs supplies! She hasn't prepared at all yet. Convince Alice to buy {self.items[i]}!"
        self.game_started = True
        return self.prompts

    def add_player(self, player: str):
        if player not in self.players:
            self.players.append(player)
            self.prompts[player] = None
            return True
        return False

    def submit_pitch(self, player: str, pitch: str):
        if player in self.players and self.game_started:
            self.pitches[player] = pitch
            return True
        return False
    def get_evaluation_prompt(self):
        return "\n".join([f"{self.players[i]} suggests buying: {self.items[i]}. Reasoning: {self.pitches[self.players[i]]}" for i in range(len(self.players))])
    def process_pitches(self):
        # Call the OpenAI API to evaluate the pitches
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are Alice, who is a role-playing a person who is going camping in Antarctica and needs supplies. Choose the answer suggested that you think would make the game most enjoyable, which should be the most surprising or funny one. Don't make your own twists on their suggestions. Reason before answering with the correct answer. It's not fun if you choose the most standard one."},
                {"role": "user", "content": self.get_evaluation_prompt()}
            ]
        )
        print(response.choices[0].message)
        new_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": self.get_evaluation_prompt()},
                {"role": "assistant", "content": response.choices[0].message.content},
                {"role": "user", "content": "Please reply with only the username of the winning player:"}
            ]
        )
        self.winner = new_response.choices[0].message.content
        return {'thoughts': response.choices[0].message, 'winner': self.winner}

    def reset_game(self):
        self.prompts = {player: None for player in self.players}
        self.pitches = dict()
        self.winner = None
        self.game_started = False

if __name__ == "__main__":
    g = ConvincingGame()
    print(g.add_player("P"))
    print(g.add_player("Q"))
    print(g.start_game())
    print(g.submit_pitch("P", g.items[0] + "s give heat"))
    print(g.submit_pitch("Q", g.items[1] + "s give heat"))
    print(g.process_pitches())
