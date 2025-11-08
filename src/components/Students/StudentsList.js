import React, { useEffect, useState } from "react";
import { getStudents, updateStudent } from "../../api/studentApi";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Box,
} from "@mui/material";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    telephone: "",
    address: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setError("Could not load students. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(student) {
    setEditingId(student.id);
    setEditForm({
      name: student.name,
      telephone: student.telephone,
      address: student.address,
    });
  }

  async function saveEdit(id) {
    try {
      const updated = await updateStudent(id, editForm);

      if (updated) {
        setEditingId(null);
        setEditForm({ name: "", telephone: "", address: "" });
        window.location.reload(); // refresh page to fetch fresh records
      }
    } catch (err) {
      console.error("Failed to update student", err);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: "1rem", marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          All Students
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && students.length === 0 && !error && (
          <Typography variant="body1">No students found.</Typography>
        )}

        <List>
          {students.map((s) => (
            <ListItem key={s.id} divider alignItems="flex-start">
              {editingId === s.id ? (
                <Box sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Telephone"
                    value={editForm.telephone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, telephone: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveEdit(s.id)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({ name: "", telephone: "", address: "" });
                    }}
                    sx={{ mt: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      maxWidth: "80%",
                    }}
                  >
                    <Typography variant="h6">
                      <strong>Name:</strong> {s.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Telephone:</strong> {s.telephone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {s.address}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => startEdit(s)}
                    sx={{ height: "fit-content" }}
                  >
                    Edit
                  </Button>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
