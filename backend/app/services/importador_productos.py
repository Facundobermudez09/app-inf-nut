import requests
from app.database import db
from app.models.producto import Producto
from app.models.nutriente import Nutriente
from app.models.producto_nutriente import ProductoNutriente

def importarProductoOFF(codigoBarras):
    # buscar en la base de datos
    producto = Producto.query.filter_by(codigoBarras=codigoBarras).first()
    if producto:
        return producto

    # buscar en Open Food Facts
    url = f"https://world.openfoodfacts.org/api/v0/product/{codigoBarras}.json"
    response = requests.get(url, timeout=10)
    data = response.json()

    if data.get("status") != 1:
        return None

    product = data["product"]
    nutriments = product.get("nutriments", {})

    # ✅ CREAR PRODUCTO (CLASE, NO VARIABLE)
    producto = Producto(
        codigoBarras=codigoBarras,
        nombre=product.get("product_name"),
        marca=product.get("brands"),
        fuente="open_food_facts"
    )

    db.session.add(producto)
    db.session.commit()

    nutrientes_map = {
        "Energia": ("kcal", nutriments.get("energy-kcal_100g")),
        "Proteinas": ("g", nutriments.get("proteins_100g")),
        "Grasas": ("g", nutriments.get("fat_100g")),
        "Carbohidratos": ("g", nutriments.get("carbohydrates_100g")),
        "Azucares": ("g", nutriments.get("sugars_100g")),
        "Sal": ("g", nutriments.get("salt_100g")),
    }

    for nombre, (unidad, valor) in nutrientes_map.items():
        if valor is not None:
            nutriente = Nutriente.query.filter_by(nombre=nombre).first()
            if not nutriente:
                nutriente = Nutriente(nombre=nombre, unidad=unidad)
                db.session.add(nutriente)
                db.session.commit()

            pn = ProductoNutriente(
                productoId=producto.id,
                nutrienteId=nutriente.id,
                valor=float(valor)
            )
            db.session.add(pn)

    db.session.commit()
    return producto
