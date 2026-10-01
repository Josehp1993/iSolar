-- iSolar Database Schema

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'asesor' CHECK (rol IN ('superadmin', 'asesor', 'consulta')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  categoria_id INT REFERENCES categorias(id),
  nombre VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  marca VARCHAR(100),
  referencia VARCHAR(100),
  descripcion TEXT,
  specs JSONB DEFAULT '{}',
  features TEXT[],
  precio DECIMAL(12,2) DEFAULT 0,
  precio_oferta DECIMAL(12,2),
  stock INT DEFAULT 0,
  imagen_url TEXT,
  imagenes TEXT[],
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  telefono VARCHAR(20),
  cedula VARCHAR(20),
  ciudad VARCHAR(100),
  direccion TEXT,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS negociaciones (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id),
  producto_id INT REFERENCES productos(id),
  usuario_id INT REFERENCES usuarios(id),
  estado VARCHAR(20) DEFAULT 'lead' CHECK (estado IN ('lead','contactado','cotizado','negociacion','cerrado','perdido')),
  fuente VARCHAR(30) DEFAULT 'web' CHECK (fuente IN ('web','whatsapp','instagram','referido','presencial','wompi')),
  valor_cotizacion DECIMAL(12,2) DEFAULT 0,
  valor_cierre DECIMAL(12,2) DEFAULT 0,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seguimientos (
  id SERIAL PRIMARY KEY,
  negociacion_id INT REFERENCES negociaciones(id) ON DELETE CASCADE,
  tipo VARCHAR(20) DEFAULT 'nota' CHECK (tipo IN ('nota','llamada','correo','visita','whatsapp')),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id),
  referencia VARCHAR(50) UNIQUE NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobado','rechazado','enviado','entregado','cancelado')),
  subtotal DECIMAL(12,2) NOT NULL,
  iva DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  wompi_transaction_id VARCHAR(100),
  wompi_status VARCHAR(30),
  direccion_envio TEXT,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL
);

-- Seed admin user (password: admin123)
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES ('Administrador', 'admin@isolar.com.co', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- Seed categories
INSERT INTO categorias (nombre, slug, orden) VALUES
  ('Paneles Solares', 'paneles', 1),
  ('Inversores', 'inversores', 2),
  ('Controladores de Carga', 'controladores', 3),
  ('Baterias de Gel', 'baterias-gel', 4),
  ('Baterias de Litio', 'baterias-litio', 5),
  ('Protecciones', 'protecciones', 6),
  ('Estructura', 'estructura', 7),
  ('Accesorios', 'accesorios', 8)
ON CONFLICT (slug) DO NOTHING;
