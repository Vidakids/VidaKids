# ✨ VidaKids — Todo el año caminando con Dios

VidaKids es una aplicación web de devocionales diarios para niños. Ofrece **365 devocionales**, uno para cada día del año, con versículos bíblicos, mensajes de reflexión, oraciones y actividades interactivas para que los niños crezcan en su fe de una forma divertida y visual.

## 🎯 Características

### 👤 Vista de Usuario (`/dashboard`)
- **Calendario de meses** con emojis y frases únicas por mes
- **Vista de días** en grid de 7 columnas con estado de completado (✅ verde)
- **Detalle del día** con:
  - Emoji y tema del día
  - 📖 Versículo del día con referencia bíblica
  - 🔮 Mensaje devocional ("Para ti")
  - 🙏 Oración del día
  - Botones de acción: Completado, Lee la historia, Actividades
- **Breadcrumb** de navegación (Inicio → Mes → Día)
- Animaciones suaves con Framer Motion

### 🔧 Panel de Administración (`/admin`)
- **Gestión de usuarios**: crear, ver y eliminar usuarios con roles (admin/maestro)
- **Editor de contenido devocional**: editar por mes y día
  - Emoji, tema, versículo, mensaje devocional y oración
  - Vista previa en tiempo real
  - Navegación entre días
- **Gestión de actividades**: configurar enlaces de Google Drive por día/mes
- Interfaz con animaciones y diseño pastel

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework principal |
| **React 19** | UI components |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos |
| **Framer Motion** | Animaciones |
| **Shadcn/UI** | Componentes base |
| **react-icons** | Iconografía |

## 📝 Licencia

Proyecto desarrollado para VidaKids.
