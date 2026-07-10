import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Page404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="section-404 section" 
      style={{ 
        backgroundImage: 'url("/assets/images/bg/bg-404.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 0'
      }}
    >
      <div className="container">
        <div className="content-404" style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '60px 40px', borderRadius: '4px', maxWidth: '550px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h1 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--color-primary)' }}>Oops!</h1>
          <h2 className="sub-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '20px', color: '#111' }}>Page not found!</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>You could either go back or go to homepage</p>
          <div className="buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary btn-outline-hover-dark" 
              onClick={() => navigate(-1)}
              style={{ padding: '0 25px', height: '48px', lineHeight: '48px' }}
            >
              Go back
            </button>
            <button 
              className="btn btn-dark btn-outline-hover-dark" 
              onClick={() => navigate('/')}
              style={{ padding: '0 25px', height: '48px', lineHeight: '48px' }}
            >
              Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page404;
