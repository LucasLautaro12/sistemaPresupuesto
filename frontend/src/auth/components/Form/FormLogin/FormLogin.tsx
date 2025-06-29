import React from "react";
import '../../../style/form.css'; 

interface LoginFromProps{
    dni: string;
    contrasenia: string;
    setDni: (dni: string) => void;
    setContrasenia: (contrasenia: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const FormLogin: React.FC<LoginFromProps> = ({
    dni,
    contrasenia,
    setDni,
    setContrasenia,
    handleSubmit,
}) => {
    return (
        <div className="login-box">
            <form onSubmit={handleSubmit}>
                <h2>Inicio Sesion</h2>
            <div>
                <input 
                    id="dni"
                    placeholder="USUARIO"
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                 />
            </div>
            <div>
                <input 
                    id="contrasenia"
                    placeholder="CONTRASEÑA"
                    type="password"
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    required
                 />
            </div>
            <a href="#">¿Olvidó su nombre de usuario o contraseña?</a>
            <button type="submit" className="siguiente-btn">Iniciar Sesión</button>
            <p>o continuar con</p>
        </form>
        <button className="google-btn">
                <img src="/google_13170545.png" alt="Google Icon" className="google-icon" />
                <span>GOOGLE</span> <img src="/google_13170545.png" alt="Google Icon" className="google-icon2" />
            </button>
        </div>
    );
};

export default FormLogin;