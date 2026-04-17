import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Login.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const { login, register } = useAuth(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsFormSubmitting(true);

        try { 
            await login(email, password);
            } catch (error: any) {
              setError(error.message);
          } finally {
            setIsFormSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', color: 'black' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                {isLogin ? 'Logga in' : 'Skapa konto'}
            </h2>

            {error && (
                <div style={{ color: 'red', backgroundColor: '#fee', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Namn</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>E-post</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lösenord</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isFormSubmitting}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: isFormSubmitting ? '#ccc' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isFormSubmitting ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {isFormSubmitting ? 'Laddar...' : (isLogin ? 'Logga in' : 'Skapa konto')}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isLogin ? 'Behöver du ett konto? Registrera dig' : 'Har du redan konto? Logga in'}
                </button>
            </div>
        </div>
    );
};

export default Login;
