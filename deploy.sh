#!/bin/bash
set -e

echo "=== Deploy iSolar en isolar.rednodetech.com ==="

# 1. Clonar o actualizar
if [ -d /var/www/isolar ]; then
  echo ">> Actualizando repo..."
  cd /var/www/isolar
  git fetch origin
  git checkout claude/loving-tesla-mntjtt
  git pull origin claude/loving-tesla-mntjtt
else
  echo ">> Clonando repo..."
  git clone https://github.com/Josehp1993/iSolar.git /var/www/isolar
  cd /var/www/isolar
  git checkout claude/loving-tesla-mntjtt
fi

# 2. Instalar dependencias
echo ">> npm install..."
npm install

# 3. Base de datos
echo ">> Creando base de datos..."
sudo -u postgres psql -c "CREATE DATABASE isolar;" 2>/dev/null || echo "BD ya existe"
sudo -u postgres psql isolar < lib/schema.sql

# 4. Crear .env si no existe
if [ ! -f .env ]; then
  echo ">> Creando .env..."
  cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/isolar
JWT_SECRET=isolar_jwt_secreto_cambiar_2026
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=
WOMPI_EVENTS_KEY=
ENVEOF
  echo "!! EDITA .env con tu password de PostgreSQL y keys de Wompi !!"
fi

# 5. Build
echo ">> Building Next.js..."
npm run build

# 6. PM2
echo ">> Iniciando con PM2..."
pm2 delete isolar 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# 7. Caddy - agregar subdominio
if ! grep -q "isolar.rednodetech.com" /etc/caddy/Caddyfile 2>/dev/null; then
  echo ">> Agregando isolar.rednodetech.com a Caddy..."
  cat >> /etc/caddy/Caddyfile << 'CADDYEOF'

isolar.rednodetech.com {
    reverse_proxy localhost:3002
}
CADDYEOF
  sudo systemctl reload caddy
  echo ">> Caddy actualizado"
else
  echo ">> Caddy ya tiene isolar.rednodetech.com"
fi

echo ""
echo "=== LISTO ==="
echo "URL: https://isolar.rednodetech.com"
echo "Admin: https://isolar.rednodetech.com/admin/login"
echo "Usuario: admin@isolar.com.co / admin123"
echo ""
echo "PENDIENTE:"
echo "1. Editar /var/www/isolar/.env con el password real de PostgreSQL"
echo "2. Agregar registro DNS: isolar.rednodetech.com -> A -> 188.245.19.99"
echo "3. Reiniciar: cd /var/www/isolar && npm run build && pm2 restart isolar"
