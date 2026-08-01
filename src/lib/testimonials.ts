export type Testimonial = {
  name: string;
  city: string;
  stars: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Valentina R.",
    city: "Medellín",
    stars: "★★★★★",
    quote:
      "Pedí la manilla Aurora para un matrimonio y llegó impecable. Se ve mejor que en las fotos.",
  },
  {
    name: "Daniela M.",
    city: "Bogotá",
    stars: "★★★★★",
    quote:
      "Me asesoraron con la talla del anillo en minutos. Cero fricción, todo por WhatsApp.",
  },
  {
    name: "Camila O.",
    city: "Cali",
    stars: "★★★★★",
    quote:
      "Uso el collar a diario desde hace ocho meses y sigue igual de brillante. Vale cada peso.",
  },
  {
    name: "Laura P.",
    city: "Barranquilla",
    stars: "★★★★★",
    quote:
      "El empaque parece de boutique. Lo regalé y la reacción fue justo la que esperaba.",
  },
];
