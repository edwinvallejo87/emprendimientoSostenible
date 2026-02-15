# Requerimientos del Sistema — Bitacora de Oportunidades

## 1. Descripcion General

Aplicacion web para emprendimiento sostenible que guia a los usuarios a traves de una metodologia de 13 pasos (agrupados en 7 pasos consolidados) para analizar, validar y desarrollar ideas de negocio con enfoque de sostenibilidad. Integra inteligencia artificial (OpenAI GPT-4) para generar analisis, ideas y recomendaciones automaticamente.

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

### 2.2 Gestion de Bitacoras (Journals)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-07 | El sistema debe crear un equipo/workspace por defecto de forma transparente al usuario | Alta |
| RF-08 | El sistema debe permitir crear multiples bitacoras con nombre personalizado | Alta |
| RF-09 | El sistema debe permitir eliminar bitacoras con confirmacion modal | Alta |
| RF-10 | El sistema debe mostrar las bitacoras con su progreso general (0-100%) | Alta |
| RF-11 | El sistema debe mostrar la fecha de ultima actualizacion de cada bitacora | Media |
| RF-12 | El sistema debe visualizar el progreso de cada bitacora como pipeline de 7 pasos con indicadores de color | Media |

### 2.3 Gestion de Ideas

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-13 | El sistema debe permitir crear ideas manualmente con titulo, descripcion, mercado objetivo y propuesta de valor | Alta |
| RF-14 | El sistema debe permitir generar ideas con IA a partir de los medios del emprendedor | Alta |
| RF-15 | El sistema debe generar un plan de negocio completo (13 pasos) con IA a partir de una descripcion de idea | Alta |
| RF-16 | El sistema debe permitir seleccionar una idea activa para desarrollar en los pasos siguientes | Alta |
| RF-17 | El sistema debe mostrar badges de potencial de mercado (Alto/Medio/Bajo) y puntaje de alineacion (0-100%) | Media |
| RF-18 | El sistema debe permitir multiples ideas por bitacora | Media |

### 2.4 Modulo 1 — Analisis Efectual (Pasos 1-5)

#### Paso 1: Tu Idea (Seleccion/Generacion)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-19 | El sistema debe mostrar el generador de ideas con IA como opcion principal | Alta |
| RF-20 | El sistema debe listar ideas existentes con indicador de seleccion | Alta |
| RF-21 | El sistema debe permitir crear ideas manualmente como alternativa | Alta |

#### Paso 2: Fundamentos (Recursos + Problema)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-22 | El sistema debe capturar el inventario de medios del emprendedor: perfil profesional, habilidades, red de contactos, recursos disponibles | Alta |
| RF-23 | El sistema debe validar que al menos un campo del inventario este completo | Alta |
| RF-24 | El sistema debe capturar la definicion del problema: titulo, descripcion (min 50 caracteres), poblacion afectada, relevancia y conexion con los medios | Alta |
| RF-25 | El sistema debe organizar estos dos sub-pasos como tabs navegables | Media |

#### Paso 3: Entorno y FODA (Tendencias + Evaluacion)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-26 | El sistema debe permitir agregar multiples tendencias con: nombre, tipo (Social/Tecnologica/Ambiental/Cultural/Consumo), descripcion, ejemplo, fuente APA y comentarios | Alta |
| RF-27 | El sistema debe capturar el analisis FODA: fortalezas, debilidades, oportunidades, amenazas, factores de exito y mitigacion de riesgos | Alta |
| RF-28 | El sistema debe mostrar progreso de evaluacion como porcentaje | Media |

#### Paso 4: Cliente y Valor (Buyer Persona + VP Canvas)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-29 | El sistema debe capturar el perfil del comprador: nombre, edad, ocupacion, motivaciones, puntos de dolor, necesidades | Alta |
| RF-30 | El sistema debe capturar el Canvas de Propuesta de Valor: trabajos del cliente, dolores, ganancias vs. productos/servicios, aliviadores de dolor, creadores de ganancia | Alta |

#### Evaluacion IA (Integrado en Paso 7)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-31 | El sistema debe generar un analisis FODA automatico con IA basado en todos los datos ingresados | Alta |
| RF-32 | El sistema debe mostrar puntaje de viabilidad (0-100), evaluacion de riesgo, y recomendaciones | Alta |
| RF-33 | El sistema debe proveer un analisis de respaldo (mock) cuando la API no este disponible | Media |

### 2.5 Modulo 2 — Emprendimiento Sostenible (Pasos 5-7)

#### Paso 5: Modelo de Negocio (Canvas Sostenible + Patrones)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-34 | El sistema debe implementar un Canvas de 14 bloques basado en el modelo EAN (Economics for the Anthropocene) | Alta |
| RF-35 | Los bloques del canvas deben incluir: segmentos de clientes, propuesta de valor, productos/servicios, canales, relaciones, ingresos, beneficios sociales, beneficios ambientales, recursos clave, actividades clave, alianzas clave, costos, costos sociales, costos ambientales | Alta |
| RF-36 | El sistema debe permitir generar contenido del canvas con IA bloque por bloque | Alta |
| RF-37 | El sistema debe incluir una biblioteca de 20+ patrones de innovacion del Business Model Navigator | Alta |
| RF-38 | El sistema debe capturar por cada patron: nombre, descripcion, justificacion, impacto esperado y estado de patron primario | Alta |

#### Paso 6: MVP y Validacion (Prototipo + Validacion + Ecosistema)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-39 | El sistema debe capturar el prototipo/MVP con: nombre, tipo (concept/wireframe/mockup/mvp/physical/digital/service), descripcion, hipotesis a validar, metricas de aprendizaje | Alta |
| RF-40 | El sistema debe soportar enlaces multimedia: imagen URL, video URL, enlace externo (Figma, Canva, etc.) | Media |
| RF-41 | El sistema debe generar sugerencias de MVP con IA | Media |
| RF-42 | El sistema debe capturar la estrategia de validacion con: hipotesis, segmentos objetivo, metodos (entrevista/encuesta/landing page/test A-B/observacion/focus group/prueba de prototipo), aprendizajes esperados, criterios de exito | Alta |
| RF-43 | El sistema debe capturar estimados de tiempo (semanas) y presupuesto para la validacion | Media |
| RF-44 | El sistema debe mapear el ecosistema de actores con: nombre, tipo (financiero/academico/empresarial/social/institucional), tipos de apoyo (7 categorias), beneficios bidireccionales y estado de relacion | Alta |

#### Paso 7: Impacto y Cierre (Reflexion + Evaluacion IA + Exportacion)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-45 | El sistema debe capturar la reflexion de sostenibilidad en 3 areas: balance de impacto social/ambiental/economico, decisiones de sostenibilidad, estrategia de escalamiento con proposito | Alta |
| RF-46 | El sistema debe requerir minimo 200 caracteres por area de reflexion | Media |
| RF-47 | El sistema debe generar reflexiones de sostenibilidad con IA | Media |
| RF-48 | El sistema debe permitir exportar el proyecto completo a PDF profesional | Alta |
| RF-49 | El sistema debe permitir exportar el proyecto completo a presentacion PowerPoint (PPTX) | Alta |

### 2.6 Navegacion y Progreso

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-50 | El sistema debe implementar un wizard de 7 pasos consolidados con sidebar de navegacion | Alta |
| RF-51 | El sistema debe calcular y mostrar progreso por paso y progreso general | Alta |
| RF-52 | El sistema debe bloquear pasos posteriores hasta completar los anteriores (progresion secuencial) | Alta |
| RF-53 | El sistema debe permitir navegar libremente entre pasos desbloqueados | Alta |
| RF-54 | El sistema debe mostrar tabs dentro de pasos que contienen multiples sub-pasos | Alta |
| RF-55 | El sistema debe auto-guardar datos con debounce de 600ms | Alta |
| RF-56 | El sistema debe mostrar indicador visual de guardado en curso | Media |

### 2.7 Exportacion

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-57 | La exportacion PDF debe incluir todos los datos de los 13 pasos originales: medios, problema, tendencias, ideacion, buyer persona, canvas VP, canvas sostenible, patrones, prototipo, validacion, ecosistema, reflexion y evaluacion IA | Alta |
| RF-58 | La exportacion PPTX debe generar slides profesionales con resumen ejecutivo y todos los modulos | Alta |
| RF-59 | Las exportaciones deben usar formato de fecha en espanol | Media |
| RF-60 | Las exportaciones deben estar disponibles unicamente cuando hay datos suficientes | Media |

### 2.8 Generacion con IA

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-61 | El sistema debe integrar OpenAI GPT-4 Turbo y GPT-4o para generacion de contenido | Alta |
| RF-62 | El sistema debe generar ideas de negocio (5+) basadas en el inventario de medios del emprendedor | Alta |
| RF-63 | El sistema debe generar bitacoras completas (13 pasos) a partir de una descripcion de idea | Alta |
| RF-64 | El sistema debe generar analisis FODA, puntajes de viabilidad y recomendaciones | Alta |
| RF-65 | El sistema debe generar contenido del canvas sostenible bloque por bloque | Alta |
| RF-66 | El sistema debe proveer datos mock/respaldo cuando la API de IA no este disponible | Alta |
| RF-67 | La temperatura de generacion debe ser 0.7 para equilibrar creatividad y coherencia | Baja |

---

## 3. Requerimientos No Funcionales

### 3.1 Rendimiento

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-01 | Tiempo de carga inicial | < 3 segundos con conexion broadband |
| RNF-02 | Auto-guardado | Debounce de 600ms para reducir escrituras a base de datos |
| RNF-03 | Tamano del bundle de produccion | CSS < 50KB gzipped, JS principal < 500KB gzipped |
| RNF-04 | Indices de base de datos | Todos los campos FK y de consulta frecuente deben estar indexados |
| RNF-05 | Carga de datos | Uso de Promise.allSettled para carga paralela de datos de sostenibilidad |
| RNF-06 | Estado del cliente | Gestion eficiente con Zustand (sin re-renders innecesarios) |

### 3.2 Seguridad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-07 | Autenticacion | Gestionada por Supabase Auth con tokens JWT |
| RNF-08 | Politicas RLS | Row Level Security habilitado en todas las tablas de Supabase |
| RNF-09 | Variables de entorno | API keys almacenadas en variables de entorno (VITE_OPENAI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) |
| RNF-10 | Proteccion de rutas | AuthGuard envuelve toda la aplicacion, sin acceso sin autenticacion |
| RNF-11 | Validacion de datos | Validacion con Zod en el cliente antes de enviar a la base de datos |

### 3.3 Usabilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-12 | Idioma | Interfaz completamente en espanol |
| RNF-13 | Diseno responsivo | Adaptable a mobile, tablet y desktop |
| RNF-14 | Sistema de diseno | Basado en Tailwind CSS con design tokens consistentes (colores, tipografia, espaciado) |
| RNF-15 | Feedback visual | Estados de carga, guardado, error y exito visibles al usuario |
| RNF-16 | Navegacion guiada | Wizard paso a paso con bloqueo progresivo y indicadores de progreso |
| RNF-17 | Tipografia | Inter (400, 500, 600, 700) como fuente principal |
| RNF-18 | Animaciones | Transiciones suaves: fadeIn (150ms), slideUp (400ms) |
| RNF-19 | Sidebar responsive | Sidebar colapsable en mobile con overlay y boton flotante |

### 3.4 Disponibilidad y Confiabilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-20 | Fallback de IA | Si la API de OpenAI falla, el sistema genera datos mock realistas |
| RNF-21 | Manejo de errores | Try-catch en todas las operaciones asincronas con feedback al usuario |
| RNF-22 | Persistencia local | Estado critico (equipo, bitacora, idea actual) persistido en localStorage |
| RNF-23 | Suscripcion en tiempo real | Soporte para suscripciones de Supabase para actualizaciones en vivo |
| RNF-24 | Limpieza de datos | Eliminacion en cascada y limpieza de datos huerfanos |

### 3.5 Mantenibilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-25 | Stack tecnologico | React 18 + TypeScript 5.2 + Vite 5.2 |
| RNF-26 | Gestion de estado | Zustand 4.4.7 con persist middleware |
| RNF-27 | Componentes | Componentes funcionales con hooks, arquitectura modular |
| RNF-28 | Validacion | Esquemas Zod reutilizables para cada paso |
| RNF-29 | Base de datos | Supabase (PostgreSQL) con migraciones SQL versionadas |
| RNF-30 | Linting | ESLint configurado con reglas de TypeScript |

### 3.6 Escalabilidad

| ID | Requerimiento | Especificacion |
|----|---------------|----------------|
| RNF-31 | Multi-usuario | Soporte para multiples usuarios con equipos independientes |
| RNF-32 | Multi-bitacora | Sin limite de bitacoras por usuario |
| RNF-33 | Multi-idea | Sin limite de ideas por bitacora |
| RNF-34 | Infraestructura | Backend en la nube via Supabase (auto-escalable) |
| RNF-35 | API stateless | Diseno sin estado en el servidor, estado gestionado en el cliente |

---

## 4. Modelo de Datos

### 4.1 Relaciones Principales

```
teams (1) ──→ (N) journals (1) ──→ (N) ideas
                                        │
                    ┌───────────────────┤
                    ↓                   ↓
              step1_means          step2_problem
              step3_trends         step4_ideas
              step4_idea_evaluation
              step5_buyer          step5_vpcanvas
              sustainable_canvas   innovation_patterns
              prototypes           validation_strategies
              ecosystem_actors     sustainability_reflections
```

### 4.2 Tablas del Sistema

| Tabla | Descripcion | FK Principal |
|-------|-------------|--------------|
| teams | Equipos/workspaces | created_by → users |
| journals | Bitacoras de oportunidades | team_id → teams |
| ideas | Ideas de negocio | journal_id → journals |
| step1_means | Inventario de medios | idea_id → ideas |
| step2_problem | Definicion del problema | idea_id → ideas |
| step3_trends | Tendencias del mercado | idea_id → ideas |
| step4_ideas | Ideas generadas | journal_id → journals |
| step4_idea_evaluation | Evaluacion FODA | idea_id → ideas |
| step5_buyer | Buyer persona | idea_id → ideas |
| step5_vpcanvas | Canvas de propuesta de valor | idea_id → ideas |
| sustainable_canvas | Canvas sostenible de 14 bloques | idea_id → ideas |
| innovation_patterns | Patrones de innovacion | idea_id → ideas |
| prototypes | Prototipos y MVPs | idea_id → ideas |
| validation_strategies | Estrategias de validacion | idea_id → ideas |
| ecosystem_actors | Actores del ecosistema | idea_id → ideas |
| sustainability_reflections | Reflexion de sostenibilidad | idea_id → ideas |
| activity_log | Registro de actividad | journal_id → journals |

---

## 5. Stack Tecnologico

| Categoria | Tecnologia | Version |
|-----------|------------|---------|
| Frontend | React | 18.2.0 |
| Lenguaje | TypeScript | 5.2.2 |
| Build Tool | Vite | 5.2.0 |
| Estado | Zustand | 4.4.7 |
| CSS | Tailwind CSS | 3.4.1 |
| Iconos | Lucide React | 0.344.0 |
| Formularios | React Hook Form | 7.49.3 |
| Validacion | Zod | 3.22.4 |
| Backend | Supabase | 2.39.7 |
| IA | OpenAI GPT-4 | API v1 |
| PDF | jsPDF | 2.5.2 |
| PPTX | pptxgenjs | 4.0.1 |
| Fechas | date-fns | 3.2.0 |

---

## 6. Variables de Entorno Requeridas

```
VITE_OPENAI_API_KEY      # Clave de API de OpenAI
VITE_SUPABASE_URL        # URL del proyecto Supabase
VITE_SUPABASE_ANON_KEY   # Clave anonima de Supabase
```

---

## 7. Flujo Principal del Usuario

```
1. Registro/Login (email+password o magic link)
2. HomePage: Ver bitacoras existentes o crear nueva
3. Seleccionar bitacora → Entra al Wizard de 7 pasos
4. Paso 1: Generar idea con IA o crear manualmente
5. Paso 2: Definir recursos personales y problema
6. Paso 3: Analizar tendencias y realizar FODA
7. Paso 4: Perfilar cliente y disenar propuesta de valor
8. Paso 5: Construir canvas sostenible y seleccionar patrones
9. Paso 6: Disenar MVP, planificar validacion y mapear ecosistema
10. Paso 7: Reflexion de sostenibilidad + Evaluacion IA + Exportar
11. Exportar a PDF o PPTX
```
