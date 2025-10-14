export interface Artwork {
  id: number;
  image: string;
  title: string;
  artist: string;
}

export const artworks: Artwork[] = [
  {
    id: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Vincent_Willem_van_Gogh_128.jpg',
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
  },
  {
    id: 2,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Vincent_Willem_van_Gogh_083.jpg/250px-Vincent_Willem_van_Gogh_083.jpg',
    title: 'Water Lilies',
    artist: 'Claude Monet',
  },
  {
    id: 3,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vincent_van_Gogh_-_Road_with_Cypress_and_Star_-_c._12-15_May_1890.jpg/250px-Vincent_van_Gogh_-_Road_with_Cypress_and_Star_-_c._12-15_May_1890.jpg',
    title: 'The Creation of Adam',
    artist: 'Michelangelo Buonarroti',
  },
  {
    id: 4,
    image: 'https://img.wikioo.org/ADC/art.nsf/get_large_image_wikioo?Open&ra=5ZKGLP',
    title: 'Woman with a Hat',
    artist: 'Pablo Picasso',
  },
  {
    id: 5,
    image: 'https://img.wikioo.org/ADC/art.nsf/get_large_image_wikioo?Open&ra=8YDLUC',
    title: 'The Kiss',
    artist: 'Gustav Klimt',
  },
  {
    id: 6,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Van_Gogh_self-portrait_dedicated_to_Gauguin.jpg/250px-Van_Gogh_self-portrait_dedicated_to_Gauguin.jpg',
    title: 'The Scream',
    artist: 'Edvard Munch',
  },
  {
    id: 7,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Van_gogh-lallee_des_alyscamps.jpg/250px-Van_gogh-lallee_des_alyscamps.jpg',
    title: 'Self Portrait with Thorn Necklace',
    artist: 'Frida Kahlo',
  },
  {
    id: 8,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Van_Gogh_-_Gipsmodell_eines_knienden_Mannes.jpeg/250px-Van_Gogh_-_Gipsmodell_eines_knienden_Mannes.jpeg',
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
  },
];
