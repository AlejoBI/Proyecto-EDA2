import React, { useState } from "react";

const ProfessionalAreaSelector = ({ register, setValue }) => {
  const professionalAreas = [
    "Technology and Programming",
    "Graphic Design",
    "Video and Animation",
    "Writing and Translation",
    "Digital Marketing",
    "Music and Audio",
  ];

  const [selectedArea, setSelectedArea] = useState("");

  return (
    <>
      {/* Selector de Área Profesional */}
      <p className="title-custom">Professional Area</p>
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