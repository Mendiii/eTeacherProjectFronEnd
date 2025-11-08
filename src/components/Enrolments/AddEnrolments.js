import React, { useEffect, useState } from "react";
import { getEnrolments, addEnrolment } from "../../api/enrolmentApi";
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

export default function EnrolmentsForm() {
  const [enrolments, setEnrolments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    startingDate: "",
    courseId: "",
  });

  useEffect(() => {
    fetchEnrolments();
  }, []);

  async function fetchEnrolments() {
    try {
      setLoading(true);
      const data = await getEnrolments();
      setEnrolments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch enrolments", err);
      setError("Could not load enrolments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const dto = {
        title: form.title,
        startingDate: form.startingDate, // native date string
        courseId: parseInt(form.courseId, 10),
      };
      await addEnrolment(dto);
      setForm({ title: "", startingDate: "", courseId: "" });
      window.location.reload(); // refresh page to fetch fresh enrolments
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

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            margin="normal"
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
            required
          />
          <TextField
            fullWidth
            label="Course ID"
            type="number"
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Enrolment
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>
          All Enrolments
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && enrolments.length === 0 && !error && (
          <Typography variant="body1">No enrolments found.</Typography>
        )}

        <List>
          {enrolments.map((e) => (
            <ListItem key={e.id} divider alignItems="flex-start">
              <Box
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "100%",
                }}
              >
                <Typography variant="h6">
                  <strong>Title:</strong> {e.title}
                </Typography>
                <Typography variant="body2">
                  <strong>Starting Date:</strong>{" "}
                  {new Date(e.startingDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Course ID:</strong> {e.courseId}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
