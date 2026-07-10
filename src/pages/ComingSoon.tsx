import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const ComingSoon: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 120,
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString().trim();
    if (!email) return;

    toast.success('Thank you! You have successfully subscribed for notifications.');
    e.currentTarget.reset();
  };

  return (
    <div 
      className="coming-soon-section section" 
      style={{ 
        backgroundImage: 'url("/assets/images/bg/coming-soon-bg.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 0'
      }}
    >
      <div className="container">
        <div className="coming-soon-content text-center" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '50px 30px', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div className="logo" style={{ marginBottom: '30px' }}>
            <a href="/"><img src="/assets/images/logo/logo-2.webp" alt="Learts" /></a>
          </div>
          
          <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '30px', color: '#111' }}>Coming soon</h2>
          
          {/* Countdown Clock */}
          <div className="countdown-wrap" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 600, display: 'block', color: 'var(--color-primary)' }}>{timeLeft.days}</span>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#999', letterSpacing: '0.1em' }}>Days</span>
            </div>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 600, display: 'block', color: 'var(--color-primary)' }}>{timeLeft.hours}</span>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#999', letterSpacing: '0.1em' }}>Hours</span>
            </div>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 600, display: 'block', color: 'var(--color-primary)' }}>{timeLeft.minutes}</span>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#999', letterSpacing: '0.1em' }}>Mins</span>
            </div>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 600, display: 'block', color: 'var(--color-primary)' }}>{timeLeft.seconds}</span>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#999', letterSpacing: '0.1em' }}>Secs</span>
            </div>
          </div>

          {/* Subscription form */}
          <div className="coming-soon-subscribe" style={{ maxWidth: '450px', margin: '0 auto' }}>
            <form onSubmit={handleSubscribe} className="widget-subscibe" style={{ display: 'flex', gap: '8px' }}>
              <input 
                name="email"
                type="email" 
                placeholder="Enter your e-mail address" 
                required 
                style={{ flexGrow: 1, height: '48px', padding: '0 15px', border: '1px solid #ddd', fontSize: '0.9rem' }} 
              />
              <button type="submit" className="btn btn-dark" style={{ height: '48px', padding: '0 25px' }}>subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ComingSoon;
