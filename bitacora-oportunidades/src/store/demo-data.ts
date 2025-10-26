// Demo data for testing the UI without Supabase
export const demoTeams = [
  {
    id: 'team-1',
    name: 'Equipo Innovación EAN',
    created_by: 'demo-user-123',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'team-2', 
    name: 'Startup Lab',
    created_by: 'demo-user-123',
    created_at: '2024-02-01T14:30:00Z'
  }
]

export const demoJournals = [
  {
    id: 'journal-1',
    team_id: 'team-1',
    title: 'Oportunidad: App de Movilidad Urbana',
    status: 'in_progress' as const,
    progress: 60,
    updated_at: '2024-10-20T16:45:00Z'
  },
  {
    id: 'journal-2',
    team_id: 'team-1', 
    title: 'Plataforma de E-learning',
    status: 'draft' as const,
    progress: 20,
    updated_at: '2024-10-18T09:15:00Z'
  },
  {
    id: 'journal-3',
    team_id: 'team-2',
    title: 'Solución AgTech',
    status: 'ready' as const,
    progress: 100,
    updated_at: '2024-10-15T11:20:00Z'
  }
]

export const demoStep1Data = [
  {
    id: 'step1-1',
    journal_id: 'journal-1',
    member_id: 'demo-user-123',
    who_i_am: 'Estudiante de Ingeniería de Sistemas con experiencia en desarrollo web y móvil',
    what_i_know: 'Programación en React, Node.js, bases de datos, metodologías ágiles, UX/UI básico',
    who_i_know: 'Compañeros de carrera, profesores del área tecnológica, desarrolladores en startups locales',
    what_i_have: 'Laptop, acceso a herramientas de desarrollo, tiempo libre los fines de semana, $500 USD ahorrados',
    created_at: '2024-10-15T10:00:00Z',
    updated_at: '2024-10-20T15:30:00Z'
  }
]

export const demoStep2Data = {
  id: 'step2-1',
  journal_id: 'journal-1',
  title: 'Dificultad para encontrar transporte eficiente en horas pico',
  description: 'Los estudiantes y trabajadores en Bogotá enfrentan grandes desafíos para movilizarse durante las horas pico. Los tiempos de espera son impredecibles, las rutas son ineficientes y no existe una plataforma unificada que permita comparar opciones de transporte público, privado y alternativo en tiempo real. Esto genera estrés, pérdida de tiempo productivo y costos adicionales por la falta de información oportuna.',
  affected: 'Estudiantes universitarios (18-25 años), trabajadores jóvenes (25-35 años), y profesionales que dependen del transporte público en ciudades grandes como Bogotá, Medellín y Cali. Especialmente aquellos en estratos 2-4 que necesitan optimizar tiempo y dinero en transporte. También afecta a turistas y visitantes que no conocen las mejores rutas.',
  relevance: 'Según el DANE, los bogotanos invierten en promedio 2.5 horas diarias en transporte. Esto representa una pérdida económica significativa y afecta la calidad de vida. Con el crecimiento urbano acelerado y los problemas de infraestructura, esta problemática se intensifica. El mercado de apps de movilidad en Colombia está valorado en $200M USD y crece 15% anual.',
  link_to_means: 'Mi experiencia personal como estudiante que usa transporte público me permite entender el problema. Mis conocimientos en desarrollo de apps móviles y APIs son directamente aplicables. Conozco otros estudiantes que enfrentan el mismo problema y podrían ser early adopters. Tengo acceso a herramientas de desarrollo y un presupuesto inicial para MVP y validación.',
  updated_at: '2024-10-20T14:15:00Z'
}

export const demoStep3Data = [
  {
    id: 'trend-1',
    journal_id: 'journal-1',
    name: 'Micro-movilidad urbana',
    type: 'Tecnológica' as const,
    brief: 'Crecimiento exponencial de bicicletas y scooters eléctricos compartidos en ciudades latinoamericanas',
    example: 'Empresas como Grin, Lime y Muvo han expandido sus operaciones en Colombia, con más de 10,000 vehículos en Bogotá',
    source_apa: 'Rodríguez, M. (2024). Micro-movilidad en América Latina: Tendencias y adopción. Revista de Transporte Urbano, 12(3), 45-62.',
    comment: 'Oportunidad de integrar estas opciones en una plataforma unificada',
    created_at: '2024-10-18T09:00:00Z'
  },
  {
    id: 'trend-2', 
    journal_id: 'journal-1',
    name: 'Trabajo remoto híbrido post-pandemia',
    type: 'Social' as const,
    brief: 'Cambio en patrones de movilidad debido a la flexibilidad laboral y educativa',
    example: 'El 60% de empresas en Colombia adoptaron modelos híbridos, reduciendo viajes diarios pero aumentando la necesidad de flexibilidad',
    source_apa: 'García, L. & Martínez, C. (2024). Nuevos patrones de movilidad urbana post-COVID. Estudios Urbanos, 8(2), 23-41.',
    comment: 'Genera demanda de soluciones de transporte más flexibles y bajo demanda',
    created_at: '2024-10-18T09:15:00Z'
  },
  {
    id: 'trend-3',
    journal_id: 'journal-1', 
    name: 'Consciousness sobre sostenibilidad ambiental',
    type: 'Ambiental' as const,
    brief: 'Mayor conciencia ambiental especialmente en millennials y Gen Z sobre el impacto del transporte',
    example: 'Encuestas muestran que 78% de jóvenes colombianos prefieren opciones de transporte sostenible cuando están disponibles',
    source_apa: 'López, A. (2024). Conciencia ambiental y decisiones de transporte en jóvenes urbanos. Revista Ambiental Colombiana, 15(4), 112-128.',
    comment: 'Oportunidad de promover opciones eco-friendly en la plataforma',
    created_at: '2024-10-18T09:30:00Z'
  },
  {
    id: 'trend-4',
    journal_id: 'journal-1',
    name: 'Economía colaborativa y sharing economy',
    type: 'Cultural' as const, 
    brief: 'Creciente aceptación de modelos de economía compartida especialmente en transporte y servicios',
    example: 'El uso de apps como Uber, Beat y carpooling ha crecido 200% en los últimos 3 años en Colombia',
    source_apa: 'Hernández, P. (2024). La economía colaborativa en el transporte urbano colombiano. Revista de Innovación Social, 7(1), 67-84.',
    comment: 'Base cultural sólida para adopción de nuevas soluciones de movilidad compartida',
    created_at: '2024-10-18T09:45:00Z'
  },
  {
    id: 'trend-5',
    journal_id: 'journal-1',
    name: 'Digitalización del consumo y servicios',
    type: 'Consumo' as const,
    brief: 'Aceleración en la adopción de servicios digitales y comparadores online para decisiones de compra',
    example: 'Apps como Rappi, Shopify y comparadores de precios han cambiado los hábitos de consumo, con 85% de millennials usando apps para decisiones diarias',
    source_apa: 'Torres, S. & Villareal, J. (2024). Transformación digital del consumo en Colombia. Revista de Marketing Digital, 11(2), 34-52.',
    comment: 'Contexto favorable para una app que permita comparar y elegir opciones de transporte',
    created_at: '2024-10-18T10:00:00Z'
  }
]

export const demoStep4Data = [
  {
    id: 'idea-1',
    journal_id: 'journal-1',
    idea: 'App móvil que integre todas las opciones de transporte (público, privado, micro-movilidad) con tiempos reales y comparación de precios',
    kind: 'Producto Digital',
    innovation_level: 'Incremental' as const,
    feasibility: 'Alta' as const,
    selected: true,
    justification: 'Esta idea combina tecnologías existentes de manera innovadora para resolver un problema real y urgente. La viabilidad técnica es alta dado mi background en desarrollo móvil y APIs. El mercado es grande y creciente, con validación clara del problema. Los costos de desarrollo inicial son manejables y existe potencial de monetización a través de comisiones y publicidad. La competencia es fragmentada, lo que representa una oportunidad de diferenciación.',
    created_at: '2024-10-19T10:00:00Z'
  },
  {
    id: 'idea-2',
    journal_id: 'journal-1', 
    idea: 'Plataforma de carpooling inteligente para estudiantes universitarios con verificación académica',
    kind: 'Plataforma Digital',
    innovation_level: 'Incremental' as const,
    feasibility: 'Media' as const,
    selected: false,
    justification: '',
    created_at: '2024-10-19T10:15:00Z'
  },
  {
    id: 'idea-3',
    journal_id: 'journal-1',
    idea: 'Sistema de optimización de rutas usando AI para transporte público con incentivos gamificados',
    kind: 'Producto Digital',
    innovation_level: 'Radical' as const,
    feasibility: 'Baja' as const,
    selected: false,
    justification: '',
    created_at: '2024-10-19T10:30:00Z'
  },
  {
    id: 'idea-4',
    journal_id: 'journal-1',
    idea: 'Servicio de consultoría en movilidad urbana para empresas e instituciones educativas',
    kind: 'Servicio',
    innovation_level: 'Incremental' as const,
    feasibility: 'Media' as const,
    selected: false,
    justification: '',
    created_at: '2024-10-19T10:45:00Z'
  },
  {
    id: 'idea-5',
    journal_id: 'journal-1',
    idea: 'Marketplace de servicios de transporte personalizado con suscripción mensual',
    kind: 'Plataforma Digital',
    innovation_level: 'Incremental' as const,
    feasibility: 'Media' as const,
    selected: false,
    justification: '',
    created_at: '2024-10-19T11:00:00Z'
  },
  {
    id: 'idea-6',
    journal_id: 'journal-1',
    idea: 'Bot de WhatsApp/Telegram que brinde información de transporte en tiempo real',
    kind: 'Producto Digital',
    innovation_level: 'Incremental' as const,
    feasibility: 'Alta' as const,
    selected: false,
    justification: '',
    created_at: '2024-10-19T11:15:00Z'
  }
]

export const demoStep5BuyerData = {
  id: 'buyer-1',
  journal_id: 'journal-1',
  name: 'Camila Estudiante',
  age: 21,
  occupation: 'Estudiante de Administración de Empresas',
  motivations: 'Optimizar tiempo y dinero en transporte para dedicar más tiempo al estudio y trabajo de medio tiempo. Busca independencia y eficiencia en sus desplazamientos diarios.',
  pains: 'Pérdida de tiempo en esperas impredecibles, estrés por llegar tarde a clases, costos variables e inesperados de transporte, falta de información confiable sobre mejores rutas.',
  needs: 'Información precisa de tiempos de llegada, comparación de costos y rutas, opciones de transporte seguras y confiables, planificación anticipada de viajes.',
  updated_at: '2024-10-20T12:00:00Z'
}

export const demoStep5VPData = {
  id: 'vp-1',
  journal_id: 'journal-1',
  customer_jobs: 'Llegar puntual a clases y trabajo, minimizar costos de transporte, planificar rutas eficientes, encontrar opciones de transporte seguras y confiables.',
  customer_pains: 'Incertidumbre en tiempos de viaje, información fragmentada sobre opciones de transporte, costos impredecibles, estrés por posibles retrasos, falta de alternativas cuando hay problemas.',
  customer_gains: 'Ahorro de tiempo y dinero, reducción de estrés, mayor puntualidad, mejor planificación del día, acceso a múltiples opciones de transporte en una sola app.',
  products_services: 'App móvil multiplataforma que integra información en tiempo real de transporte público, privado y micro-movilidad. Comparador de precios y tiempos. Sistema de alertas y notificaciones.',
  pain_relievers: 'Información actualizada en tiempo real, comparación automática de opciones, alertas proactivas sobre retrasos o cambios, rutas alternativas inteligentes, historial de viajes para aprender patrones.',
  gain_creators: 'Gamificación con puntos por uso eficiente, descuentos exclusivos con partners, comunidad de usuarios para compartir tips, integración con calendarios académicos, programa de referidos.',
  updated_at: '2024-10-20T12:30:00Z'
}