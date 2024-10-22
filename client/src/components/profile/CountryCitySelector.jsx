import React, { useState, useEffect } from "react";

const CountryCitySelector = ({ register, setValue }) => {
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
    Chile: [
      "Santiago",
      "Valparaíso",
      "Concepción",
      "La Serena",
      "Antofagasta",
      "Temuco",
    ],
  };

  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  // Actualiza las ciudades cuando cambia el país seleccionado
  useEffect(() => {
    if (selectedCountry) {
      setFilteredCities(countriesAndCities[selectedCountry]);
    } else {
      setFilteredCities([]);
    }
  }, [selectedCountry]);

  return (
    <>
      {/* Selector de País */}
      <p className="title-custom">Country</p>
      <select
        className="form-select"
        {...register("country")}
        onChange={(e) => {
          const selected = e.target.value;
          setSelectedCountry(selected);
          setValue("country", selected);
          setValue("city", ""); // Reinicia la ciudad seleccionada
        }}
      >
        <option value="">Select a Country</option>
        {Object.keys(countriesAndCities).map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* Selector de Ciudad */}
      <p className="title-custom">City</p>
      <select
        className="form-select"
        {...register("city")}
        onChange={(e) => setValue("city", e.target.value)}
        disabled={!selectedCountry}
      >
        <option value="">Select a City</option>
        {filteredCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </>
  );
};

export default CountryCitySelector;