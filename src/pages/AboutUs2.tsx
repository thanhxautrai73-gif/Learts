import React from 'react';

export const AboutUs2: React.FC = () => {
  return (
    <div className="about-us-2-page">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-1.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="page-title">
            <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>About Us 02</h1>
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">About Us 02</li>
            </ul>
          </div>
        </div>
      </div>

      {/* About Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="row learts-mb-n30 align-items-center">
            <div className="col-lg-4 col-12 learts-mb-30">
              <div className="about-us4">
                <span className="sub-title" style={{ color: 'var(--color-primary)', letterSpacing: '0.15em', fontWeight: 600 }}>LEARTS STORE</span>
                <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '10px', color: '#111' }}>Aspiration Inspired Happiness</h2>
              </div>
            </div>
            <div className="col-lg-8 col-12 learts-mb-30">
              <img src="/assets/images/about/about-6.webp" alt="About Gray" style={{ width: '100%', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* About Details Section Start */}
      <div className="section section-fluid section-padding pt-0">
        <div className="container">
          <div className="row learts-mb-n30 align-items-center">
            <div className="col-lg-6 col-12 text-center learts-mb-30">
              <img src="/assets/images/about/about-7.webp" alt="About Stone" style={{ maxWidth: '100%', borderRadius: '4px' }} />
            </div>

            <div className="col-lg-6 col-12 learts-mb-30">
              <div className="about-us4" style={{ paddingLeft: '15px' }}>
                <div className="row learts-mb-n30">
                  <div className="col-xl-8 col-12 learts-mb-30">
                    <div className="desc mb-0" style={{ color: '#555', lineHeight: '1.7' }}>
                      <p>Crafting beautiful stuff with our own hands and the help from useful tools is a wonderful process, where you can enjoy yourself while pulling out some ideas and busy perfecting your work.</p>
                    </div>
                  </div>
                  
                  {/* Address Icon Box */}
                  <div className="col-12 learts-mb-30" style={{ marginTop: '20px' }}>
                    <div className="icon-box4 text-left justify-content-start text-start" style={{ display: 'flex', gap: '15px' }}>
                      <div className="inner">
                        <div className="content">
                          <h6 className="title" style={{ fontWeight: 600, margin: '0 0 5px', color: '#111' }}>ADDRESS</h6>
                          <p style={{ margin: 0, color: '#666' }}>1800 Abbot Kinney Blvd. Unit D & E Venice</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Icon Box */}
                  <div className="col-12 learts-mb-30" style={{ marginTop: '15px' }}>
                    <div className="icon-box4 text-left justify-content-start text-start" style={{ display: 'flex', gap: '15px' }}>
                      <div className="inner">
                        <div className="content">
                          <h6 className="title" style={{ fontWeight: 600, margin: '0 0 5px', color: '#111' }}>PHONE</h6>
                          <p style={{ margin: 0, color: '#666' }}>Mobile: (+88) – 1990 – 6886 <br /> Hotline: 1800 – 1102</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Icon Box */}
                  <div className="col-12 learts-mb-30" style={{ marginTop: '15px' }}>
                    <div className="icon-box4 text-left justify-content-start text-start" style={{ display: 'flex', gap: '15px' }}>
                      <div className="inner">
                        <div className="content">
                          <h6 className="title" style={{ fontWeight: 600, margin: '0 0 5px', color: '#111' }}>EMAIL</h6>
                          <p style={{ margin: 0, color: '#666' }}>contact@leartsstore.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Banner Section Start */}
      <div className="section">
        <div 
          className="video-banner" 
          style={{ 
            backgroundImage: 'url("/assets/images/banner/video/video-banner-1.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <div className="content">
            <h2 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '2.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>LITTLE <span style={{ fontWeight: 300 }}>SIMPLE</span> THINGS</h2>
            <a href="https://www.youtube.com/watch?v=1jSsy7DtYgc" target="_blank" rel="noopener noreferrer" className="video-popup" style={{ display: 'inline-block', marginTop: '20px' }}>
              <img src="/assets/images/icons/button-play.webp" alt="Play Video" style={{ width: '70px' }} />
            </a>
          </div>
        </div>
      </div>

      {/* Testimonials Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="section-title2 row justify-content-between align-items-center" style={{ marginBottom: '30px' }}>
            <div className="col-md-auto col-12">
              <h2 className="title title-icon-right" style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>We love our clients</h2>
            </div>
          </div>

          <div className="row row-cols-lg-2 row-cols-1 g-4">
            <div className="col">
              <div className="testimonial" style={{ padding: '30px', border: '1px solid #eee', height: '100%' }}>
                <p style={{ fontStyle: 'italic', color: '#555', lineHeight: '1.7' }}>"There's nothing would satisfy me much more than a worry-free clean and responsive theme for my high-traffic site."</p>
                <div className="author" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '20px' }}>
                  <img src="/assets/images/testimonial/testimonial-1.webp" alt="Client 1" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
                  <div className="content">
                    <h6 className="name" style={{ margin: 0, fontWeight: 600 }}>Anais Coulon</h6>
                    <span className="title" style={{ fontSize: '0.75rem', color: '#999' }}>Actor</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="testimonial" style={{ padding: '30px', border: '1px solid #eee', height: '100%' }}>
                <p style={{ fontStyle: 'italic', color: '#555', lineHeight: '1.7' }}>"Really good design/documentation, pretty much everything is nicely setup. The best choice for Woocommerce shop."</p>
                <div className="author" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '20px' }}>
                  <img src="/assets/images/testimonial/testimonial-2.webp" alt="Client 2" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
                  <div className="content">
                    <h6 className="name" style={{ margin: 0, fontWeight: 600 }}>Ian Schneider</h6>
                    <span className="title" style={{ fontSize: '0.75rem', color: '#999' }}>Actor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUs2;
