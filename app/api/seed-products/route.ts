import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ProductData {
  categoria_slug: string;
  nombre: string;
  slug: string;
  marca: string;
  referencia: string;
  descripcion: string;
  specs: Record<string, string>;
  features: string[];
  precio: number;
  stock: number;
  destacado: boolean;
}

const products: ProductData[] = [
  // CONTROLADORES PWM GreenPoint Gris
  ...([10,20,30].map(a => ({
    categoria_slug:'controladores',nombre:`Controlador PWM GreenPoint Gris ${a}A`,slug:`pwm-greenpoint-gris-${a}a`,marca:'GreenPoint',referencia:`GP-PWM-G-${a}A`,
    descripcion:`Controlador de carga solar PWM ${a}A con pantalla LCD. Compatible con sistemas 12V/24V auto-deteccion.`,
    specs:{potencia:`${a}A`,voltaje:'12V/24V',tipo:'PWM',pantalla:'LCD'},
    features:['Auto-deteccion 12V/24V','Pantalla LCD','Proteccion contra sobrecarga','Proteccion contra cortocircuito','Proteccion contra polaridad inversa'],
    precio:0,stock:50,destacado:false
  }))),
  ...([40,60].map(a => ({
    categoria_slug:'controladores',nombre:`Controlador PWM GreenPoint Gris ${a}A`,slug:`pwm-greenpoint-gris-${a}a`,marca:'GreenPoint',referencia:`GP-PWM-G-${a}A`,
    descripcion:`Controlador de carga solar PWM ${a}A con pantalla LCD. Compatible con sistemas 12V/24V/48V.`,
    specs:{potencia:`${a}A`,voltaje:'12V/24V/48V',tipo:'PWM',pantalla:'LCD'},
    features:['Auto-deteccion 12V/24V/48V','Pantalla LCD','Proteccion contra sobrecarga','Proteccion contra cortocircuito'],
    precio:0,stock:30,destacado:false
  }))),
  // PWM Verde/Negro
  ...([10,20,30,40,60].map(a => ({
    categoria_slug:'controladores',nombre:`Controlador PWM GreenPoint Verde ${a}A`,slug:`pwm-greenpoint-verde-${a}a`,marca:'GreenPoint',referencia:`GP-PWM-V-${a}A`,
    descripcion:`Controlador de carga solar PWM ${a}A serie verde/negro. 12V/24V.`,
    specs:{potencia:`${a}A`,voltaje:'12V/24V',tipo:'PWM'},
    features:['Auto-deteccion 12V/24V','Proteccion multiple','Diseno compacto'],
    precio:0,stock:50,destacado:false
  }))),
  // MPPT SRNE Shiner
  ...([20,30,40].map(a => ({
    categoria_slug:'controladores',nombre:`Controlador MPPT SRNE Shiner ${a}A`,slug:`mppt-srne-shiner-${a}a`,marca:'SRNE',referencia:`SRNE-SH-${a}A`,
    descripcion:`Controlador MPPT ${a}A SRNE serie Shiner. Entrada PV hasta 100V. Eficiencia >99.5%.`,
    specs:{potencia:`${a}A`,voltaje:'12V/24V',tipo:'MPPT',entrada_pv:'60-100V',eficiencia:'>99.5%'},
    features:['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Comunicacion RS485','Compatible con bateria litio'],
    precio:0,stock:30,destacado:a===40
  }))),
  // MPPT MF 60A
  {categoria_slug:'controladores',nombre:'Controlador MPPT SRNE Serie MF 60A',slug:'mppt-srne-mf-60a',marca:'SRNE',referencia:'SRNE-MF-60A',
   descripcion:'Controlador MPPT 60A SRNE serie MF. Entrada PV hasta 150V. 12V/24V/48V.',
   specs:{potencia:'60A',voltaje:'12V/24V/48V',tipo:'MPPT',entrada_pv:'150V'},
   features:['MPPT tracking >99.5%','Entrada PV hasta 150V','Compatible 12V/24V/48V','Compatible con bateria litio'],
   precio:0,stock:20,destacado:true},
  // MPPT MC 50A
  {categoria_slug:'controladores',nombre:'Controlador MPPT SRNE Serie MC 50A',slug:'mppt-srne-mc-50a',marca:'SRNE',referencia:'SRNE-MC-50A',
   descripcion:'Controlador MPPT 50A SRNE serie MC. Entrada PV hasta 92V.',
   specs:{potencia:'50A',voltaje:'12V/24V',tipo:'MPPT',entrada_pv:'92V'},
   features:['MPPT tracking >99.5%','Entrada PV hasta 92V','Pantalla LCD','Compatible con bateria litio'],
   precio:0,stock:20,destacado:false},
  // MPPT ML
  ...([20,30,40].map(a => ({
    categoria_slug:'controladores',nombre:`Controlador MPPT SRNE Serie ML ${a}A`,slug:`mppt-srne-ml-${a}a`,marca:'SRNE',referencia:`SRNE-ML-${a}A`,
    descripcion:`Controlador MPPT ${a}A SRNE serie ML. Entrada PV hasta 100V.`,
    specs:{potencia:`${a}A`,voltaje:'12V/24V',tipo:'MPPT',entrada_pv:'100V'},
    features:['MPPT tracking >99.5%','Entrada PV hasta 100V','Pantalla LCD','Compatible con bateria litio'],
    precio:0,stock:30,destacado:false
  }))),

  // INVERSORES ONDA PURA BEP
  ...([600,1000,1500].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor Onda Pura Belttt BEP ${w}W`,slug:`inversor-belttt-bep-${w}w`,marca:'Belttt',referencia:`BEP-${w}`,
    descripcion:`Inversor onda sinusoidal pura ${w}W Belttt serie BEP.`,
    specs:{potencia:`${w}W`,tipo:'Onda Pura',entrada:'12V DC',salida:'110/120V AC'},
    features:['Onda sinusoidal pura','Proteccion contra sobrecarga','Proteccion termica','Arranque suave'],
    precio:0,stock:30,destacado:false
  }))),
  ...([2000,3000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor Onda Pura Belttt BEP ${w}W`,slug:`inversor-belttt-bep-${w}w`,marca:'Belttt',referencia:`BEP-${w}`,
    descripcion:`Inversor onda sinusoidal pura ${w}W Belttt serie BEP.`,
    specs:{potencia:`${w}W`,tipo:'Onda Pura',entrada:'24V DC',salida:'110/120V AC'},
    features:['Onda sinusoidal pura','Proteccion contra sobrecarga','Proteccion termica','Arranque suave'],
    precio:0,stock:15,destacado:w===3000
  }))),
  // BBP
  ...([2000,3000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor Onda Pura Belttt BBP ${w}W`,slug:`inversor-belttt-bbp-${w}w`,marca:'Belttt',referencia:`BBP-${w}`,
    descripcion:`Inversor onda sinusoidal pura ${w}W serie BBP.`,
    specs:{potencia:`${w}W`,tipo:'Onda Pura',serie:'BBP'},
    features:['Onda sinusoidal pura','Alta eficiencia','Proteccion multiple'],
    precio:0,stock:15,destacado:false
  }))),
  // BAP
  ...([1000,1500].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor Onda Pura Belttt BAP ${w}W`,slug:`inversor-belttt-bap-${w}w`,marca:'Belttt',referencia:`BAP-${w}`,
    descripcion:`Inversor onda sinusoidal pura ${w}W serie BAP.`,
    specs:{potencia:`${w}W`,tipo:'Onda Pura',serie:'BAP'},
    features:['Onda sinusoidal pura','Diseno compacto','Proteccion multiple'],
    precio:0,stock:20,destacado:false
  }))),
  // ONDA MODIFICADA BEL
  ...([200,300,500,800,1000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor Onda Modificada Belttt BEL ${w}W`,slug:`inversor-belttt-bel-${w}w`,marca:'Belttt',referencia:`BEL-${w}`,
    descripcion:`Inversor onda modificada ${w}W.`,
    specs:{potencia:`${w}W`,tipo:'Onda Modificada',serie:'BEL'},
    features:['Onda modificada','Economico','Puerto USB','Proteccion contra sobrecarga'],
    precio:0,stock:40,destacado:false
  }))),
  // BEM
  ...([1000,1500].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor Onda Modificada Belttt BEM ${w}W`,slug:`inversor-belttt-bem-${w}w`,marca:'Belttt',referencia:`BEM-${w}`,
    descripcion:`Inversor onda modificada ${w}W serie BEM.`,
    specs:{potencia:`${w}W`,tipo:'Onda Modificada',serie:'BEM'},
    features:['Onda modificada','Alta potencia pico','Proteccion multiple'],
    precio:0,stock:20,destacado:false
  }))),

  // INVERSORES CARGADORES GreenPoint HF
  {categoria_slug:'inversores',nombre:'Inversor Cargador GreenPoint HF 1200W 12V',slug:'inversor-cargador-gp-hf-1200w-12v',marca:'GreenPoint',referencia:'GP-HF-1200-12',
   descripcion:'Inversor cargador monofasico HF 1200W entrada 12V. Onda pura con cargador integrado.',
   specs:{potencia:'1200W',tipo:'Inversor Cargador',entrada:'12V',fase:'Monofasico',onda:'Pura'},
   features:['Onda sinusoidal pura','Cargador integrado','Transferencia automatica','Monofasico'],
   precio:0,stock:20,destacado:false},
  {categoria_slug:'inversores',nombre:'Inversor Cargador GreenPoint HF 1200W 24V',slug:'inversor-cargador-gp-hf-1200w-24v',marca:'GreenPoint',referencia:'GP-HF-1200-24',
   descripcion:'Inversor cargador monofasico HF 1200W entrada 24V.',
   specs:{potencia:'1200W',tipo:'Inversor Cargador',entrada:'24V',fase:'Monofasico'},
   features:['Onda sinusoidal pura','Cargador integrado','Transferencia automatica'],
   precio:0,stock:20,destacado:false},
  {categoria_slug:'inversores',nombre:'Inversor Cargador GreenPoint HF 1600W 24V',slug:'inversor-cargador-gp-hf-1600w',marca:'GreenPoint',referencia:'GP-HF-1600',
   descripcion:'Inversor cargador monofasico HF 1600W entrada 24V.',
   specs:{potencia:'1600W',tipo:'Inversor Cargador',entrada:'24V'},
   features:['Onda sinusoidal pura','Cargador integrado','Transferencia automatica'],
   precio:0,stock:15,destacado:false},
  {categoria_slug:'inversores',nombre:'Inversor Cargador GreenPoint HF 2400W 24V',slug:'inversor-cargador-gp-hf-2400w',marca:'GreenPoint',referencia:'GP-HF-2400',
   descripcion:'Inversor cargador monofasico HF 2400W entrada 24V.',
   specs:{potencia:'2400W',tipo:'Inversor Cargador',entrada:'24V'},
   features:['Onda sinusoidal pura','Cargador integrado','Transferencia automatica'],
   precio:0,stock:15,destacado:false},
  {categoria_slug:'inversores',nombre:'Inversor Cargador GreenPoint HF 3000W 24V',slug:'inversor-cargador-gp-hf-3000w',marca:'GreenPoint',referencia:'GP-HF-3000',
   descripcion:'Inversor cargador monofasico HF 3000W entrada 24V.',
   specs:{potencia:'3000W',tipo:'Inversor Cargador',entrada:'24V'},
   features:['Onda sinusoidal pura','Cargador integrado','Transferencia automatica'],
   precio:0,stock:10,destacado:true},

  // SRNE Cargadores
  {categoria_slug:'inversores',nombre:'Inversor Cargador SRNE HF 3000W 24V 80A MPPT',slug:'inversor-cargador-srne-hf-3000w',marca:'SRNE',referencia:'SRNE-HF-3000',
   descripcion:'Inversor cargador monofasico SRNE 3000W 24V con MPPT 80A integrado.',
   specs:{potencia:'3000W',tipo:'Inversor Cargador MPPT',entrada:'24V',mppt:'80A'},
   features:['MPPT 80A integrado','Onda sinusoidal pura','Monitoreo WiFi','Transferencia automatica'],
   precio:0,stock:10,destacado:true},
  {categoria_slug:'inversores',nombre:'Inversor Cargador SRNE HYP 5000W 48V 100A MPPT',slug:'inversor-cargador-srne-hyp-5000w',marca:'SRNE',referencia:'SRNE-HYP-5000',
   descripcion:'Inversor cargador monofasico SRNE HYP 5000W 48V con MPPT 100A. Certificacion RETIE.',
   specs:{potencia:'5000W',tipo:'Inversor Cargador MPPT',entrada:'48V',mppt:'100A',certificacion:'RETIE'},
   features:['MPPT 100A integrado','Certificacion RETIE','Onda sinusoidal pura','Monitoreo WiFi','Compatible bateria litio'],
   precio:0,stock:10,destacado:true},

  // ASP Fase Dividida
  {categoria_slug:'inversores',nombre:'Inversor Cargador SRNE ASP 6500W 48V Fase Dividida',slug:'inversor-srne-asp-6500w',marca:'SRNE',referencia:'SRNE-ASP-6500',
   descripcion:'Inversor cargador SRNE ASP 6500W 48V fase dividida 120/240V. RETIE.',
   specs:{potencia:'6500W',tipo:'Fase Dividida',entrada:'48V',salida:'120/240V AC',certificacion:'RETIE'},
   features:['Fase dividida 120/240V','Certificacion RETIE','MPPT integrado','Compatible bateria litio','Monitoreo WiFi'],
   precio:0,stock:8,destacado:true},
  {categoria_slug:'inversores',nombre:'Inversor Cargador SRNE ASP 10000W 48V Fase Dividida',slug:'inversor-srne-asp-10000w',marca:'SRNE',referencia:'SRNE-ASP-10000',
   descripcion:'Inversor cargador SRNE ASP 10000W 48V fase dividida 120/240V. RETIE.',
   specs:{potencia:'10000W',tipo:'Fase Dividida',entrada:'48V',salida:'120/240V AC',certificacion:'RETIE'},
   features:['Fase dividida 120/240V','Certificacion RETIE','MPPT integrado','Compatible bateria litio','Monitoreo WiFi'],
   precio:0,stock:5,destacado:true},

  // HIBRIDOS SRNE HESP
  ...([6000,12000,18000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor Hibrido SRNE HESP ${w}W 48V`,slug:`inversor-hibrido-srne-hesp-${w}w`,marca:'SRNE',referencia:`SRNE-HESP-${w}`,
    descripcion:`Inversor hibrido SRNE HESP ${w}W 48V. Emparejar hasta 6 unidades. RETIE.`,
    specs:{potencia:`${w}W`,tipo:'Hibrido',entrada:'48V',certificacion:'RETIE',paralelo:'Hasta 6 unidades'},
    features:['Certificacion RETIE','Emparejar hasta 6 unidades','On-grid y Off-grid','MPPT integrado','Monitoreo WiFi'],
    precio:0,stock:w<=6000?8:3,destacado:true
  }))),

  // ON-GRID BIFASICOS
  {categoria_slug:'inversores',nombre:'Inversor On-Grid GoodWe DNS G4 5000W',slug:'inversor-goodwe-dns-g4-5000w',marca:'GoodWe',referencia:'GW-DNS-5000',
   descripcion:'Inversor on-grid bifasico GoodWe DNS G4 5000W. IP66, RETIE.',
   specs:{potencia:'5000W',tipo:'On-Grid Bifasico',proteccion:'IP66',certificacion:'RETIE'},
   features:['Certificacion RETIE','IP66 exterior','WiFi integrado','Alta eficiencia >97%'],
   precio:0,stock:10,destacado:false},
  {categoria_slug:'inversores',nombre:'Inversor On-Grid GoodWe DNS G4 6000W',slug:'inversor-goodwe-dns-g4-6000w',marca:'GoodWe',referencia:'GW-DNS-6000',
   descripcion:'Inversor on-grid bifasico GoodWe DNS G4 6000W. IP66, RETIE.',
   specs:{potencia:'6000W',tipo:'On-Grid Bifasico',proteccion:'IP66',certificacion:'RETIE'},
   features:['Certificacion RETIE','IP66 exterior','WiFi integrado','Alta eficiencia >97%'],
   precio:0,stock:10,destacado:false},
  {categoria_slug:'inversores',nombre:'Inversor On-Grid SolaX X1-Boost G4 5000W',slug:'inversor-solax-x1-boost-5000w',marca:'SolaX',referencia:'X1-BOOST-5000',
   descripcion:'Inversor on-grid SolaX X1-Boost G4 5000W. WiFi, RETIE, 10 anos garantia.',
   specs:{potencia:'5000W',tipo:'On-Grid Bifasico',certificacion:'RETIE',garantia:'10 anos'},
   features:['Certificacion RETIE','10 anos garantia','WiFi integrado','Diseno compacto'],
   precio:0,stock:10,destacado:true},
  {categoria_slug:'inversores',nombre:'Inversor On-Grid SolaX X1-Boost G4 6000W',slug:'inversor-solax-x1-boost-6000w',marca:'SolaX',referencia:'X1-BOOST-6000',
   descripcion:'Inversor on-grid SolaX X1-Boost G4 6000W. WiFi, RETIE, 10 anos garantia.',
   specs:{potencia:'6000W',tipo:'On-Grid Bifasico',certificacion:'RETIE',garantia:'10 anos'},
   features:['Certificacion RETIE','10 anos garantia','WiFi integrado'],
   precio:0,stock:10,destacado:false},
  {categoria_slug:'inversores',nombre:'Inversor On-Grid SolaX X1-Mini G4 3300W',slug:'inversor-solax-x1-mini-3300w',marca:'SolaX',referencia:'X1-MINI-3300',
   descripcion:'Inversor on-grid SolaX X1-Mini G4 3300W. Ultra compacto.',
   specs:{potencia:'3300W',tipo:'On-Grid Bifasico'},
   features:['Ultra compacto','WiFi integrado','1 MPPT'],
   precio:0,stock:15,destacado:false},

  // ON-GRID TRIFASICOS (selection)
  ...([17000,23000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor On-Grid GoodWe SDT G3 ${w}W`,slug:`inversor-goodwe-sdt-${w}w`,marca:'GoodWe',referencia:`GW-SDT-${w}`,
    descripcion:`Inversor on-grid trifasico GoodWe SDT G3 ${(w/1000)}kW.`,
    specs:{potencia:`${w}W`,tipo:'On-Grid Trifasico',fase:'3'},
    features:['Trifasico','WiFi integrado','2 MPPT','Alta eficiencia'],
    precio:0,stock:5,destacado:false
  }))),
  ...([50000,75000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor On-Grid GoodWe GT ${w}W`,slug:`inversor-goodwe-gt-${w}w`,marca:'GoodWe',referencia:`GW-GT-${w}`,
    descripcion:`Inversor on-grid trifasico GoodWe GT ${(w/1000)}kW para proyectos industriales.`,
    specs:{potencia:`${w}W`,tipo:'On-Grid Trifasico',fase:'3'},
    features:['Trifasico','Proyecto industrial','6 MPPT','Monitoreo avanzado'],
    precio:0,stock:2,destacado:false
  }))),
  ...([10000,15000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor On-Grid SolaX X3-PRO G2 ${w}W`,slug:`inversor-solax-x3-pro-${w}w`,marca:'SolaX',referencia:`X3-PRO-${w}`,
    descripcion:`Inversor on-grid trifasico SolaX X3-PRO G2 ${(w/1000)}kW.`,
    specs:{potencia:`${w}W`,tipo:'On-Grid Trifasico',fase:'3'},
    features:['Trifasico','2 MPPT','WiFi integrado'],
    precio:0,stock:5,destacado:false
  }))),
  ...([20000,25000,30000,35000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor On-Grid SolaX X3-MEGA G2 ${w}W`,slug:`inversor-solax-x3-mega-${w}w`,marca:'SolaX',referencia:`X3-MEGA-${w}`,
    descripcion:`Inversor on-grid trifasico SolaX X3-MEGA G2 ${(w/1000)}kW.`,
    specs:{potencia:`${w}W`,tipo:'On-Grid Trifasico',fase:'3'},
    features:['Trifasico','Proyecto comercial','WiFi integrado'],
    precio:0,stock:3,destacado:false
  }))),
  ...([50000,60000,70000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor On-Grid SolaX X3-FORTH LV ${w}W`,slug:`inversor-solax-x3-forth-${w}w`,marca:'SolaX',referencia:`X3-FORTH-${w}`,
    descripcion:`Inversor on-grid trifasico SolaX X3-FORTH LV ${(w/1000)}kW.`,
    specs:{potencia:`${w}W`,tipo:'On-Grid Trifasico',fase:'3'},
    features:['Trifasico','Proyecto industrial','6 MPPT','Monitoreo avanzado'],
    precio:0,stock:2,destacado:false
  }))),

  // SAJ
  ...([5000,6000,8000,10000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor On-Grid SAJ R6 ${w}W`,slug:`inversor-saj-r6-${w}w`,marca:'SAJ',referencia:`SAJ-R6-${w}`,
    descripcion:`Inversor on-grid SAJ R6 ${(w/1000)}kW.`,
    specs:{potencia:`${w}W`,tipo:'On-Grid'},
    features:['WiFi integrado','Alta eficiencia'],
    precio:0,stock:8,destacado:false
  }))),
  ...([50000,75000].map(w => ({
    categoria_slug:'inversores',nombre:`Inversor On-Grid SAJ C6 ${w}W`,slug:`inversor-saj-c6-${w}w`,marca:'SAJ',referencia:`SAJ-C6-${w}`,
    descripcion:`Inversor on-grid trifasico SAJ C6 ${(w/1000)}kW industrial.`,
    specs:{potencia:`${w}W`,tipo:'On-Grid Trifasico',fase:'3'},
    features:['Trifasico','Proyecto industrial','6 MPPT'],
    precio:0,stock:2,destacado:false
  }))),

  // MICROINVERSORES
  {categoria_slug:'inversores',nombre:'Microinversor SolaX X1-Micro 2000W',slug:'microinversor-solax-x1-micro-2000w',marca:'SolaX',referencia:'X1-MICRO-2000',
   descripcion:'Microinversor SolaX X1-Micro 2000W. Optimizacion panel a panel.',
   specs:{potencia:'2000W',tipo:'Microinversor',paneles:'4'},
   features:['Optimizacion por panel','Monitoreo individual','IP67','Facil instalacion'],
   precio:0,stock:15,destacado:false},
  {categoria_slug:'inversores',nombre:'Microinversor TSUN TSOL-MS 2250W',slug:'microinversor-tsun-2250w',marca:'TSUN',referencia:'TSOL-MS-2250',
   descripcion:'Microinversor TSUN TSOL-MS 2250W.',
   specs:{potencia:'2250W',tipo:'Microinversor'},
   features:['Optimizacion por panel','Monitoreo WiFi','IP67'],
   precio:0,stock:15,destacado:false},

  // PANELES SOLARES
  {categoria_slug:'paneles',nombre:'Panel Solar TW Solar 620W Tipo-N Bifacial',slug:'panel-tw-solar-620w',marca:'TW Solar',referencia:'TW-620N',
   descripcion:'Panel solar monocristalino Tipo-N bifacial 620W. 23.0% eficiencia. 2382x1134x30mm, 32.5kg.',
   specs:{potencia:'620W',eficiencia:'23.0%',tipo:'Tipo-N Bifacial',peso:'32.5kg',dimensiones:'2382x1134x30mm'},
   features:['Tipo-N Bifacial','23.0% eficiencia','Garantia 30 anos rendimiento','Ganancia bifacial hasta 30%','Resistente a PID y LID'],
   precio:0,stock:100,destacado:true},
  {categoria_slug:'paneles',nombre:'Panel Solar Astronergy 625W Tipo-N Bifacial',slug:'panel-astronergy-625w',marca:'Astronergy',referencia:'AST-625N',
   descripcion:'Panel solar monocristalino Tipo-N bifacial 625W. 22.4% eficiencia. 2465x1134x30mm, 34.7kg.',
   specs:{potencia:'625W',eficiencia:'22.4%',tipo:'Tipo-N Bifacial',peso:'34.7kg',dimensiones:'2465x1134x30mm'},
   features:['Tipo-N Bifacial','22.4% eficiencia','Garantia 30 anos rendimiento','Ganancia bifacial hasta 30%','Tier 1 Bloomberg'],
   precio:0,stock:80,destacado:true},
  {categoria_slug:'paneles',nombre:'Panel Solar Runergy 630W Tipo-N Bifacial',slug:'panel-runergy-630w',marca:'Runergy',referencia:'RUN-630N',
   descripcion:'Panel solar monocristalino Tipo-N bifacial 630W. 23.3% eficiencia. 2382x1134x30mm, 32.4kg.',
   specs:{potencia:'630W',eficiencia:'23.3%',tipo:'Tipo-N Bifacial',peso:'32.4kg',dimensiones:'2382x1134x30mm'},
   features:['Tipo-N Bifacial','23.3% eficiencia','Garantia 30 anos rendimiento','Ganancia bifacial hasta 30%','Mayor eficiencia del catalogo'],
   precio:0,stock:60,destacado:true},

  // BATERIAS GEL
  ...([40,55,80,100,150,200,250].map(ah => ({
    categoria_slug:'baterias-gel',nombre:`Bateria Gel GreenPoint ${ah}Ah 12V`,slug:`bateria-gel-gp-${ah}ah`,marca:'GreenPoint',referencia:`GP-6CNFJ-${ah}`,
    descripcion:`Bateria de gel ${ah}Ah 12V GreenPoint serie 6 CNFJ. 1400 ciclos al 50% DOD.`,
    specs:{capacidad:`${ah}Ah`,voltaje:'12V',tipo:'Gel',ciclos:'1400 al 50% DOD',serie:'6 CNFJ'},
    features:['Libre de mantenimiento','1400 ciclos DOD 50%','Descarga profunda','Resistente a vibraciones'],
    precio:0,stock:ah<=100?25:15,destacado:ah===100||ah===200
  }))),
  // Movilidad
  {categoria_slug:'baterias-gel',nombre:'Bateria Movilidad GreenPoint 6DZF 12Ah 12V',slug:'bateria-movilidad-gp-12ah',marca:'GreenPoint',referencia:'GP-6DZF-12',
   descripcion:'Bateria para movilidad electrica 12Ah 12V serie 6 DZF.',
   specs:{capacidad:'12Ah',voltaje:'12V',tipo:'Movilidad',serie:'6 DZF'},
   features:['Para bicicletas electricas','Motos electricas','Libre de mantenimiento'],
   precio:0,stock:40,destacado:false},
  {categoria_slug:'baterias-gel',nombre:'Bateria Movilidad GreenPoint 6DZF 22Ah 12V',slug:'bateria-movilidad-gp-22ah',marca:'GreenPoint',referencia:'GP-6DZF-22',
   descripcion:'Bateria para movilidad electrica 22Ah 12V serie 6 DZF.',
   specs:{capacidad:'22Ah',voltaje:'12V',tipo:'Movilidad',serie:'6 DZF'},
   features:['Para bicicletas electricas','Motos electricas','Libre de mantenimiento'],
   precio:0,stock:30,destacado:false},
  {categoria_slug:'baterias-gel',nombre:'Bateria Movilidad GreenPoint 6EVF 32Ah 12V',slug:'bateria-movilidad-gp-32ah',marca:'GreenPoint',referencia:'GP-6EVF-32',
   descripcion:'Bateria para movilidad electrica 32Ah 12V serie 6 EVF.',
   specs:{capacidad:'32Ah',voltaje:'12V',tipo:'Movilidad',serie:'6 EVF'},
   features:['Para vehiculos electricos','Alta descarga','Libre de mantenimiento'],
   precio:0,stock:20,destacado:false},

  // BATERIAS LITIO RACK
  ...([100,200].map(ah => ({
    categoria_slug:'baterias-litio',nombre:`Bateria Litio Rack GreenPoint ${ah}Ah 51.2V`,slug:`bateria-litio-rack-gp-${ah}ah`,marca:'GreenPoint',referencia:`GP-LR-${ah}`,
    descripcion:`Bateria LiFePO4 rack ${ah}Ah 51.2V (${(ah*51.2/1000).toFixed(2)}kWh). 6000 ciclos 80% DOD. BMS CAN/RS485, WiFi.`,
    specs:{capacidad:`${ah}Ah`,voltaje:'51.2V',energia:`${(ah*51.2/1000).toFixed(2)}kWh`,tipo:'LiFePO4 Rack',ciclos:'6000 al 80% DOD',bms:'CAN/RS485',wifi:'Si'},
    features:['LiFePO4','6000 ciclos DOD 80%','BMS CAN/RS485','WiFi integrado','Montaje en rack 19"','Emparejar hasta 16 unidades'],
    precio:0,stock:ah===100?10:8,destacado:true
  }))),
  // LITIO MONOBLOCK
  {categoria_slug:'baterias-litio',nombre:'Bateria Litio Monoblock GreenPoint 100Ah 12.8V',slug:'bateria-litio-mono-gp-100ah-12v',marca:'GreenPoint',referencia:'GP-LM-100-12',
   descripcion:'Bateria LiFePO4 monoblock 100Ah 12.8V (1.28kWh). 6000 ciclos.',
   specs:{capacidad:'100Ah',voltaje:'12.8V',energia:'1.28kWh',tipo:'LiFePO4 Monoblock',ciclos:'6000'},
   features:['LiFePO4','6000 ciclos','BMS integrado','Compacta y liviana'],
   precio:0,stock:20,destacado:false},
  {categoria_slug:'baterias-litio',nombre:'Bateria Litio Monoblock GreenPoint 200Ah 12.8V',slug:'bateria-litio-mono-gp-200ah-12v',marca:'GreenPoint',referencia:'GP-LM-200-12',
   descripcion:'Bateria LiFePO4 monoblock 200Ah 12.8V (2.56kWh). 6000 ciclos.',
   specs:{capacidad:'200Ah',voltaje:'12.8V',energia:'2.56kWh',tipo:'LiFePO4 Monoblock',ciclos:'6000'},
   features:['LiFePO4','6000 ciclos','BMS integrado','Compacta y liviana'],
   precio:0,stock:15,destacado:false},
  {categoria_slug:'baterias-litio',nombre:'Bateria Litio Monoblock GreenPoint 200Ah 25.6V',slug:'bateria-litio-mono-gp-200ah-25v',marca:'GreenPoint',referencia:'GP-LM-200-25',
   descripcion:'Bateria LiFePO4 monoblock 200Ah 25.6V (5.12kWh). 6000 ciclos.',
   specs:{capacidad:'200Ah',voltaje:'25.6V',energia:'5.12kWh',tipo:'LiFePO4 Monoblock',ciclos:'6000'},
   features:['LiFePO4','6000 ciclos','BMS integrado'],
   precio:0,stock:8,destacado:true},
  // LITIO MODULAR SRNE
  ...([100,205,314].map(ah => ({
    categoria_slug:'baterias-litio',nombre:`Bateria Litio Modular SRNE ${ah}Ah 51.2V`,slug:`bateria-litio-modular-srne-${ah}ah`,marca:'SRNE',referencia:`SRNE-BM-${ah}`,
    descripcion:`Bateria litio modular SRNE ${ah}Ah 51.2V (${(ah*51.2/1000).toFixed(1)}kWh). WiFi App SmartLife. Hasta 16 unidades.`,
    specs:{capacidad:`${ah}Ah`,voltaje:'51.2V',energia:`${(ah*51.2/1000).toFixed(1)}kWh`,tipo:'LiFePO4 Modular',paralelo:'Hasta 16 unidades',wifi:'SmartLife'},
    features:['LiFePO4','WiFi App SmartLife','Emparejar hasta 16 unidades','BMS integrado','Modular apilable'],
    precio:0,stock:ah<=100?10:5,destacado:true
  }))),

  // PROTECCIONES
  ...([{a:16,p:2,v:600},{a:32,p:2,v:600},{a:63,p:2,v:600},{a:32,p:4,v:1000}].map(b => ({
    categoria_slug:'protecciones',nombre:`Breaker DC ${b.p}P ${b.a}A ${b.v}V`,slug:`breaker-dc-${b.p}p-${b.a}a`,marca:'Cosostenible',referencia:`BR-DC-${b.p}P-${b.a}A`,
    descripcion:`Breaker corriente continua ${b.p} polos ${b.a}A ${b.v}VDC.`,
    specs:{corriente:`${b.a}A`,voltaje:`${b.v}VDC`,polos:`${b.p}`,tipo:'Breaker DC'},
    features:['Proteccion DC',`${b.p} polos`,'Montaje riel DIN','Corte seguro DC'],
    precio:0,stock:80,destacado:false
  }))),
  {categoria_slug:'protecciones',nombre:'DPS DC Tipo II 600V',slug:'dps-dc-tipo2-600v',marca:'Cosostenible',referencia:'DPS-DC-600',
   descripcion:'Dispositivo proteccion contra sobretensiones DC Tipo II 600VDC.',
   specs:{voltaje:'600VDC',tipo:'DPS Tipo II'},
   features:['Proteccion contra rayos','Tipo II','Montaje riel DIN','Indicador de estado'],
   precio:0,stock:60,destacado:false},
  {categoria_slug:'protecciones',nombre:'DPS DC Tipo II 1000V',slug:'dps-dc-tipo2-1000v',marca:'Cosostenible',referencia:'DPS-DC-1000',
   descripcion:'Dispositivo proteccion contra sobretensiones DC Tipo II 1000VDC.',
   specs:{voltaje:'1000VDC',tipo:'DPS Tipo II'},
   features:['Proteccion contra rayos','Tipo II','Montaje riel DIN','Indicador de estado'],
   precio:0,stock:40,destacado:false},
  {categoria_slug:'protecciones',nombre:'DPS AC Tipo II 275V',slug:'dps-ac-tipo2-275v',marca:'Cosostenible',referencia:'DPS-AC-275',
   descripcion:'Dispositivo proteccion contra sobretensiones AC Tipo II 275VAC.',
   specs:{voltaje:'275VAC',tipo:'DPS Tipo II AC'},
   features:['Proteccion AC','Tipo II','Montaje riel DIN','Indicador de estado'],
   precio:0,stock:60,destacado:false},
  {categoria_slug:'protecciones',nombre:'Fusible DC 15A 1000V con Portafusible',slug:'fusible-dc-15a-1000v',marca:'Cosostenible',referencia:'FUS-DC-15A',
   descripcion:'Fusible DC cilindrico 15A 1000VDC con portafusible.',
   specs:{corriente:'15A',voltaje:'1000VDC',tipo:'Fusible DC + Portafusible'},
   features:['Proteccion de strings','Con portafusible','1000VDC','Facil reemplazo'],
   precio:0,stock:100,destacado:false},

  // ESTRUCTURA
  ...([1,2,4].map(n => ({
    categoria_slug:'estructura',nombre:`Kit Estructura Techo Inclinado ${n} Panel${n>1?'es':''}`,slug:`estructura-techo-inclinado-${n}p`,marca:'Cosostenible',referencia:`EST-TI-${n}P`,
    descripcion:`Kit estructura para techo inclinado para ${n} panel${n>1?'es':''}. Aluminio anodizado.`,
    specs:{tipo:'Techo Inclinado',paneles:`${n}`,material:'Aluminio anodizado'},
    features:['Aluminio anodizado','Tornilleria acero inoxidable','Para techo con lamina','Incluye rieles y abrazaderas'],
    precio:0,stock:40,destacado:n===4
  }))),
  ...([1,2,4].map(n => ({
    categoria_slug:'estructura',nombre:`Kit Estructura Techo Plano ${n} Panel${n>1?'es':''}`,slug:`estructura-techo-plano-${n}p`,marca:'Cosostenible',referencia:`EST-TP-${n}P`,
    descripcion:`Kit estructura para techo plano para ${n} panel${n>1?'es':''}. Inclinacion ajustable.`,
    specs:{tipo:'Techo Plano',paneles:`${n}`,material:'Aluminio anodizado',inclinacion:'Ajustable 10-30 grados'},
    features:['Aluminio anodizado','Inclinacion ajustable 10-30 grados','Para techo plano o losa','Tornilleria acero inoxidable'],
    precio:0,stock:30,destacado:false
  }))),
  ...([4,8].map(n => ({
    categoria_slug:'estructura',nombre:`Kit Estructura Suelo ${n} Paneles`,slug:`estructura-suelo-${n}p`,marca:'Cosostenible',referencia:`EST-SU-${n}P`,
    descripcion:`Kit estructura para montaje en suelo para ${n} paneles. Inclinacion ajustable.`,
    specs:{tipo:'Suelo',paneles:`${n}`,material:'Aluminio y acero galvanizado'},
    features:['Aluminio y acero galvanizado','Inclinacion ajustable','Anclaje al suelo incluido','Alta resistencia al viento'],
    precio:0,stock:10,destacado:false
  }))),

  // ACCESORIOS
  {categoria_slug:'accesorios',nombre:'Modulo WiFi para Inversor SRNE',slug:'modulo-wifi-srne',marca:'SRNE',referencia:'SRNE-WIFI',
   descripcion:'Modulo WiFi para monitoreo remoto de inversores SRNE. App SmartLife.',
   specs:{tipo:'Modulo WiFi',compatibilidad:'Inversores SRNE',app:'SmartLife'},
   features:['Monitoreo remoto','App SmartLife','Facil instalacion','Compatible inversores SRNE'],
   precio:0,stock:50,destacado:false},
  {categoria_slug:'accesorios',nombre:'Modulo WiFi para Inversor GoodWe',slug:'modulo-wifi-goodwe',marca:'GoodWe',referencia:'GW-WIFI',
   descripcion:'Modulo WiFi para monitoreo remoto de inversores GoodWe. SEMS Portal.',
   specs:{tipo:'Modulo WiFi',compatibilidad:'Inversores GoodWe',app:'SEMS Portal'},
   features:['Monitoreo remoto','SEMS Portal','Facil instalacion'],
   precio:0,stock:40,destacado:false},
  {categoria_slug:'accesorios',nombre:'Vatimetro Digital Bifuncional DC',slug:'vatimetro-digital-dc',marca:'Cosostenible',referencia:'VAT-DC',
   descripcion:'Vatimetro digital para medicion V, A, W, Wh en DC.',
   specs:{tipo:'Vatimetro DC',medicion:'V, A, W, Wh',rango:'0-100V / 0-100A'},
   features:['Medicion V/A/W/Wh','Pantalla LCD','Precision 1%','Shunt incluido'],
   precio:0,stock:60,destacado:false},
  {categoria_slug:'accesorios',nombre:'Cable Solar 6mm2 Negro (100m)',slug:'cable-solar-6mm-negro-100m',marca:'Cosostenible',referencia:'CAB-SOL-6N',
   descripcion:'Cable solar fotovoltaico 6mm2 negro, rollo 100m. UV, doble aislamiento.',
   specs:{tipo:'Cable Solar',seccion:'6mm2',color:'Negro',longitud:'100m'},
   features:['Resistente a UV','Doble aislamiento','1500VDC','TUV certificado'],
   precio:0,stock:30,destacado:false},
  {categoria_slug:'accesorios',nombre:'Cable Solar 6mm2 Rojo (100m)',slug:'cable-solar-6mm-rojo-100m',marca:'Cosostenible',referencia:'CAB-SOL-6R',
   descripcion:'Cable solar fotovoltaico 6mm2 rojo, rollo 100m. UV, doble aislamiento.',
   specs:{tipo:'Cable Solar',seccion:'6mm2',color:'Rojo',longitud:'100m'},
   features:['Resistente a UV','Doble aislamiento','1500VDC','TUV certificado'],
   precio:0,stock:30,destacado:false},
  {categoria_slug:'accesorios',nombre:'Par Conectores MC4 Macho/Hembra',slug:'conectores-mc4-par',marca:'Cosostenible',referencia:'MC4-PAR',
   descripcion:'Par de conectores MC4 (macho + hembra). IP67, 30A.',
   specs:{tipo:'Conector MC4',contenido:'1 Macho + 1 Hembra',proteccion:'IP67',corriente:'30A'},
   features:['IP67','30A maximo','Compatible cable 4-6mm2'],
   precio:0,stock:200,destacado:false},
  {categoria_slug:'accesorios',nombre:'Kit 5 Pares Conectores MC4',slug:'conectores-mc4-kit-5',marca:'Cosostenible',referencia:'MC4-KIT5',
   descripcion:'Kit 5 pares conectores MC4. IP67, 30A.',
   specs:{tipo:'Conector MC4',contenido:'5 Machos + 5 Hembras',proteccion:'IP67'},
   features:['IP67','30A','Kit 5 pares'],
   precio:0,stock:100,destacado:false},
  {categoria_slug:'accesorios',nombre:'Conector MC4 Y Paralelo (2 en 1)',slug:'conector-mc4-y-2en1',marca:'Cosostenible',referencia:'MC4-Y2',
   descripcion:'Conector MC4 tipo Y para conexion paralelo 2 paneles. IP67.',
   specs:{tipo:'Conector MC4 Y',configuracion:'2 en 1',proteccion:'IP67'},
   features:['Conexion paralelo 2 paneles','IP67','30A'],
   precio:0,stock:80,destacado:false},
  {categoria_slug:'accesorios',nombre:'Herramienta Crimpeo MC4',slug:'herramienta-crimpeo-mc4',marca:'Cosostenible',referencia:'TOOL-MC4',
   descripcion:'Herramienta profesional de crimpeo para conectores MC4. Cables 2.5-6mm2.',
   specs:{tipo:'Herramienta',compatibilidad:'MC4',cables:'2.5-6mm2'},
   features:['Crimpeo profesional','Compatible 2.5-6mm2','Mango ergonomico','Incluye dado MC4'],
   precio:0,stock:30,destacado:false},
];

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.SEED_SECRET || 'isolar-seed-2026'}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const catResult = await query('SELECT id, slug FROM categorias');
    const catMap: Record<string, number> = {};
    for (const row of catResult.rows) {
      catMap[row.slug] = row.id;
    }

    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const p of products) {
      const catId = catMap[p.categoria_slug];
      if (!catId) {
        errors.push(`Categoria no encontrada: ${p.categoria_slug}`);
        continue;
      }

      try {
        await query(
          `INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, stock, destacado)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
           ON CONFLICT (slug) DO NOTHING`,
          [catId, p.nombre, p.slug, p.marca, p.referencia, p.descripcion, JSON.stringify(p.specs), p.features, p.precio, p.stock, p.destacado]
        );
        const res = await query('SELECT id FROM productos WHERE slug = $1', [p.slug]);
        if (res.rows.length > 0) inserted++;
        else skipped++;
      } catch (err: any) {
        if (err.code === '23505') {
          skipped++;
        } else {
          errors.push(`${p.slug}: ${err.message}`);
        }
      }
    }

    return NextResponse.json({
      total: products.length,
      inserted,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
