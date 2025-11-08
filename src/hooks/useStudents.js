import { useEffect, useState } from "react";
import { getStudents } from "../api/studentApi";

export function useStudents() {
  const [students, setStudents] = useState([]);
  useEffect(() => { getStudents().then(setStudents); }, []);
  return students;
}
