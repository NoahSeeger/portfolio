import React from "react";

function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <span className="text-xl">{title}</span>
      <h2 className="font-bold">{subtitle}</h2>
    </div>
  );
}

export default SectionTitle;
