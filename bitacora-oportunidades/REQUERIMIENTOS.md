# brota — Plataforma de Emprendimiento Sostenible

## 0. Resumen Ejecutivo del Proyecto

### 0.1 Vision General

**brota** (anteriormente "Bitacora de Oportunidades") es una plataforma web de emprendimiento sostenible que guia a emprendedores a traves de una metodologia estructurada de 7 pasos consolidados (13 pasos originales) para analizar, validar y desarrollar ideas de negocio con un enfoque integral de sostenibilidad. La plataforma integra inteligencia artificial (OpenAI GPT-4o y GPT-4-turbo) para generar analisis, ideas y recomendaciones automaticamente, acelerando el proceso de validacion de negocios.

**Tagline**: "De la idea al impacto"

**Marca**: brota — nombre que evoca crecimiento organico y sostenible (brotar/germinar), representado visualmente con un icono de brote (Sprout) en un circulo con degradado emerald→cyan.

### 0.2 Problema que Resuelve

Los emprendedores frecuentemente carecen de una metodologia estructurada para validar sus ideas de negocio. El proceso de ir de una idea cruda a un plan de negocio completo requiere analizar multiples dimensiones (recursos, mercado, cliente, modelo de negocio, sostenibilidad) que normalmente se abordan de forma fragmentada. brota consolida todo este proceso en una plataforma unica potenciada por IA.

### 0.3 Propuesta de Valor

1. **Metodologia guiada de 7 pasos**: Proceso estructurado basado en emprendimiento efectual y sostenibilidad
2. **IA integrada en cada paso**: GPT-4 genera analisis, ideas, canvas de negocio y evaluaciones
3. **Generacion completa con un click**: A partir de una descripcion de idea, la IA completa automaticamente los 13 pasos
4. **Enfoque de sostenibilidad**: Canvas de 14 bloques basado en el modelo EAN (Economics for the Anthropocene)
5. **Exportacion profesional**: PDF y PPTX con todos los datos del proyecto
6. **Auto-guardado en tiempo real**: Los datos se persisten automaticamente con debounce de 600ms

### 0.4 Usuarios Objetivo

- Emprendedores en etapa temprana
- Estudiantes de emprendimiento (contexto academico EAN)
- Consultores de innovacion y sostenibilidad
- Equipos de aceleracion de startups

---

## 1. Arquitectura del Sistema

### 1.1 Stack Tecnologico

| Capa | Tecnologia | Version | Proposito |
|------|------------|---------|-----------|
| Frontend | React | 18.2.0 | UI declarativa con componentes funcionales |
| Lenguaje | TypeScript | 5.2.2 | Tipado estatico para robustez |
| Build Tool | Vite | 5.2.0 | Bundling rapido con HMR |
| Estado | Zustand | 4.4.7 | Gestion de estado minimalista con persist |
| CSS | Tailwind CSS | 3.4.1 | Utility-first con design tokens custom |
| Iconos | Lucide React | 0.344.0 | Iconografia consistente SVG |
| Formularios | React Hook Form | 7.49.3 | Manejo eficiente de formularios |
| Validacion | Zod | 3.22.4 | Esquemas de validacion declarativos |
| Backend | Supabase | 2.39.7 | PostgreSQL + Auth + RLS + Realtime |
| IA | OpenAI API | GPT-4o/Turbo | Generacion de contenido inteligente |
| PDF | jsPDF + html2canvas | 2.5.2 / 1.4.1 | Exportacion a PDF profesional |
| PPTX | pptxgenjs | 4.0.1 | Generacion de presentaciones |
| Fechas | date-fns | 3.2.0 | Formateo de fechas en espanol |
| Utilidades | clsx + tailwind-merge | — | Composicion de clases CSS |
| Deploy | Vercel | — | Hosting y CI/CD |

### 1.2 Estructura de Carpetas

```
bitacora-oportunidades/
├── index.html                  # Entry HTML (meta: espanol, emprendimiento sostenible)
├── vite.config.ts              # Dev server en puerto 3020, host: true
├── tailwind.config.js          # Design tokens: primary(blue), gray(zinc), glow shadows
├── package.json                # 26 dependencias directas
├── src/
│   ├── main.tsx                # React 18 StrictMode entry
│   ├── App.tsx                 # AuthGuard → Header + (WizardLayout | HomePage)
│   ├── index.css               # Design system: botones, inputs, cards, step-content, animaciones
│   ├── store/
│   │   ├── auth.ts             # AuthState: signIn, signUp, signOut, sendMagicLink, demo mode
│   │   ├── journal.ts          # JournalState (1022 lineas): CRUD completo, 17 tipos de datos, persist
│   │   └── supabase.ts         # Cliente Supabase tipado con Database types
│   ├── lib/
│   │   ├── utils.ts            # cn() para clases CSS, debounce()
│   │   ├── database.types.ts   # Tipos auto-generados de Supabase
│   │   ├── ai/
│   │   │   ├── openai.ts       # AIAnalysisService: evaluacion FODA con GPT-4-turbo (temp 0.3)
│   │   │   ├── ideaGenerator.ts # AIIdeaGenerator: genera 5+ ideas desde medios (temp 0.7)
│   │   │   ├── completeIdeaGenerator.ts # CompleteIdeaGenerator: 13 pasos completos (GPT-4o, temp 0.7, 12K tokens)
│   │   │   └── testDataGenerator.ts     # Datos de prueba para desarrollo
│   │   ├── validators/
│   │   │   ├── step1.ts - step5.ts      # Validacion + calculo de progreso por paso
│   │   ├── progress/
│   │   │   └── calcProgress.ts          # calculateStepProgress(), calculateOverallProgress(), colores
│   │   └── pdf/
│   │       └── comprehensivePdfGenerator.ts # PDF profesional 1014 lineas (portada, ejecutivo, 13 pasos)
│   ├── scripts/
│   │   ├── createCompleteIdeaFromAI.ts  # Automatizacion end-to-end: idea → DB completa (400+ lineas)
│   │   ├── createCompleteTestData.ts    # Datos de prueba completos
│   │   ├── createSimpleTestData.ts      # Datos de prueba minimos
│   │   └── createMultipleIdeasTestData.ts # Multiples ideas de prueba
│   ├── utils/
│   │   └── loadSustainabilityData.ts    # Carga paralela de datos de sostenibilidad
│   └── components/
│       ├── auth/
│       │   ├── AuthGuard.tsx            # Guard + demo mode (demo@ean.edu.co)
│       │   └── LoginForm.tsx            # Login/Signup/MagicLink con branding brota
│       ├── layout/
│       │   └── Header.tsx               # Navbar: brota logo + breadcrumb + signout
│       ├── home/
│       │   └── HomePage.tsx             # Hero + pipeline 7 pasos + cards de bitacoras
│       ├── wizard/
│       │   └── WizardLayout.tsx         # Layout 2 columnas: sidebar + contenido (517 lineas)
│       ├── ui/
│       │   └── StepTabs.tsx             # Tabs para sub-pasos con indicadores de completado
│       ├── ideas/
│       │   ├── IdeasManager.tsx          # CRUD de ideas + generacion IA
│       │   └── IdeaGeneratorPanel.tsx    # Panel de generacion desde medios
│       ├── export/
│       │   ├── ExportButtons.tsx         # Wrapper PDF + PPTX
│       │   ├── PdfExportButton.tsx       # Boton con carga de todos los datos
│       │   └── PptxExportButton.tsx      # Boton con multiples generadores
│       ├── AIIdeaCreator.tsx             # Generador completo: descripcion → 7 pasos con IA
│       └── steps/
│           ├── consolidated/             # 7 wrappers que agrupan sub-pasos
│           │   ├── Step1Idea.tsx          # → IdeasManager
│           │   ├── Step2Discovery.tsx     # → Step1Means + Step2Problem (tabs)
│           │   ├── Step3Environment.tsx   # → Step3Trends + Step4IdeaEvaluation (tabs)
│           │   ├── Step4ValueProp.tsx     # → Step5Buyer + Step5UserValue (tabs)
│           │   ├── Step5BusinessModel.tsx # → Step7SustainableCanvas + Step8InnovationPatterns (tabs)
│           │   ├── Step6Prototype.tsx     # → Step9Prototype + Step10Validation + Step11Ecosystem (tabs)
│           │   └── Step7FinalEval.tsx     # → Step12Sustainability + Step6AIEval + Export (tabs)
│           ├── Step1Means.tsx            # Inventario de medios (quien soy, que se, a quien conozco, que tengo)
│           ├── Step2Problem.tsx          # Definicion del problema/oportunidad
│           ├── Step3Trends.tsx           # Tendencias de mercado (4-5 entradas)
│           ├── Step4Ideation.tsx         # Ideacion inicial
│           ├── Step4IdeaEvaluation.tsx   # Evaluacion FODA de idea seleccionada
│           ├── Step5Buyer.tsx            # Buyer persona
│           ├── Step5UserValue.tsx        # Canvas de propuesta de valor
│           ├── Step6AIEvaluation.tsx     # Evaluacion IA comprehensiva (29K lineas)
│           ├── Step7SustainableCanvas.tsx # Canvas sostenible 14 bloques
│           ├── Step8InnovationPatterns.tsx # Patrones de innovacion (20+ del BMN)
│           ├── Step9PrototypeMVP.tsx     # Diseno de prototipo/MVP
│           ├── Step10ValidationStrategy.tsx # Estrategia de validacion
│           ├── Step11EcosystemMap.tsx    # Mapeo de ecosistema de actores
│           └── Step12SustainabilityReflection.tsx # Reflexion de impacto sostenible
```

### 1.3 Flujo de la Aplicacion

```
┌─────────────────────────────────────────────────────────┐
│                    index.html                           │
│                       ↓                                 │
│                    main.tsx                              │
│                       ↓                                 │
│                    App.tsx                               │
│                       ↓                                 │
│                  AuthGuard.tsx                           │
│              ┌────────┴────────┐                        │
│              ↓                 ↓                        │
│         LoginForm        Contenido Auth                 │
│     (3 metodos auth)     ┌────┴────┐                    │
│                          ↓         ↓                    │
│                      Header    Routing                  │
│                              ┌────┴────┐                │
│                              ↓         ↓                │
│                          HomePage  WizardLayout         │
│                       (bitacoras)  (7 pasos)            │
│                              ↓         ↓                │
│                        AIIdeaCreator  Steps 1-7         │
│                       (gen completa)  (consolidados)    │
│                                        ↓                │
│                                   Exportacion           │
│                                   (PDF + PPTX)          │
└─────────────────────────────────────────────────────────┘
```

### 1.4 Gestion de Estado (Zustand)

El store principal (`journal.ts`, 1022 lineas) gestiona todo el estado de la aplicacion:

**Estado de seleccion** (persistido en localStorage):
- `currentTeam` — Equipo/workspace activo (transparente al usuario)
- `currentJournal` — Bitacora seleccionada
- `currentIdea` — Idea activa dentro de la bitacora

**Datos por paso** (cargados desde Supabase):
| Propiedad | Tabla Supabase | Paso |
|-----------|---------------|------|
| `step1Data[]` | step1_means | 2 (Fundamentos) |
| `step2Data` | step2_problem | 2 (Fundamentos) |
| `step3Data[]` | step3_trends | 3 (Entorno) |
| `step4Data[]` | step4_ideas | 1 (Ideacion) |
| `step4EvaluationData` | step4_idea_evaluation | 3 (FODA) |
| `step5BuyerData` | step5_buyer | 4 (Cliente) |
| `step5VPData` | step5_vpcanvas | 4 (Valor) |
| `sustainableCanvasData` | sustainable_canvas | 5 (Modelo) |
| `innovationPatternsData[]` | innovation_patterns | 5 (Patrones) |
| `prototypeData` | prototypes | 6 (MVP) |
| `validationStrategyData` | validation_strategies | 6 (Validacion) |
| `ecosystemActorsData[]` | ecosystem_actors | 6 (Ecosistema) |
| `sustainabilityReflectionData` | sustainability_reflections | 7 (Impacto) |

**Acciones principales**: `loadTeams`, `loadJournals`, `loadIdeas`, `loadJournalData`, `loadIdeaData`, `createTeam`, `createJournal`, `createIdea`, `deleteJournal`, `deleteIdea`, `saveStep1Data`...`saveStep5VPDataForIdea`, `ensureDefaultTeam`, `cleanupOrphanedData`, `subscribeToJournal`, `unsubscribeFromJournal`

### 1.5 Integracion con IA

La plataforma usa 3 servicios de IA diferentes:

| Servicio | Archivo | Modelo | Temp | Tokens | Uso |
|----------|---------|--------|------|--------|-----|
| `AIAnalysisService` | openai.ts | gpt-4-turbo-preview | 0.3 | 4,000 | Evaluacion FODA comprehensiva |
| `AIIdeaGenerator` | ideaGenerator.ts | gpt-4-turbo-preview | 0.7 | 3,000 | Generar 5+ ideas desde medios |
| `CompleteIdeaGenerator` | completeIdeaGenerator.ts | gpt-4o | 0.7 | 12,000 | Plan completo de 13 pasos |

**Prompt de AIAnalysisService**: Rol de consultor de negocios con PhD y 20+ anos de experiencia. Enfoque analitico, cuantitativo, estrategico y constructivo.

**Output de AIAnalysisService**:
- Evaluacion general (3-5 parrafos)
- Fortalezas, debilidades, oportunidades (min 5 cada una)
- Recomendaciones (min 7)
- Evaluacion de riesgo (3-4 parrafos)
- Proximos pasos (min 8)
- Puntaje de viabilidad (0-100)

**Prompt de AIIdeaGenerator**: Framework de emprendimiento efectual — empieza con los medios disponibles, bajo riesgo, validacion rapida, aprovecha redes existentes.

**CompleteIdeaGenerator**: Genera un objeto masivo con datos para los 13 pasos incluyendo: medios, problema, 4 tendencias, FODA, buyer persona, canvas VP, canvas sostenible 14 bloques, 3+ patrones de innovacion, prototipo, estrategia de validacion, 4+ actores del ecosistema y reflexion de sostenibilidad. Timeout de 10 minutos.

**Fallback**: Todos los servicios incluyen datos mock realistas cuando la API no esta disponible (ejemplo: "EcoScore" — plataforma de reciclaje inteligente).

### 1.6 Base de Datos

**Proveedor**: Supabase (PostgreSQL gestionado)

**17 tablas**:

| Tabla | Columnas Principales | FK |
|-------|---------------------|-----|
| `teams` | id, name, created_by, created_at | created_by → auth.users |
| `journals` | id, team_id, title, status (draft/in_progress/ready), progress (0-100), updated_at | team_id → teams |
| `ideas` | id, journal_id, title, description, target_market, unique_value, resources_needed[], implementation_complexity, market_potential, alignment_score (0-100), reasoning, status | journal_id → journals |
| `step1_means` | id, idea_id, who_i_am, what_i_know, who_i_know, what_i_have | idea_id → ideas |
| `step2_problem` | id, idea_id, title, description, affected, relevance, link_to_means | idea_id → ideas |
| `step3_trends` | id, idea_id, name, type (Social/Tecnologica/Ambiental/Cultural/Consumo), brief, example, source_apa, comment | idea_id → ideas |
| `step4_ideas` | id, journal_id, idea, innovation_level, feasibility, selected, justification | journal_id → journals |
| `step4_idea_evaluation` | id, idea_id, strengths, weaknesses, opportunities, threats, success_factors, risk_mitigation | idea_id → ideas |
| `step5_buyer` | id, idea_id, name, age, occupation, motivations, pains, needs | idea_id → ideas |
| `step5_vpcanvas` | id, idea_id, customer_jobs, customer_pains, customer_gains, products_services, pain_relievers, gain_creators | idea_id → ideas |
| `sustainable_canvas` | id, idea_id, 14 bloques de texto (segmentos, propuesta, productos, canales, relaciones, ingresos, beneficios_sociales, beneficios_ambientales, recursos, actividades, alianzas, costos, costos_sociales, costos_ambientales) | idea_id → ideas |
| `innovation_patterns` | id, idea_id, name, description, justification, expected_impact, is_primary | idea_id → ideas |
| `prototypes` | id, idea_id, name, type (concept/wireframe/mockup/mvp/physical/digital/service), description, hypotheses, learning_metrics, image_url, video_url, external_link | idea_id → ideas |
| `validation_strategies` | id, idea_id, hypothesis, target_segments, methods[], expected_learnings, success_criteria, estimated_time_weeks, estimated_budget | idea_id → ideas |
| `ecosystem_actors` | id, idea_id, name, type (financiero/academico/empresarial/social/institucional), support_types[] (7 categorias), mutual_benefits, relationship_status | idea_id → ideas |
| `sustainability_reflections` | id, idea_id, impact_balance, sustainability_decisions, scaling_strategy | idea_id → ideas |
| `activity_log` | id, journal_id, action, details, timestamp | journal_id → journals |

**Seguridad**: Row Level Security (RLS) habilitado en todas las tablas. Politicas basadas en pertenencia al equipo del usuario autenticado.

### 1.7 Metodologia de 7 Pasos

La plataforma implementa dos modulos pedagogicos:

**Modulo 1 — Analisis Efectual (Pasos 1-4)**
Basado en la teoria de emprendimiento efectual (Sarasvathy): empieza con lo que tienes, no con lo que necesitas.

**Modulo 2 — Emprendimiento Sostenible (Pasos 5-7)**
Basado en el modelo EAN (Economics for the Anthropocene): integra impacto social, ambiental y economico en el modelo de negocio.

| Paso UI | Sub-pasos Internos | Fase | Color |
|---------|-------------------|------|-------|
| 1. Tu Idea | Seleccion/generacion de idea | Ideacion | Amber |
| 2. Fundamentos | Inventario de medios + Definicion del problema | Analisis | Blue |
| 3. Entorno y FODA | Tendencias de mercado + Evaluacion FODA | Analisis | Blue |
| 4. Cliente y Valor | Buyer persona + Canvas de propuesta de valor | Modelo | Violet |
| 5. Modelo de Negocio | Canvas sostenible 14 bloques + Patrones de innovacion | Modelo | Violet |
| 6. MVP y Validacion | Prototipo + Estrategia de validacion + Ecosistema | Prototipo | Cyan |
| 7. Impacto y Cierre | Reflexion sostenibilidad + Evaluacion IA + Exportacion | Impacto | Emerald |

### 1.8 Sistema de Progreso

Cada paso calcula su porcentaje de completado:
- **Paso 1**: Existe idea seleccionada (0 o 100%)
- **Paso 2**: Promedio de medios + problema (campos completados)
- **Paso 3**: Promedio de tendencias + FODA (campos completados)
- **Paso 4**: Buyer + VP ambos > 80%
- **Paso 5**: Promedio de canvas + patrones
- **Paso 6**: Promedio de prototipo + validacion + ecosistema
- **Paso 7**: Promedio de reflexion + evaluacion IA
- **General**: Promedio de los 7 pasos

Progresion secuencial: cada paso se bloquea hasta completar el anterior.

### 1.9 Exportacion

**PDF** (comprehensivePdfGenerator.ts — 1014 lineas):
- Portada con titulo de idea y fecha
- Resumen ejecutivo
- Datos completos de los 13 pasos
- Tablas formateadas
- Formato profesional con colores y secciones

**PPTX** (multiples generadores):
- `professionalPptxGenerator.ts` — Diseno profesional
- `concisePresentationPptx.ts` — Formato conciso
- Slides: portada, problema, solucion, mercado, modelo, finanzas, sostenibilidad, CTA

### 1.10 Identidad Visual

**Marca**: brota
- Logo: Icono Sprout (brote) en circulo con degradado `from-emerald-400 to-cyan-500`
- Wordmark: "brota" en font-black lowercase, 15px
- Tagline: "de idea a impacto"

**Sistema de diseno**:
- Fuente: Inter (400, 500, 600, 700)
- Colores primarios: Blue scale (50-950)
- Acentos: Emerald (sostenibilidad), Cyan (tecnologia), Amber (ideacion), Violet (modelo)
- Sombras glow: `shadow-glow-sm`, `shadow-glow`, `shadow-glow-lg`
- Animaciones: `animate-fade-in` (150ms), `animate-slide-up` (400ms)
- Hero: bg-gray-950 con orbs de degradado difuminado (blur-[120px]+)
- Botones: `.btn-primary`, `.btn-glow` (efecto brillo), `.btn-ghost`
- Inputs: bordes gris con focus ring primario
- Step content: campos envueltos en cards con barra lateral de acento

### 1.11 Autenticacion

**3 metodos disponibles**:
1. Email + contrasena (Supabase Auth, min 6 chars)
2. Registro con email + contrasena
3. Magic Link via email (Supabase OTP)

**Modo demo**: Habilitado — auto-login con `demo@ean.edu.co` sin necesidad de credenciales reales.

**AuthGuard**: Envuelve toda la aplicacion. Sin autenticacion, muestra LoginForm.

### 1.2 Despliegue

**Plataforma**: Vercel
- `installCommand`: `cd bitacora-oportunidades && npm ci`
- `buildCommand`: `cd bitacora-oportunidades && npm run build`
- `outputDirectory`: `bitacora-oportunidades/dist`

**Variables de entorno requeridas en Vercel**:
```
VITE_OPENAI_API_KEY      # Clave de API de OpenAI
VITE_SUPABASE_URL        # URL del proyecto Supabase
VITE_SUPABASE_ANON_KEY   # Clave anonima de Supabase
```

---

## 2. Requerimientos Funcionales

### 2.1 Autenticacion y Gestion de Usuarios

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-01 | El sistema debe permitir registro de usuarios con email y contrasena (minimo 6 caracteres) | Alta |
| RF-02 | El sistema debe permitir inicio de sesion con email y contrasena | Alta |
| RF-03 | El sistema debe soportar autenticacion por enlace magico (magic link) via email | Media |
| RF-04 | El sistema debe persistir la sesion del usuario en localStorage | Alta |
| RF-05 | El sistema debe proteger todas las rutas con un AuthGuard que requiera autenticacion | Alta |
| RF-06 | El sistema debe permitir cerrar sesion desde cualquier pantalla | Alta |
| RF-07 | El sistema debe soportar un modo demo con auto-login (demo@ean.edu.co) | Media |

### 2.2 Gestion de Bitacoras (Journals)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-08 | El sistema debe crear un equipo/workspace por defecto de forma transparente al usuario | Alta |
| RF-09 | El sistema debe permitir crear multiples bitacoras con nombre personalizado | Alta |
| RF-10 | El sistema debe permitir eliminar bitacoras con confirmacion modal | Alta |
| RF-11 | El sistema debe mostrar las bitacoras con su progreso general (0-100%) | Alta |
| RF-12 | El sistema debe mostrar la fecha de ultima actualizacion de cada bitacora | Media |
| RF-13 | El sistema debe visualizar el progreso de cada bitacora como pipeline de 7 pasos con indicadores de color por fase | Media |

### 2.3 Gestion de Ideas

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-14 | El sistema debe permitir crear ideas manualmente con titulo, descripcion, mercado objetivo y propuesta de valor | Alta |
| RF-15 | El sistema debe permitir generar ideas con IA a partir de los medios del emprendedor | Alta |
| RF-16 | El sistema debe generar un plan de negocio completo (13 pasos) con IA a partir de una descripcion de idea | Alta |
| RF-17 | El sistema debe permitir seleccionar una idea activa para desarrollar en los pasos siguientes | Alta |
| RF-18 | El sistema debe mostrar badges de potencial de mercado (Alto/Medio/Bajo) y puntaje de alineacion (0-100%) | Media |
| RF-19 | El sistema debe permitir multiples ideas por bitacora | Media |

### 2.4 Modulo 1 — Analisis Efectual (Pasos 1-4)

#### Paso 1: Tu Idea (Seleccion/Generacion)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-20 | El sistema debe mostrar el generador de ideas con IA como opcion principal | Alta |
| RF-21 | El sistema debe listar ideas existentes con indicador de seleccion | Alta |
| RF-22 | El sistema debe permitir crear ideas manualmente como alternativa | Alta |
| RF-23 | El sistema debe incluir el componente AIIdeaCreator para generar planes completos desde descripcion | Alta |

#### Paso 2: Fundamentos (Recursos + Problema)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-24 | El sistema debe capturar el inventario de medios del emprendedor: perfil profesional (quien soy), habilidades (que se), red de contactos (a quien conozco), recursos disponibles (que tengo) | Alta |
| RF-25 | El sistema debe validar que al menos un campo del inventario este completo | Alta |
| RF-26 | El sistema debe capturar la definicion del problema: titulo, descripcion (min 50 caracteres), poblacion afectada, relevancia y conexion con los medios | Alta |
| RF-27 | El sistema debe organizar estos dos sub-pasos como tabs navegables con indicadores de completado | Media |

#### Paso 3: Entorno y FODA (Tendencias + Evaluacion)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-28 | El sistema debe permitir agregar multiples tendencias (4-5) con: nombre, tipo (Social/Tecnologica/Ambiental/Cultural/Consumo), descripcion, ejemplo, fuente APA y comentarios | Alta |
| RF-29 | El sistema debe capturar el analisis FODA: fortalezas, debilidades, oportunidades, amenazas, factores de exito y mitigacion de riesgos | Alta |
| RF-30 | El sistema debe mostrar progreso de evaluacion como porcentaje | Media |

#### Paso 4: Cliente y Valor (Buyer Persona + VP Canvas)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-31 | El sistema debe capturar el perfil del comprador: nombre, edad, ocupacion, motivaciones, puntos de dolor, necesidades | Alta |
| RF-32 | El sistema debe capturar el Canvas de Propuesta de Valor: trabajos del cliente, dolores, ganancias vs. productos/servicios, aliviadores de dolor, creadores de ganancia | Alta |

### 2.5 Modulo 2 — Emprendimiento Sostenible (Pasos 5-7)

#### Paso 5: Modelo de Negocio (Canvas Sostenible + Patrones)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-33 | El sistema debe implementar un Canvas de 14 bloques basado en el modelo EAN (Economics for the Anthropocene) | Alta |
| RF-34 | Los bloques del canvas deben incluir: segmentos de clientes, propuesta de valor, productos/servicios, canales, relaciones, ingresos, beneficios sociales, beneficios ambientales, recursos clave, actividades clave, alianzas clave, costos, costos sociales, costos ambientales | Alta |
| RF-35 | El sistema debe permitir generar contenido del canvas con IA bloque por bloque | Alta |
| RF-36 | El sistema debe incluir una biblioteca de 20+ patrones de innovacion del Business Model Navigator | Alta |
| RF-37 | El sistema debe capturar por cada patron: nombre, descripcion, justificacion, impacto esperado y estado de patron primario | Alta |

#### Paso 6: MVP y Validacion (Prototipo + Validacion + Ecosistema)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-38 | El sistema debe capturar el prototipo/MVP con: nombre, tipo (concept/wireframe/mockup/mvp/physical/digital/service), descripcion, hipotesis a validar, metricas de aprendizaje | Alta |
| RF-39 | El sistema debe soportar enlaces multimedia: imagen URL, video URL, enlace externo (Figma, Canva, etc.) | Media |
| RF-40 | El sistema debe generar sugerencias de MVP con IA | Media |
| RF-41 | El sistema debe capturar la estrategia de validacion con: hipotesis, segmentos objetivo, metodos (entrevista/encuesta/landing page/test A-B/observacion/focus group/prueba de prototipo), aprendizajes esperados, criterios de exito | Alta |
| RF-42 | El sistema debe capturar estimados de tiempo (semanas) y presupuesto para la validacion | Media |
| RF-43 | El sistema debe mapear el ecosistema de actores con: nombre, tipo (financiero/academico/empresarial/social/institucional), tipos de apoyo (7 categorias), beneficios bidireccionales y estado de relacion | Alta |

#### Paso 7: Impacto y Cierre (Reflexion + Evaluacion IA + Exportacion)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-44 | El sistema debe capturar la reflexion de sostenibilidad en 3 areas: balance de impacto social/ambiental/economico, decisiones de sostenibilidad, estrategia de escalamiento con proposito | Alta |
| RF-45 | El sistema debe requerir minimo 200 caracteres por area de reflexion | Media |
| RF-46 | El sistema debe generar reflexiones de sostenibilidad con IA | Media |
| RF-47 | El sistema debe generar un analisis FODA automatico con IA basado en todos los datos ingresados (viabilidad 0-100, riesgo, recomendaciones) | Alta |
| RF-48 | El sistema debe proveer un analisis de respaldo (mock) cuando la API no este disponible | Media |
| RF-49 | El sistema debe permitir exportar el proyecto completo a PDF profesional | Alta |
| RF-50 | El sistema debe permitir exportar el proyecto completo a presentacion PowerPoint (PPTX) | Alta |

### 2.6 Navegacion y Progreso

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-51 | El sistema debe implementar un wizard de 7 pasos consolidados con sidebar de navegacion | Alta |
| RF-52 | El sistema debe calcular y mostrar progreso por paso y progreso general | Alta |
| RF-53 | El sistema debe bloquear pasos posteriores hasta completar los anteriores (progresion secuencial) | Alta |
| RF-54 | El sistema debe permitir navegar libremente entre pasos desbloqueados | Alta |
| RF-55 | El sistema debe mostrar tabs dentro de pasos que contienen multiples sub-pasos | Alta |
| RF-56 | El sistema debe auto-guardar datos con debounce de 600ms | Alta |
| RF-57 | El sistema debe mostrar indicador visual de guardado en curso | Media |
| RF-58 | El sidebar debe mostrar iconos de fase con colores diferenciados (amber/blue/violet/cyan/emerald) | Media |

### 2.7 Exportacion

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-59 | La exportacion PDF debe incluir todos los datos de los 13 pasos: medios, problema, tendencias, ideacion, buyer persona, canvas VP, canvas sostenible, patrones, prototipo, validacion, ecosistema, reflexion y evaluacion IA | Alta |
| RF-60 | La exportacion PPTX debe generar slides profesionales con resumen ejecutivo y todos los modulos | Alta |
| RF-61 | Las exportaciones deben usar formato de fecha en espanol | Media |
| RF-62 | Las exportaciones deben estar disponibles unicamente cuando hay datos suficientes | Media |

### 2.8 Generacion con IA

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-63 | El sistema debe integrar OpenAI GPT-4 Turbo (analisis) y GPT-4o (generacion completa) | Alta |
| RF-64 | El sistema debe generar ideas de negocio (5+) basadas en el inventario de medios del emprendedor | Alta |
| RF-65 | El sistema debe generar bitacoras completas (13 pasos) a partir de una descripcion de idea con timeout de 10 minutos | Alta |
| RF-66 | El sistema debe generar analisis FODA, puntajes de viabilidad y recomendaciones | Alta |
| RF-67 | El sistema debe generar contenido del canvas sostenible bloque por bloque | Alta |
| RF-68 | El sistema debe proveer datos mock/respaldo cuando la API de IA no este disponible | Alta |
| RF-69 | La temperatura de generacion debe ser 0.7 para creatividad y 0.3 para analisis | Baja |

---

## 3. Requerimientos No Funcionales

### 3.1 Rendimiento

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-01 | Tiempo de carga inicial | < 3 segundos con conexion broadband |
| RNF-02 | Auto-guardado | Debounce de 600ms para reducir escrituras a base de datos |
| RNF-03 | Tamano del bundle de produccion | CSS ~49KB gzipped, JS principal ~463KB gzipped |
| RNF-04 | Indices de base de datos | Todos los campos FK y de consulta frecuente deben estar indexados |
| RNF-05 | Carga de datos | Uso de Promise.allSettled para carga paralela de datos de sostenibilidad |
| RNF-06 | Estado del cliente | Gestion eficiente con Zustand (sin re-renders innecesarios) |
| RNF-07 | Timeout de IA | 10 minutos maximo para generacion completa de plan |

### 3.2 Seguridad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-08 | Autenticacion | Gestionada por Supabase Auth con tokens JWT |
| RNF-09 | Politicas RLS | Row Level Security habilitado en todas las tablas de Supabase |
| RNF-10 | Variables de entorno | API keys almacenadas en variables de entorno (VITE_OPENAI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) |
| RNF-11 | Proteccion de rutas | AuthGuard envuelve toda la aplicacion, sin acceso sin autenticacion |
| RNF-12 | Validacion de datos | Validacion con Zod en el cliente antes de enviar a la base de datos |

### 3.3 Usabilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-13 | Idioma | Interfaz completamente en espanol |
| RNF-14 | Diseno responsivo | Adaptable a mobile, tablet y desktop |
| RNF-15 | Sistema de diseno | Tailwind CSS con design tokens custom (primary blue, gray zinc, glow shadows) |
| RNF-16 | Feedback visual | Estados de carga, guardado, error y exito visibles al usuario |
| RNF-17 | Navegacion guiada | Wizard paso a paso con bloqueo progresivo y indicadores de progreso |
| RNF-18 | Tipografia | Inter (400, 500, 600, 700) como fuente principal |
| RNF-19 | Animaciones | Transiciones suaves: fadeIn (150ms), slideUp (400ms) |
| RNF-20 | Sidebar responsive | Sidebar colapsable en mobile con overlay y boton flotante |
| RNF-21 | Identidad visual | Marca "brota" con icono Sprout, degradado emerald→cyan, estilo premium SaaS |

### 3.4 Disponibilidad y Confiabilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-22 | Fallback de IA | Si la API de OpenAI falla, el sistema genera datos mock realistas |
| RNF-23 | Manejo de errores | Try-catch en todas las operaciones asincronas con feedback al usuario |
| RNF-24 | Persistencia local | Estado critico (equipo, bitacora, idea actual) persistido en localStorage |
| RNF-25 | Suscripcion en tiempo real | Soporte para suscripciones de Supabase para actualizaciones en vivo |
| RNF-26 | Limpieza de datos | Eliminacion en cascada y limpieza de datos huerfanos |

### 3.5 Mantenibilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-27 | Stack tecnologico | React 18 + TypeScript 5.2 + Vite 5.2 |
| RNF-28 | Gestion de estado | Zustand 4.4.7 con persist middleware |
| RNF-29 | Componentes | Componentes funcionales con hooks, arquitectura modular |
| RNF-30 | Validacion | Esquemas Zod reutilizables para cada paso |
| RNF-31 | Base de datos | Supabase (PostgreSQL) con migraciones SQL versionadas |
| RNF-32 | Linting | ESLint configurado con reglas de TypeScript |
| RNF-33 | Tipos | database.types.ts auto-generado de Supabase para type safety completo |

### 3.6 Escalabilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-34 | Multi-usuario | Soporte para multiples usuarios con workspaces independientes |
| RNF-35 | Multi-bitacora | Sin limite de bitacoras por usuario |
| RNF-36 | Multi-idea | Sin limite de ideas por bitacora |
| RNF-37 | Infraestructura | Backend en la nube via Supabase (auto-escalable) |
| RNF-38 | API stateless | Diseno sin estado en el servidor, estado gestionado en el cliente |

---

## 4. Modelo de Datos

### 4.1 Diagrama de Relaciones

```
auth.users (Supabase Auth)
      │
      ↓ created_by
   teams (1) ──→ (N) journals (1) ──→ (N) ideas
                       │                     │
                       ↓                     ├──→ step1_means
                  step4_ideas                ├──→ step2_problem
                  activity_log               ├──→ step3_trends
                                             ├──→ step4_idea_evaluation
                                             ├──→ step5_buyer
                                             ├──→ step5_vpcanvas
                                             ├──→ sustainable_canvas
                                             ├──→ innovation_patterns
                                             ├──→ prototypes
                                             ├──→ validation_strategies
                                             ├──→ ecosystem_actors
                                             └──→ sustainability_reflections
```

### 4.2 Detalle de Tablas

| Tabla | Descripcion | FK Principal | Cardinalidad |
|-------|-------------|--------------|--------------|
| teams | Workspaces (transparentes al usuario) | created_by → auth.users | 1:N users |
| journals | Bitacoras de oportunidades | team_id → teams | N:1 teams |
| ideas | Ideas de negocio con metadata | journal_id → journals | N:1 journals |
| step1_means | Inventario de medios del emprendedor | idea_id → ideas | 1:1 ideas |
| step2_problem | Definicion del problema/oportunidad | idea_id → ideas | 1:1 ideas |
| step3_trends | Tendencias de mercado (multiples) | idea_id → ideas | N:1 ideas |
| step4_ideas | Ideas generadas en ideacion | journal_id → journals | N:1 journals |
| step4_idea_evaluation | Evaluacion FODA de idea | idea_id → ideas | 1:1 ideas |
| step5_buyer | Perfil del buyer persona | idea_id → ideas | 1:1 ideas |
| step5_vpcanvas | Canvas de propuesta de valor | idea_id → ideas | 1:1 ideas |
| sustainable_canvas | Canvas sostenible de 14 bloques EAN | idea_id → ideas | 1:1 ideas |
| innovation_patterns | Patrones del Business Model Navigator | idea_id → ideas | N:1 ideas |
| prototypes | Diseno de prototipo/MVP | idea_id → ideas | 1:1 ideas |
| validation_strategies | Estrategia de validacion | idea_id → ideas | 1:1 ideas |
| ecosystem_actors | Actores del ecosistema (multiples) | idea_id → ideas | N:1 ideas |
| sustainability_reflections | Reflexion de impacto sostenible | idea_id → ideas | 1:1 ideas |
| activity_log | Registro de actividad | journal_id → journals | N:1 journals |

---

## 5. Flujo Principal del Usuario

```
1. Acceso → LoginForm (3 metodos) o Demo Mode (auto-login)
2. AuthGuard valida sesion → muestra Header + HomePage
3. HomePage → ensureDefaultTeam() crea workspace transparente
4. Usuario ve bitacoras existentes o crea nueva (nombre personalizado)
5. Click en bitacora → WizardLayout (7 pasos consolidados)
6. Opcion A: Paso 1 → AIIdeaCreator genera plan completo con IA
7. Opcion B: Crear idea manual → completar pasos secuencialmente
8. Cada paso auto-guarda con debounce de 600ms
9. Progresion: paso siguiente se desbloquea al completar el actual
10. Paso 7 → Reflexion de sostenibilidad + Evaluacion IA comprehensiva
11. Exportar a PDF profesional o PPTX con slides
12. Volver a HomePage → crear nueva bitacora o continuar otra
```

---

## 6. Componentes Clave del UI

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| Header | layout/Header.tsx | Navbar sticky: logo brota + breadcrumb + signout |
| HomePage | home/HomePage.tsx | Hero dark + pipeline 7 pasos + cards de bitacoras |
| LoginForm | auth/LoginForm.tsx | Split layout: hero brota + formulario multi-metodo |
| WizardLayout | wizard/WizardLayout.tsx | 2 columnas: sidebar nav + contenido de paso (517 lineas) |
| StepTabs | ui/StepTabs.tsx | Tabs para sub-pasos con indicadores de completado |
| AIIdeaCreator | AIIdeaCreator.tsx | Textarea + boton → genera 7 pasos completos con IA |
| IdeasManager | ideas/IdeasManager.tsx | CRUD de ideas + generacion IA desde medios |
| ExportButtons | export/ExportButtons.tsx | Wrapper PDF + PPTX con carga de datos |
