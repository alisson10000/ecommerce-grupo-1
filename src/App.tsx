import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; // ✅ caminho ajustado
import { ThemeProvider } from "./ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
