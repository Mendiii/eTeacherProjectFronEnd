const API_BASE = "http://localhost:5002/api";

export async function getStudents() {
  const res = await fetch(`${API_BASE}/students`);
  return res.json();
}
export async function addStudent(student) {
  const res = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  return res.json();
}

export async function updateStudent(id, student) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

  if (res.status === 204) {
    return true;
  }

  if (!res.ok) {
    throw new Error(`Failed to update student ${id}: ${res.status}`);
  }

  return res.json();
}

