import React, { useState, useEffect } from "react";
import useParentComponentData from "../../hooks/useParentComponentData";
import styles from "../../assets/css/ProfilePage.module.css";

const ProfessionalAreaSelector = ({ register, setValue, getValues }) => {
  const { professionalAreasAndSkills } = useParentComponentData();
  const [selectedArea, setSelectedArea] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    if (selectedArea) {
      setFilteredSkills(professionalAreasAndSkills[selectedArea]);
    } else {
      setFilteredSkills([]);
    }
  }, [selectedArea]);

  useEffect(() => {
    // Load existing skills when the component mounts
    const existingSkills = getValues("skills") || [];
    setSelectedSkills(existingSkills);
  }, [getValues]);

  // Función para añadir una skill a la lista
  const addSkill = () => {
    const skillSelect = document.querySelector('select[name="skills"]');

    if (skillSelect?.value) {
      const newSkill = skillSelect.value;

      // Verifica si la skill ya existe en la lista
      if (!selectedSkills.includes(newSkill)) {
        const updatedSkills = [...selectedSkills, newSkill];
        setSelectedSkills(updatedSkills);

        // Actualiza el campo oculto con todas las skills
        setValue("skills", updatedSkills);
      }
    }
  };

  // Función para eliminar una skill de la lista
  const removeSkill = (indexToRemove) => {
    const updatedSkills = selectedSkills.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedSkills(updatedSkills);
    setValue("skills", updatedSkills);
  };

  return (
    <div className={styles.container}>
      {/* Campo oculto para almacenar todas las skills seleccionadas */}
      <input type="hidden" {...register("skills")} />

      {/* Selector de Área Profesional */}
      <div className="mb-3">
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
          {Object.keys(professionalAreasAndSkills).map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de Habilidades con botón de agregar */}
      <div className="mb-3">
        <p className={styles.title_custom}>Skills</p>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            {...register("skills")}
            disabled={!selectedArea}
          >
            <option value="">Select a Skill</option>
            {filteredSkills.map((skills) => (
              <option key={skills} value={skills}>
                {skills}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary"
            onClick={addSkill}
            disabled={!selectedArea}
          >
            Add
          </button>
        </div>
      </div>

      {/* Lista de skills seleccionadas */}
      {selectedSkills.length > 0 && (
        <div className="mt-3">
          <p className={styles.title_custom}>Selected Skills</p>
          <ul className="list-group">
            {selectedSkills.map((skills, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{skills}</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeSkill(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAreaSelector;
