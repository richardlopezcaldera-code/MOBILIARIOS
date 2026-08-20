import type { Condition } from "@/lib/weather";

export interface Article {
  slug: string;
  title: string;
  summary: string;
  /** Climas en los que este artículo se destaca en la portada del blog. */
  conditions: Condition[];
  /** Se destaca además cuando la temperatura entra en este rango. */
  temperature?: { min?: number; max?: number };
  readingMinutes: number;
  categorySlugs: string[];
  body: string[];
}

export const articles: Article[] = [
  {
    slug: "home-office-para-dias-de-lluvia",
    title: "Armar un home office que aguante los días de encierro",
    summary:
      "Cuando llueve toda la semana, el escritorio deja de ser un mueble y pasa a ser el lugar donde vives. Qué mirar antes de comprar.",
    conditions: ["rain", "storm"],
    readingMinutes: 4,
    categorySlugs: ["escritorios", "sillas/sillas-ejecutivas-y-ergonomicas"],
    body: [
      "Un escritorio que sirve para dos horas no sirve para ocho. La diferencia no está en el precio: está en tres medidas que casi nadie revisa antes de comprar.",
      "**La altura.** El estándar son 75 cm, pensado para una persona de 1,75 m. Si mides menos, vas a terminar con los hombros encogidos; si mides más, con la espalda curvada. Antes de elegir, siéntate en la silla que vas a usar y mide desde el suelo hasta tus codos con los brazos relajados: esa es tu altura de trabajo.",
      "**El fondo.** Menos de 60 cm y la pantalla te queda demasiado cerca, que es la causa más común de fatiga visual al final del día. Con monitor grande, apunta a 70 u 80 cm.",
      "**El paso de cables.** Suena a detalle menor hasta que tienes cargador, monitor y lámpara peleando por el mismo borde. Un escritorio con pasacables o una cajonera con canal se paga solo en orden.",
      "Sobre la silla: si vas a pasar jornadas completas, el apoyo lumbar regulable importa más que el respaldo alto. Un respaldo alto sin soporte lumbar es solo un respaldo grande.",
      "En días de lluvia también conviene mirar dónde pones el escritorio. Pegado a la ventana suena bien, pero con luz gris de invierno vas a trabajar a contraluz. Mejor perpendicular a la ventana: recibes luz lateral sin reflejo en la pantalla.",
    ],
  },
  {
    slug: "living-para-el-invierno-santiaguino",
    title: "El living en invierno: menos metros, más horas de uso",
    summary:
      "En Santiago el invierno concentra la vida en una sola pieza. Cómo ordenarla para que no se sienta apretada.",
    conditions: ["rain", "snow", "fog"],
    temperature: { max: 12 },
    readingMinutes: 3,
    categorySlugs: ["sofas-y-living", "comedor-y-muebles-varios", "estantes-y-repisas"],
    body: [
      "Cuando baja la temperatura, el living absorbe funciones que en verano estaban repartidas: comedor, oficina, sala de juegos. El error clásico es llenarlo de muebles para cubrir cada función.",
      "**Un sofá bien elegido reemplaza tres muebles.** Fíjate en la profundidad del asiento antes que en el largo: menos de 55 cm obliga a sentarse en el borde, más de 65 cm invita a recostarse. Para un living que también es sala de estar diaria, entre 55 y 60 cm es el rango cómodo.",
      "**La estantería vertical gana al mueble bajo.** En espacios chicos, subir el almacenamiento libera piso, y el piso libre es lo que hace que una pieza se sienta grande. Una repisa de 180 cm ocupa el mismo metro cuadrado que una de 80, pero guarda el doble.",
      "**Deja un camino.** Suena obvio, pero es lo primero que se pierde: 60 cm libres para circular entre el sofá y la mesa de centro. Si no caben, la mesa de centro sobra.",
      "Un truco de invierno: mover el sofá 20 cm hacia adentro, separándolo del muro exterior. Los muros que dan a la calle son los más fríos de la casa, y esa distancia se nota al sentarse.",
    ],
  },
  {
    slug: "terraza-y-quincho-antes-del-calor",
    title: "Preparar la terraza antes de que llegue el calor",
    summary:
      "Los buenos días de sol pillan a todos sin mesa. Qué conviene tener listo y por qué comprarlo fuera de temporada.",
    conditions: ["clear"],
    temperature: { min: 22 },
    readingMinutes: 3,
    categorySlugs: ["parrillas-y-exterior", "mesas/mesas-plegables", "ping-pong-y-juegos"],
    body: [
      "El mobiliario de exterior tiene un problema de calendario: todos lo buscan la misma semana, cuando ya hace calor. Es cuando hay menos stock y menos variedad.",
      "**Plegable no es sinónimo de frágil.** Una mesa plegable de estructura metálica aguanta lo mismo que una fija, y te devuelve la terraza completa los días que no la usas. Para espacios chicos, es la diferencia entre una terraza usable y una bodega al aire libre.",
      "**Mira el material pensando en el sol, no en la lluvia.** En Santiago el enemigo del mobiliario exterior no es el agua: es la radiación. El plástico sin protección UV se vuelve quebradizo en dos veranos, y la madera sin tratar se agrisa en uno.",
      "**La sombra antes que los muebles.** Un buen juego de terraza bajo sol directo a las tres de la tarde no se usa. Si el presupuesto es acotado, resuelve la sombra primero.",
      "Sobre el quincho: la parrilla define dónde se para la gente, y donde se para la gente necesita mesa cerca. Una mesa auxiliar al lado de la parrilla evita que todo el mundo circule con platos en la mano.",
    ],
  },
  {
    slug: "sillas-de-oficina-que-duran",
    title: "Cómo distinguir una silla de oficina que va a durar",
    summary:
      "Cuatro cosas que puedes revisar en cinco minutos y que separan una silla de tres años de una de diez.",
    conditions: ["cloudy", "clear", "fog"],
    readingMinutes: 4,
    categorySlugs: [
      "sillas/sillas-ejecutivas-y-ergonomicas",
      "sillas/sillas-operativas",
      "sillas/sillas-gamer",
    ],
    body: [
      "En sillas de oficina el precio dice poco. Estas cuatro cosas dicen bastante más.",
      "**La base.** Nylon reforzado o aluminio duran; el plástico simple se raja por la unión de los radios, casi siempre al segundo año. Es la falla más común y la menos reparable.",
      "**El pistón.** Es la pieza que baja sola cuando la silla ya está cansada. Busca certificación de clase 3 o 4. Un pistón bueno es barato de reemplazar; el problema es que casi nadie lo reemplaza y termina botando la silla entera.",
      "**El mecanismo.** Una silla que solo sube y baja es una silla de reunión, no de jornada. Para ocho horas necesitas al menos inclinación con bloqueo. El mecanismo sincronizado, donde respaldo y asiento se mueven en proporción, es lo que de verdad cambia la comodidad al final del día.",
      "**El tapiz.** La malla ventila mejor en verano y no retiene olor; la tela abriga más y se ensucia menos a la vista. El ecocuero se ve bien el primer año y se pela donde apoyas los antebrazos.",
      "Un consejo que ahorra devoluciones: si la silla es para alguien de más de 1,85 m o menos de 1,60 m, revisa el rango del pistón antes de comprar. La mayoría está calibrada para el promedio y deja fuera los extremos.",
    ],
  },
  {
    slug: "equipar-oficina-completa-sin-errores",
    title: "Equipar una oficina completa: el orden que conviene seguir",
    summary:
      "Comprar todo junto sale más barato, pero el orden en que decides importa más que el descuento.",
    conditions: ["cloudy", "fog", "clear", "rain", "storm", "snow"],
    readingMinutes: 5,
    categorySlugs: ["escritorios", "sillas", "estantes-y-repisas", "lockers"],
    body: [
      "Cuando hay que equipar de cero, la tentación es partir por lo visible: escritorios y sillas. Conviene el orden inverso.",
      "**Primero mide la circulación.** Un pasillo de trabajo necesita 80 cm; si hay tránsito en dos direcciones, 120. Esos metros no se negocian después: si los ocupas con muebles, la oficina se siente estrecha para siempre y no hay mueble bonito que lo arregle.",
      "**Después define los puestos.** Un puesto individual cómodo son 140 × 70 cm de escritorio. En L, cuando la persona trabaja con dos pantallas o mucho papel. Estación de trabajo compartida cuando el equipo rota.",
      "**Recién ahí, las sillas.** Porque el tipo de puesto define la silla, no al revés: una estación de pie necesita silla alta, un puesto de atención necesita silla de cajero.",
      "**El almacenamiento va al final, pero no se omite.** Es lo primero que se recorta del presupuesto y lo primero que se echa de menos al mes. Estantería vertical y lockers si hay personal que rota o guarda cosas personales.",
      "Un último punto práctico: al comprar por volumen conviene pedir cotización en vez de ir sumando al carro. Se ajusta el despacho, se coordina la entrega en una sola fecha y se puede facturar todo junto.",
    ],
  },
];

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/** Ordena los artículos poniendo primero los que calzan con el clima actual. */
export function sortForWeather(
  condition: Condition | null,
  temperature: number | null,
): Article[] {
  if (!condition) return articles;

  const score = (article: Article): number => {
    let value = article.conditions.includes(condition) ? 2 : 0;
    if (temperature !== null && article.temperature) {
      const { min, max } = article.temperature;
      const fits =
        (min === undefined || temperature >= min) &&
        (max === undefined || temperature <= max);
      if (fits) value += 1;
    }
    return value;
  };

  return [...articles].sort((a, b) => score(b) - score(a));
}
