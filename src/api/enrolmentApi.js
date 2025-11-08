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
  const res = await fetch(`${API_BASE}/enrolments/${enrolmentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentId),
  });
  return res.json();
}

