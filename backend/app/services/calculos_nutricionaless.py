def calcularNutrientesPorPorcion(producto,gramos):
    factor=gramos/100
    return{ #devolvemos un diccionario con la informacion calculada
        "producto":producto.nombre,
        "gramos":gramos,
        "nutrientes": [
            {
                "nombre":pn.nutriente.nombre,
                "valor":round(pn.valor * factor,2), #multiplicamos los 100gr por el factor, redondeamos a 2 decimales
                "unidad": pn.nutriente.unidad
            }
            for pn in producto.nutrientes
        ]
    }