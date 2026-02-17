/* ── Shared Devotional Data Store ──
 * Uses localStorage to persist data.
 * Both admin (editor) and user (viewer) read/write from the same keys.
 */

export interface DayData {
  emoji: string;
  theme: string;
  verseText: string;
  verseRef: string;
  devotional: string;
  prayer: string;
}

export interface MonthData {
  month: string;
  emoji: string;
  phrase: string;
  color: string;
  days: number;
}

/* ── Month metadata ── */
export const MONTHS: MonthData[] = [
  { month: 'ENERO', emoji: '❄️', phrase: 'Dios me cuida', color: 'bg-blue-100', days: 31 },
  { month: 'FEBRERO', emoji: '❤️', phrase: 'El amor de Dios', color: 'bg-pink-200', days: 29 },
  { month: 'MARZO', emoji: '🌷', phrase: 'Nueva vida en Cristo', color: 'bg-pink-200', days: 31 },
  { month: 'ABRIL', emoji: '🌸', phrase: 'Promesas de Dios', color: 'bg-purple-100', days: 30 },
  { month: 'MAYO', emoji: '🌼', phrase: 'Creciendo en fe', color: 'bg-orange-50', days: 31 },
  { month: 'JUNIO', emoji: '🌻', phrase: 'La luz de Jesús', color: 'bg-yellow-100', days: 30 },
  { month: 'JULIO', emoji: '💧', phrase: 'Descanso en Dios', color: 'bg-blue-100', days: 31 },
  { month: 'AGOSTO', emoji: '⭐', phrase: 'Brillando para Dios', color: 'bg-green-100', days: 31 },
  { month: 'SEPTIEMBRE', emoji: '📖', phrase: 'Aprendiendo de Dios', color: 'bg-yellow-100', days: 30 },
  { month: 'OCTUBRE', emoji: '🍂', phrase: 'Gratitud y alabanza', color: 'bg-orange-100', days: 31 },
  { month: 'NOVIEMBRE', emoji: '🕯️', phrase: 'Oración y fe', color: 'bg-amber-100', days: 30 },
  { month: 'DICIEMBRE', emoji: '🎄', phrase: 'Celebrando a Jesús', color: 'bg-green-100', days: 31 },
];

export const MONTH_NAMES_LOWER: Record<string, string> = {
  ENERO: 'enero', FEBRERO: 'febrero', MARZO: 'marzo', ABRIL: 'abril',
  MAYO: 'mayo', JUNIO: 'junio', JULIO: 'julio', AGOSTO: 'agosto',
  SEPTIEMBRE: 'septiembre', OCTUBRE: 'octubre', NOVIEMBRE: 'noviembre',
  DICIEMBRE: 'diciembre',
};

/* ── Default day emojis cycling ── */
const DEFAULT_EMOJIS = [
  '❤️', '⭐', '🌈', '🦋', '🌻', '🌹', '🌸', '🙏', '✨', '💖',
  '❤️', '⭐', '🌈', '🦋', '🌺', '🌻', '🌼', '🙏', '✨', '❤️',
  '💖', '⭐', '🌈', '🦋', '🌺', '🌻', '🌸', '🙏', '✨', '❤️', '❤️',
];

const DEFAULT_THEMES = [
  'Amor', 'Fe', 'Esperanza', 'Alegría', 'Paz', 'Bondad', 'Gratitud',
  'Valentía', 'Confianza', 'Gracia', 'Paciencia', 'Perdón', 'Verdad',
  'Sabiduría', 'Humildad', 'Compasión', 'Fortaleza', 'Obediencia',
  'Amistad', 'Generosidad', 'Fidelidad', 'Adoración', 'Gozo',
  'Oración', 'Servicio', 'Luz', 'Bendición', 'Misericordia',
  'Alabanza', 'Renovación', 'Libertad',
];

const DEFAULT_VERSES = [
  { text: 'En el principio creó Dios los cielos y la tierra.', ref: 'Génesis 1:1' },
  { text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.', ref: 'Juan 3:16' },
  { text: 'Jehová es mi pastor; nada me faltará.', ref: 'Salmos 23:1' },
  { text: 'Todo lo puedo en Cristo que me fortalece.', ref: 'Filipenses 4:13' },
  { text: 'Confía en Jehová con todo tu corazón.', ref: 'Proverbios 3:5' },
  { text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz.', ref: 'Jeremías 29:11' },
  { text: 'El Señor es mi luz y mi salvación, ¿de quién temeré?', ref: 'Salmos 27:1' },
  { text: 'Sed fuertes y valientes; no temáis ni os asustéis.', ref: 'Josué 1:9' },
  { text: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.', ref: 'Salmos 119:105' },
  { text: 'Dad gracias en todo, porque esta es la voluntad de Dios.', ref: '1 Tesalonicenses 5:18' },
  { text: 'Yo soy el camino, la verdad y la vida.', ref: 'Juan 14:6' },
  { text: 'Estad quietos y conoced que yo soy Dios.', ref: 'Salmos 46:10' },
  { text: 'Amarás al Señor tu Dios con todo tu corazón.', ref: 'Mateo 22:37' },
  { text: 'Los que esperan en Jehová tendrán nuevas fuerzas.', ref: 'Isaías 40:31' },
  { text: 'No temas, porque yo estoy contigo.', ref: 'Isaías 41:10' },
];

const DEFAULT_DEVOTIONALS = [
  'Dios creó todo lo que existe con amor. Tú también eres parte de su maravillosa creación 🌟. Recuerda que cada nuevo día es un regalo de Dios ✨ para aprender algo especial sobre Su amor 💕.',
  'Dios nos ama tanto que envió a Su Hijo Jesús para estar cerca de nosotros 💖. Hoy es un día perfecto para decirle a alguien cuánto lo quieres ✨.',
  'Así como un pastor cuida a sus ovejas, Dios te cuida a ti en todo momento 🌈. Nunca estás solo porque Él siempre está contigo 💕.',
  'Con la ayuda de Jesús puedes hacer cosas increíbles 🌟. No importa lo difícil que parezca algo, Él te da fuerzas ✨ para lograrlo 💪.',
  'Dios quiere que confíes en Él con todo tu corazón 💖. Cuando no entiendas algo, recuerda que Él tiene un plan maravilloso para ti 🌈.',
  'Dios tiene planes increíbles para tu vida 🌟. Cada día es una nueva oportunidad para descubrir lo que Él tiene preparado para ti ✨.',
  'Dios es tu luz en los momentos oscuros 💡. Cuando tengas miedo, recuerda que Él está contigo y te protege 🛡️.',
];

const DEFAULT_PRAYERS = [
  'Querido Dios 🙏, gracias por este nuevo día ✨. Ayúdame a confiar en Ti en todo momento 💖. Que mi vida brille con Tu luz 🌟 y refleje Tu amor a los demás 💕. En el nombre de Jesús, amén 🌈.',
  'Señor Jesús 🙏, gracias por Tu amor infinito 💕. Ayúdame a ser amable y generoso con todos ✨. Quiero seguir Tus pasos cada día 🌟. Amén 🌈.',
  'Papito Dios 🙏, gracias por cuidarme siempre 💖. Dame valentía para hacer lo correcto ✨ y sabiduría para tomar buenas decisiones 🌟. Te amo mucho 💕. Amén 🌈.',
  'Querido Jesús 🙏, hoy quiero darte gracias por mi familia y amigos ✨. Ayúdame a ser una bendición para los que me rodean 💖. En Tu nombre, amén 🌈.',
  'Dios todopoderoso 🙏, Tú eres mi fortaleza ✨. Ayúdame a no tener miedo 💪 y a confiar siempre en Tu poder 🌟. Gracias por estar conmigo 💕. Amén 🌈.',
];

/* ── Helper: generate default data for a day ── */
function getDefaultDayData(day: number): DayData {
  const i = day - 1;
  const verse = DEFAULT_VERSES[i % DEFAULT_VERSES.length];
  return {
    emoji: DEFAULT_EMOJIS[i % DEFAULT_EMOJIS.length],
    theme: DEFAULT_THEMES[i % DEFAULT_THEMES.length],
    verseText: verse.text,
    verseRef: verse.ref,
    devotional: DEFAULT_DEVOTIONALS[i % DEFAULT_DEVOTIONALS.length],
    prayer: DEFAULT_PRAYERS[i % DEFAULT_PRAYERS.length],
  };
}

/* ── Storage key ── */
function storageKey(month: string, day: number) {
  return `devo_${month}_${day}`;
}

function monthPhraseKey(month: string) {
  return `devo_phrase_${month}`;
}

/* ── Public API ── */

/** Get day data (from localStorage or defaults) */
export function getDayData(month: string, day: number): DayData {
  if (typeof window === 'undefined') return getDefaultDayData(day);
  try {
    const stored = localStorage.getItem(storageKey(month, day));
    if (stored) return JSON.parse(stored) as DayData;
  } catch { /* ignore */ }
  return getDefaultDayData(day);
}

/** Save day data to localStorage */
export function saveDayData(month: string, day: number, data: DayData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(month, day), JSON.stringify(data));
}

/** Get the phrase for a month (custom or default) */
export function getMonthPhrase(month: string): string {
  if (typeof window === 'undefined') return MONTHS.find(m => m.month === month)?.phrase || '';
  try {
    const stored = localStorage.getItem(monthPhraseKey(month));
    if (stored) return stored;
  } catch { /* ignore */ }
  return MONTHS.find(m => m.month === month)?.phrase || '';
}

/** Save the phrase for a month */
export function saveMonthPhrase(month: string, phrase: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(monthPhraseKey(month), phrase);
}
