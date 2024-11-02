import React, { useState, useEffect } from "react";
import useParentComponentData from "../../hooks/useParentComponentData";
import styles from "../../assets/css/ProfilePage.module.css";

const CountryCitySelector = ({ register, setValue }) => {
  const { countriesAndCities } = useParentComponentData();

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
      <p className={styles.title_custom}>Country</p>
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
      <p className={styles.title_custom}>City</p>
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