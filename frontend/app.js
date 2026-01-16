// ===== CONFIGURACIÓN DE LA API =====
const API_URL = 'http://127.0.0.1:5000';

// ===== VARIABLES GLOBALES =====
let escena, camara, renderizador, controles;
let grupoNutrientes = null;
let productoActual = null;

// ===== ELEMENTOS DEL DOM =====
const elementos = {
    inputCodigoBarras: document.getElementById('inputCodigoBarras'),
    btnBuscar: document.getElementById('btnBuscar'),
    panelProducto: document.getElementById('panelProducto'),
    nombreProducto: document.getElementById('nombreProducto'),
    marcaProducto: document.getElementById('marcaProducto'),
    codigoProducto: document.getElementById('codigoProducto'),
    fuenteProducto: document.getElementById('fuenteProducto'),
    tablaNutrientes: document.getElementById('tablaNutrientes'),
    inputGramos: document.getElementById('inputGramos'),
    btnCalcularPorcion: document.getElementById('btnCalcularPorcion'),
    indicadorCarga: document.getElementById('indicadorCarga'),
    mensajeError: document.getElementById('mensajeError'),
    textoError: document.getElementById('textoError')
};

// ===== COLORES PARA NUTRIENTES =====
const coloresNutrientes = {
    'Energia': 0xff6b6b,
    'Proteinas': 0x4ecdc4,
    'Grasas': 0xffe66d,
    'Carbohidratos': 0x95e1d3,
    'Azucares': 0xf38181,
    'Sal': 0xaa96da
};

// ===== INICIALIZACIÓN =====
function inicializar() {
    configurarEscena3D();
    configurarEventos();
    animarEscena();
}

// ===== CONFIGURACIÓN DE LA ESCENA 3D =====
function configurarEscena3D() {
    // Crear escena
    escena = new THREE.Scene();
    escena.fog = new THREE.Fog(0x0f172a, 10, 50);

    // Configurar cámara
    camara = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camara.position.set(0, 5, 15);

    // Configurar renderizador
    const canvas = document.getElementById('canvas3d');
    renderizador = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setPixelRatio(window.devicePixelRatio);
    renderizador.shadowMap.enabled = true;

    // Configurar controles de órbita
    controles = new THREE.OrbitControls(camara, renderizador.domElement);
    controles.enableDamping = true;
    controles.dampingFactor = 0.05;
    controles.minDistance = 5;
    controles.maxDistance = 30;

    // Agregar luces
    agregarLuces();

    // Agregar partículas de fondo
    agregarParticulas();

    // Agregar plataforma base
    agregarPlataforma();

    // Manejar redimensionamiento
    window.addEventListener('resize', alRedimensionar);
}

// ===== AGREGAR LUCES =====
function agregarLuces() {
    // Luz ambiental
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.4);
    escena.add(luzAmbiental);

    // Luz direccional principal
    const luzDireccional = new THREE.DirectionalLight(0xffffff, 0.8);
    luzDireccional.position.set(5, 10, 5);
    luzDireccional.castShadow = true;
    escena.add(luzDireccional);

    // Luces de acento (colores vibrantes)
    const luzAcento1 = new THREE.PointLight(0x6366f1, 1, 20);
    luzAcento1.position.set(-5, 5, 5);
    escena.add(luzAcento1);

    const luzAcento2 = new THREE.PointLight(0xec4899, 1, 20);
    luzAcento2.position.set(5, 5, -5);
    escena.add(luzAcento2);
}

// ===== AGREGAR PARTÍCULAS DE FONDO =====
function agregarParticulas() {
    const geometriaParticulas = new THREE.BufferGeometry();
    const cantidadParticulas = 1000;
    const posiciones = new Float32Array(cantidadParticulas * 3);

    for (let i = 0; i < cantidadParticulas * 3; i++) {
        posiciones[i] = (Math.random() - 0.5) * 50;
    }

    geometriaParticulas.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));

    const materialParticulas = new THREE.PointsMaterial({
        color: 0x6366f1,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particulas = new THREE.Points(geometriaParticulas, materialParticulas);
    escena.add(particulas);
}

// ===== AGREGAR PLATAFORMA BASE =====
function agregarPlataforma() {
    const geometriaPlataforma = new THREE.CylinderGeometry(8, 8, 0.5, 32);
    const materialPlataforma = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x6366f1,
        emissiveIntensity: 0.1
    });
    const plataforma = new THREE.Mesh(geometriaPlataforma, materialPlataforma);
    plataforma.position.y = -2;
    plataforma.receiveShadow = true;
    escena.add(plataforma);

    // Agregar anillo decorativo
    const geometriaAnillo = new THREE.TorusGeometry(8.5, 0.1, 16, 100);
    const materialAnillo = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x6366f1,
        emissiveIntensity: 0.5
    });
    const anillo = new THREE.Mesh(geometriaAnillo, materialAnillo);
    anillo.position.y = -1.75;
    anillo.rotation.x = Math.PI / 2;
    escena.add(anillo);
}

// ===== CREAR VISUALIZACIÓN 3D DE NUTRIENTES =====
function crearVisualizacionNutrientes(nutrientes) {
    // Limpiar visualización anterior
    if (grupoNutrientes) {
        escena.remove(grupoNutrientes);
    }

    grupoNutrientes = new THREE.Group();

    const cantidadNutrientes = nutrientes.length;
    const radio = 5;
    const anguloIncremento = (Math.PI * 2) / cantidadNutrientes;

    nutrientes.forEach((nutriente, indice) => {
        const angulo = indice * anguloIncremento;
        const x = Math.cos(angulo) * radio;
        const z = Math.sin(angulo) * radio;

        // Escalar el valor para la visualización (altura máxima de 8 unidades)
        const valorEscalado = Math.min(nutriente.valor / 20, 8);
        const altura = Math.max(valorEscalado, 0.5);

        // Crear cilindro para el nutriente
        const geometria = new THREE.CylinderGeometry(0.6, 0.6, altura, 32);
        const color = coloresNutrientes[nutriente.nombre] || 0x6366f1;
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.5,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.3
        });

        const cilindro = new THREE.Mesh(geometria, material);
        cilindro.position.set(x, altura / 2 - 1.5, z);
        cilindro.castShadow = true;

        // Agregar brillo en la parte superior
        const geometriaBrillo = new THREE.SphereGeometry(0.3, 16, 16);
        const materialBrillo = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        });
        const brillo = new THREE.Mesh(geometriaBrillo, materialBrillo);
        brillo.position.set(x, altura - 1.5, z);

        grupoNutrientes.add(cilindro);
        grupoNutrientes.add(brillo);

        // Agregar luz puntual para cada nutriente
        const luzNutriente = new THREE.PointLight(color, 0.5, 5);
        luzNutriente.position.set(x, altura - 1.5, z);
        grupoNutrientes.add(luzNutriente);
    });

    escena.add(grupoNutrientes);
}

// ===== ANIMACIÓN =====
function animarEscena() {
    requestAnimationFrame(animarEscena);

    // Rotar grupo de nutrientes si existe
    if (grupoNutrientes) {
        grupoNutrientes.rotation.y += 0.005;
    }

    // Actualizar controles
    controles.update();

    // Renderizar escena
    renderizador.render(escena, camara);
}

// ===== CONFIGURAR EVENTOS =====
function configurarEventos() {
    elementos.btnBuscar.addEventListener('click', buscarProducto);
    elementos.inputCodigoBarras.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarProducto();
    });
    elementos.btnCalcularPorcion.addEventListener('click', calcularPorcion);
}

// ===== BUSCAR PRODUCTO =====
async function buscarProducto() {
    const codigoBarras = elementos.inputCodigoBarras.value.trim();

    if (!codigoBarras) {
        mostrarError('Por favor ingresa un código de barras');
        return;
    }

    mostrarCargando(true);
    ocultarError();
    elementos.panelProducto.classList.add('oculto');

    try {
        const respuesta = await fetch(`${API_URL}/productos/${codigoBarras}`);

        if (!respuesta.ok) {
            throw new Error('Producto no encontrado');
        }

        const datos = await respuesta.json();
        productoActual = datos;
        mostrarProducto(datos);

    } catch (error) {
        mostrarError(`Error: ${error.message}`);
    } finally {
        mostrarCargando(false);
    }
}

// ===== MOSTRAR PRODUCTO =====
function mostrarProducto(producto) {
    // Actualizar información del producto
    elementos.nombreProducto.textContent = producto.nombre || 'Producto sin nombre';
    elementos.marcaProducto.textContent = producto.marca || 'Marca desconocida';
    elementos.codigoProducto.textContent = `📦 Código: ${producto.codigo_barras}`;
    elementos.fuenteProducto.textContent = `🌐 Fuente: ${producto.fuente}`;

    // Mostrar nutrientes en tabla
    mostrarTablaNutrientes(producto.nutrientes_por_100g);

    // Crear visualización 3D
    crearVisualizacionNutrientes(producto.nutrientes_por_100g);

    // Mostrar panel
    elementos.panelProducto.classList.remove('oculto');
}

// ===== MOSTRAR TABLA DE NUTRIENTES =====
function mostrarTablaNutrientes(nutrientes) {
    elementos.tablaNutrientes.innerHTML = '';

    nutrientes.forEach(nutriente => {
        const fila = document.createElement('div');
        fila.className = 'fila-nutriente';

        const color = coloresNutrientes[nutriente.nombre] || '#6366f1';
        fila.style.borderLeftColor = color;

        fila.innerHTML = `
            <span class="nombre-nutriente">${nutriente.nombre}</span>
            <span class="valor-nutriente">${nutriente.valor} ${nutriente.unidad}</span>
        `;

        elementos.tablaNutrientes.appendChild(fila);
    });
}

// ===== CALCULAR PORCIÓN =====
async function calcularPorcion() {
    if (!productoActual) {
        mostrarError('Primero busca un producto');
        return;
    }

    const gramos = parseFloat(elementos.inputGramos.value);

    if (!gramos || gramos <= 0) {
        mostrarError('Ingresa una cantidad válida de gramos');
        return;
    }

    mostrarCargando(true);
    ocultarError();

    try {
        const respuesta = await fetch(
            `${API_URL}/productos/${productoActual.codigo_barras}/porcion/${gramos}`
        );

        if (!respuesta.ok) {
            throw new Error('Error al calcular la porción');
        }

        const datos = await respuesta.json();

        // Actualizar visualización con los nuevos valores
        // datos.nutrientes ya es un array con objetos {nombre, valor, unidad}
        mostrarTablaNutrientes(datos.nutrientes);
        crearVisualizacionNutrientes(datos.nutrientes);

        // Actualizar título para indicar la porción
        elementos.nombreProducto.textContent =
            `${productoActual.nombre} (${gramos}g)`;

    } catch (error) {
        mostrarError(`Error: ${error.message}`);
    } finally {
        mostrarCargando(false);
    }
}

// ===== UTILIDADES DE UI =====
function mostrarCargando(mostrar) {
    if (mostrar) {
        elementos.indicadorCarga.classList.remove('oculto');
    } else {
        elementos.indicadorCarga.classList.add('oculto');
    }
}

function mostrarError(mensaje) {
    elementos.textoError.textContent = mensaje;
    elementos.mensajeError.classList.remove('oculto');

    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        ocultarError();
    }, 5000);
}

function ocultarError() {
    elementos.mensajeError.classList.add('oculto');
}

function alRedimensionar() {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
}

// ===== INICIAR APLICACIÓN =====
window.addEventListener('DOMContentLoaded', inicializar);
