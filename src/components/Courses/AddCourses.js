import React, { useState } from "react";
import { addCourse } from "../../api/courseApi";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";

export default function CourseForm({ onCourseAdded }) {
  const [form, setForm] = useState({ title: "", description: "", lecturer: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.lecturer) newErrors.lecturer = "Lecturer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const added = await addCourse(form);

      if (added && (added.status === 201 || added.id)) {
        setSuccess(true);
        if (onCourseAdded) onCourseAdded(added);
        setForm({ title: "", description: "", lecturer: "" });
        setErrors({});
        // Hide success after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to add course", err);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "1rem", marginTop: "2rem" }}>
        <Typography variant="h5" gutterBottom>
          Add Course
        </Typography>

        {success && (
          <Alert severity="success" style={{ marginBottom: "1rem" }}>
            Course registered successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            fullWidth
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            margin="normal"
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Lecturer"
            value={form.lecturer}
            onChange={e => setForm({ ...form, lecturer: e.target.value })}
            margin="normal"
            error={!!errors.lecturer}
            helperText={errors.lecturer}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "1rem" }}
          >
            Save Course
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
