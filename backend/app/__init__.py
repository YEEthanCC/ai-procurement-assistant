from flask import Flask
from dotenv import load_dotenv
import os
from .events import socketio
from .routes import main


load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["DEBUG"] = True
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

    # Register blueprints
    app.register_blueprint(main)
    socketio.init_app(app)
    return app