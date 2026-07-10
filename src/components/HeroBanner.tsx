import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  bgImage: string;
  title: string;
  subTitle: string;
  contentClass: string;
}

const slides: Slide[] = [
  {
    bgImage: '/assets/images/slider/home1/slide-1.webp',
    title: 'Handicraft Shop',
    subTitle: 'Just for you',
    contentClass: 'home1-slide1-content'
  },
  {
    bgImage: '/assets/images/slider/home1/slide-2.webp',
    title: 'Newly arrived',
    subTitle: 'Sale up to 10%',
    contentClass: 'home1-slide2-content'
  },
  {
    bgImage: '/assets/images/slider/home1/slide-3.webp',
    title: 'Affectious gifts',
    subTitle: 'For friends & family',
    contentClass: 'home1-slide3-content'
  }
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="home1-slider swiper-container" style={{ position: 'relative', height: '600px', overflow: 'hidden' }}>
      <div className="swiper-wrapper">
        <div 
          className="home1-slide-item swiper-slide swiper-slide-active" 
          style={{ 
            backgroundImage: `url(${slide.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            transition: 'background-image 0.8s ease-in-out'
          }}
        >
          <div className="container" style={{ width: '100%' }}>
            <div className={slide.contentClass}>
              <span className="bg"></span>
              <span className="slide-border"></span>
              <h2 className="title" style={{ color: '#111' }}>{slide.title}</h2>
              <h3 className="sub-title" style={{ color: '#777' }}>{slide.subTitle}</h3>
              <div className="link">
                <Link to="/shop">shop now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="home1-slider-prev swiper-button-prev"
        style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
        aria-label="Previous Slide"
      >
        <i className="ti-angle-left"></i>
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="home1-slider-next swiper-button-next"
        style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
        aria-label="Next Slide"
      >
        <i className="ti-angle-right"></i>
      </button>
    </div>
  );
};
export default HeroBanner;
