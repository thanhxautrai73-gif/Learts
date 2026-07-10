import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminRegister } from '../../services/api';

export const AdminRegister: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await adminRegister(username, email, password);
      toast.success('Registration successful! Please login.');
      navigate('/admin/login');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try a different username/email.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-register-page" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-light-bg)',
      padding: '40px 20px'
    }}>
      <div className="register-card" style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: 'var(--shadow-md)',
        borderRadius: '0px'
      }}>
        <div className="register-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '2rem', 
            color: 'var(--color-dark)', 
            marginBottom: '10px' 
          }}>Admin Register</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Create a new Administrator account for Learts Store
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '6px',
              color: 'var(--color-dark)'
            }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_jane"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-light-bg)',
                color: 'var(--color-dark)',
                fontSize: '0.95rem',
              }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '6px',
              color: 'var(--color-dark)'
            }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@learts.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-light-bg)',
                color: 'var(--color-dark)',
                fontSize: '0.95rem',
              }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '6px',
              color: 'var(--color-dark)'
            }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-light-bg)',
                color: 'var(--color-dark)',
                fontSize: '0.95rem',
              }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '6px',
              color: 'var(--color-dark)'
            }}>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-light-bg)',
                color: 'var(--color-dark)',
                fontSize: '0.95rem',
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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
          Already have an account?{' '}
          <Link to="/admin/login" style={{ 
            color: 'var(--color-primary)', 
            fontWeight: 500, 
            borderBottom: '1px solid var(--color-primary)' 
          }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
