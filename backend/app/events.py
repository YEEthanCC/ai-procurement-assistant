from .extensions import socketio
from flask_socketio import emit
from agents.agent import graph
from langchain_core.messages import HumanMessage

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('new_message')
def handle_message_send(msg):
    print(f"Message received: {msg}")
    for event in graph.stream({"messages": [HumanMessage(msg)]}, stream_mode='values'):
        if len(event["messages"]) > 1:
            emit("chat", {"response": event["messages"][-1].content})