import React, { useState } from "react";
import useParentComponentData from "../../hooks/useParentComponentData";
import styles from "../../assets/css/ProfilePage.module.css";

const ProfessionalAreaSelector = ({ register, setValue }) => {
  const { professionalAreas } = useParentComponentData();
  const [selectedArea, setSelectedArea] = useState("");

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
        }}
      >
        <option value="">Select a Professional Area</option>
        {professionalAreas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
    </>
  );
};

export default ProfessionalAreaSelector;
