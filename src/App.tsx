import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../src/routes/AppRoutes';
import { ThemeProvider } from './ThemeContext';

const App: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
