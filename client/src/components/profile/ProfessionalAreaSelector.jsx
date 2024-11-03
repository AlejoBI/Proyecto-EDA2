import React, { useState, useEffect } from "react";
import useParentComponentData from "../../hooks/useParentComponentData";
import styles from "../../assets/css/ProfilePage.module.css";

const ProfessionalAreaSelector = ({ register, setValue }) => {
  const { professionalAreasAndSkills } = useParentComponentData();

  const [selectedArea, setSelectedArea] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);

  // Actualiza las habilidades cuando cambia el área profesional seleccionada
  useEffect(() => {
    if (selectedArea) {
      setFilteredSkills(professionalAreasAndSkills[selectedArea]);
    } else {
      setFilteredSkills([]);
    }
  }, [selectedArea]);

  return (
    <>
      {/* Selector de Área Profesional */}
      <p className={styles.title_custom}>Professional Area</p>
      <select
        className="form-select"
        {...register("professionalArea")}
        onChange={(e) => {
          const selected = e.target.value;
          setSelectedArea(selected);
          setValue("professionalArea", selected);
          setValue("skill", ""); // Reinicia la habilidad seleccionada
        }}
      >
        <option value="">Select a Professional Area</option>
        {Object.keys(professionalAreasAndSkills).map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>

      {/* Selector de Habilidades */}
      <p className={styles.title_custom}>Skill</p>
      <select
        className="form-select"
        {...register("skill")}
        onChange={(e) => setValue("skill", e.target.value)}
        disabled={!selectedArea}
      >
        <option value="">Select a Skill</option>
        {filteredSkills.map((skill) => (
          <option key={skill} value={skill}>
            {skill}
          </option>
        ))}
      </select>
    </>
  );
};

export default ProfessionalAreaSelector;
