import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { getCourses().then(setCourses); }, []);
  return courses;
}
