-- Seed Products from Cosostenible Brochure
-- Run: psql -U isolar -d isolar -f scripts/seed-products.sql

-- Ensure categories exist
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

-- Helper: get category IDs
DO $$
DECLARE
  cat_paneles INT;
  cat_inversores INT;
  cat_controladores INT;
  cat_baterias_gel INT;
  cat_baterias_litio INT;
  cat_protecciones INT;
  cat_estructura INT;
  cat_accesorios INT;
BEGIN
  SELECT id INTO cat_paneles FROM categorias WHERE slug = 'paneles';
  SELECT id INTO cat_inversores FROM categorias WHERE slug = 'inversores';
  SELECT id INTO cat_controladores FROM categorias WHERE slug = 'controladores';
  SELECT id INTO cat_baterias_gel FROM categorias WHERE slug = 'baterias-gel';
  SELECT id INTO cat_baterias_litio FROM categorias WHERE slug = 'baterias-litio';
  SELECT id INTO cat_protecciones FROM categorias WHERE slug = 'protecciones';
  SELECT id INTO cat_estructura FROM categorias WHERE slug = 'estructura';
  SELECT id INTO cat_accesorios FROM categorias WHERE slug = 'accesorios';

  -- =============================================
  -- CONTROLADORES PWM GreenPoint Gris
  -- =============================================
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_controladores, 'Controlador PWM GreenPoint Gris 10A', 'pwm-greenpoint-gris-10a', 'GreenPoint', 'GP-PWM-G-10A',
   'Controlador de carga solar PWM 10A con pantalla LCD. Compatible con sistemas 12V/24V auto-deteccion.',
   '{"potencia":"10A","voltaje":"12V/24V","tipo":"PWM","pantalla":"LCD"}',
   ARRAY['Auto-deteccion 12V/24V','Pantalla LCD','Proteccion contra sobrecarga','Proteccion contra cortocircuito','Proteccion contra polaridad inversa'],
   0, 50, false),
  (cat_controladores, 'Controlador PWM GreenPoint Gris 20A', 'pwm-greenpoint-gris-20a', 'GreenPoint', 'GP-PWM-G-20A',
   'Controlador de carga solar PWM 20A con pantalla LCD. Compatible con sistemas 12V/24V auto-deteccion.',
   '{"potencia":"20A","voltaje":"12V/24V","tipo":"PWM","pantalla":"LCD"}',
   ARRAY['Auto-deteccion 12V/24V','Pantalla LCD','Proteccion contra sobrecarga','Proteccion contra cortocircuito','Proteccion contra polaridad inversa'],
   0, 50, false),
  (cat_controladores, 'Controlador PWM GreenPoint Gris 30A', 'pwm-greenpoint-gris-30a', 'GreenPoint', 'GP-PWM-G-30A',
   'Controlador de carga solar PWM 30A con pantalla LCD. Compatible con sistemas 12V/24V auto-deteccion.',
   '{"potencia":"30A","voltaje":"12V/24V","tipo":"PWM","pantalla":"LCD"}',
   ARRAY['Auto-deteccion 12V/24V','Pantalla LCD','Proteccion contra sobrecarga','Proteccion contra cortocircuito','Proteccion contra polaridad inversa'],
   0, 50, false),
  (cat_controladores, 'Controlador PWM GreenPoint Gris 40A', 'pwm-greenpoint-gris-40a', 'GreenPoint', 'GP-PWM-G-40A',
   'Controlador de carga solar PWM 40A con pantalla LCD. Compatible con sistemas 12V/24V/48V auto-deteccion.',
   '{"potencia":"40A","voltaje":"12V/24V/48V","tipo":"PWM","pantalla":"LCD"}',
   ARRAY['Auto-deteccion 12V/24V/48V','Pantalla LCD','Proteccion contra sobrecarga','Proteccion contra cortocircuito','Proteccion contra polaridad inversa'],
   0, 30, false),
  (cat_controladores, 'Controlador PWM GreenPoint Gris 60A', 'pwm-greenpoint-gris-60a', 'GreenPoint', 'GP-PWM-G-60A',
   'Controlador de carga solar PWM 60A con pantalla LCD. Compatible con sistemas 12V/24V/48V auto-deteccion.',
   '{"potencia":"60A","voltaje":"12V/24V/48V","tipo":"PWM","pantalla":"LCD"}',
   ARRAY['Auto-deteccion 12V/24V/48V','Pantalla LCD','Proteccion contra sobrecarga','Proteccion contra cortocircuito','Proteccion contra polaridad inversa'],
   0, 20, false)
  ON CONFLICT (slug) DO NOTHING;

  -- CONTROLADORES PWM GreenPoint Verde/Negro
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_controladores, 'Controlador PWM GreenPoint Verde 10A', 'pwm-greenpoint-verde-10a', 'GreenPoint', 'GP-PWM-V-10A',
   'Controlador de carga solar PWM 10A serie verde/negro. Compatible con sistemas 12V/24V.',
   '{"potencia":"10A","voltaje":"12V/24V","tipo":"PWM"}',
   ARRAY['Auto-deteccion 12V/24V','Proteccion multiple','Diseno compacto'],
   0, 50, false),
  (cat_controladores, 'Controlador PWM GreenPoint Verde 20A', 'pwm-greenpoint-verde-20a', 'GreenPoint', 'GP-PWM-V-20A',
   'Controlador de carga solar PWM 20A serie verde/negro. Compatible con sistemas 12V/24V.',
   '{"potencia":"20A","voltaje":"12V/24V","tipo":"PWM"}',
   ARRAY['Auto-deteccion 12V/24V','Proteccion multiple','Diseno compacto'],
   0, 50, false),
  (cat_controladores, 'Controlador PWM GreenPoint Verde 30A', 'pwm-greenpoint-verde-30a', 'GreenPoint', 'GP-PWM-V-30A',
   'Controlador de carga solar PWM 30A serie verde/negro. Compatible con sistemas 12V/24V.',
   '{"potencia":"30A","voltaje":"12V/24V","tipo":"PWM"}',
   ARRAY['Auto-deteccion 12V/24V','Proteccion multiple','Diseno compacto'],
   0, 50, false),
  (cat_controladores, 'Controlador PWM GreenPoint Verde 40A', 'pwm-greenpoint-verde-40a', 'GreenPoint', 'GP-PWM-V-40A',
   'Controlador de carga solar PWM 40A serie verde/negro. Compatible con sistemas 12V/24V.',
   '{"potencia":"40A","voltaje":"12V/24V","tipo":"PWM"}',
   ARRAY['Auto-deteccion 12V/24V','Proteccion multiple','Diseno compacto'],
   0, 30, false),
  (cat_controladores, 'Controlador PWM GreenPoint Verde 60A', 'pwm-greenpoint-verde-60a', 'GreenPoint', 'GP-PWM-V-60A',
   'Controlador de carga solar PWM 60A serie verde/negro. Compatible con sistemas 12V/24V.',
   '{"potencia":"60A","voltaje":"12V/24V","tipo":"PWM"}',
   ARRAY['Auto-deteccion 12V/24V','Proteccion multiple','Diseno compacto'],
   0, 20, false)
  ON CONFLICT (slug) DO NOTHING;

  -- CONTROLADORES MPPT SRNE Shiner
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_controladores, 'Controlador MPPT SRNE Shiner 20A', 'mppt-srne-shiner-20a', 'SRNE', 'SRNE-SH-20A',
   'Controlador de carga MPPT 20A SRNE serie Shiner. Entrada PV hasta 100V. Eficiencia de seguimiento >99.5%.',
   '{"potencia":"20A","voltaje":"12V/24V","tipo":"MPPT","entrada_pv":"60-100V","eficiencia":">99.5%"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Comunicacion RS485','Compatible con bateria litio'],
   0, 30, false),
  (cat_controladores, 'Controlador MPPT SRNE Shiner 30A', 'mppt-srne-shiner-30a', 'SRNE', 'SRNE-SH-30A',
   'Controlador de carga MPPT 30A SRNE serie Shiner. Entrada PV hasta 100V. Eficiencia de seguimiento >99.5%.',
   '{"potencia":"30A","voltaje":"12V/24V","tipo":"MPPT","entrada_pv":"60-100V","eficiencia":">99.5%"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Comunicacion RS485','Compatible con bateria litio'],
   0, 30, false),
  (cat_controladores, 'Controlador MPPT SRNE Shiner 40A', 'mppt-srne-shiner-40a', 'SRNE', 'SRNE-SH-40A',
   'Controlador de carga MPPT 40A SRNE serie Shiner. Entrada PV hasta 100V. Eficiencia de seguimiento >99.5%.',
   '{"potencia":"40A","voltaje":"12V/24V","tipo":"MPPT","entrada_pv":"60-100V","eficiencia":">99.5%"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Comunicacion RS485','Compatible con bateria litio'],
   0, 30, true)
  ON CONFLICT (slug) DO NOTHING;

  -- CONTROLADORES MPPT SRNE Serie MF
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_controladores, 'Controlador MPPT SRNE Serie MF 60A', 'mppt-srne-mf-60a', 'SRNE', 'SRNE-MF-60A',
   'Controlador de carga MPPT 60A SRNE serie MF. Entrada PV hasta 150V. Compatible con sistemas 12V/24V/48V.',
   '{"potencia":"60A","voltaje":"12V/24V/48V","tipo":"MPPT","entrada_pv":"150V","eficiencia":">99.5%"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 150V','Pantalla LCD','Comunicacion RS485','Compatible 12V/24V/48V','Compatible con bateria litio'],
   0, 20, true)
  ON CONFLICT (slug) DO NOTHING;

  -- CONTROLADORES MPPT SRNE Serie MC
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_controladores, 'Controlador MPPT SRNE Serie MC 50A', 'mppt-srne-mc-50a', 'SRNE', 'SRNE-MC-50A',
   'Controlador de carga MPPT 50A SRNE serie MC. Entrada PV hasta 92V. Compatible con sistemas 12V/24V.',
   '{"potencia":"50A","voltaje":"12V/24V","tipo":"MPPT","entrada_pv":"92V"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 92V','Pantalla LCD','Comunicacion RS485','Compatible con bateria litio'],
   0, 20, false)
  ON CONFLICT (slug) DO NOTHING;

  -- CONTROLADORES MPPT SRNE Serie ML
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_controladores, 'Controlador MPPT SRNE Serie ML 20A', 'mppt-srne-ml-20a', 'SRNE', 'SRNE-ML-20A',
   'Controlador de carga MPPT 20A SRNE serie ML. Entrada PV hasta 100V.',
   '{"potencia":"20A","voltaje":"12V/24V","tipo":"MPPT","entrada_pv":"100V"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Compatible con bateria litio'],
   0, 30, false),
  (cat_controladores, 'Controlador MPPT SRNE Serie ML 30A', 'mppt-srne-ml-30a', 'SRNE', 'SRNE-ML-30A',
   'Controlador de carga MPPT 30A SRNE serie ML. Entrada PV hasta 100V.',
   '{"potencia":"30A","voltaje":"12V/24V","tipo":"MPPT","entrada_pv":"100V"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Compatible con bateria litio'],
   0, 30, false),
  (cat_controladores, 'Controlador MPPT SRNE Serie ML 40A', 'mppt-srne-ml-40a', 'SRNE', 'SRNE-ML-40A',
   'Controlador de carga MPPT 40A SRNE serie ML. Entrada PV hasta 100V.',
   '{"potencia":"40A","voltaje":"12V/24V","tipo":"MPPT","entrada_pv":"100V"}',
   ARRAY['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Compatible con bateria litio'],
   0, 30, false)
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================
  -- INVERSORES ONDA PURA - Belttt Serie BEP
  -- =============================================
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Onda Pura Belttt BEP 600W', 'inversor-belttt-bep-600w', 'Belttt', 'BEP-600',
   'Inversor de onda sinusoidal pura 600W Belttt serie BEP. Ideal para equipos sensibles.',
   '{"potencia":"600W","tipo":"Onda Pura","entrada":"12V DC","salida":"110V/120V AC"}',
   ARRAY['Onda sinusoidal pura','Proteccion contra sobrecarga','Proteccion termica','Arranque suave'],
   0, 30, false),
  (cat_inversores, 'Inversor Onda Pura Belttt BEP 1000W', 'inversor-belttt-bep-1000w', 'Belttt', 'BEP-1000',
   'Inversor de onda sinusoidal pura 1000W Belttt serie BEP.',
   '{"potencia":"1000W","tipo":"Onda Pura","entrada":"12V DC","salida":"110V/120V AC"}',
   ARRAY['Onda sinusoidal pura','Proteccion contra sobrecarga','Proteccion termica','Arranque suave'],
   0, 30, false),
  (cat_inversores, 'Inversor Onda Pura Belttt BEP 1500W', 'inversor-belttt-bep-1500w', 'Belttt', 'BEP-1500',
   'Inversor de onda sinusoidal pura 1500W Belttt serie BEP.',
   '{"potencia":"1500W","tipo":"Onda Pura","entrada":"12V DC","salida":"110V/120V AC"}',
   ARRAY['Onda sinusoidal pura','Proteccion contra sobrecarga','Proteccion termica','Arranque suave'],
   0, 20, false),
  (cat_inversores, 'Inversor Onda Pura Belttt BEP 2000W', 'inversor-belttt-bep-2000w', 'Belttt', 'BEP-2000',
   'Inversor de onda sinusoidal pura 2000W Belttt serie BEP.',
   '{"potencia":"2000W","tipo":"Onda Pura","entrada":"24V DC","salida":"110V/120V AC"}',
   ARRAY['Onda sinusoidal pura','Proteccion contra sobrecarga','Proteccion termica','Arranque suave'],
   0, 20, false),
  (cat_inversores, 'Inversor Onda Pura Belttt BEP 3000W', 'inversor-belttt-bep-3000w', 'Belttt', 'BEP-3000',
   'Inversor de onda sinusoidal pura 3000W Belttt serie BEP.',
   '{"potencia":"3000W","tipo":"Onda Pura","entrada":"24V DC","salida":"110V/120V AC"}',
   ARRAY['Onda sinusoidal pura','Proteccion contra sobrecarga','Proteccion termica','Arranque suave'],
   0, 15, true)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES ONDA PURA - Belttt Serie BBP
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Onda Pura Belttt BBP 2000W', 'inversor-belttt-bbp-2000w', 'Belttt', 'BBP-2000',
   'Inversor de onda sinusoidal pura 2000W Belttt serie BBP.',
   '{"potencia":"2000W","tipo":"Onda Pura","serie":"BBP"}',
   ARRAY['Onda sinusoidal pura','Alta eficiencia','Proteccion multiple'],
   0, 20, false),
  (cat_inversores, 'Inversor Onda Pura Belttt BBP 3000W', 'inversor-belttt-bbp-3000w', 'Belttt', 'BBP-3000',
   'Inversor de onda sinusoidal pura 3000W Belttt serie BBP.',
   '{"potencia":"3000W","tipo":"Onda Pura","serie":"BBP"}',
   ARRAY['Onda sinusoidal pura','Alta eficiencia','Proteccion multiple'],
   0, 15, false)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES ONDA PURA - Belttt Serie BAP
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Onda Pura Belttt BAP 1000W', 'inversor-belttt-bap-1000w', 'Belttt', 'BAP-1000',
   'Inversor de onda sinusoidal pura 1000W Belttt serie BAP.',
   '{"potencia":"1000W","tipo":"Onda Pura","serie":"BAP"}',
   ARRAY['Onda sinusoidal pura','Diseno compacto','Proteccion multiple'],
   0, 25, false),
  (cat_inversores, 'Inversor Onda Pura Belttt BAP 1500W', 'inversor-belttt-bap-1500w', 'Belttt', 'BAP-1500',
   'Inversor de onda sinusoidal pura 1500W Belttt serie BAP.',
   '{"potencia":"1500W","tipo":"Onda Pura","serie":"BAP"}',
   ARRAY['Onda sinusoidal pura','Diseno compacto','Proteccion multiple'],
   0, 20, false)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES ONDA MODIFICADA - Belttt Serie BEL
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Onda Modificada Belttt BEL 200W', 'inversor-belttt-bel-200w', 'Belttt', 'BEL-200',
   'Inversor de onda modificada 200W. Ideal para cargas basicas.',
   '{"potencia":"200W","tipo":"Onda Modificada","serie":"BEL"}',
   ARRAY['Onda modificada','Economico','Puerto USB','Proteccion contra sobrecarga'],
   0, 50, false),
  (cat_inversores, 'Inversor Onda Modificada Belttt BEL 300W', 'inversor-belttt-bel-300w', 'Belttt', 'BEL-300',
   'Inversor de onda modificada 300W.',
   '{"potencia":"300W","tipo":"Onda Modificada","serie":"BEL"}',
   ARRAY['Onda modificada','Economico','Puerto USB','Proteccion contra sobrecarga'],
   0, 50, false),
  (cat_inversores, 'Inversor Onda Modificada Belttt BEL 500W', 'inversor-belttt-bel-500w', 'Belttt', 'BEL-500',
   'Inversor de onda modificada 500W.',
   '{"potencia":"500W","tipo":"Onda Modificada","serie":"BEL"}',
   ARRAY['Onda modificada','Economico','Puerto USB','Proteccion contra sobrecarga'],
   0, 40, false),
  (cat_inversores, 'Inversor Onda Modificada Belttt BEL 800W', 'inversor-belttt-bel-800w', 'Belttt', 'BEL-800',
   'Inversor de onda modificada 800W.',
   '{"potencia":"800W","tipo":"Onda Modificada","serie":"BEL"}',
   ARRAY['Onda modificada','Economico','Puerto USB','Proteccion contra sobrecarga'],
   0, 30, false),
  (cat_inversores, 'Inversor Onda Modificada Belttt BEL 1000W', 'inversor-belttt-bel-1000w', 'Belttt', 'BEL-1000',
   'Inversor de onda modificada 1000W.',
   '{"potencia":"1000W","tipo":"Onda Modificada","serie":"BEL"}',
   ARRAY['Onda modificada','Economico','Puerto USB','Proteccion contra sobrecarga'],
   0, 30, false)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES ONDA MODIFICADA - Belttt Serie BEM
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Onda Modificada Belttt BEM 1000W', 'inversor-belttt-bem-1000w', 'Belttt', 'BEM-1000',
   'Inversor de onda modificada 1000W serie BEM.',
   '{"potencia":"1000W","tipo":"Onda Modificada","serie":"BEM"}',
   ARRAY['Onda modificada','Alta potencia pico','Proteccion multiple'],
   0, 25, false),
  (cat_inversores, 'Inversor Onda Modificada Belttt BEM 1500W', 'inversor-belttt-bem-1500w', 'Belttt', 'BEM-1500',
   'Inversor de onda modificada 1500W serie BEM.',
   '{"potencia":"1500W","tipo":"Onda Modificada","serie":"BEM"}',
   ARRAY['Onda modificada','Alta potencia pico','Proteccion multiple'],
   0, 20, false)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES CARGADORES - GreenPoint HF Monofasico
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Cargador GreenPoint HF 1200W 12V', 'inversor-cargador-gp-hf-1200w-12v', 'GreenPoint', 'GP-HF-1200-12',
   'Inversor cargador monofasico HF 1200W entrada 12V. Onda pura con cargador integrado.',
   '{"potencia":"1200W","tipo":"Inversor Cargador","entrada":"12V","fase":"Monofasico","onda":"Pura"}',
   ARRAY['Onda sinusoidal pura','Cargador integrado','Transferencia automatica','Monofasico'],
   0, 20, false),
  (cat_inversores, 'Inversor Cargador GreenPoint HF 1200W 24V', 'inversor-cargador-gp-hf-1200w-24v', 'GreenPoint', 'GP-HF-1200-24',
   'Inversor cargador monofasico HF 1200W entrada 24V.',
   '{"potencia":"1200W","tipo":"Inversor Cargador","entrada":"24V","fase":"Monofasico","onda":"Pura"}',
   ARRAY['Onda sinusoidal pura','Cargador integrado','Transferencia automatica','Monofasico'],
   0, 20, false),
  (cat_inversores, 'Inversor Cargador GreenPoint HF 1600W 24V', 'inversor-cargador-gp-hf-1600w', 'GreenPoint', 'GP-HF-1600',
   'Inversor cargador monofasico HF 1600W entrada 24V.',
   '{"potencia":"1600W","tipo":"Inversor Cargador","entrada":"24V","fase":"Monofasico","onda":"Pura"}',
   ARRAY['Onda sinusoidal pura','Cargador integrado','Transferencia automatica','Monofasico'],
   0, 15, false),
  (cat_inversores, 'Inversor Cargador GreenPoint HF 2400W 24V', 'inversor-cargador-gp-hf-2400w', 'GreenPoint', 'GP-HF-2400',
   'Inversor cargador monofasico HF 2400W entrada 24V.',
   '{"potencia":"2400W","tipo":"Inversor Cargador","entrada":"24V","fase":"Monofasico","onda":"Pura"}',
   ARRAY['Onda sinusoidal pura','Cargador integrado','Transferencia automatica','Monofasico'],
   0, 15, false),
  (cat_inversores, 'Inversor Cargador GreenPoint HF 3000W 24V', 'inversor-cargador-gp-hf-3000w', 'GreenPoint', 'GP-HF-3000',
   'Inversor cargador monofasico HF 3000W entrada 24V.',
   '{"potencia":"3000W","tipo":"Inversor Cargador","entrada":"24V","fase":"Monofasico","onda":"Pura"}',
   ARRAY['Onda sinusoidal pura','Cargador integrado','Transferencia automatica','Monofasico'],
   0, 10, true)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES CARGADORES - SRNE
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Cargador SRNE HF 3000W 24V 80A MPPT', 'inversor-cargador-srne-hf-3000w', 'SRNE', 'SRNE-HF-3000',
   'Inversor cargador monofasico SRNE 3000W 24V con MPPT 80A integrado.',
   '{"potencia":"3000W","tipo":"Inversor Cargador MPPT","entrada":"24V","mppt":"80A","fase":"Monofasico"}',
   ARRAY['MPPT 80A integrado','Onda sinusoidal pura','Monitoreo WiFi','Transferencia automatica'],
   0, 10, true),
  (cat_inversores, 'Inversor Cargador SRNE HYP 5000W 48V 100A MPPT', 'inversor-cargador-srne-hyp-5000w', 'SRNE', 'SRNE-HYP-5000',
   'Inversor cargador monofasico SRNE HYP 5000W 48V con MPPT 100A. Certificacion RETIE.',
   '{"potencia":"5000W","tipo":"Inversor Cargador MPPT","entrada":"48V","mppt":"100A","fase":"Monofasico","certificacion":"RETIE"}',
   ARRAY['MPPT 100A integrado','Certificacion RETIE','Onda sinusoidal pura','Monitoreo WiFi','Compatible bateria litio'],
   0, 10, true)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES CARGADORES - SRNE ASP Fase Dividida
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Cargador SRNE ASP 6500W 48V Fase Dividida', 'inversor-srne-asp-6500w', 'SRNE', 'SRNE-ASP-6500',
   'Inversor cargador SRNE ASP 6500W 48V fase dividida 120/240V. Certificacion RETIE.',
   '{"potencia":"6500W","tipo":"Fase Dividida","entrada":"48V","salida":"120/240V AC","certificacion":"RETIE"}',
   ARRAY['Fase dividida 120/240V','Certificacion RETIE','MPPT integrado','Compatible bateria litio','Monitoreo WiFi'],
   0, 8, true),
  (cat_inversores, 'Inversor Cargador SRNE ASP 10000W 48V Fase Dividida', 'inversor-srne-asp-10000w', 'SRNE', 'SRNE-ASP-10000',
   'Inversor cargador SRNE ASP 10000W 48V fase dividida 120/240V. Certificacion RETIE.',
   '{"potencia":"10000W","tipo":"Fase Dividida","entrada":"48V","salida":"120/240V AC","certificacion":"RETIE"}',
   ARRAY['Fase dividida 120/240V','Certificacion RETIE','MPPT integrado','Compatible bateria litio','Monitoreo WiFi'],
   0, 5, true)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES HIBRIDOS - SRNE HESP
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor Hibrido SRNE HESP 6000W 48V', 'inversor-hibrido-srne-hesp-6000w', 'SRNE', 'SRNE-HESP-6000',
   'Inversor hibrido SRNE HESP 6000W 48V. Emparejar hasta 6 unidades. Certificacion RETIE.',
   '{"potencia":"6000W","tipo":"Hibrido","entrada":"48V","certificacion":"RETIE","paralelo":"Hasta 6 unidades"}',
   ARRAY['Certificacion RETIE','Emparejar hasta 6 unidades','On-grid y Off-grid','MPPT integrado','Monitoreo WiFi'],
   0, 8, true),
  (cat_inversores, 'Inversor Hibrido SRNE HESP 12000W 48V', 'inversor-hibrido-srne-hesp-12000w', 'SRNE', 'SRNE-HESP-12000',
   'Inversor hibrido SRNE HESP 12000W 48V. Emparejar hasta 6 unidades. Certificacion RETIE.',
   '{"potencia":"12000W","tipo":"Hibrido","entrada":"48V","certificacion":"RETIE","paralelo":"Hasta 6 unidades"}',
   ARRAY['Certificacion RETIE','Emparejar hasta 6 unidades','On-grid y Off-grid','MPPT integrado','Monitoreo WiFi'],
   0, 5, true),
  (cat_inversores, 'Inversor Hibrido SRNE HESP 18000W 48V', 'inversor-hibrido-srne-hesp-18000w', 'SRNE', 'SRNE-HESP-18000',
   'Inversor hibrido SRNE HESP 18000W 48V. Emparejar hasta 6 unidades. Certificacion RETIE.',
   '{"potencia":"18000W","tipo":"Hibrido","entrada":"48V","certificacion":"RETIE","paralelo":"Hasta 6 unidades"}',
   ARRAY['Certificacion RETIE','Emparejar hasta 6 unidades','On-grid y Off-grid','MPPT integrado','Monitoreo WiFi'],
   0, 3, true)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES ON-GRID BIFASICOS
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor On-Grid GoodWe DNS G4 5000W', 'inversor-goodwe-dns-g4-5000w', 'GoodWe', 'GW-DNS-5000',
   'Inversor on-grid bifasico GoodWe DNS G4 5000W. IP66, certificacion RETIE.',
   '{"potencia":"5000W","tipo":"On-Grid Bifasico","proteccion":"IP66","certificacion":"RETIE"}',
   ARRAY['Certificacion RETIE','IP66 exterior','WiFi integrado','Alta eficiencia >97%'],
   0, 10, false),
  (cat_inversores, 'Inversor On-Grid GoodWe DNS G4 6000W', 'inversor-goodwe-dns-g4-6000w', 'GoodWe', 'GW-DNS-6000',
   'Inversor on-grid bifasico GoodWe DNS G4 6000W. IP66, certificacion RETIE.',
   '{"potencia":"6000W","tipo":"On-Grid Bifasico","proteccion":"IP66","certificacion":"RETIE"}',
   ARRAY['Certificacion RETIE','IP66 exterior','WiFi integrado','Alta eficiencia >97%'],
   0, 10, false),
  (cat_inversores, 'Inversor On-Grid GoodWe MS G4 8500W', 'inversor-goodwe-ms-g4-8500w', 'GoodWe', 'GW-MS-8500',
   'Inversor on-grid bifasico GoodWe MS G4 8500W.',
   '{"potencia":"8500W","tipo":"On-Grid Bifasico"}',
   ARRAY['WiFi integrado','Alta eficiencia','2 MPPT'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid GoodWe MS G4 10000W', 'inversor-goodwe-ms-g4-10000w', 'GoodWe', 'GW-MS-10000',
   'Inversor on-grid bifasico GoodWe MS G4 10000W.',
   '{"potencia":"10000W","tipo":"On-Grid Bifasico"}',
   ARRAY['WiFi integrado','Alta eficiencia','2 MPPT'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid SolaX X1-Boost G4 5000W', 'inversor-solax-x1-boost-5000w', 'SolaX', 'X1-BOOST-5000',
   'Inversor on-grid SolaX X1-Boost G4 5000W. WiFi integrado, RETIE, 10 anos garantia.',
   '{"potencia":"5000W","tipo":"On-Grid Bifasico","certificacion":"RETIE","garantia":"10 anos"}',
   ARRAY['Certificacion RETIE','10 anos garantia','WiFi integrado','Diseno compacto'],
   0, 10, true),
  (cat_inversores, 'Inversor On-Grid SolaX X1-Boost G4 6000W', 'inversor-solax-x1-boost-6000w', 'SolaX', 'X1-BOOST-6000',
   'Inversor on-grid SolaX X1-Boost G4 6000W. WiFi integrado, RETIE, 10 anos garantia.',
   '{"potencia":"6000W","tipo":"On-Grid Bifasico","certificacion":"RETIE","garantia":"10 anos"}',
   ARRAY['Certificacion RETIE','10 anos garantia','WiFi integrado','Diseno compacto'],
   0, 10, false),
  (cat_inversores, 'Inversor On-Grid SolaX X1-Smart G2 8000W', 'inversor-solax-x1-smart-8000w', 'SolaX', 'X1-SMART-8000',
   'Inversor on-grid SolaX X1-Smart G2 8000W.',
   '{"potencia":"8000W","tipo":"On-Grid Bifasico"}',
   ARRAY['WiFi integrado','2 MPPT','Alta eficiencia'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid SolaX X1-Smart G2 10000W', 'inversor-solax-x1-smart-10000w', 'SolaX', 'X1-SMART-10000',
   'Inversor on-grid SolaX X1-Smart G2 10000W.',
   '{"potencia":"10000W","tipo":"On-Grid Bifasico"}',
   ARRAY['WiFi integrado','2 MPPT','Alta eficiencia'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid SolaX X1-Mini G4 3300W', 'inversor-solax-x1-mini-3300w', 'SolaX', 'X1-MINI-3300',
   'Inversor on-grid SolaX X1-Mini G4 3300W. Ultra compacto.',
   '{"potencia":"3300W","tipo":"On-Grid Bifasico"}',
   ARRAY['Ultra compacto','WiFi integrado','1 MPPT'],
   0, 15, false)
  ON CONFLICT (slug) DO NOTHING;

  -- INVERSORES ON-GRID TRIFASICOS
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor On-Grid GoodWe SDT G3 17000W', 'inversor-goodwe-sdt-17000w', 'GoodWe', 'GW-SDT-17000',
   'Inversor on-grid trifasico GoodWe SDT G3 17kW.',
   '{"potencia":"17000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','WiFi integrado','2 MPPT','Alta eficiencia'],
   0, 5, false),
  (cat_inversores, 'Inversor On-Grid GoodWe SDT G3 23000W', 'inversor-goodwe-sdt-23000w', 'GoodWe', 'GW-SDT-23000',
   'Inversor on-grid trifasico GoodWe SDT G3 23kW.',
   '{"potencia":"23000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','WiFi integrado','2 MPPT','Alta eficiencia'],
   0, 5, false),
  (cat_inversores, 'Inversor On-Grid GoodWe SMT 37500W', 'inversor-goodwe-smt-37500w', 'GoodWe', 'GW-SMT-37500',
   'Inversor on-grid trifasico GoodWe SMT 37.5kW para proyectos comerciales.',
   '{"potencia":"37500W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto comercial','4 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid GoodWe GT 50000W', 'inversor-goodwe-gt-50000w', 'GoodWe', 'GW-GT-50000',
   'Inversor on-grid trifasico GoodWe GT 50kW para proyectos comerciales e industriales.',
   '{"potencia":"50000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto industrial','6 MPPT','Monitoreo avanzado'],
   0, 2, false),
  (cat_inversores, 'Inversor On-Grid GoodWe GT 75000W', 'inversor-goodwe-gt-75000w', 'GoodWe', 'GW-GT-75000',
   'Inversor on-grid trifasico GoodWe GT 75kW para proyectos industriales.',
   '{"potencia":"75000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto industrial','6 MPPT','Monitoreo avanzado'],
   0, 2, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-MIC G2 6000W', 'inversor-solax-x3-mic-6000w', 'SolaX', 'X3-MIC-6000',
   'Inversor on-grid trifasico SolaX X3-MIC G2 6kW.',
   '{"potencia":"6000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','WiFi integrado','Compacto'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-MIC G2 8000W', 'inversor-solax-x3-mic-8000w', 'SolaX', 'X3-MIC-8000',
   'Inversor on-grid trifasico SolaX X3-MIC G2 8kW.',
   '{"potencia":"8000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','WiFi integrado','Compacto'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-PRO G2 10000W', 'inversor-solax-x3-pro-10000w', 'SolaX', 'X3-PRO-10000',
   'Inversor on-grid trifasico SolaX X3-PRO G2 10kW.',
   '{"potencia":"10000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','2 MPPT','WiFi integrado'],
   0, 5, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-PRO G2 15000W', 'inversor-solax-x3-pro-15000w', 'SolaX', 'X3-PRO-15000',
   'Inversor on-grid trifasico SolaX X3-PRO G2 15kW.',
   '{"potencia":"15000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','2 MPPT','WiFi integrado'],
   0, 5, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-MEGA G2 20000W', 'inversor-solax-x3-mega-20000w', 'SolaX', 'X3-MEGA-20000',
   'Inversor on-grid trifasico SolaX X3-MEGA G2 20kW para proyectos comerciales.',
   '{"potencia":"20000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto comercial','3 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-MEGA G2 25000W', 'inversor-solax-x3-mega-25000w', 'SolaX', 'X3-MEGA-25000',
   'Inversor on-grid trifasico SolaX X3-MEGA G2 25kW.',
   '{"potencia":"25000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto comercial','3 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-MEGA G2 30000W', 'inversor-solax-x3-mega-30000w', 'SolaX', 'X3-MEGA-30000',
   'Inversor on-grid trifasico SolaX X3-MEGA G2 30kW.',
   '{"potencia":"30000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto comercial','3 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-MEGA G2 35000W', 'inversor-solax-x3-mega-35000w', 'SolaX', 'X3-MEGA-35000',
   'Inversor on-grid trifasico SolaX X3-MEGA G2 35kW.',
   '{"potencia":"35000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto comercial','4 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-FORTH LV 50000W', 'inversor-solax-x3-forth-50000w', 'SolaX', 'X3-FORTH-50000',
   'Inversor on-grid trifasico SolaX X3-FORTH LV 50kW para proyectos industriales.',
   '{"potencia":"50000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto industrial','6 MPPT','Monitoreo avanzado'],
   0, 2, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-FORTH LV 60000W', 'inversor-solax-x3-forth-60000w', 'SolaX', 'X3-FORTH-60000',
   'Inversor on-grid trifasico SolaX X3-FORTH LV 60kW.',
   '{"potencia":"60000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto industrial','6 MPPT','Monitoreo avanzado'],
   0, 2, false),
  (cat_inversores, 'Inversor On-Grid SolaX X3-FORTH LV 70000W', 'inversor-solax-x3-forth-70000w', 'SolaX', 'X3-FORTH-70000',
   'Inversor on-grid trifasico SolaX X3-FORTH LV 70kW.',
   '{"potencia":"70000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto industrial','6 MPPT','Monitoreo avanzado'],
   0, 2, false)
  ON CONFLICT (slug) DO NOTHING;

  -- SAJ On-Grid Trifasicos
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Inversor On-Grid SAJ R6 5000W', 'inversor-saj-r6-5000w', 'SAJ', 'SAJ-R6-5000',
   'Inversor on-grid SAJ R6 5kW.',
   '{"potencia":"5000W","tipo":"On-Grid","fase":"1-3"}',
   ARRAY['WiFi integrado','Alta eficiencia','Compacto'],
   0, 10, false),
  (cat_inversores, 'Inversor On-Grid SAJ R6 6000W', 'inversor-saj-r6-6000w', 'SAJ', 'SAJ-R6-6000',
   'Inversor on-grid SAJ R6 6kW.',
   '{"potencia":"6000W","tipo":"On-Grid","fase":"1-3"}',
   ARRAY['WiFi integrado','Alta eficiencia'],
   0, 10, false),
  (cat_inversores, 'Inversor On-Grid SAJ R6 8000W', 'inversor-saj-r6-8000w', 'SAJ', 'SAJ-R6-8000',
   'Inversor on-grid SAJ R6 8kW.',
   '{"potencia":"8000W","tipo":"On-Grid","fase":"1-3"}',
   ARRAY['WiFi integrado','2 MPPT'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid SAJ R6 10000W', 'inversor-saj-r6-10000w', 'SAJ', 'SAJ-R6-10000',
   'Inversor on-grid SAJ R6 10kW.',
   '{"potencia":"10000W","tipo":"On-Grid","fase":"1-3"}',
   ARRAY['WiFi integrado','2 MPPT'],
   0, 8, false),
  (cat_inversores, 'Inversor On-Grid SAJ R6 15000W', 'inversor-saj-r6-15000w', 'SAJ', 'SAJ-R6-15000',
   'Inversor on-grid trifasico SAJ R6 15kW.',
   '{"potencia":"15000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','WiFi integrado','2 MPPT'],
   0, 5, false),
  (cat_inversores, 'Inversor On-Grid SAJ R6 20000W', 'inversor-saj-r6-20000w', 'SAJ', 'SAJ-R6-20000',
   'Inversor on-grid trifasico SAJ R6 20kW.',
   '{"potencia":"20000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','3 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid SAJ R6 25000W', 'inversor-saj-r6-25000w', 'SAJ', 'SAJ-R6-25000',
   'Inversor on-grid trifasico SAJ R6 25kW.',
   '{"potencia":"25000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','3 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid SAJ R6 30000W', 'inversor-saj-r6-30000w', 'SAJ', 'SAJ-R6-30000',
   'Inversor on-grid trifasico SAJ R6 30kW.',
   '{"potencia":"30000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','3 MPPT','WiFi integrado'],
   0, 3, false),
  (cat_inversores, 'Inversor On-Grid SAJ C6 50000W', 'inversor-saj-c6-50000w', 'SAJ', 'SAJ-C6-50000',
   'Inversor on-grid trifasico SAJ C6 50kW para proyectos industriales.',
   '{"potencia":"50000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto industrial','6 MPPT'],
   0, 2, false),
  (cat_inversores, 'Inversor On-Grid SAJ C6 75000W', 'inversor-saj-c6-75000w', 'SAJ', 'SAJ-C6-75000',
   'Inversor on-grid trifasico SAJ C6 75kW para proyectos industriales.',
   '{"potencia":"75000W","tipo":"On-Grid Trifasico","fase":"3"}',
   ARRAY['Trifasico','Proyecto industrial','6 MPPT'],
   0, 2, false)
  ON CONFLICT (slug) DO NOTHING;

  -- MICROINVERSORES
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_inversores, 'Microinversor SolaX X1-Micro 2000W', 'microinversor-solax-x1-micro-2000w', 'SolaX', 'X1-MICRO-2000',
   'Microinversor SolaX X1-Micro 2000W. Optimizacion panel a panel.',
   '{"potencia":"2000W","tipo":"Microinversor","paneles":"4"}',
   ARRAY['Optimizacion por panel','Monitoreo individual','IP67','Facil instalacion'],
   0, 15, false),
  (cat_inversores, 'Microinversor SolaX X1-Micro 2200W', 'microinversor-solax-x1-micro-2200w', 'SolaX', 'X1-MICRO-2200',
   'Microinversor SolaX X1-Micro 2200W.',
   '{"potencia":"2200W","tipo":"Microinversor","paneles":"4"}',
   ARRAY['Optimizacion por panel','Monitoreo individual','IP67','Facil instalacion'],
   0, 15, false),
  (cat_inversores, 'Microinversor TSUN TSOL-MS 2250W', 'microinversor-tsun-2250w', 'TSUN', 'TSOL-MS-2250',
   'Microinversor TSUN TSOL-MS 2250W.',
   '{"potencia":"2250W","tipo":"Microinversor"}',
   ARRAY['Optimizacion por panel','Monitoreo WiFi','IP67'],
   0, 15, false),
  (cat_inversores, 'Microinversor TSUN TSOL-MS 3000D', 'microinversor-tsun-3000d', 'TSUN', 'TSOL-MS-3000D',
   'Microinversor TSUN TSOL-MS 3000D.',
   '{"potencia":"3000W","tipo":"Microinversor"}',
   ARRAY['Optimizacion por panel','Monitoreo WiFi','IP67'],
   0, 10, false)
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================
  -- BATERIAS GEL - GreenPoint 6 CNFJ
  -- =============================================
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_baterias_gel, 'Bateria Gel GreenPoint 40Ah 12V', 'bateria-gel-gp-40ah', 'GreenPoint', 'GP-6CNFJ-40',
   'Bateria de gel 40Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.',
   '{"capacidad":"40Ah","voltaje":"12V","tipo":"Gel","ciclos":"1400 al 50% DOD","serie":"6 CNFJ"}',
   ARRAY['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
   0, 30, false),
  (cat_baterias_gel, 'Bateria Gel GreenPoint 55Ah 12V', 'bateria-gel-gp-55ah', 'GreenPoint', 'GP-6CNFJ-55',
   'Bateria de gel 55Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.',
   '{"capacidad":"55Ah","voltaje":"12V","tipo":"Gel","ciclos":"1400 al 50% DOD"}',
   ARRAY['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
   0, 30, false),
  (cat_baterias_gel, 'Bateria Gel GreenPoint 80Ah 12V', 'bateria-gel-gp-80ah', 'GreenPoint', 'GP-6CNFJ-80',
   'Bateria de gel 80Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.',
   '{"capacidad":"80Ah","voltaje":"12V","tipo":"Gel","ciclos":"1400 al 50% DOD"}',
   ARRAY['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
   0, 25, false),
  (cat_baterias_gel, 'Bateria Gel GreenPoint 100Ah 12V', 'bateria-gel-gp-100ah', 'GreenPoint', 'GP-6CNFJ-100',
   'Bateria de gel 100Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.',
   '{"capacidad":"100Ah","voltaje":"12V","tipo":"Gel","ciclos":"1400 al 50% DOD"}',
   ARRAY['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
   0, 25, true),
  (cat_baterias_gel, 'Bateria Gel GreenPoint 150Ah 12V', 'bateria-gel-gp-150ah', 'GreenPoint', 'GP-6CNFJ-150',
   'Bateria de gel 150Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.',
   '{"capacidad":"150Ah","voltaje":"12V","tipo":"Gel","ciclos":"1400 al 50% DOD"}',
   ARRAY['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
   0, 20, false),
  (cat_baterias_gel, 'Bateria Gel GreenPoint 200Ah 12V', 'bateria-gel-gp-200ah', 'GreenPoint', 'GP-6CNFJ-200',
   'Bateria de gel 200Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.',
   '{"capacidad":"200Ah","voltaje":"12V","tipo":"Gel","ciclos":"1400 al 50% DOD"}',
   ARRAY['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
   0, 15, true),
  (cat_baterias_gel, 'Bateria Gel GreenPoint 250Ah 12V', 'bateria-gel-gp-250ah', 'GreenPoint', 'GP-6CNFJ-250',
   'Bateria de gel 250Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.',
   '{"capacidad":"250Ah","voltaje":"12V","tipo":"Gel","ciclos":"1400 al 50% DOD"}',
   ARRAY['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
   0, 10, false)
  ON CONFLICT (slug) DO NOTHING;

  -- BATERIAS MOVILIDAD
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_baterias_gel, 'Bateria Movilidad GreenPoint 6DZF 12Ah 12V', 'bateria-movilidad-gp-12ah', 'GreenPoint', 'GP-6DZF-12',
   'Bateria para movilidad electrica 12Ah 12V GreenPoint serie 6 DZF.',
   '{"capacidad":"12Ah","voltaje":"12V","tipo":"Movilidad","serie":"6 DZF"}',
   ARRAY['Para bicicletas electricas','Motos electricas','Libre de mantenimiento'],
   0, 40, false),
  (cat_baterias_gel, 'Bateria Movilidad GreenPoint 6DZF 22Ah 12V', 'bateria-movilidad-gp-22ah', 'GreenPoint', 'GP-6DZF-22',
   'Bateria para movilidad electrica 22Ah 12V GreenPoint serie 6 DZF.',
   '{"capacidad":"22Ah","voltaje":"12V","tipo":"Movilidad","serie":"6 DZF"}',
   ARRAY['Para bicicletas electricas','Motos electricas','Libre de mantenimiento'],
   0, 30, false),
  (cat_baterias_gel, 'Bateria Movilidad GreenPoint 6EVF 32Ah 12V', 'bateria-movilidad-gp-32ah', 'GreenPoint', 'GP-6EVF-32',
   'Bateria para movilidad electrica 32Ah 12V GreenPoint serie 6 EVF.',
   '{"capacidad":"32Ah","voltaje":"12V","tipo":"Movilidad","serie":"6 EVF"}',
   ARRAY['Para vehiculos electricos','Alta descarga','Libre de mantenimiento'],
   0, 20, false)
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================
  -- BATERIAS LITIO
  -- =============================================
  -- Rack
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_baterias_litio, 'Bateria Litio Rack GreenPoint 100Ah 51.2V', 'bateria-litio-rack-gp-100ah', 'GreenPoint', 'GP-LR-100',
   'Bateria de litio LiFePO4 tipo rack 100Ah 51.2V (5.12kWh). 6000 ciclos al 80% DOD. BMS CAN/RS485, WiFi.',
   '{"capacidad":"100Ah","voltaje":"51.2V","energia":"5.12kWh","tipo":"LiFePO4 Rack","ciclos":"6000 al 80% DOD","bms":"CAN/RS485","wifi":"Si"}',
   ARRAY['LiFePO4','6000 ciclos DOD 80%','BMS CAN/RS485','WiFi integrado','Montaje en rack 19\"','Emparejar hasta 16 unidades'],
   0, 10, true),
  (cat_baterias_litio, 'Bateria Litio Rack GreenPoint 200Ah 51.2V', 'bateria-litio-rack-gp-200ah', 'GreenPoint', 'GP-LR-200',
   'Bateria de litio LiFePO4 tipo rack 200Ah 51.2V (10.24kWh). 6000 ciclos al 80% DOD. BMS CAN/RS485, WiFi.',
   '{"capacidad":"200Ah","voltaje":"51.2V","energia":"10.24kWh","tipo":"LiFePO4 Rack","ciclos":"6000 al 80% DOD","bms":"CAN/RS485","wifi":"Si"}',
   ARRAY['LiFePO4','6000 ciclos DOD 80%','BMS CAN/RS485','WiFi integrado','Montaje en rack 19\"','Emparejar hasta 16 unidades'],
   0, 8, true)
  ON CONFLICT (slug) DO NOTHING;

  -- Monoblock
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_baterias_litio, 'Bateria Litio Monoblock GreenPoint 100Ah 12.8V', 'bateria-litio-mono-gp-100ah-12v', 'GreenPoint', 'GP-LM-100-12',
   'Bateria de litio LiFePO4 monoblock 100Ah 12.8V (1.28kWh). 6000 ciclos.',
   '{"capacidad":"100Ah","voltaje":"12.8V","energia":"1.28kWh","tipo":"LiFePO4 Monoblock","ciclos":"6000"}',
   ARRAY['LiFePO4','6000 ciclos','BMS integrado','Compacta y liviana'],
   0, 20, false),
  (cat_baterias_litio, 'Bateria Litio Monoblock GreenPoint 200Ah 12.8V', 'bateria-litio-mono-gp-200ah-12v', 'GreenPoint', 'GP-LM-200-12',
   'Bateria de litio LiFePO4 monoblock 200Ah 12.8V (2.56kWh). 6000 ciclos.',
   '{"capacidad":"200Ah","voltaje":"12.8V","energia":"2.56kWh","tipo":"LiFePO4 Monoblock","ciclos":"6000"}',
   ARRAY['LiFePO4','6000 ciclos','BMS integrado','Compacta y liviana'],
   0, 15, false),
  (cat_baterias_litio, 'Bateria Litio Monoblock GreenPoint 100Ah 25.6V', 'bateria-litio-mono-gp-100ah-25v', 'GreenPoint', 'GP-LM-100-25',
   'Bateria de litio LiFePO4 monoblock 100Ah 25.6V (2.56kWh). 6000 ciclos.',
   '{"capacidad":"100Ah","voltaje":"25.6V","energia":"2.56kWh","tipo":"LiFePO4 Monoblock","ciclos":"6000"}',
   ARRAY['LiFePO4','6000 ciclos','BMS integrado'],
   0, 15, false),
  (cat_baterias_litio, 'Bateria Litio Monoblock GreenPoint 120Ah 25.6V', 'bateria-litio-mono-gp-120ah-25v', 'GreenPoint', 'GP-LM-120-25',
   'Bateria de litio LiFePO4 monoblock 120Ah 25.6V (3.07kWh). 6000 ciclos.',
   '{"capacidad":"120Ah","voltaje":"25.6V","energia":"3.07kWh","tipo":"LiFePO4 Monoblock","ciclos":"6000"}',
   ARRAY['LiFePO4','6000 ciclos','BMS integrado'],
   0, 12, false),
  (cat_baterias_litio, 'Bateria Litio Monoblock GreenPoint 150Ah 25.6V', 'bateria-litio-mono-gp-150ah-25v', 'GreenPoint', 'GP-LM-150-25',
   'Bateria de litio LiFePO4 monoblock 150Ah 25.6V (3.84kWh). 6000 ciclos.',
   '{"capacidad":"150Ah","voltaje":"25.6V","energia":"3.84kWh","tipo":"LiFePO4 Monoblock","ciclos":"6000"}',
   ARRAY['LiFePO4','6000 ciclos','BMS integrado'],
   0, 10, false),
  (cat_baterias_litio, 'Bateria Litio Monoblock GreenPoint 200Ah 25.6V', 'bateria-litio-mono-gp-200ah-25v', 'GreenPoint', 'GP-LM-200-25',
   'Bateria de litio LiFePO4 monoblock 200Ah 25.6V (5.12kWh). 6000 ciclos.',
   '{"capacidad":"200Ah","voltaje":"25.6V","energia":"5.12kWh","tipo":"LiFePO4 Monoblock","ciclos":"6000"}',
   ARRAY['LiFePO4','6000 ciclos','BMS integrado'],
   0, 8, true)
  ON CONFLICT (slug) DO NOTHING;

  -- Modulares SRNE
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_baterias_litio, 'Bateria Litio Modular SRNE 100Ah 51.2V', 'bateria-litio-modular-srne-100ah', 'SRNE', 'SRNE-BM-100',
   'Bateria de litio modular SRNE 100Ah 51.2V (5.12kWh). WiFi App SmartLife. Emparejar hasta 16 unidades.',
   '{"capacidad":"100Ah","voltaje":"51.2V","energia":"5.12kWh","tipo":"LiFePO4 Modular","paralelo":"Hasta 16 unidades","wifi":"SmartLife"}',
   ARRAY['LiFePO4','WiFi App SmartLife','Emparejar hasta 16 unidades','BMS integrado','Modular apilable'],
   0, 10, true),
  (cat_baterias_litio, 'Bateria Litio Modular SRNE 205Ah 51.2V', 'bateria-litio-modular-srne-205ah', 'SRNE', 'SRNE-BM-205',
   'Bateria de litio modular SRNE 205Ah 51.2V (10.5kWh). WiFi App SmartLife. Emparejar hasta 16 unidades.',
   '{"capacidad":"205Ah","voltaje":"51.2V","energia":"10.5kWh","tipo":"LiFePO4 Modular","paralelo":"Hasta 16 unidades","wifi":"SmartLife"}',
   ARRAY['LiFePO4','WiFi App SmartLife','Emparejar hasta 16 unidades','BMS integrado','Modular apilable'],
   0, 8, true),
  (cat_baterias_litio, 'Bateria Litio Modular SRNE 314Ah 51.2V', 'bateria-litio-modular-srne-314ah', 'SRNE', 'SRNE-BM-314',
   'Bateria de litio modular SRNE 314Ah 51.2V (16.1kWh). WiFi App SmartLife. Emparejar hasta 16 unidades.',
   '{"capacidad":"314Ah","voltaje":"51.2V","energia":"16.1kWh","tipo":"LiFePO4 Modular","paralelo":"Hasta 16 unidades","wifi":"SmartLife"}',
   ARRAY['LiFePO4','WiFi App SmartLife','Emparejar hasta 16 unidades','BMS integrado','Modular apilable'],
   0, 5, true)
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================
  -- PANELES SOLARES
  -- =============================================
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_paneles, 'Panel Solar TW Solar 620W Tipo-N Bifacial', 'panel-tw-solar-620w', 'TW Solar', 'TW-620N',
   'Panel solar monocristalino Tipo-N bifacial 620W TW Solar. 23.0% eficiencia. Dimensiones 2382x1134x30mm, 32.5kg.',
   '{"potencia":"620W","eficiencia":"23.0%","tipo":"Tipo-N Bifacial","peso":"32.5kg","dimensiones":"2382x1134x30mm","celdas":"Monocristalino N-Type"}',
   ARRAY['Tipo-N Bifacial','23.0% eficiencia','Garantia 30 anos rendimiento','Ganancia bifacial hasta 30%','Resistente a PID y LID'],
   0, 100, true),
  (cat_paneles, 'Panel Solar Astronergy 625W Tipo-N Bifacial', 'panel-astronergy-625w', 'Astronergy', 'AST-625N',
   'Panel solar monocristalino Tipo-N bifacial 625W Astronergy. 22.4% eficiencia. Dimensiones 2465x1134x30mm, 34.7kg.',
   '{"potencia":"625W","eficiencia":"22.4%","tipo":"Tipo-N Bifacial","peso":"34.7kg","dimensiones":"2465x1134x30mm","celdas":"Monocristalino N-Type"}',
   ARRAY['Tipo-N Bifacial','22.4% eficiencia','Garantia 30 anos rendimiento','Ganancia bifacial hasta 30%','Tier 1 Bloomberg'],
   0, 80, true),
  (cat_paneles, 'Panel Solar Runergy 630W Tipo-N Bifacial', 'panel-runergy-630w', 'Runergy', 'RUN-630N',
   'Panel solar monocristalino Tipo-N bifacial 630W Runergy. 23.3% eficiencia. Dimensiones 2382x1134x30mm, 32.4kg.',
   '{"potencia":"630W","eficiencia":"23.3%","tipo":"Tipo-N Bifacial","peso":"32.4kg","dimensiones":"2382x1134x30mm","celdas":"Monocristalino N-Type"}',
   ARRAY['Tipo-N Bifacial','23.3% eficiencia','Garantia 30 anos rendimiento','Ganancia bifacial hasta 30%','Mayor eficiencia del catalogo'],
   0, 60, true)
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================
  -- PROTECCIONES
  -- =============================================
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_protecciones, 'Breaker DC 2P 16A 600V', 'breaker-dc-2p-16a', 'Cosostenible', 'BR-DC-2P-16A',
   'Breaker de corriente continua 2 polos 16A 600VDC para proteccion de sistemas solares.',
   '{"corriente":"16A","voltaje":"600VDC","polos":"2","tipo":"Breaker DC"}',
   ARRAY['Proteccion DC','2 polos','Montaje riel DIN','Corte seguro DC'],
   0, 100, false),
  (cat_protecciones, 'Breaker DC 2P 32A 600V', 'breaker-dc-2p-32a', 'Cosostenible', 'BR-DC-2P-32A',
   'Breaker de corriente continua 2 polos 32A 600VDC.',
   '{"corriente":"32A","voltaje":"600VDC","polos":"2","tipo":"Breaker DC"}',
   ARRAY['Proteccion DC','2 polos','Montaje riel DIN','Corte seguro DC'],
   0, 100, false),
  (cat_protecciones, 'Breaker DC 2P 63A 600V', 'breaker-dc-2p-63a', 'Cosostenible', 'BR-DC-2P-63A',
   'Breaker de corriente continua 2 polos 63A 600VDC.',
   '{"corriente":"63A","voltaje":"600VDC","polos":"2","tipo":"Breaker DC"}',
   ARRAY['Proteccion DC','2 polos','Montaje riel DIN','Corte seguro DC'],
   0, 80, false),
  (cat_protecciones, 'Breaker DC 4P 32A 1000V', 'breaker-dc-4p-32a', 'Cosostenible', 'BR-DC-4P-32A',
   'Breaker de corriente continua 4 polos 32A 1000VDC para strings de paneles.',
   '{"corriente":"32A","voltaje":"1000VDC","polos":"4","tipo":"Breaker DC"}',
   ARRAY['Proteccion DC','4 polos','1000VDC','Para strings de paneles'],
   0, 50, false),
  (cat_protecciones, 'DPS DC Tipo II 600V', 'dps-dc-tipo2-600v', 'Cosostenible', 'DPS-DC-600',
   'Dispositivo de proteccion contra sobretensiones DC Tipo II 600VDC.',
   '{"voltaje":"600VDC","tipo":"DPS Tipo II","proteccion":"Sobretensiones"}',
   ARRAY['Proteccion contra rayos','Tipo II','Montaje riel DIN','Indicador de estado'],
   0, 60, false),
  (cat_protecciones, 'DPS DC Tipo II 1000V', 'dps-dc-tipo2-1000v', 'Cosostenible', 'DPS-DC-1000',
   'Dispositivo de proteccion contra sobretensiones DC Tipo II 1000VDC.',
   '{"voltaje":"1000VDC","tipo":"DPS Tipo II","proteccion":"Sobretensiones"}',
   ARRAY['Proteccion contra rayos','Tipo II','Montaje riel DIN','Indicador de estado'],
   0, 40, false),
  (cat_protecciones, 'DPS AC Tipo II 275V', 'dps-ac-tipo2-275v', 'Cosostenible', 'DPS-AC-275',
   'Dispositivo de proteccion contra sobretensiones AC Tipo II 275VAC.',
   '{"voltaje":"275VAC","tipo":"DPS Tipo II AC","proteccion":"Sobretensiones AC"}',
   ARRAY['Proteccion AC','Tipo II','Montaje riel DIN','Indicador de estado'],
   0, 60, false),
  (cat_protecciones, 'Fusible DC 15A 1000V con Portafusible', 'fusible-dc-15a-1000v', 'Cosostenible', 'FUS-DC-15A',
   'Fusible DC cilindrico 15A 1000VDC con portafusible para proteccion de strings.',
   '{"corriente":"15A","voltaje":"1000VDC","tipo":"Fusible DC + Portafusible"}',
   ARRAY['Proteccion de strings','Con portafusible','1000VDC','Facil reemplazo'],
   0, 100, false),
  (cat_protecciones, 'Seccionador DC 2P 32A 1000V', 'seccionador-dc-2p-32a', 'Cosostenible', 'SEC-DC-32A',
   'Seccionador de corriente continua 2 polos 32A 1000VDC.',
   '{"corriente":"32A","voltaje":"1000VDC","polos":"2","tipo":"Seccionador DC"}',
   ARRAY['Corte visible','2 polos','1000VDC','Montaje riel DIN'],
   0, 50, false)
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================
  -- ESTRUCTURA
  -- =============================================
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_estructura, 'Kit Estructura Techo Inclinado 1 Panel', 'estructura-techo-inclinado-1p', 'Cosostenible', 'EST-TI-1P',
   'Kit de estructura para montaje en techo inclinado para 1 panel solar. Aluminio anodizado.',
   '{"tipo":"Techo Inclinado","paneles":"1","material":"Aluminio anodizado"}',
   ARRAY['Aluminio anodizado','Tornilleria acero inoxidable','Para techo con lamina','Incluye rieles y abrazaderas'],
   0, 50, false),
  (cat_estructura, 'Kit Estructura Techo Inclinado 2 Paneles', 'estructura-techo-inclinado-2p', 'Cosostenible', 'EST-TI-2P',
   'Kit de estructura para montaje en techo inclinado para 2 paneles solares.',
   '{"tipo":"Techo Inclinado","paneles":"2","material":"Aluminio anodizado"}',
   ARRAY['Aluminio anodizado','Tornilleria acero inoxidable','Para techo con lamina','Incluye rieles y abrazaderas'],
   0, 40, false),
  (cat_estructura, 'Kit Estructura Techo Inclinado 4 Paneles', 'estructura-techo-inclinado-4p', 'Cosostenible', 'EST-TI-4P',
   'Kit de estructura para montaje en techo inclinado para 4 paneles solares.',
   '{"tipo":"Techo Inclinado","paneles":"4","material":"Aluminio anodizado"}',
   ARRAY['Aluminio anodizado','Tornilleria acero inoxidable','Para techo con lamina','Incluye rieles y abrazaderas'],
   0, 30, true),
  (cat_estructura, 'Kit Estructura Techo Plano 1 Panel', 'estructura-techo-plano-1p', 'Cosostenible', 'EST-TP-1P',
   'Kit de estructura para montaje en techo plano para 1 panel solar con inclinacion ajustable.',
   '{"tipo":"Techo Plano","paneles":"1","material":"Aluminio anodizado","inclinacion":"Ajustable 10-30 grados"}',
   ARRAY['Aluminio anodizado','Inclinacion ajustable 10-30 grados','Para techo plano o losa','Tornilleria acero inoxidable'],
   0, 40, false),
  (cat_estructura, 'Kit Estructura Techo Plano 2 Paneles', 'estructura-techo-plano-2p', 'Cosostenible', 'EST-TP-2P',
   'Kit de estructura para montaje en techo plano para 2 paneles solares.',
   '{"tipo":"Techo Plano","paneles":"2","material":"Aluminio anodizado","inclinacion":"Ajustable 10-30 grados"}',
   ARRAY['Aluminio anodizado','Inclinacion ajustable 10-30 grados','Para techo plano o losa','Tornilleria acero inoxidable'],
   0, 30, false),
  (cat_estructura, 'Kit Estructura Techo Plano 4 Paneles', 'estructura-techo-plano-4p', 'Cosostenible', 'EST-TP-4P',
   'Kit de estructura para montaje en techo plano para 4 paneles solares.',
   '{"tipo":"Techo Plano","paneles":"4","material":"Aluminio anodizado","inclinacion":"Ajustable 10-30 grados"}',
   ARRAY['Aluminio anodizado','Inclinacion ajustable 10-30 grados','Para techo plano o losa','Tornilleria acero inoxidable'],
   0, 25, false),
  (cat_estructura, 'Kit Estructura Suelo 4 Paneles', 'estructura-suelo-4p', 'Cosostenible', 'EST-SU-4P',
   'Kit de estructura para montaje en suelo para 4 paneles solares con inclinacion ajustable.',
   '{"tipo":"Suelo","paneles":"4","material":"Aluminio y acero galvanizado","inclinacion":"Ajustable"}',
   ARRAY['Aluminio y acero galvanizado','Inclinacion ajustable','Anclaje al suelo incluido','Alta resistencia al viento'],
   0, 15, false),
  (cat_estructura, 'Kit Estructura Suelo 8 Paneles', 'estructura-suelo-8p', 'Cosostenible', 'EST-SU-8P',
   'Kit de estructura para montaje en suelo para 8 paneles solares.',
   '{"tipo":"Suelo","paneles":"8","material":"Aluminio y acero galvanizado","inclinacion":"Ajustable"}',
   ARRAY['Aluminio y acero galvanizado','Inclinacion ajustable','Anclaje al suelo incluido','Alta resistencia al viento'],
   0, 10, false)
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================
  -- ACCESORIOS
  -- =============================================
  INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
  VALUES
  (cat_accesorios, 'Modulo WiFi para Inversor SRNE', 'modulo-wifi-srne', 'SRNE', 'SRNE-WIFI',
   'Modulo WiFi para monitoreo remoto de inversores SRNE. Compatible con App SmartLife.',
   '{"tipo":"Modulo WiFi","compatibilidad":"Inversores SRNE","app":"SmartLife"}',
   ARRAY['Monitoreo remoto','App SmartLife','Facil instalacion','Compatible inversores SRNE'],
   0, 50, false),
  (cat_accesorios, 'Modulo WiFi para Inversor GoodWe', 'modulo-wifi-goodwe', 'GoodWe', 'GW-WIFI',
   'Modulo WiFi para monitoreo remoto de inversores GoodWe. Compatible con SEMS Portal.',
   '{"tipo":"Modulo WiFi","compatibilidad":"Inversores GoodWe","app":"SEMS Portal"}',
   ARRAY['Monitoreo remoto','SEMS Portal','Facil instalacion','Compatible inversores GoodWe'],
   0, 40, false),
  (cat_accesorios, 'Vatimetro Digital Bifuncional DC', 'vatimetro-digital-dc', 'Cosostenible', 'VAT-DC',
   'Vatimetro digital bifuncional para medicion de voltaje, corriente, potencia y energia en DC.',
   '{"tipo":"Vatimetro DC","medicion":"V, A, W, Wh","rango":"0-100V / 0-100A"}',
   ARRAY['Medicion V/A/W/Wh','Pantalla LCD','Precision 1%','Shunt incluido'],
   0, 60, false),
  (cat_accesorios, 'Cable Solar 6mm2 Negro (100m)', 'cable-solar-6mm-negro-100m', 'Cosostenible', 'CAB-SOL-6N',
   'Cable solar fotovoltaico 6mm2 negro, rollo de 100 metros. Resistente a UV, doble aislamiento.',
   '{"tipo":"Cable Solar","seccion":"6mm2","color":"Negro","longitud":"100m","resistencia":"UV, 1500VDC"}',
   ARRAY['Resistente a UV','Doble aislamiento','1500VDC','TUV certificado','Para instalaciones exteriores'],
   0, 30, false),
  (cat_accesorios, 'Cable Solar 6mm2 Rojo (100m)', 'cable-solar-6mm-rojo-100m', 'Cosostenible', 'CAB-SOL-6R',
   'Cable solar fotovoltaico 6mm2 rojo, rollo de 100 metros. Resistente a UV, doble aislamiento.',
   '{"tipo":"Cable Solar","seccion":"6mm2","color":"Rojo","longitud":"100m","resistencia":"UV, 1500VDC"}',
   ARRAY['Resistente a UV','Doble aislamiento','1500VDC','TUV certificado','Para instalaciones exteriores'],
   0, 30, false),
  (cat_accesorios, 'Cable Solar 4mm2 Negro (100m)', 'cable-solar-4mm-negro-100m', 'Cosostenible', 'CAB-SOL-4N',
   'Cable solar fotovoltaico 4mm2 negro, rollo de 100 metros.',
   '{"tipo":"Cable Solar","seccion":"4mm2","color":"Negro","longitud":"100m"}',
   ARRAY['Resistente a UV','Doble aislamiento','1500VDC','TUV certificado'],
   0, 30, false),
  (cat_accesorios, 'Cable Solar 4mm2 Rojo (100m)', 'cable-solar-4mm-rojo-100m', 'Cosostenible', 'CAB-SOL-4R',
   'Cable solar fotovoltaico 4mm2 rojo, rollo de 100 metros.',
   '{"tipo":"Cable Solar","seccion":"4mm2","color":"Rojo","longitud":"100m"}',
   ARRAY['Resistente a UV','Doble aislamiento','1500VDC','TUV certificado'],
   0, 30, false),
  (cat_accesorios, 'Par Conectores MC4 Macho/Hembra', 'conectores-mc4-par', 'Cosostenible', 'MC4-PAR',
   'Par de conectores MC4 (macho + hembra) para conexion de paneles solares. IP67.',
   '{"tipo":"Conector MC4","contenido":"1 Macho + 1 Hembra","proteccion":"IP67","corriente":"30A"}',
   ARRAY['IP67','30A maximo','Compatible con cable 4-6mm2','Herramienta de crimpeado recomendada'],
   0, 200, false),
  (cat_accesorios, 'Kit 5 Pares Conectores MC4', 'conectores-mc4-kit-5', 'Cosostenible', 'MC4-KIT5',
   'Kit de 5 pares de conectores MC4 (5 macho + 5 hembra). IP67, 30A.',
   '{"tipo":"Conector MC4","contenido":"5 Machos + 5 Hembras","proteccion":"IP67","corriente":"30A"}',
   ARRAY['IP67','30A maximo','Kit 5 pares','Compatible con cable 4-6mm2'],
   0, 100, false),
  (cat_accesorios, 'Conector MC4 Y Paralelo (2 en 1)', 'conector-mc4-y-2en1', 'Cosostenible', 'MC4-Y2',
   'Conector MC4 tipo Y para conexion en paralelo de 2 paneles. IP67.',
   '{"tipo":"Conector MC4 Y","configuracion":"2 en 1","proteccion":"IP67","corriente":"30A"}',
   ARRAY['Conexion paralelo 2 paneles','IP67','30A','Facil instalacion'],
   0, 80, false),
  (cat_accesorios, 'Herramienta Crimpeo MC4', 'herramienta-crimpeo-mc4', 'Cosostenible', 'TOOL-MC4',
   'Herramienta profesional de crimpeo para conectores MC4. Compatible con cables 2.5-6mm2.',
   '{"tipo":"Herramienta","compatibilidad":"MC4","cables":"2.5-6mm2"}',
   ARRAY['Crimpeo profesional','Compatible 2.5-6mm2','Mango ergonomico','Incluye dado MC4'],
   0, 30, false)
  ON CONFLICT (slug) DO NOTHING;

END $$;
