import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- DATA DEL CLIENTE ---

const monthsData = [
  { id: 1, name: "Enero", emoji: "❄️", theme: "Dios me cuida", color: "#E3F2FD", days: 31 },
  { id: 2, name: "Febrero", emoji: "💕", theme: "El amor de Dios", color: "#FFE4F0", days: 28 }, 
  { id: 3, name: "Marzo", emoji: "🌷", theme: "Nueva vida en Cristo", color: "#FFE4E9", days: 31 },
  { id: 4, name: "Abril", emoji: "🌺", theme: "Promesas de Dios", color: "#F3E5F5", days: 30 },
  { id: 5, name: "Mayo", emoji: "🌼", theme: "Creciendo en fe", color: "#FFF8E1", days: 31 },
  { id: 6, name: "Junio", emoji: "☀️", theme: "La luz de Jesús", color: "#FFF9C4", days: 30 },
  { id: 7, name: "Julio", emoji: "💧", theme: "Descanso en Dios", color: "#E1F5FE", days: 31 },
  { id: 8, name: "Agosto", emoji: "⭐", theme: "Brillando para Dios", color: "#FFF3E0", days: 31 },
  { id: 9, name: "Septiembre", emoji: "📕", theme: "Aprendiendo de Dios", color: "#F8BBD0", days: 30 },
  { id: 10, name: "Octubre", emoji: "🍂", theme: "Gratitud y alabanza", color: "#FFE0B2", days: 31 },
  { id: 11, name: "Noviembre", emoji: "🙏", theme: "Oración y fe", color: "#F1E4F3", days: 30 },
  { id: 12, name: "Diciembre", emoji: "🎄", theme: "Celebrando a Jesús", color: "#E8F5E9", days: 31 }
];

const storyTemplates = {
    animals: ["osito 🐻", "mariposa 🦋", "conejito 🐰", "abejita 🐝", "pajarito 🐦", "tortuga 🐢", "zorro 🦊", "ardilla 🐿️", "delfín 🐬", "ovejita 🐑", "león 🦁", "jirafa 🦒", "elefante 🐘", "ballena 🐋", "pez luminoso 🐟✨", "hormiga 🐜", "búho 🦉", "paloma 🕊️", "gato 🐱", "perro 🐕"],
    actions: ["compartió con amor 💕", "voló alto hacia el cielo 🦋☁️", "habló con valentía 💪", "trabajó duro cada día 🌟", "cantó melodías hermosas 🎵", "perseveró sin rendirse ⭐", "usó su inteligencia 🧠✨", "guardó provisión sabiamente 🌰", "saltó de gozo 🎉", "se perdió pero fue encontrado 🔍💕", "rugió con fuerza 🦁", "ayudó desde su altura 🦒", "nunca olvidó las bendiciones 🐘💭", "protegió a los pequeños 🐋🛡️", "brilló en la oscuridad 🐟✨", "cargó su semilla con fe 🐜🌱", "escuchó primero antes de hablar 🦉👂", "llevó paz a todos 🕊️☮️", "exploró con curiosidad 🐱🔍", "esperó con fidelidad 🐕💖"],
    lessons: ["Compartir multiplica la alegría 🎉", "Confía en las capacidades que Dios te dio 💪✨", "El valor verdadero viene de Dios 🦁💖", "El trabajo constante trae frutos abundantes 🌳🍎", "Alabar a Dios alegra al mundo entero 🎵🌍", "La perseverancia siempre vence obstáculos ⭐💪", "Usa tu inteligencia para hacer el bien 🧠💕", "La generosidad siempre es bendecida 🌰✨", "La alegría pura es muy contagiosa 😊💖", "Jesús siempre nos busca cuando nos perdemos 🔍💕"]
};

const baseVerses = [
    { text: "En el principio creó Dios los cielos y la tierra.", ref: "Génesis 1:1" },
    { text: "El Señor es mi pastor, nada me faltará.", ref: "Salmos 23:1" },
    { text: "Esfuérzate y sé valiente; no temas ni desmayes.", ref: "Josué 1:9" },
    { text: "Porque tanto amó Dios al mundo que dio a su Hijo único.", ref: "Juan 3:16" },
    { text: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
    { text: "Confía en el Señor de todo corazón.", ref: "Proverbios 3:5" },
    { text: "El amor es paciente, es bondadoso.", ref: "1 Corintios 13:4" },
    { text: "Jesús le dijo: Yo soy el camino, la verdad y la vida.", ref: "Juan 14:6" },
    { text: "Pedid y se os dará; buscad y hallaréis.", ref: "Mateo 7:7" },
    { text: "No temas, porque yo estoy contigo.", ref: "Isaías 41:10" }
];

const prayerTemplates = [
    "Querido Dios 🙏, gracias por este nuevo día ✨. Ayúdame a confiar en Ti en todo momento 💖.",
    "Padre celestial ☁️, te alabo por Tu grandeza 🌟. Enséñame a ser valiente como Tú me llamas a ser 💪.",
    "Señor Jesús 💕, gracias por amarme tanto 💖. Ayúdame a compartir Tu amor con otros 🌸.",
    "Dios de amor 💗, te doy gracias por mi familia y amigos 👨👩👧👦. Protégenos y bendícenos hoy 🛡️.",
    "Padre bueno 🌟, gracias por cuidar de mí cada día ☀️. Ayúdame a crecer en fe 📖.",
    "Señor ✨, te alabo por ser mi pastor 🐑. Ayúdame a seguirte siempre 👣.",
    "Dios todopoderoso 🌟, gracias por Tu Palabra 📖 que me enseña 📚.",
    "Jesús amado 💕, gracias por ser mi mejor amigo 🤝. Ayúdame a hablar contigo siempre 🙏.",
    "Padre celestial ☁️, te doy gracias por la naturaleza hermosa 🌻🦋.",
    "Señor de amor 💗, gracias por escuchar mis oraciones 🙏. Ayúdame a confiar en Ti 💕."
];

const storyTitles = [
    "El Osito Generoso 🐻💕", "La Mariposa Valiente 🦋", "El Conejito Tímido 🐰", "La Abejita Trabajadora 🐝", "El Pajarito Cantor 🐦🎵",
    "La Tortuga Perseverante 🐢", "El Zorro Inteligente 🦊", "La Ardilla Previsora 🐿️", "El Delfín Alegre 🐬", "La Ovejita Perdida 🐑",
    "El León Fuerte 🦁", "La Jirafa Alta 🦒", "El Elefante Agradecido 🐘", "La Ballena Protectora 🐋", "El Pez Luminoso 🐟✨",
    "La Hormiga Constante 🐜", "El Búho Sabio 🦉", "La Paloma Pacificadora 🕊️", "El Gato Curioso 🐱", "El Perro Fiel 🐕"
];

const explanations = [
    "✨ Dios creó todo lo que existe con amor. Tú también eres parte de su maravillosa creación 🌟.",
    "🐑 Jesús cuida de ti como un pastor cuida a sus ovejas. Él siempre está contigo 💕.",
    "💪 Dios te da valentía para enfrentar cada día. No tengas miedo porque Él está contigo 🛡️.",
    "💖 El amor de Dios por ti es tan grande que envió a Jesús para salvarte. ¡Eres muy especial! 🌟",
    "⚡ Con Jesús a tu lado puedes lograr cosas maravillosas. Él te da la fuerza que necesitas 💪✨.",
    "🙏 Cuando confías en Dios con todo tu corazón, Él guía tus pasos hacia lo mejor 👣🌈.",
    "💕 Amar como Jesús significa ser amable y paciente con los demás cada día 🌸.",
    "🛤️ Jesús es como un mapa que te muestra el mejor camino para vivir feliz 🗺️✨.",
    "🙏 Dios escucha todas tus oraciones. Habla con Él y verás cómo te responde 💝.",
    "🤗 Nunca estás solo. Dios siempre está a tu lado cuidándote y protegiéndote 🛡️💖."
];

const dailyThemes = ["Amor 💕", "Fe ✨", "Esperanza 🌈", "Paz 🕊️", "Alegría 😊", "Bondad 💖", "Paciencia ⏳", "Perdón 🙏", "Gratitud 🙌", "Obediencia 📖"];

// --- FUNCIÓN PRINCIPAL ---

async function main() {
  console.log('🌱 Iniciando carga de datos CORREGIDA...');

  // 0. Limpiar tabla devotionals (TRUNCATE NO funciona con RLS activo normalmente, pero con service_role sí)
  // 0. Limpiar tabla devotionals
  console.log('🧹 Limpiando devotionals antiguos...');
  // Usamos un criterio seguro para borrar todo: day_number > 0
  const { error: deleteError } = await supabase.from('devotionals').delete().gt('day_number', 0); 
  if (deleteError) {
    console.error('Error limpiando devotionals:', deleteError.message);
  } else {
    console.log('✅ Devotionals limpiados.');
  }

  // 1. Insertar MESES
  console.log('📅 Insertando Meses...');
  for (const month of monthsData) {
    const { error } = await supabase
      .from('months')
      .upsert({ 
        id: month.id, 
        name: month.name, 
        theme: month.theme, 
        color_hex: month.color,
        icon_name: month.emoji
      }, { onConflict: 'id' });
    
    if (error) console.error(`Error mes ${month.name}:`, error.message);
  }

  // 2. Generar e Insertar DEVOCIONALES
  console.log('📖 Generando historias separadas...');
  
  let globalDayCounter = 0;

  for (const month of monthsData) {
    const devotionalsForMonth = [];

    for (let day = 1; day <= month.days; day++) {
      const idx = globalDayCounter;
      
      // Variables aleatorias (cíclicas)
      const animal = storyTemplates.animals[idx % storyTemplates.animals.length];
      const action = storyTemplates.actions[idx % storyTemplates.actions.length];
      const lesson = storyTemplates.lessons[idx % storyTemplates.lessons.length];
      const verse = baseVerses[idx % baseVerses.length];
      const prayer = prayerTemplates[idx % prayerTemplates.length];
      
      const storyTitle = storyTitles[idx % storyTitles.length]; // TÍTULO DEL CUENTO
      const explanation = explanations[idx % explanations.length]; // REFLEXIÓN
      const dailyTheme = dailyThemes[idx % dailyThemes.length]; // TEMA DEL DÍA
      const emoji = "⚡"; // Placeholder

      // Generar CUENTO separado
      const fullStory = `Había una vez un ${animal} que ${action}. Este pequeño amigo aprendió una lección muy importante sobre el amor infinito y la fidelidad de Dios. A través de su experiencia, descubrió que Dios siempre está presente 🙏, guiando cada paso del camino con Su luz divina ✨.\n\nLos desafíos que enfrentó se convirtieron en maravillosas oportunidades para crecer en fe 📖 y confianza 💪. Al final, comprendió que no estaba solo, sino acompañado por el amor infinito del Creador 💖.\n\nSu historia nos enseña que: ${lesson}`;

      devotionalsForMonth.push({
        month_id: month.id,
        day_number: day,
        title: dailyTheme,           // Campo 'title' = Tema (Ej: "Amor")
        emoji: emoji,                // Campo 'emoji' (Required in DB schema)
        theme: dailyTheme,           // Campo 'theme' (Redundant but required in DB schema)
        story_title: storyTitle,     // NUEVO: Título del Cuento (Ej: "El Osito...")
        story_content: fullStory,    // NUEVO: El cuento completo
        reflection_content: explanation, // Ahora esto es solo la explicación bíblica
        devotional_message: explanation, // Mapping to existing column if still used
        verse_text: verse.text,
        verse_ref: verse.ref,       // Note: DB uses verse_ref, seed logic used verse_reference in some places but mapped here
        prayer: prayer,             // DB column name is 'prayer', seed logic often uses 'prayer_content'
        prayer_content: prayer,     // Keeping both for safety/types
        image_url: null 
      });

      globalDayCounter++;
    }

    // Adjust keys to match exact DB schema from tipos.ts
    // DB: month_id, day_number, image_url, prayer_content, reflection_content, story_content, story_title, title, updated_at, verse_reference, verse_text
    const mappedDevotionals = devotionalsForMonth.map(d => ({
        month_id: d.month_id,
        day_number: d.day_number,
        // emoji: "✨", // REMOVED: Column does not exist
        // theme: d.theme, // REMOVED: Column does not exist
        verse_text: d.verse_text,
        verse_reference: d.verse_ref, // Mapped to correct column name
        reflection_content: d.reflection_content, // Mapped to correct column name
        // devotional_message: d.reflection_content, // REMOVED: Column does not exist
        prayer_content: d.prayer, // Mapped to correct column name
        // prayer: d.prayer, // REMOVED: Column does not exist
        // story_url: null, // REMOVED: Column does not exist
        story_title: d.story_title,
        story_content: d.story_content,
        title: d.title
    }));

    const { error } = await supabase.from('devotionals').upsert(mappedDevotionals, { onConflict: 'month_id,day_number' });
    
    if (error) {
        console.error(`❌ Error en ${month.name}:`, error.message);
    } else {
        console.log(`✅ ${month.name} completado.`);
    }
  }

  console.log('✨ ¡Base de datos actualizada con la estructura correcta!');
}

main();