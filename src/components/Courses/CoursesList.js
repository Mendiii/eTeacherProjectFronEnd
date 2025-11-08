import React, { useEffect, useState } from "react";
import { getCourses, updateCourse } from "../../api/courseApi";
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

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    lecturer: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setError("Could not load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(course) {
    setEditingId(course.id);
    setEditForm({
      title: course.title,
      description: course.description,
      lecturer: course.lecturer,
    });
  }

  async function saveEdit(id) {
    try {
      const updated = await updateCourse(id, editForm);

      if (updated) {
        setEditingId(null);
        setEditForm({ title: "", description: "", lecturer: "" });
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to update course", err);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: "1rem", marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          All Courses
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && courses.length === 0 && !error && (
          <Typography variant="body1">No courses found.</Typography>
        )}

        <List>
          {courses.map((c) => (
            <ListItem key={c.id} divider alignItems="flex-start">
              {editingId === c.id ? (
                <Box sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Lecturer"
                    value={editForm.lecturer}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lecturer: e.target.value })
                    }
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveEdit(c.id)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({ title: "", description: "", lecturer: "" });
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
                      wordBreak: "break-word", // ✅ ensures long text wraps
                      whiteSpace: "normal",    // ✅ allows wrapping
                      maxWidth: "80%",         // ✅ keeps text inside box
                    }}
                  >
                    <Typography variant="h6">
                      <strong>Title:</strong> {c.title}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description:</strong> {c.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Lecturer:</strong> {c.lecturer}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => startEdit(c)}
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
