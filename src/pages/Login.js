import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/usuarios?email=${email}&password=${password}`);
      const data = await response.json();

      if (data.length > 0) {
        login(data[0]); // guarda el usuario en contexto
        navigate('/');  // redirige a home
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Contraseña:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
