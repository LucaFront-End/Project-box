import { CATALOG_PRODUCTS } from './catalog';
import { CatalogProduct, VerticalId } from '../types/commerce';

export const VERTICAL_ORDER: VerticalId[] = [
  'seguridad',
  'redes',
  'energia',
  'computo',
  'iluminacion',
  'radiocom',
];

export const VERTICAL_HERO_META: Record<
  VerticalId,
  {
    src: string;
    heroTitle: string;
    heroSub: string;
    nextId: VerticalId;
    nextLabel: string;
  }
> = {
  seguridad: {
    src: '/visuals/vertical-seguridad.webp',
    heroTitle: 'Visión perimetral sin puntos ciegos.',
    heroSub: 'Óptica ColorVu F1.0, detección neural en borde y almacenamiento continuo.',
    nextId: 'redes',
    nextLabel: 'Redes & Conectividad Enterprise',
  },
  redes: {
    src: '/visuals/vertical-redes.webp',
    heroTitle: 'Troncales 10G sin latencia.',
    heroSub: 'Switching Layer 3 PoE++, fibra óptica SFP+ y cobertura Wi-Fi 7.',
    nextId: 'energia',
    nextLabel: 'Energía Solar & Respaldo Crítico',
  },
  energia: {
    src: '/visuals/vertical-energia.webp',
    heroTitle: 'Continuidad eléctrica inteligente.',
    heroSub: 'Inversores híbridos bifásicos, celdas LiFePO4 y protección cero milisegundos.',
    nextId: 'computo',
    nextLabel: 'Cómputo, Servidores & Edge IT',
  },
  computo: {
    src: '/visuals/vertical-computo.webp',
    heroTitle: 'Cómputo modular de alta densidad.',
    heroSub: 'Servidores en rack, arreglos NVMe Gen4 y gabinetes climatizados EIA-310.',
    nextId: 'iluminacion',
    nextLabel: 'Iluminación LED Industrial',
  },
  iluminacion: {
    src: '/visuals/vertical-iluminacion.webp',
    heroTitle: 'Precisión fotométrica industrial.',
    heroSub: 'Luminarias Highbay 175 lm/W, reflectores IP66 y control arquitectónico.',
    nextId: 'radiocom',
    nextLabel: 'Radiocomunicación & Audio IP',
  },
  radiocom: {
    src: '/visuals/vertical-radiocom.webp',
    heroTitle: 'Voz instantánea de misión crítica.',
    heroSub: 'Radios digitales DMR Tier III con encriptación AES-256 y repetidores.',
    nextId: 'seguridad',
    nextLabel: 'Videovigilancia & Seguridad IA',
  },
};

export interface LabComputation {
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  tertiaryLabel: string;
  tertiaryValue: string;
  fillPct: number;
  visualHint: string;
}

export interface VerticalLabConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  sliderLabel: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  compute: (val: number) => LabComputation;
}

export const VERTICAL_LAB_CONFIG: Record<VerticalId, VerticalLabConfig> = {
  seguridad: {
    eyebrow: 'LABORATORIO ÓPTICO EN VIVO',
    title: 'Simulador de visión nocturna F1.0',
    subtitle: 'Ajusta el nivel de iluminación ambiental y evalúa la nitidez cromática frente a cámaras convencionales.',
    sliderLabel: 'Iluminancia ambiental del sitio',
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 18,
    unit: '% Lux',
    compute: (val) => {
      const lux = (0.0005 + (val / 100) * 14).toFixed(val < 12 ? 4 : 1);
      const clarity = Math.min(99.8, 92.4 + (val / 100) * 7.4).toFixed(1);
      const falseFilter = Math.round(93 + (val / 100) * 5);
      return {
        primaryLabel: 'Claridad Cromática',
        primaryValue: `${clarity}%`,
        secondaryLabel: 'Sensibilidad Activa',
        secondaryValue: `${lux} Lux`,
        tertiaryLabel: 'Filtrado Falsas Alarmas',
        tertiaryValue: `${falseFilter}% IA`,
        fillPct: Math.min(98, 72 + val * 0.26),
        visualHint: val < 25 ? 'Modo ColorVu F1.0 Nocturno Activo' : 'Captura HDR Balanceada',
      };
    },
  },
  redes: {
    eyebrow: 'SIMULADOR DE BACKBONE 10G',
    title: 'Capacidad de conmutación y PoE++',
    subtitle: 'Calcula el margen de ancho de banda y potencia PoE disponible según la densidad de usuarios.',
    sliderLabel: 'Dispositivos y puntos PoE simultáneos',
    min: 40,
    max: 1000,
    step: 20,
    defaultValue: 320,
    unit: 'clientes',
    compute: (val) => {
      const poeUsed = Math.round(140 + (val / 1000) * 540);
      const latency = (0.4 + (val / 1000) * 0.9).toFixed(2);
      const headroom = Math.max(12, Math.round(100 - (val / 1000) * 74));
      return {
        primaryLabel: 'Latencia Media L3',
        primaryValue: `${latency} ms`,
        secondaryLabel: 'Carga PoE++ Estimada',
        secondaryValue: `${poeUsed} / 720 W`,
        tertiaryLabel: 'Margen Troncal 10G',
        tertiaryValue: `${headroom}% libre`,
        fillPct: Math.round((val / 1000) * 86 + 12),
        visualHint: val > 720 ? 'Recomendado doble uplink SFP+ 10G' : 'Operación óptima en canal 6 GHz',
      };
    },
  },
  energia: {
    eyebrow: 'CALCULADOR DE AUTONOMÍA HÍBRIDA',
    title: 'Respaldo solar + banco LiFePO4',
    subtitle: 'Estima horas de continuidad operativa ante un corte total de red eléctrica según tu carga crítica.',
    sliderLabel: 'Demanda crítica continua del sitio',
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 3.5,
    unit: 'kW',
    compute: (val) => {
      const hours = (14.4 / val).toFixed(1);
      const solarOffset = Math.max(48, Math.round(98 - val * 4.2));
      return {
        primaryLabel: 'Autonomía de Respaldo',
        primaryValue: `${hours} hrs`,
        secondaryLabel: 'Aporte Fotovoltaico',
        secondaryValue: `${solarOffset}% día`,
        tertiaryLabel: 'Conmutación UPS',
        tertiaryValue: '0 ms Online',
        fillPct: Math.min(96, Math.round((10 - val) * 8 + 20)),
        visualHint: `${Math.ceil(val / 3.2)} módulos LiFePO4 recomendados`,
      };
    },
  },
  computo: {
    eyebrow: 'ARQUITECTURA DE ALMACENAMIENTO',
    title: 'Rendimiento de arreglo NVMe RAID',
    subtitle: 'Ajusta el número de bahías activas en rack para calcular caudal secuencial y tolerancia a fallos.',
    sliderLabel: 'Bahías activas en arreglo NAS / SAN',
    min: 2,
    max: 8,
    step: 1,
    defaultValue: 6,
    unit: 'bahías',
    compute: (val) => {
      const throughput = Math.round(1450 + val * 670);
      const tbUsable = val * 14;
      const raid = val >= 6 ? 'RAID 6 / Z2' : val >= 4 ? 'RAID 10' : 'RAID 1';
      return {
        primaryLabel: 'Lectura Secuencial',
        primaryValue: `${throughput.toLocaleString('es-MX')} MB/s`,
        secondaryLabel: 'Capacidad Útil Neta',
        secondaryValue: `${tbUsable} TB`,
        tertiaryLabel: 'Redundancia Sugerida',
        tertiaryValue: raid,
        fillPct: Math.round((val / 8) * 100),
        visualHint: 'Doble puerto 10GbE SFP+ balanceado',
      };
    },
  },
  iluminacion: {
    eyebrow: 'SIMULADOR FOTOMÉTRICO',
    title: 'Cobertura Highbay y ahorro LED',
    subtitle: 'Simula la altura de montaje industrial para dimensionar iluminancia uniforme y reducción de consumo.',
    sliderLabel: 'Altura libre de montaje en nave',
    min: 6,
    max: 18,
    step: 1,
    defaultValue: 10,
    unit: 'metros',
    compute: (val) => {
      const lux = Math.round(520 - (val - 6) * 21);
      const beamDiameter = (val * 1.45).toFixed(1);
      return {
        primaryLabel: 'Iluminancia en Piso',
        primaryValue: `${lux} lx`,
        secondaryLabel: 'Huella Útil (90°)',
        secondaryValue: `${beamDiameter} m Ø`,
        tertiaryLabel: 'Ahorro vs Aditivos',
        tertiaryValue: '-64% kWh',
        fillPct: Math.max(28, Math.round(100 - (val - 6) * 5)),
        visualHint: val >= 14 ? 'Óptica concentrada 60° recomendada' : 'Óptica industrial estándar 90°',
      };
    },
  },
  radiocom: {
    eyebrow: 'ENLACE RF DE MISIÓN CRÍTICA',
    title: 'Propagación DMR Tier III en campo',
    subtitle: 'Evalúa distancia de cobertura punto a punto con repetidor UHF y claridad de voz encriptada.',
    sliderLabel: 'Radio de cobertura operativa',
    min: 5,
    max: 45,
    step: 5,
    defaultValue: 20,
    unit: 'km LOS',
    compute: (val) => {
      const rssi = Math.round(-62 - (val / 45) * 34);
      const fidelity = Math.max(88, Math.round(99 - (val / 45) * 9));
      return {
        primaryLabel: 'Claridad Digital IA',
        primaryValue: `${fidelity}%`,
        secondaryLabel: 'Señal Estimada',
        secondaryValue: `${rssi} dBm`,
        tertiaryLabel: 'Cifrado de Canal',
        tertiaryValue: 'AES-256',
        fillPct: Math.max(24, Math.round(100 - (val / 45) * 65)),
        visualHint: val > 25 ? 'Requiere repetidor digital 50W en torre' : 'Cobertura directa alta penetración',
      };
    },
  },
};

export interface ProductExtendedDetails {
  studioImage: string;
  warrantyYears: number;
  inTheBox: string[];
  groups: {
    id: string;
    title: string;
    items: { label: string; value: string }[];
  }[];
  pairings: CatalogProduct[];
}

export function getProductExtendedDetails(
  product: CatalogProduct,
): ProductExtendedDetails {
  const studioImage = VERTICAL_HERO_META[product.verticalId].src;

  const pairings = CATALOG_PRODUCTS.filter(
    (p) => p.id !== product.id && p.verticalId === product.verticalId,
  ).concat(
    CATALOG_PRODUCTS.filter(
      (p) => p.id !== product.id && p.verticalId !== product.verticalId,
    ),
  ).slice(0, 3);

  const boxItemsByVertical: Record<VerticalId, string[]> = {
    seguridad: [
      `1× ${product.name}`,
      'Kit de montaje sellado IP67 y plantilla de perforación',
      'Conector Ethernet impermeable y llave Torx de seguridad',
      'Póliza oficial de garantía y guía de integración',
    ],
    redes: [
      `1× ${product.name}`,
      'Orejas de montaje en rack 19" EIA-310 y tornillería',
      'Cable de alimentación con seguro de retención',
      'Acceso a gestión cloud / controlador SDN y póliza',
    ],
    energia: [
      `1× ${product.name}`,
      'Conectores de potencia DC/AC y terminales de comunicación CAN/RS485',
      'Soporte de anclaje estructural y fusibles de protección',
      'Manual de puesta en marcha y certificación NOM',
    ],
    computo: [
      `1× ${product.name}`,
      'Rieles deslizantes para rack y kit de gestión de cableado',
      'Cables redundantes de poder y llave de seguridad frontal',
      'Documentación técnica de hardware y garantía directa',
    ],
    iluminacion: [
      `1× ${product.name}`,
      'Argolla forjada de suspensión industrial de alta carga',
      'Driver de grado industrial integrado 0-10V',
      'Certificado fotométrico IES y garantía de fábrica',
    ],
    radiocom: [
      `1× ${product.name}`,
      'Antena calibrada de alta ganancia y batería de alta capacidad',
      'Cargador rápido de escritorio y clip reforzado',
      'Guía de programación DMR y póliza oficial México',
    ],
  };

  return {
    studioImage,
    warrantyYears: product.verticalId === 'energia' ? 5 : 3,
    inTheBox: boxItemsByVertical[product.verticalId],
    groups: [
      {
        id: 'arch',
        title: 'Arquitectura & Especificación Core',
        items: [
          { label: 'Número de parte (SKU)', value: product.sku },
          { label: 'Fabricante oficial', value: product.brand },
          { label: 'Resumen técnico', value: product.specs },
          {
            label: 'Disponibilidad nacional',
            value:
              product.stockStatus === 'in_stock'
                ? 'Stock inmediato Hub Guadalajara'
                : 'Despacho programado',
          },
        ],
      },
      {
        id: 'power',
        title: 'Integración, Despliegue y Tarifa B2B',
        items: [
          {
            label: 'Descuento Distribuidor',
            value: `${product.distributorDiscountPct}% sobre precio público`,
          },
          { label: 'Compatibilidad de proyecto', value: 'Sistemas modulares PROJECT BOX.' },
          { label: 'Logística', value: 'Envío asegurado 24–48 hrs en todo México' },
        ],
      },
      {
        id: 'warranty',
        title: 'Garantía y Respaldo en México',
        items: [
          {
            label: 'Cobertura oficial',
            value: `${product.verticalId === 'energia' ? 5 : 3} años directo con fabricante`,
          },
          { label: 'Métodos de pago', value: 'SPEI, Tarjeta, Mercado Pago y Mercado Crédito' },
          { label: 'Soporte técnico', value: 'Asesoría de ingeniería pre y post-venta' },
        ],
      },
    ],
    pairings,
  };
}

export interface TopologyNode {
  id: string;
  x: number;
  y: number;
  code: string;
  title: string;
  role: string;
  bomIndex: number;
}

export interface SystemTopologyConfig {
  studioImage: string;
  nodes: TopologyNode[];
  edges: [string, string][];
  timeline: { day: string; title: string; detail: string }[];
}

export const SYSTEM_TOPOLOGIES: Record<string, SystemTopologyConfig> = {
  'PB-NET-01': {
    studioImage: '/visuals/system-net-01.webp',
    nodes: [
      {
        id: 'gw',
        x: 90,
        y: 135,
        code: 'WAN 10G',
        title: 'Gateway Cloud 10G',
        role: 'Balanceo Multi-WAN, firewall DPI y VPN corporativa.',
        bomIndex: 1,
      },
      {
        id: 'sw',
        x: 230,
        y: 135,
        code: 'CORE L3',
        title: 'Switch UniFi Pro Max 48',
        role: 'Backbone 10G SFP+ y entrega inteligente 720W PoE++.',
        bomIndex: 0,
      },
      {
        id: 'ap',
        x: 370,
        y: 78,
        code: 'WI-FI 7',
        title: '6× Access Point U7 Pro Max',
        role: 'Banda 6 GHz tri-band para alta densidad inalámbrica.',
        bomIndex: 2,
      },
      {
        id: 'sfp',
        x: 370,
        y: 192,
        code: 'FIBRA OM4',
        title: 'Transceptores SFP+ & Panduit',
        role: 'Enlace óptico certificado libre de interferencia electromagnética.',
        bomIndex: 3,
      },
    ],
    edges: [
      ['gw', 'sw'],
      ['sw', 'ap'],
      ['sw', 'sfp'],
    ],
    timeline: [
      { day: 'DÍA 01', title: 'Consolidación Hub GDL', detail: 'Pre-etiquetado y verificación de firmware.' },
      { day: 'DÍA 02', title: 'Tránsito Asegurado', detail: 'Entrega en sitio con seguro integral.' },
      { day: 'DÍA 03', title: 'Puesta en Marcha', detail: 'Adopción cloud y pruebas de caudal 10G.' },
    ],
  },
  'PB-SEC-02': {
    studioImage: '/visuals/system-sec-02.webp',
    nodes: [
      {
        id: 'cam',
        x: 90,
        y: 80,
        code: '4K F1.0',
        title: '12× Cámaras ColorVu 8MP',
        role: 'Captura cromática nocturna 0.0005 Lux y audio dual.',
        bomIndex: 1,
      },
      {
        id: 'nvr',
        x: 230,
        y: 135,
        code: 'NVR IA',
        title: 'Grabador NVR 16 Canales AI',
        role: 'Clasificación vehicular, facial y cruce de línea en tiempo real.',
        bomIndex: 0,
      },
      {
        id: 'hdd',
        x: 370,
        y: 80,
        code: '32TB RAID',
        title: '2× Discos Púrpura Pro 16TB',
        role: 'Retención continua de alta carga por 90 días.',
        bomIndex: 2,
      },
      {
        id: 'ups',
        x: 370,
        y: 192,
        code: 'UPS 1.5KVA',
        title: 'Respaldo Online + Cat6 Exterior',
        role: 'Continuidad de grabación ante cortes de energía.',
        bomIndex: 3,
      },
    ],
    edges: [
      ['cam', 'nvr'],
      ['nvr', 'hdd'],
      ['ups', 'nvr'],
    ],
    timeline: [
      { day: 'DÍA 01', title: 'Ensamble HDD & Pruebas', detail: 'Inicialización de arreglo de discos.' },
      { day: 'DÍA 02', title: 'Envío Protegido', detail: 'Embalaje antiestático asegurado a obra.' },
      { day: 'DÍA 03', title: 'Calibración Perimetral', detail: 'Reglas AcuSense y alertas móviles.' },
    ],
  },
  'PB-PWR-03': {
    studioImage: '/visuals/system-pwr-03.webp',
    nodes: [
      {
        id: 'pv',
        x: 90,
        y: 80,
        code: '10KW PV',
        title: '18× Paneles Bifaciales 555W',
        role: 'Captación monocristalina de alta eficiencia solar.',
        bomIndex: 2,
      },
      {
        id: 'inv',
        x: 230,
        y: 135,
        code: 'MPPT 10KW',
        title: 'Inversor Híbrido Bifásico',
        role: 'Gestión inteligente solar, red y baterías en <10ms.',
        bomIndex: 0,
      },
      {
        id: 'bat',
        x: 370,
        y: 80,
        code: '14.4 KWH',
        title: '3× Módulos Litio LiFePO4',
        role: 'Almacenamiento seguro +6,000 ciclos de descarga.',
        bomIndex: 1,
      },
      {
        id: 'prot',
        x: 370,
        y: 192,
        code: 'DPS DC/AC',
        title: 'Protecciones y Tierra Física',
        role: 'Supresión de picos y seccionamiento normado.',
        bomIndex: 3,
      },
    ],
    edges: [
      ['pv', 'inv'],
      ['inv', 'bat'],
      ['prot', 'inv'],
    ],
    timeline: [
      { day: 'DÍA 01', title: 'Paletizado Especializado', detail: 'Validación de celdas LiFePO4 y protecciones.' },
      { day: 'DÍA 02', title: 'Flete Asegurado', detail: 'Traslado directo a pie de obra en México.' },
      { day: 'DÍA 03', title: 'Sincronización Híbrida', detail: 'Pruebas de respaldo y telemetría.' },
    ],
  },
  'PB-IT-04': {
    studioImage: '/visuals/system-it-04.webp',
    nodes: [
      {
        id: 'rack',
        x: 90,
        y: 135,
        code: '24U EIA',
        title: 'Gabinete Acústico Panduit 24U',
        role: 'Chasis ventilado de alta rigidez y aislamiento sonoro.',
        bomIndex: 0,
      },
      {
        id: 'nas',
        x: 230,
        y: 80,
        code: 'NVME 8-BAY',
        title: 'NAS RackStation Redundante',
        role: 'Almacenamiento all-flash con doble fuente y enlace 10GbE.',
        bomIndex: 1,
      },
      {
        id: 'ups',
        x: 230,
        y: 192,
        code: '3KVA 0MS',
        title: 'Smart-UPS SRT 3000VA Online',
        role: 'Doble conversión senoidal pura sin interrupción.',
        bomIndex: 2,
      },
      {
        id: 'pdu',
        x: 370,
        y: 135,
        code: 'PDU + 10G',
        title: 'PDU Inteligente & Ordenadores',
        role: 'Medición de consumo por toma y flujo térmico limpio.',
        bomIndex: 3,
      },
    ],
    edges: [
      ['rack', 'nas'],
      ['ups', 'nas'],
      ['nas', 'pdu'],
    ],
    timeline: [
      { day: 'DÍA 01', title: 'Integración en Gabinete', detail: 'Verificación mecánica y carga de UPS.' },
      { day: 'DÍA 02', title: 'Transporte Dedicado', detail: 'Entrega asegurada con rampa hidráulica.' },
      { day: 'DÍA 03', title: 'Operación Edge', detail: 'Monitoreo térmico y energía en línea.' },
    ],
  },
};
