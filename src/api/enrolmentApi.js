const API_BASE = "http://localhost:5002/api";

export async function getEnrolments() {
  const res = await fetch(`${API_BASE}/enrolments`);
  return res.json();
}

export async function addEnrolment(enrolment) {
  const res = await fetch(`${API_BASE}/enrolments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrolment),
  });
  return res.json();
}

export async function Enroll(enrolmentId, studentId) {
  const res = await fetch(`${API_BASE}/enrolments/${enrolmentId}/assign-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentId),
  });

  if (!res.ok) {
    const errorText = await res.text(); // plain string from server
    throw new Error(errorText);
  }

  // If server returns 204 No Content, just return true
  if (res.status === 204) {
    return true;
  }

  // If body is empty but not 204, avoid parsing error
  const text = await res.text();
  return text ? JSON.parse(text) : true;
}


