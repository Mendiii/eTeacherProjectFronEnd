import React from "react";
import AppRoutes from "./routes";
import { AppProvider } from "./context/AppContext";
import "./styles/App.css";

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
