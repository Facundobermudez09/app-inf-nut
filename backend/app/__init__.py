from flask import Flask
from flask_cors import CORS #importamos CORS para permitir peticiones desde el frontend
from app.config import Config
from app.database import db
from app.routes.productos import productos_bp

def create_app():
    app=Flask(__name__)
    app.config.from_object(Config) #cargamos la configuracion
    CORS(app) #habilitamos CORS para todas las rutas
    db.init_app(app) #inicializamos sqalchemy
    app.register_blueprint(productos_bp) #registramos el blueprint
    return app
