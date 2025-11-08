import { useEffect, useState } from "react";
import { getEnrolments } from "../api/enrolmentApi";

export function useEnrolments() {
  const [enrolments, setEnrolments] = useState([]);
  useEffect(() => { getEnrolments().then(setEnrolments); }, []);
  return enrolments;
}
