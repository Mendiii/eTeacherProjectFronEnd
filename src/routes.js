import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { StudentRegister, GetStudentsList } from "./pages/StudentsPage";
import { CourseRegister, GetCoursesList } from "./pages/CoursesPage";
import { EnrolmentsRegister, EnrollStudents} from "./pages/EnrolmentsPage";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function AppRoutes() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openEnrolments, setOpenEnrolments] = useState(false);

  return (
    <Router>
      {/* Top bar with burger */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            eTeacher Project
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer menu */}
      <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List sx={{ width: 250 }}>
          <ListItemButton component={Link} to="/" onClick={() => setOpenDrawer(false)}>
            <ListItemText primary="Home" />
          </ListItemButton>

          {/* Students section */}
          <ListItemButton onClick={() => setOpenStudents(!openStudents)}>
            <ListItemText primary="Students" />
            {openStudents ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStudents} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/students-registration"
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemText primary="Add student" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/students/students-list"
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemText primary="Get Students List" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Courses section */}
          <ListItemButton onClick={() => setOpenCourses(!openCourses)}>
            <ListItemText primary="Courses" />
            {openCourses ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCourses} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/courses-registration"
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemText primary="Add Course" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/courses/courses-list"
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemText primary="Get Courses List" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* Enrolments section */}
          <ListItemButton onClick={() => setOpenEnrolments(!openEnrolments)}>
            <ListItemText primary="Enrolments" />
            {openEnrolments ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openEnrolments} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/enrolments-registration"
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemText primary="Add Enrolments" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/enrolments/enroll"
                onClick={() => setOpenDrawer(false)}
              >
                <ListItemText primary="Enroll students" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Page content */}
      <Container sx={{ marginTop: "2rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/students-registration" element={<StudentRegister />} />
          <Route path="/students/students-list" element={<GetStudentsList />} />
          <Route path="/courses-registration" element={<CourseRegister />} />
          <Route path="/courses/courses-list" element={<GetCoursesList />} />
          <Route path="/enrolments-registration" element={<EnrolmentsRegister />} />
          <Route path="/enrolments/enroll"  element={<EnrollStudents />} />
        </Routes>
      </Container>
    </Router>
  );
}
