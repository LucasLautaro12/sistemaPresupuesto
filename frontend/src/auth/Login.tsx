// Login.tsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from './components/Carrucel/Carrucel';
import FormLogin from './components/Form/FormLogin/FormLogin';
import { login as loginApi } from "../api/login";

import './style/login.css';
import { login } from "../api/login";
import { AuthContext } from "./AuthContext";

interface LoginProps {
    onLogin: (status: boolean) => void; // Prop para comunicar el estado al componente padre
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [dni, setDni] = useState<string>("");
    const [contrasenia, setContrasenia] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();
    // Extraemos la funciÃ³n login del AuthContext
    const { login: contextLogin } = useContext(AuthContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Llama a la funciÃ³n API; espera el token
        const token = await loginApi(dni, contrasenia, setMessage, onLogin, navigate);
        if (token) {
        // Actualiza el contexto con el nuevo token (y sus permisos)
        contextLogin(token);
        }
    };

    return (
        <div className="container">
            <div className="col-md-4 columna"></div>
            <div className="col-md-4 columna"></div>
            <div className="col-md-4 login-column">
                <div className="login-container">
                    <img src="/LogoSinFondo (2).png" alt="Logo VEXAR" className="logo" />
                    <FormLogin
                        dni={dni}
                        contrasenia={contrasenia}
                        setDni={setDni}
                        setContrasenia={setContrasenia}
                        handleSubmit={handleSubmit}
                    />
                    {message && <p>{message}</p>}
                </div>
            </div>
            <Carousel />
        </div>
    );
};

export default Login;
