import React from "react";

function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <span className="text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{title}</span>
      <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>{subtitle}</h2>
    </div>
  );
}

export default SectionTitle;