def calcularNutrientesPorPorcion(producto,gramos):
    factor=gramos/100
    return{ #devolvemos un diccionario con la informacion calculada
        "producto":producto.nombre,
        "gramos":gramos,
<<<<<<< HEAD
        "nutrientes": {
            pn.nutriente.nombre: {
=======
        "nutrientes": [
            {
                "nombre":pn.nutriente.nombre,
>>>>>>> 6d51e740317d2bd5a7b1334fb8c62073c3bb65c6
                "valor":round(pn.valor * factor,2), #multiplicamos los 100gr por el factor, redondeamos a 2 decimales
                "unidad": pn.nutriente.unidad
            }
            for pn in producto.nutrientes
<<<<<<< HEAD
        }
=======
        ]
>>>>>>> 6d51e740317d2bd5a7b1334fb8c62073c3bb65c6
    }