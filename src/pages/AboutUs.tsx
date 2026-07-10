import React from 'react';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
  return (
    <div className="about-us-page-template">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-3.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>About Us</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">About us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Title Section End */}

      {/* About Section Start */}
      <div className="section section-padding pb-0">
        <div className="container">
          <div className="row learts-mb-n30">
            <div className="col-md-6 col-12 align-self-center learts-mb-30">
              <div className="about-us3">
                <span className="sub-title">Live out your life.</span>
                <h2 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>The happiness of <br /> crafting artworks</h2>
                <div className="desc">
                  <p>It’s all about the joy when finally you have done something beautiful on your own and observe it with quite a great deal of proud & successful feeling.</p>
                </div>
                <Link to="/shop" className="link">Learn more</Link>
              </div>
            </div>
            <div className="col-md-6 col-12 text-center learts-mb-30">
              <img src="/assets/images/about/about-5.webp" alt="About" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </div>
      {/* About Section End */}

      {/* Feature Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="row row-cols-md-3 row-cols-1 learts-mb-n30">
            <div className="col learts-mb-30">
              <div className="icon-box4">
                <div className="inner">
                  <div className="content">
                    <h6 className="title" style={{ fontWeight: 600 }}>FREE SHIPPING</h6>
                    <p>Once receiving your order, we will turn your products around in 3- 5 business days.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col border-left border-right learts-mb-30">
              <div className="icon-box4">
                <div className="inner">
                  <div className="content">
                    <h6 className="title" style={{ fontWeight: 600 }}>FREE RETURNS</h6>
                    <p>We accept returns for freshly purchased products within 7 days from the payment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col learts-mb-30">
              <div className="icon-box4">
                <div className="inner">
                  <div className="content">
                    <h6 className="title" style={{ fontWeight: 600 }}>SECURE PAYMENT</h6>
                    <img className="img-hover-color" src="/assets/images/others/pay.webp" alt="Payment Gateways" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Feature Section End */}

      {/* Video Banner Section Start */}
      <div className="section">
        <div className="container">
          <div 
            className="video-banner2" 
            style={{ 
              backgroundImage: 'url("/assets/images/banner/video/video-banner-2.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="content">
              <a href="https://www.youtube.com/watch?v=1jSsy7DtYgc" target="_blank" rel="noopener noreferrer" className="video-popup">
                <img src="/assets/images/icons/button-play-light.webp" alt="Play Video" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Video Banner Section End */}

      {/* Feature Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="row learts-mb-n30">
            <div className="col-xl-3 col-lg-4 col-12 me-auto learts-mb-30">
              <h1 className="fw-400" style={{ fontFamily: 'var(--font-serif)' }}>The difference when you shop Learts!</h1>
            </div>
            <div className="col-lg-8 col-12 learts-mb-30">
              <div className="row learts-mb-n30">
                <div className="col-md-6 col-12 learts-mb-30">
                  <p className="text-heading fw-600 learts-mb-10">Free Shipping</p>
                  <p>Once receiving your order, we will turn your products around in 3-5 business days.</p>
                </div>

                <div className="col-md-6 col-12 learts-mb-30">
                  <p className="text-heading fw-600 learts-mb-10">Free Returns</p>
                  <p>We accept returns for freshly purchased products within 7 days from the payment.</p>
                </div>

                <div className="col-md-6 col-12 learts-mb-30">
                  <p className="text-heading fw-600 learts-mb-10">Superb Quality</p>
                  <p>We make commitments that the quality of our products will and always will be superb.</p>
                </div>

                <div className="col-md-6 col-12 learts-mb-30">
                  <p className="text-heading fw-600 learts-mb-10">Free Wrapping</p>
                  <p>Upon request, items bought as gifts from our store can receive free wrapping service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Feature Section End */}
    </div>
  );
};
export default AboutUs;
