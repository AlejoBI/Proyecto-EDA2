const useParentComponentData = () => {
  const professionalAreas = [
    "Technology and Programming",
    "Graphic Design",
    "Video and Animation",
    "Writing and Translation",
    "Digital Marketing",
    "Music and Audio",
  ];

  const professionalAreasAndSkills = {
    "Technology and Programming": [
      "Web Development",
      "Mobile App Development",
      "Data Science",
      "Machine Learning",
      "Cloud Computing",
      "Cybersecurity",
      "Blockchain",
      "DevOps",
      "Game Development"
    ],
    "Graphic Design": [
      "Logo Design",
      "Branding",
      "UI/UX Design",
      "Illustration",
      "Photoshop",
      "3D Modeling",
      "Animation",
      "Packaging Design",
      "Typography"
    ],
    "Video and Animation": [
      "Video Editing",
      "2D Animation",
      "3D Animation",
      "Motion Graphics",
      "Visual Effects (VFX)",
      "Script Writing",
      "Voice Over",
      "Storyboarding",
      "Film Production"
    ],
    "Writing and Translation": [
      "Content Writing",
      "Copywriting",
      "Blog Writing",
      "Technical Writing",
      "Proofreading",
      "Editing",
      "Translation",
      "Transcription",
      "Creative Writing"
    ],
    "Digital Marketing": [
      "Social Media Marketing",
      "SEO",
      "Email Marketing",
      "Content Marketing",
      "Pay-Per-Click (PPC)",
      "Affiliate Marketing",
      "Influencer Marketing",
      "Marketing Strategy",
      "Brand Strategy"
    ],
    "Music and Audio": [
      "Music Production",
      "Audio Engineering",
      "Sound Design",
      "Voice Over",
      "Podcast Production",
      "Mixing and Mastering",
      "Composition",
      "Audio Editing",
      "DJing"
    ]
  };  

  const tableData = [
    {
      categories: "Technology and Programming",
      help: "Help and Support",
      community: "Academy",
      company: "About Us",
    },
    {
      categories: "Graphic Design",
      help: "Trust and Security",
      community: "Blog",
      company: "Careers",
    },
    {
      categories: "Video and Animation",
      help: "Quality Guide",
      community: "Themes",
      company: "FAQs",
    },
    {
      categories: "Writing and Translation",
      help: "Taskeria Guides",
      community: "Hosting",
      company: "Teams",
    },
    {
      categories: "Digital Marketing",
      help: "",
      community: "Developers",
      company: "Contact Us",
    },
    {
      categories: "Music and Audio",
      help: "",
      community: "Support",
      company: "",
    },
  ];
  

  const countriesAndCities = {
    Argentina: [
      "Buenos Aires",
      "Córdoba",
      "Rosario",
      "Mendoza",
      "San Miguel de Tucumán",
      "La Plata",
    ],
    Brazil: [
      "Rio de Janeiro",
      "São Paulo",
      "Brasília",
      "Salvador",
      "Fortaleza",
      "Belo Horizonte",
    ],
    Canada: [
      "Toronto",
      "Vancouver",
      "Montreal",
      "Calgary",
      "Ottawa",
      "Edmonton",
    ],
    Spain: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga"],
    USA: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "San Antonio",
    ],
    "United Kingdom": [
      "London",
      "Manchester",
      "Birmingham",
      "Liverpool",
      "Glasgow",
      "Bristol",
    ],
    France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes"],
    Germany: [
      "Berlin",
      "Munich",
      "Hamburg",
      "Frankfurt",
      "Cologne",
      "Stuttgart",
    ],
    Italy: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa"],
    Australia: [
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaide",
      "Hobart",
    ],
    Mexico: [
      "Mexico City",
      "Guadalajara",
      "Monterrey",
      "Cancún",
      "Puebla",
      "Tijuana",
    ],
    Japan: ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Fukuoka", "Sapporo"],
    China: [
      "Beijing",
      "Shanghai",
      "Guangzhou",
      "Shenzhen",
      "Chengdu",
      "Hangzhou",
    ],
    India: [
      "New Delhi",
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Kolkata",
      "Hyderabad",
    ],
    Russia: [
      "Moscow",
      "Saint Petersburg",
      "Novosibirsk",
      "Yekaterinburg",
      "Nizhny Novgorod",
      "Samara",
    ],
    "South Africa": [
      "Cape Town",
      "Johannesburg",
      "Durban",
      "Pretoria",
      "Port Elizabeth",
      "Bloemfontein",
    ],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju"],
    Egypt: ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Luxor", "Aswan"],
    Thailand: [
      "Bangkok",
      "Chiang Mai",
      "Phuket",
      "Pattaya",
      "Ayutthaya",
      "Khon Kaen",
    ],
    Turkey: ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa", "Adana"],
    "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar"],
    "United Arab Emirates": [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "Fujairah",
    ],
    Indonesia: [
      "Jakarta",
      "Bali",
      "Surabaya",
      "Medan",
      "Bandung",
      "Yogyakarta",
    ],
    Nigeria: [
      "Lagos",
      "Abuja",
      "Kano",
      "Ibadan",
      "Port Harcourt",
      "Benin City",
    ],
    Chile: [
      "Santiago",
      "Valparaíso",
      "Concepción",
      "La Serena",
      "Antofagasta",
      "Temuco",
    ],
    Colombia: [
      "Bogotá",
      "Medellín",
      "Cali",
      "Barranquilla",
      "Cartagena",
      "Bucaramanga",
    ],
    Peru: ["Lima", "Cusco", "Arequipa", "Trujillo", "Piura", "Chiclayo"],
  };

  return {
    countriesAndCities,
    professionalAreas,
    professionalAreasAndSkills,
    tableData,
  };
};

export default useParentComponentData;
