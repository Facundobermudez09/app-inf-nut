from app.database import db
class ProductoNutriente(db.Model):
    __tablename__="producto_nutrientes"
    productoId=db.Column(db.Integer,db.ForeignKey("productos.id"),primary_key=True) #clave foranea con la tabla de productos 
    nutrienteId=db.Column(db.Integer,db.ForeignKey("nutrientes.id"),primary_key=True) #clave foranea con la tabla de nutrientes
    valor=db.Column(db.Float)
    producto=db.relationship("Producto",back_populates="nutrientes")#relacion de composicion producto<-->productonutriente
    nutriente=db.relationship("Nutriente")#clase que modela la asociacion   producto-->*productonutriente*<--nutriente
    