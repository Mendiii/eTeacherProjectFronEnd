const API_BASE = "http://localhost:5002/api";

export async function getCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  return res.json();
}

export async function addCourse(course) {
  const res = await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  return res.json();
}

export async function updateCourse(id, course) {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  if (res.status === 204) {
    return true;
  }

  if (!res.ok) {
    throw new Error(`Failed to update course ${id}: ${res.status}`);
  }

  return res.json();
}
