from app.database import db
class Nutriente(db.Model):
    __tablename__="nutrientes"
    id=db.Column(db.Integer, primary_key=True)
    nombre=db.Column(db.String, nullable=False)
    unidad=db.Column(db.String, nullable=False)