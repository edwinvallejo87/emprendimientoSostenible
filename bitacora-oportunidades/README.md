# Bitácora de Oportunidades - EAN

Una aplicación web completa para crear y colaborar en bitácoras de oportunidades del curso "Herramientas básicas de innovación" de la Universidad EAN.

## 🎯 Objetivo

Guiar a equipos a través de un proceso secuencial de 5 pasos obligatorios para identificar y desarrollar oportunidades de innovación:

1. **Medios Personales** (Teoría Efectual)
2. **Problema o Necesidad**
3. **Tendencias** (exactamente 5, con fuentes APA)
4. **Ideación** (≥5 ideas), clasificar y seleccionar 1
5. **Usuario y Propuesta de Valor** (Buyer Persona + Canvas)

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
- Cada miembro debe completar al menos un campo
- Campos: Quién soy, Qué sé, A quién conozco, Qué tengo

### Paso 2: Problema o Necesidad
- Título requerido
- Descripción, afectados, relevancia y vínculo: mínimo 200 caracteres cada uno

### Paso 3: Tendencias
- **Exactamente 5 tendencias** (ni más, ni menos)
- Cada una con: nombre, tipo, descripción, ejemplo y fuente APA obligatoria
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

## 📞 Soporte

Para soporte técnico o preguntas sobre el curso, contactar:
- **Email**: soporte-innovacion@ean.edu.co
- **Teams**: Canal "Bitácora de Oportunidades"

---

**Universidad EAN - Herramientas básicas de innovación**  
*Desarrollado con ❤️ para el aprendizaje de la innovación*
