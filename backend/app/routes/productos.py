from flask import Blueprint,jsonify  #blueprint, permite agrupar rutas en un modulo reutilizable,jsonify,convierte diccionarios de python en respuestas json http
from app.models.producto import Producto
from app.services.importador_productos import importarProductoOFF
from app.services.calculos_nutricionaless import calcularNutrientesPorPorcion
from app.utils.serializers import productoADic

productos_bp=Blueprint("productos",__name__) #creamos el blueprint llamado "productos"

@productos_bp.route("/")
def index():
    return jsonify({
        "status": "ok",
        "endpoints": [
            "/productos/<codigo_barras>",
            "/productos/<codigo_barras>/porcion/<float:gramos>"
        ]
    })

@productos_bp.route("/productos/<codigo_barras>") #definimos una ruta dinamica con un parametro de la url

#funcion que recibe el codigo de barras y busca el producto en la base de datos sino existe lo importa desde la api externa. en caso que no este por ningun lado lo informa. si se encuentra convierte el producto en diccionario y lo devuelve como json con http 200
def obtenerProducto(codigo_barras):
    producto=importarProductoOFF(codigo_barras) 
    if not producto:
        return jsonify({"error":"producto no encontrado"}),404
    return jsonify(productoADic(producto))


@productos_bp.route("/productos/<codigo_barras>/porcion/<gramos>", methods=['GET']) #definimos una ruta con el codigo de barras y las cantidades en gramos

#funcion que recibe el codigo y las cantidades en gramos. busca el producto en la base de datos. si no existe lo informa, caso contrario calcula los nutrientes con la porcion indicada y devuelve el resultado como json
def calcularPorcion(codigo_barras, gramos):
    try:
        gramos = float(gramos)  # Convertir a float manualmente
    except ValueError:
        return jsonify({"error": "gramos debe ser un número válido"}), 400
    
    producto=Producto.query.filter_by(codigoBarras=codigo_barras).first()
    if not producto:
        return jsonify({"error":"producto no encontrado"}),404
    resultado=calcularNutrientesPorPorcion(producto,gramos)
    return jsonify(resultado)