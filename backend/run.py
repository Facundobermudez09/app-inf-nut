from app import create_app #create_app, construye y configura la app flask(config,blueprints,db,etc)
from app.database import db
app=create_app() #creamos la aplicacion flask
with app.app_context(): #entra en el contexto de la aplicacion, sin esto db.create_all() falla
    db.create_all() #crea todas las tablas en la base de datos

if __name__=="__main__": 
    app.run(debug=True)