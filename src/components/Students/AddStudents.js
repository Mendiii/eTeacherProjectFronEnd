import React, { useState } from "react";
import { addStudent } from "../../api/studentApi";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";

export default function StudentForm({ onStudentAdded }) {
  const [form, setForm] = useState({ name: "", telephone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.telephone) newErrors.telephone = "Telephone is required";
    if (!form.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const added = await addStudent(form);

      if (added && (added.status === 201 || added.id)) {
        setSuccess(true);
        if (onStudentAdded) onStudentAdded(added);
        setForm({ name: "", telephone: "", address: "" });
        setErrors({});
        // Hide success after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to add student", err);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "1rem", marginTop: "2rem" }}>
        <Typography variant="h5" gutterBottom>
          Add Student
        </Typography>

        {success && (
          <Alert severity="success" style={{ marginBottom: "1rem" }}>
             Student registered successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Telephone"
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
            margin="normal"
            error={!!errors.telephone}
            helperText={errors.telephone}
          />
          <TextField
            fullWidth
            label="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            margin="normal"
            error={!!errors.address}
            helperText={errors.address}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "1rem" }}
          >
            Save Student
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
