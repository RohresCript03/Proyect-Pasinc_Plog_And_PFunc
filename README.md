# Motor de Inferencia Lógica como Servicio

Servicio web que expone un motor de inferencia simbólica (Prolog) mediante una API REST en Node.js + Express.

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación local 
### Pasos para VS Code

```bash
Abrir la terminal y realizar los siguientes pasos:

git clone https://github.com/RohresCript03/Proyect-Pasinc_Plog_And_PFunc.git
cd Proyect-Pasinc_Plog_And_PFunc
(code -r .) "Desde VS"
npm install
```

## Ejecución

```bash
npm start
# El servidor corre en http://localhost:3000
```

Para desarrollo con recarga automática:

```bash
npm run dev
```

## Endpoints

### `GET /health`
Esto verifica que el servidor esté activo.

```bash
curl http://localhost:3000/health
```

### `POST /query`
Ejecuta una consulta Prolog sobre la base de conocimiento.

**Body:**
```json
{ "query": "<consulta prolog>" }
```

**Ejemplos:**

```bash
# ¿Qué contratos tienen penalización aplicable?
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "penalizacion_aplicable(X)"}'

# ¿Es contrato1 de alto riesgo?
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "alto_riesgo(contrato1)"}'

# ¿Qué contratos son problemáticos?
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "contrato_problematico(X)"}'

# Información completa de todos los contratos
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "info_contrato(C, Estado, Año, Cliente, Tipo)"}'
```

## Estructura del proyecto

```
inference-engine/
├── server.js          # Servidor Express + motor de inferencia
├── knowledge/
│   └── base.pl        # Base de conocimiento Prolog
├── package.json
└── README.md
```

## Ejecución más sencilla Para New Request

```
Instalar  la extension (En VS Code ) de Thunder Client.
Una vez hecho, ejecutar en el botón del rayo y por consiguiente
cambiaar "GET" por "POST" y definir la liga que en este caso es;

"http://localhost:3000"

Una vez realizado, movernos a 'body'
y ahi definir nuestras query. El formato de entrada sería;

{
  "query": "example_123(X)"
}

```
