import React, { useEffect, useState } from "react";
import { getEnrolments } from "../../api/enrolmentApi";

export default function Enroll() {
  const [enrolments, setEnrolments] = useState([]);

  useEffect(() => {
    getEnrolments().then(setEnrolments);
  }, []);

  return (
    <div>
      <h2>Enrolments</h2>
      <ul>
        {enrolments.map(e => (
          <li key={e.id}>{e.title} (CourseId: {e.courseId})</li>
        ))}
      </ul>
    </div>
  );
}
