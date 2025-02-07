export const reviews = [
    {
      id: 1,
      user: {
        name: "João Silva",
        image: "", 
      },
      rating: 4.5,
      text: "Esse filme foi incrível! A fotografia e a trilha sonora são fantásticas.",
      likes: 12,
      comments: [
        {
          id: 101,
          user: {
            name: "Maria Oliveira",
            image: "",
          },
          text: "Concordo! A trilha sonora é espetacular!",
        },
        {
          id: 102,
          user: {
            name: "Carlos Souza",
            image: "", 
          },
          text: "Gostei bastante, mas achei o roteiro um pouco confuso.",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Ana Pereira",
        image: "", 
      },
      rating: 5.0,
      text: "Filme maravilhoso! Já assisti 3 vezes e cada vez me emociono mais.",
      likes: 25,
      comments: [],
    },
  ];
  