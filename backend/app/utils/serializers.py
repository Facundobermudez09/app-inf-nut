def productoADic(producto):
    return{
        "id":producto.id,
        "codigo_barras":producto.codigoBarras,
        "marca":producto.marca,
        "fuente":producto.fuente,
        "nutrientes_por_100g":[{
            "nombre":pn.nutriente.nombre,
            "valor":pn.valor,
            "unidad":pn.nutriente.unidad
        }
        for pn in producto.nutrientes
    ]
    }