# Bitácora de Oportunidades - Análisis Efectual

Una aplicación web para analizar oportunidades de negocio usando **metodología efectual**, desarrollada con React, TypeScript y Supabase.

## 🎯 ¿Qué es la Metodología Efectual?

La **efectuación** es una lógica de razonamiento empresarial desarrollada por Saras Sarasvathy que estudia cómo los emprendedores expertos toman decisiones bajo incertidumbre. A diferencia del enfoque tradicional (causal) que parte de un objetivo y busca los medios, la efectuación parte de los medios disponibles y explora qué objetivos se pueden alcanzar.

### Principios Fundamentales:

1. **Medios vs Objetivos**: Partir de lo que tienes, no de lo que quieres
2. **Pérdida aceptable**: Determinar cuánto puedes permitirte perder
3. **Aprovechamiento de contingencias**: Convertir sorpresas en oportunidades
4. **Alianzas estratégicas**: Crear el futuro con otros stakeholders
5. **Control del futuro**: Crear el mercado en lugar de predecirlo

## 📋 Los 5 Pasos del Análisis

### Paso 1: Medios Personales 🧑‍💼

**Propósito**: Inventariar los recursos actuales del equipo emprendedor.

**Metodología Efectual**: En lugar de partir de una idea preconcebida, comenzamos identificando:
- **Quién soy**: Identidad, experiencia, habilidades personales
- **Qué sé**: Conocimientos técnicos, industrias, dominios de expertise  
- **A quién conozco**: Red de contactos, mentores, clientes potenciales
- **Qué tengo**: Recursos financieros, tecnológicos, físicos disponibles

**¿Por qué es importante?**: Los emprendedores efectuales exitosos construyen sobre sus medios existentes en lugar de adquirir recursos externos. Esto reduce riesgo y aumenta velocidad de ejecución.

**Criterios de completitud**: Al menos 2 miembros del equipo han documentado sus medios personales.

---

### Paso 2: Problema o Necesidad 🎯

**Propósito**: Identificar y validar un problema específico que conecte con los medios disponibles.

**Metodología Efectual**: A diferencia del enfoque tradicional (encontrar un gran mercado), la efectuación busca problemas que:
- **Se conecten directamente** con los medios identificados en el Paso 1
- **Sean accesibles** con los recursos actuales del equipo
- **Permitan acción inmediata** sin requerir recursos externos masivos

**Elementos requeridos**:
- **Título**: Descripción concisa del problema (min. 1 carácter)
- **Descripción**: Explicación detallada del problema (min. 200 caracteres)
- **Afectados**: Quiénes sufren este problema (min. 200 caracteres)  
- **Relevancia**: Por qué es importante resolver esto ahora (min. 200 caracteres)
- **Vínculo con medios**: Cómo se conecta con los recursos del Paso 1 (min. 200 caracteres)

---

### Paso 3: Tendencias 📈

**Propósito**: Identificar fuerzas del entorno que pueden influir en el problema o crear nuevas oportunidades.

**Metodología Efectual**: Los emprendedores efectuales son excelentes aprovechando contingencias. Las tendencias representan:
- **Vientos de cola**: Fuerzas que pueden acelerar la solución
- **Contingencias potenciales**: Cambios inesperados que pueden convertirse en oportunidades
- **Contexto de decisión**: Información del entorno para decisiones más informadas

**Tipos de tendencias**:
- **Social**: Cambios en comportamientos y valores sociales
- **Tecnológica**: Innovaciones y avances técnicos emergentes
- **Ambiental**: Sostenibilidad y conciencia medioambiental
- **Cultural**: Evolución de costumbres y tradiciones
- **Consumo**: Nuevos patrones de compra y preferencias

**Criterios de completitud**: Mínimo 3 tendencias válidas (nombre, tipo, descripción, ejemplo). La fuente es opcional pero recomendada.

---

### Paso 4: Ideación 💡

**Propósito**: Generar múltiples alternativas de solución y seleccionar una usando criterios efectuales.

**Metodología Efectual**: En lugar de buscar "la idea perfecta", generamos un portafolio de opciones y seleccionamos basándose en:
- **Pérdida aceptable**: ¿Cuánto podemos permitirnos perder?
- **Medios disponibles**: ¿Qué podemos hacer con lo que tenemos?
- **Alianzas potenciales**: ¿Quién se sumaría a esta idea?

**Elementos requeridos**:
- **Mínimo 5 ideas** diferentes
- **Clasificación**: Tipo de solución (producto, servicio, plataforma, etc.)
- **Nivel de innovación**: Incremental vs Radical
- **Factibilidad**: Alta, Media, Baja (basada en medios actuales)
- **Selección**: Exactamente 1 idea seleccionada
- **Justificación**: Explicación de por qué esta idea (min. 200 caracteres)

---

### Paso 5: Usuario y Propuesta de Valor 👥

**Propósito**: Definir el primer cliente específico y la propuesta de valor mínima viable.

**Metodología Efectual**: En lugar de definir "mercados objetivo" amplios, la efectuación se enfoca en:
- **Primer cliente específico**: Una persona real con la que puedes hablar
- **Co-creación**: Desarrollar la solución CON el cliente, no PARA el cliente
- **Compromiso previo**: Buscar que el cliente se comprometa antes de construir

#### 5A. Buyer Persona Específico
- **Nombre**: Persona específica o arquetipo muy concreto
- **Edad**: Rango etario específico
- **Ocupación**: Trabajo o rol específico
- **Motivaciones**: Qué lo mueve en relación al problema
- **Frustraciones**: Dolores específicos que experimenta
- **Necesidades**: Qué necesita para resolver su problema

#### 5B. Value Proposition Canvas
- **Trabajos del cliente**: Tareas funcionales, emocionales y sociales
- **Dolores del cliente**: Obstáculos, riesgos, frustraciones
- **Alegrías del cliente**: Beneficios esperados, deseos, necesidades
- **Productos/Servicios**: Qué específicamente ofrecemos
- **Aliviadores de dolor**: Cómo reducimos/eliminamos dolores
- **Generadores de alegría**: Cómo creamos beneficios positivos

## 🚀 Características

- ✅ **Proceso secuencial**: Cada paso bloquea el siguiente hasta cumplir los mínimos requeridos
- ✅ **Multi-equipo y multi-usuario**: Colaboración en tiempo real
- ✅ **Guardado automático**: Sincronización automática cada 600ms
- ✅ **Progreso visual**: Semáforos y barras de progreso por paso
- ✅ **Validación estricta**: Cumple exactamente con la rúbrica EAN
- ✅ **Exportación PDF**: Genera informes completos
- ✅ **Autenticación**: Email/password + magic link
- ✅ **Real-time**: Colaboración en vivo con Supabase Realtime

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** + **Vite** + **TypeScript**
- **TailwindCSS** para estilos
- **Zustand** para manejo de estado
- **React Hook Form** + **Zod** para formularios y validación
- **Lucide React** para iconos

### Backend & Base de Datos
- **Supabase** (PostgreSQL + Auth + Realtime)
- **Row Level Security (RLS)** para seguridad
- **Edge Functions** para exportación PDF

### Deployment
- **Vercel** (frontend)
- **Supabase** (backend)

## 📋 Requisitos Previos

- **Node.js** 20.19.0 o superior
- **npm** 10.2.4 o superior
- Cuenta en **Supabase**
- Cuenta en **Vercel** (para deployment)

## 🔧 Configuración Local

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd bitacora-oportunidades
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script SQL en `supabase-schema.sql` en el SQL Editor
3. Copiar las credenciales del proyecto

### 4. Variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3020`

## 🗄️ Base de Datos

### Modelo de Datos

```sql
-- Equipos y miembros
teams(id, name, created_by, created_at)
team_members(id, team_id, user_id, role, joined_at)

-- Bitácoras
journals(id, team_id, title, status, progress, updated_at)

-- Datos por paso
step1_means(id, journal_id, member_id, who_i_am, what_i_know, who_i_know, what_i_have)
step2_problem(id, journal_id, title, description, affected, relevance, link_to_means)
step3_trends(id, journal_id, name, type, brief, example, source_apa, comment)
step4_ideas(id, journal_id, idea, kind, innovation_level, feasibility, selected, justification)
step5_buyer(id, journal_id, name, age, occupation, motivations, pains, needs)
step5_vpcanvas(id, journal_id, customer_jobs, customer_pains, customer_gains, products_services, pain_relievers, gain_creators)

-- Auditoría
activity_log(id, journal_id, member_id, step, field, old_value, new_value, ts)
```

### Configuración de Supabase

1. **Ejecutar Schema**: Copiar y ejecutar todo el contenido de `supabase-schema.sql` en el SQL Editor de Supabase
2. **Configurar Auth**: 
   - Habilitar Email Auth
   - Configurar Magic Link
   - Opcional: configurar OAuth providers
3. **Configurar RLS**: Las políticas están incluidas en el schema
4. **Realtime**: Se configura automáticamente

## 🎨 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/           # Autenticación
│   ├── home/           # Página principal
│   ├── layout/         # Layout y header
│   ├── steps/          # Componentes de los 5 pasos
│   └── wizard/         # Layout del wizard
├── lib/
│   ├── validators/     # Validadores Zod por paso
│   ├── progress/       # Cálculo de progreso
│   └── utils.ts        # Utilidades
├── store/              # Zustand stores
└── types/              # Tipos TypeScript
```

## 📏 Reglas de Validación

### Paso 1: Medios Personales
- Al menos 2 miembros del equipo deben completar al menos un campo
- Campos: Quién soy, Qué sé, A quién conozco, Qué tengo

### Paso 2: Problema o Necesidad
- Título requerido
- Descripción, afectados, relevancia y vínculo: mínimo 200 caracteres cada uno

### Paso 3: Tendencias
- **Mínimo 3 tendencias** (puedes agregar más dinámicamente)
- Cada una con: nombre, tipo, descripción y ejemplo obligatorios
- Fuente opcional pero recomendada para credibilidad
- Tipos: Social, Tecnológica, Ambiental, Cultural, Consumo

### Paso 4: Ideación
- Mínimo 5 ideas válidas
- Exactamente 1 idea seleccionada
- Justificación de selección: mínimo 200 caracteres

### Paso 5: Usuario y Propuesta de Valor
- **Buyer Persona**: todos los campos obligatorios
- **Canvas VP**: 6 bloques completos (cliente + propuesta)

## 🚀 Deployment

### Vercel (Recomendado)

1. **Fork del repositorio** en GitHub
2. **Conectar con Vercel**:
   ```bash
   npm i -g vercel
   vercel --prod
   ```
3. **Configurar variables de entorno** en Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Netlify (Alternativo)

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Variables de entorno**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Manual

```bash
npm run build
# Subir contenido de dist/ a tu hosting
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Linting
npm run lint

# Type checking
npm run type-check
```

## 👥 Roles de Usuario

- **Owner**: Creador del equipo, puede gestionar miembros
- **Member**: Puede editar todos los pasos
- **Viewer**: Solo lectura

## 🔒 Seguridad

- **Row Level Security (RLS)**: Los usuarios solo ven datos de sus equipos
- **Validación en frontend y backend**
- **Sanitización de inputs**
- **Autenticación requerida para todas las operaciones**

## 🎯 Funcionalidades Avanzadas

### Colaboración en Tiempo Real
- Presencia de usuarios activos
- Sincronización automática de cambios
- Indicadores visuales de actividad

### Exportación PDF
- Genera PDFs completos con toda la información
- Incluye portada con datos del equipo
- Referencias APA del paso 3
- Solo disponible cuando el progreso es 100%

### Historial de Cambios
- Log de actividad por campo modificado
- Trazabilidad completa de cambios
- Identificación del autor

## 🚨 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verificar que las variables estén en `.env`
- Verificar que estén prefijadas con `VITE_`

### Error: "Database connection failed"
- Verificar URL y API key de Supabase
- Verificar que RLS esté configurado correctamente

### Error: "Validation failed"
- Revisar que los datos cumplan los requisitos mínimos
- Verificar conteos exactos (5 tendencias, etc.)

### Error de permisos
- Verificar que el usuario sea miembro del equipo
- Verificar políticas RLS en Supabase

## 📈 Roadmap

- [ ] **Notificaciones push** para cambios importantes
- [ ] **Integración con LMS** (Moodle, Canvas)
- [ ] **Exportación a Word/Excel**
- [ ] **Templates** de bitácoras
- [ ] **Analytics** de uso y progreso
- [ ] **Comentarios** en línea
- [ ] **Versioning** de bitácoras

## 🤝 Contribuir

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es propiedad de la Universidad EAN y está destinado exclusivamente para uso educativo en el curso "Herramientas básicas de innovación".

## 📚 Referencias Académicas

### Metodología Efectual
- Sarasvathy, S. (2001). **Causation and Effectuation: Toward a Theoretical Shift from Economic Inevitability to Entrepreneurial Contingency**. Academy of Management Review, 26(2), 243-263.
- Read, S., Sarasvathy, S., Dew, N., Wiltbank, R. (2016). **Effectual Entrepreneurship**. Routledge.
- Sarasvathy, S. (2008). **Effectuation: Elements of Entrepreneurial Expertise**. Edward Elgar Publishing.

### Value Proposition Canvas
- Osterwalder, A., Pigneur, Y. (2010). **Business Model Generation**. John Wiley & Sons.
- Osterwalder, A., Pigneur, Y., Bernarda, G., Smith, A. (2014). **Value Proposition Design**. John Wiley & Sons.

### Buyer Persona
- Cooper, A. (1999). **The Inmates Are Running the Asylum**. Macmillan.
- Revella, A. (2015). **Buyer Personas: How to Gain Insight into your Customer's Expectations**. John Wiley & Sons.

## 🤝 Contribuir

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT para uso educativo y de investigación.

---

**Bitácora de Oportunidades - Análisis Efectual**  
*Desarrollado con ❤️ usando metodología efectual*
