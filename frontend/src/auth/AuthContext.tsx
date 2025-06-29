// src/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  idpersona?: number;
  nombre?: string;
  apellido?: string;
  permisos?: string[];
  iat?: number;
  exp?: number;
}

interface AuthContextType {
  permisos: string[];
  setPermisos: React.Dispatch<React.SetStateAction<string[]>>;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  permisos: [],
  setPermisos: () => {},
  login: () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [permisos, setPermisos] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setPermisos(decoded.permisos || []);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setPermisos(decoded.permisos || []);
    } catch (error) {
      console.error("Error decodificando el token", error);
      setPermisos([]);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setPermisos([]); // Limpia el estado de permisos
  };

  return (
    <AuthContext.Provider value={{ permisos, setPermisos, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};