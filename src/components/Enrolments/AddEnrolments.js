import React, { useState, useEffect } from "react";
import { addEnrolment } from "../../api/enrolmentApi";
import { getCourses } from "../../api/courseApi";
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Box,
  Alert,
  MenuItem,
} from "@mui/material";

export default function EnrolmentsForm() {
  const [form, setForm] = useState({
    title: "",
    startingDate: "",
    courseId: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoadingCourses(true);
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCourses();
  }, []);

  function validate() {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.startingDate) newErrors.startingDate = "Starting date is required";
    if (!form.courseId) newErrors.courseId = "Course is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const dto = {
        title: form.title,
        startingDate: form.startingDate,
        courseId: parseInt(form.courseId, 10),
      };
      const added = await addEnrolment(dto);

      if (added && (added.status === 201 || added.id)) {
        setSuccess(true);
        setForm({ title: "", startingDate: "", courseId: "" });
        setErrors({});
        // Hide success after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to add enrolment", err);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: "1rem", marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Add Enrolment
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Enrolment registered successfully!
          </Alert>
        )}

        {loadingCourses ? (
          <Typography variant="body1">Loading courses...</Typography>
        ) : courses.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No courses available. Please add courses first before creating enrolments.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
              required
            />
            <TextField
              fullWidth
              label="Starting Date"
              type="date"
              value={form.startingDate}
              onChange={(e) =>
                setForm({ ...form, startingDate: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!errors.startingDate}
              helperText={errors.startingDate}
              required
            />
            <TextField
              select
              fullWidth
              label="Course"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              margin="normal"
              error={!!errors.courseId}
              helperText={errors.courseId}
              required
            >
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.title} — {c.lecturer}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Save Enrolment
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
