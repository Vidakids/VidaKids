import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Service Role Key para saltarse RLS
);

// --- DATA DEL CLIENTE (ADAPTADA) ---

const monthsData = [
  { id: 1, name: "Enero", emoji: "❄️", theme: "Dios me cuida", color: "#E3F2FD", days: 31 },
  { id: 2, name: "Febrero", emoji: "💕", theme: "El amor de Dios", color: "#FFE4F0", days: 28 }, // Ajustar bisiesto si es necesario
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
    animals: ["osito 🐻", "mariposa 🦋", "conejito 🐰", "abejita 🐝", "pajarito 🐦", "tortuga 🐢", "zorro 🦊", "ardilla 🐿️", "delfín 🐬", "ovejita 🐑", "león 🦁", "jirafa 🦒", "elefante 🐘", "ballena 🐋", "pez luminoso 🐟✨", "hormiga 🐜", "búho 🦉", "paloma 🕊️", "gato 🐱", "perro 🐕", "oruga 🐛", "girasol 🌻", "rosa 🌹", "árbol 🌳", "estrella ⭐", "sol ☀️", "luna 🌙", "arcoíris 🌈", "nube ☁️", "río 🌊", "ratoncito 🐭", "golondrina 🐦", "cachorro 🐶", "conejos 🐰🐰", "pato 🦆", "mariquita 🐞", "grillo 🦗", "luciérnaga ✨", "cangrejo 🦀", "cordero 🐑", "semilla 🌱", "mariposa monarca 🦋👑", "gusano seda 🐛", "hormiga soldado 🐜⚔️", "caracol 🐌", "abeja reina 🐝👑", "pingüino 🐧", "estrella mar ⭐🌊", "camaleón 🦎", "libélula ✨", "murciélago 🦇", "castor 🦫", "rana 🐸", "pez payaso 🐠", "tortuga marina 🐢🌊", "colibrí 🐦✨", "halcón 🦅", "foca 🦭", "salmón 🐟", "mantis religiosa 🦗🙏", "búfalo 🦬", "nutria 🦦", "águila 🦅", "lobo 🐺", "oso 🐻", "cisne 🦢", "oruga peluda 🐛", "zorro plateado 🦊✨", "garza real 🦢"],
    actions: ["compartió con amor 💕", "voló alto hacia el cielo 🦋☁️", "habló con valentía 💪", "trabajó duro cada día 🌟", "cantó melodías hermosas 🎵", "perseveró sin rendirse ⭐", "usó su inteligencia 🧠✨", "guardó provisión sabiamente 🌰", "saltó de gozo 🎉", "se perdió pero fue encontrado 🔍💕", "rugió con fuerza 🦁", "ayudó desde su altura 🦒", "nunca olvidó las bendiciones 🐘💭", "protegió a los pequeños 🐋🛡️", "brilló en la oscuridad 🐟✨", "cargó su semilla con fe 🐜🌱", "escuchó primero antes de hablar 🦉👂", "llevó paz a todos 🕊️☮️", "exploró con curiosidad 🐱🔍", "esperó con fidelidad 🐕💖", "se transformó bellamente 🐛➡️🦋", "miró siempre al sol ☀️🌻", "creció entre espinas 🌹", "dio frutos abundantes 🌳🍎", "guió el camino estrecho ⭐🛤️", "salió cada día fielmente ☀️", "reflejó la luz divina 🌙✨", "apareció tras la tormenta 🌈⛈️", "llevó lluvia de bendición ☁️💧", "cantó fluyendo libremente 🌊🎵", "se refugió en lo seguro 🐭🏠", "construyó su nido con amor 🐦🏡", "ladró al ver su reflejo 🐶", "compartió su hogar 🐰🏡", "remó bajo el agua 🦆💧", "protegió su jardín 🐞🌺", "cantó en el silencio 🦗🎶", "brilló junto a otros ✨⭐", "encontró su caparazón perfecto 🦀🏠", "fue buscado con amor 🐑💕", "brotó despacio pero seguro 🌱", "rodeó la montaña con paciencia 🌊⛰️", "viajó miles de kilómetros 🦋🗺️", "se envolvió para transformarse 🐛🎁", "defendió su colonia unida 🐜⚔️", "llevó su casa siempre 🐌🏠", "trabajó unida con otras 🐝🤝", "sostuvo su huevo con amor 🐧🥚", "perdió un brazo pero creció otro ⭐🌊", "cambió de color sabiamente 🦎🎨", "salió del lodo hermosa 🦢💕", "fue juzgado por su apariencia 🦇", "construyó represas fuertes 🦫🏗️", "croaba avisos importantes 🐸📢", "vivió en su anémona segura 🐠🏡", "nadó miles de kilómetros 🐟🌊", "batió sus alas rapidísimo 🐦✨💨", "voló más alto que todos 🦅☁️", "descansó sabiamente 🦭💤", "nadó contra la corriente 🐟⬆️", "esperó inmóvil con paciencia 🦗", "enfrentó tormentas con fe 🦬⛈️", "jugó con alegría pura 🦦🎉", "empujó del nido con amor 🦅💕", "aulló llamando a su manada 🐺📢", "pescó con gran esfuerzo 🐻🐟", "nadó con elegancia 🦢✨", "caminó lenta pero constante 🐢", "fue diferente y especial 🐛✨", "se paró quieta y firme 🦢"],
    lessons: ["Compartir con amor 💕 multiplica la alegría 🎉", "Confía en las capacidades que Dios te dio 💪✨", "El valor verdadero viene de Dios 🦁💖", "El trabajo constante trae frutos abundantes 🌳🍎", "Alabar a Dios alegra al mundo entero 🎵🌍", "La perseverancia siempre vence obstáculos ⭐💪", "Usa tu inteligencia para hacer el bien 🧠💕", "La generosidad siempre es bendecida 🌰✨", "La alegría pura es muy contagiosa 😊💖", "Jesús siempre nos busca cuando nos perdemos 🔍💕", "La fuerza protege a los más débiles 🦁🛡️", "Tus dones sirven para ayudar a otros 🦒💝", "Un corazón agradecido es un corazón lleno 🐘💕", "El amor de Dios no tiene límites 🐋💖∞", "Brilla la luz de Cristo donde estés 🐟✨", "Dios te da fuerzas para cada tarea 🐜💪", "La sabiduría viene de escuchar primero 🦉👂", "Los pacificadores son hijos de Dios 🕊️☮️", "Buscar a Dios trae grandes tesoros 🐱🔍💎", "La fidelidad a Dios nunca falla 🐕💖✨", "Dios te transforma cuando confías en Él 🐛➡️🦋", "Mantén tus ojos fijos en Jesús ☀️🌻", "Las circunstancias no definen quién eres 🌹💪", "Alimentarse de la Palabra trae fruto 🌳📖", "Jesús guía tus pasos en la oscuridad ⭐🛤️", "Las misericordias de Dios son nuevas cada día ☀️🌅", "Refleja la gloria de Cristo en tu vida 🌙✨", "Dios cumple cada una de Sus promesas 🌈💯", "El Espíritu Santo refresca nuestra alma ☁️💧😌", "De ti fluyen ríos de agua viva 🌊💕", "Edificar sobre Cristo te mantiene firme 🐭🏠⛰️", "Busca profundo las riquezas de Dios 🐦💎", "Dios nos poda para que demos más fruto 🐞🌺✂️", "El camino estrecho lleva a la vida eterna 🦗🛤️✨", "Cristo es el único camino al Padre ✨⭐➡️", "Tu fe pequeña puede crecer enormemente 🦀🌱🌳", "La provisión de Dios llega a tiempo perfecto 🐑💕⏰", "Siembra bien y cosecharás abundancia 🌱🌾💚", "Cristo vale más que cualquier posesión 🌊💎", "Conocer a Cristo es la perla más preciosa 🦋👑💖", "Dios te ama y te busca 🐛🔍💕", "Trabajando unidos logramos más 🐜🤝💪", "En la oscuridad, Dios es tu luz 🐌✨", "Trabaja con excelencia para Dios 🐝⭐", "Cuida lo que Dios te confió 🐧💕🥚", "Dios restaura lo que se pierde ⭐🌊➡️💫", "El corazón importa más que la apariencia 🦎💖👀", "De la dificultad sale belleza 🦢💕🌸", "No juzgues por las apariencias 🦇🚫👁️", "Tu trabajo bendice a muchos 🦫🏗️🌟", "Usa lo que tienes para servir 🐸💪📢", "La amistad verdadera es mutua 🐠🏡💕", "Confía en Dios y suelta el control 🐟🌊🙏", "Cada uno tiene su propósito natural 🐦✨🎯", "Mantén una perspectiva celestial 🦅☁️👀", "El descanso es sabiduría divina 🦭💤😌", "Ir contra la corriente vale la pena 🐟⬆️💪", "La paciencia es una estrategia sabia 🦗⏳🧠", "Enfrenta todo con fe en Dios 🦬⛈️🙏", "Disfruta la vida que Dios te dio 🦦🎉💖", "Aprender a volar requiere valentía 🦅💕", "La comunidad es muy importante 🐺📢👥", "El fracaso es solo aprendizaje 🐻🐟📚", "Dios tiene un plan de belleza 🦢✨📋", "El tiempo de Dios es perfecto ⏰🐢", "Ser diferente es tu fortaleza 🐛✨💪", "La firmeza viene con paciencia 🦢⛰️"]
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
    { text: "No temas, porque yo estoy contigo.", ref: "Isaías 41:10" },
    { text: "Jehová es bueno, fortaleza en el día de la angustia.", ref: "Nahúm 1:7" },
    { text: "Ama a tu prójimo como a ti mismo.", ref: "Mateo 22:39" },
    { text: "Dios es amor.", ref: "1 Juan 4:8" },
    { text: "Porque Dios no nos ha dado espíritu de cobardía, sino de poder.", ref: "2 Timoteo 1:7" },
    { text: "Alégrate siempre en el Señor.", ref: "Filipenses 4:4" },
    { text: "Sean fuertes y valientes.", ref: "Deuteronomio 31:6" },
    { text: "Bendito el hombre que confía en Jehová.", ref: "Jeremías 17:7" },
    { text: "Jehová cumplirá su propósito en mí.", ref: "Salmos 138:8" },
    { text: "El que comenzó en vosotros la buena obra, la perfeccionará.", ref: "Filipenses 1:6" },
    { text: "Mira que te mando que te esfuerces y seas valiente.", ref: "Josué 1:9" }
];

const prayerTemplates = [
    "Querido Dios 🙏, gracias por este nuevo día ✨. Ayúdame a confiar en Ti en todo momento 💖. Que mi vida brille con Tu luz 🌟 y refleje Tu amor a los demás 💕. En el nombre de Jesús, amén 🌈.",
    "Padre celestial ☁️, te alabo por Tu grandeza 🌟. Enséñame a ser valiente como Tú me llamas a ser 💪. Guía mis pasos hoy y siempre 👣. En el nombre de Jesús, amén 🙏.",
    "Señor Jesús 💕, gracias por amarme tanto 💖. Ayúdame a compartir Tu amor con otros 🌸. Dame sabiduría para tomar buenas decisiones 🧠✨. En Tu nombre oro, amén 🙏.",
    "Dios de amor 💗, te doy gracias por mi familia y amigos 👨‍👩‍👧‍👦. Protégenos y bendícenos hoy 🛡️. Que Tu paz llene mi corazón 💕. En el nombre de Jesús, amén 🌈.",
    "Padre bueno 🌟, gracias por cuidar de mí cada día ☀️. Ayúdame a crecer en fe 📖 y a ser más como Jesús 💪. Llena mi vida de alegría 🎉. Amén 🙏.",
    "Señor ✨, te alabo por ser mi pastor 🐑. Ayúdame a seguirte siempre 👣. Dame fuerzas para hacer lo correcto 💪 y amor para perdonar 💕. En el nombre de Jesús, amén 🙏.",
    "Dios todopoderoso 🌟, gracias por Tu Palabra 📖 que me enseña 📚. Abre mi corazón para aprender de Ti 💖. Bendice mi día y guárdame de todo mal 🛡️. Amén 🙏.",
    "Jesús amado 💕, gracias por ser mi mejor amigo 🤝. Ayúdame a hablar contigo en oración cada día 🙏. Llena mi vida de Tu presencia ✨. En Tu nombre, amén 🌈.",
    "Padre celestial ☁️, te doy gracias por la naturaleza hermosa 🌻🦋. Ayúdame a cuidar Tu creación 🌍. Dame un corazón agradecido 💖 y generoso 🎁. Amén 🙏.",
    "Señor de amor 💗, gracias por escuchar mis oraciones 🙏. Ayúdame a confiar en que siempre me respondes 💕. Bendice a quienes amo 👨‍👩‍👧‍👦. En el nombre de Jesús, amén 🌟."
];

const storyTitles = [
    "El Osito Generoso 🐻💕", "La Mariposa Valiente 🦋", "El Conejito Tímido 🐰", "La Abejita Trabajadora 🐝", "El Pajarito Cantor 🐦🎵",
    "La Tortuga Perseverante 🐢", "El Zorro Inteligente 🦊", "La Ardilla Previsora 🐿️", "El Delfín Alegre 🐬", "La Ovejita Perdida 🐑",
    "El León Fuerte 🦁", "La Jirafa Alta 🦒", "El Elefante Agradecido 🐘", "La Ballena Protectora 🐋", "El Pez Luminoso 🐟✨",
    "La Hormiga Constante 🐜", "El Búho Sabio 🦉", "La Paloma Pacificadora 🕊️", "El Gato Curioso 🐱", "El Perro Fiel 🐕"
];


// --- FUNCIÓN PRINCIPAL ---

async function main() {
  console.log('🌱 Iniciando carga de datos...');

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
        icon_name: month.emoji // Guardamos el Emoji aquí directamente
      }, { onConflict: 'id' });
    
    if (error) console.error(`Error mes ${month.name}:`, error.message);
  }

  // 2. Generar e Insertar DEVOCIONALES (365 días)
  console.log('📖 Generando y subiendo devocionales...');
  
  let globalDayCounter = 0; // Para recorrer los arrays cíclicamente

  for (const month of monthsData) {
    const devotionalsForMonth = [];

    for (let day = 1; day <= month.days; day++) {
      // Índices cíclicos (para no salirse del array)
      const idx = globalDayCounter;
      
      const animal = storyTemplates.animals[idx % storyTemplates.animals.length];
      const action = storyTemplates.actions[idx % storyTemplates.actions.length];
      const lesson = storyTemplates.lessons[idx % storyTemplates.lessons.length];
      const verse = baseVerses[idx % baseVerses.length];
      const prayer = prayerTemplates[idx % prayerTemplates.length];
      const title = storyTitles[idx % storyTitles.length];

      // Construir la historia interpolando las variables
      const story = `✨ DÍA ${day} ✨\n\n🌟 Había una vez un ${animal} que ${action}.\n\n💕 Este pequeño amigo aprendió una lección muy importante sobre el amor infinito y la fidelidad de Dios. A través de su experiencia, descubrió que Dios siempre está presente 🙏, guiando cada paso del camino con Su luz divina ✨.\n\n🌈 Los desafíos que enfrentó se convirtieron en maravillosas oportunidades para crecer en fe 📖 y confianza 💪. Al final, comprendió que no estaba solo, sino acompañado por el amor infinito del Creador 💖.\n\n⭐ Su historia nos enseña que: ${lesson}\n\n🌸 Cada día es una nueva oportunidad para experimentar el amor de Dios de maneras únicas y especiales. ¡Dios te ama muchísimo! 💝🙏✨`;

      devotionalsForMonth.push({
        month_id: month.id,
        day_number: day,
        title: title,
        verse_text: verse.text,
        verse_reference: verse.ref,
        reflection_content: story, // Aquí va la historia generada
        prayer_content: prayer,
        image_url: null // Opcional
      });

      globalDayCounter++;
    }

    // Insertar en bloque para este mes
    const { error } = await supabase.from('devotionals').upsert(devotionalsForMonth, { onConflict: 'month_id,day_number' });
    
    if (error) {
        console.error(`❌ Error insertando devocionales de ${month.name}:`, error.message);
    } else {
        console.log(`✅ ${month.name} completado (${month.days} devocionales).`);
    }
  }

  console.log('✨ ¡Carga de datos completada exitosamente!');
}

main();