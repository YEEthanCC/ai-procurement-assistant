from .extensions import socketio
from flask_socketio import emit

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('new_message')
def handle_message_send(msg):
    print(f"Message received: {msg}")
    emit("chat", {"message": msg})