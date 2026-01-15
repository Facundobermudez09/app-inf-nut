from app.database import db

class Producto(db.Model):
    __tablename__="productos" #nombre de la tabla en la base de datos
    id =db.Column(db.Integer, primary_key=True)#esta sera la clave primaria
    codigoBarras=db.Column(db.String, unique=True) #ademas de crear la columna de tipo texto, indicamos que es unico, no puede haber repetidos
    nombre=db.Column(db.String, nullable=False) #con nullable indicamos que no puede quedar vacio
    marca=db.Column(db.String)#opcional
    fuente=db.Column(db.String)#opcional
    
    nutrientes=db.relationship(#provocamos la relacion que en este caso es una composicion, ya que el nutriente no existe sin el producto
        "ProductoNutriente", #nombre del modelo
        back_populates="producto",#creamos una direccion bidireccional
        cascade="all, delete-orphan" #definimos que pasa con los nutrientes cuando se modifica un producto,con "all" aplicamos todas las operaciones como save,delete,etc y con "delete-orphan" si un nutriente queda sin producto, se elimina automaticamente
    )