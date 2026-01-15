import os  #importamos os para leer las variables de entorno
class Config:
    SQLALCHEMY_DATABASE_URI=os.getenv(
        "DATABASE_URL", #intentamos leer la variable de entorno
        "sqlite:///tablanutricional.db" #sino existe, usamos por defecto la base de datos sqlite
    )
    SQLALCHEMY_TRACK_MODIFICATIONS=False #desactivamos el sistema de tracking de cambios de sqalchemy, evitando warning y consumos de memoria
    SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret")
    
    