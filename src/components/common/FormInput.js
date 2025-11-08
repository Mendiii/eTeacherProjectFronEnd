import React from "react";

export default function FormInput({ label, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
