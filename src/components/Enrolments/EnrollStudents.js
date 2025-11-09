import React, { useEffect, useState } from "react";
import { getEnrolments, Enroll } from "../../api/enrolmentApi";
import { getStudents } from "../../api/studentApi";
import { getCourses } from "../../api/courseApi";
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function EnrolmentsList() {
  const [enrolments, setEnrolments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [success, setSuccess] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchEnrolments();
    fetchStudents();
    fetchCourses();
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

  async function fetchStudents() {
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  }

  async function fetchCourses() {
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  }

  function startEnroll(enrolment) {
    setEditingId(enrolment.id);
    setSelectedStudent("");
    setError("");
  }

  async function saveEnroll(enrolmentId) {
    try {
      if (!selectedStudent) {
        setError("Please select a student before saving.");
        return;
      }
      const result = await Enroll(enrolmentId, selectedStudent);
      if (result) {
        setEditingId(null);
        setSelectedStudent("");
        setSuccess(true);
        setError("");
        setTimeout(() => setSuccess(false), 3000);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to enroll student", err);
      setError(err.message || "Failed to enroll student");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function getCourseName(courseId) {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : `Course #${courseId}`;
  }

  function openReport(enrolment) {
    setReportData(enrolment);
    setReportOpen(true);
  }

  function closeReport() {
    setReportOpen(false);
    setReportData(null);
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: "1rem", marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          All Enrolments
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Student enrolled successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && <CircularProgress />}
        {!loading && enrolments.length === 0 && !error && (
          <Typography variant="body1">No enrolments found.</Typography>
        )}

        <List>
          {enrolments.map((e) => (
            <ListItem key={e.id} divider alignItems="flex-start">
              {editingId === e.id ? (
                <Box sx={{ width: "100%" }}>
                  <TextField
                    select
                    fullWidth
                    label="Select Student"
                    value={selectedStudent}
                    onChange={(ev) => setSelectedStudent(ev.target.value)}
                    margin="normal"
                  >
                    {students.length === 0 ? (
                      <MenuItem disabled>No students available</MenuItem>
                    ) : (
                      students.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.name} — {s.telephone}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveEnroll(e.id)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingId(null);
                      setSelectedStudent("");
                      setError("");
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
                    flexDirection: "column",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      maxWidth: "80%",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Typography variant="h6">
                      <strong>Title:</strong> {e.title}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Starting Date:</strong> {formatDate(e.startAt)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Course:</strong> {getCourseName(e.courseId)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Students Enrolled:</strong>{" "}
                      {e.studentsId ? e.studentsId.length : 0}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => startEnroll(e)}
                      sx={{ mr: 1 }}
                    >
                      Enroll
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => openReport(e)}
                    >
                      Report
                    </Button>
                  </Box>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onClose={closeReport} fullWidth maxWidth="sm">
        <DialogTitle>Enrolment Report</DialogTitle>
        <DialogContent dividers>
          {reportData && (
            <Box>
              <Typography variant="body1">
                <strong>Title:</strong> {reportData.title}
              </Typography>
              <Typography variant="body1">
                <strong>Starting Date:</strong> {formatDate(reportData.startAt)}
              </Typography>
              <Typography variant="body1">
                <strong>Course:</strong> {getCourseName(reportData.courseId)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Students:</strong>
              </Typography>
              {reportData.studentsId && reportData.studentsId.length > 0 ? (
                <Table sx={{ mt: 1 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Phone</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.studentsId.map((sid) => {
                      const student = students.find((s) => s.id === sid);
                      return (
                        <TableRow key={sid}>
                          <TableCell>
                            {student ? student.name : `Student #${sid}`}
                          </TableCell>
                          <TableCell>
                            {student ? student.telephone : "N/A"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2">No students enrolled.</Typography>
              )}
            </Box>
          )}
        </DialogContent>
                <DialogActions>
          <Button onClick={closeReport} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
