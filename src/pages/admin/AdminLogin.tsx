import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminLogin } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      toast.error('Please enter all credentials.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminLogin(usernameOrEmail, password);
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
      toast.success('Welcome back, Admin!');
      
      // Dispatch a storage event or simple navigate
      navigate('/admin/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-light-bg)',
      padding: '40px 20px'
    }}>
      <div className="login-card" style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: 'var(--shadow-md)',
        borderRadius: '0px' // Sleek square borders
      }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '2rem', 
            color: 'var(--color-dark)', 
            marginBottom: '10px' 
          }}>Admin Login</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Access the Learts Store Administration Panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '8px',
              color: 'var(--color-dark)'
            }}>Username or Email</label>
            <input 
              type="text" 
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="admin or admin@example.com"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-light-bg)',
                color: 'var(--color-dark)',
                fontSize: '0.95rem',
                transition: 'var(--transition-fast)'
              }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '8px',
              color: 'var(--color-dark)'
            }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-light-bg)',
                color: 'var(--color-dark)',
                fontSize: '0.95rem',
                transition: 'var(--transition-fast)'
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: 'var(--color-dark)',
              color: '#ffffff',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'var(--transition-smooth)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
          Need an account?{' '}
          <Link to="/admin/register" style={{ 
            color: 'var(--color-primary)', 
            fontWeight: 500, 
            borderBottom: '1px solid var(--color-primary)' 
          }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
