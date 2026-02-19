import { z } from 'zod';

export const devotionalSchema = z.object({
  title: z.string().min(3, "El título es muy corto").max(100, "El título es muy largo"),
  verse_text: z.string().min(5, "El versículo es requerido"),
  verse_reference: z.string().min(3, "La referencia es requerida"),
  reflection_content: z.string().min(10, "La reflexión debe tener contenido"),
  prayer_content: z.string().min(5, "La oración es requerida"),
  image_url: z.string().url("Debe ser una URL válida").optional().nullable(),
  story_title: z.string().min(3, "El título de la historia es requerido").optional().or(z.literal('')),
  story_content: z.string().min(10, "La historia debe tener contenido").optional().or(z.literal('')),
});

export const activitySchema = z.object({
  drive_url: z.string().url("Debe ser una URL válida de Google Drive").optional().or(z.literal('')),
  is_configured: z.boolean().default(false),
});

export const progressSchema = z.object({
  monthId: z.number().min(1).max(12),
  dayNumber: z.number().min(1).max(31),
  currentStatus: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().email("Debe ser un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
