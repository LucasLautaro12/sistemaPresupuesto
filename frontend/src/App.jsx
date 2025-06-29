/* CODIGO PRUEBA NO TOCAR FUNCIONACOMPLETAMENTE*/
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import DefaultRoute from "./pages/Home/DefaultRoute";
import Usuario from "./pages/PageUsuario/Usuario";
import CreateUserRoutes from "./routes/CreateUserRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import ListaPresupuesto from "./pages/PagePresupuesto/ListaPresupuesto";
import ListaTK from "./pages/PageTK/ListaTK";
import NewPresupuesto from "./pages/PagePresupuesto/NewPresupuesto";
import { verifyToken } from "./api/verifyToken";
import { AuthProvider } from "./auth/AuthContext";

export const urlBackend = import.meta.env.VITE_URL_BACKEND || "https://vexar.onrender.com";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para verificar el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token, setIsAuthenticated, setLoading);
    } else {
      console.log(
        "No hay token válido. Configurando isAuthenticated en false."
      ); // Depuración
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DefaultRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario"
          element={
            <ProtectedRoute 
            isAuthenticated={isAuthenticated}
            requiredPermissions={["ADMIN"]}>
              <Usuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateUserRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/presupuestos"
          element={
            <ProtectedRoute 
            isAuthenticated={isAuthenticated}
            requiredPermissions={["LEER_PM_PRES", "ADMIN"]}>
              <ListaPresupuesto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/formpresupuesto"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewPresupuesto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tks"
          element={
            <ProtectedRoute 
            isAuthenticated={isAuthenticated}
            requiredPermissions={["LEER_PM_TK", "ADMIN"]}>
              <ListaTK />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
