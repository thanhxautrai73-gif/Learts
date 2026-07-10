import React from 'react';
import toast from 'react-hot-toast';

export const ContactUs: React.FC = () => {
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    toast.success(`Thank you, ${name}! Your message has been submitted. We will contact you soon.`);
    e.currentTarget.reset();
  };

  return (
    <div className="contact-us-page-template">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-2.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Contact Us</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Contact us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Title Section End */}

      {/* Contact Information & Map Section Start */}
      <div className="section section-padding">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-title2 text-center">
            <h2 className="title" style={{ fontFamily: 'var(--font-serif)' }}>Keep in touch with us</h2>
            <p>Been tearing your hair out to find the perfect gift for your loved ones? Try visiting our nationwide local stores. You can also contact us to become partner or distributor. Call us, send us an email or make an appointment now.</p>
          </div>
          {/* Section Title End */}

          {/* Contact Information Start */}
          <div className="row learts-mb-n30">
            <div className="col-lg-4 col-md-6 col-12 learts-mb-30">
              <div className="contact-info">
                <h4 className="title" style={{ fontWeight: 600 }}>ADDRESS</h4>
                <span className="info"><i className="icon fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i> 1800 Abbot Kinney Blvd. Unit D & E Venice</span>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12 learts-mb-30">
              <div className="contact-info">
                <h4 className="title" style={{ fontWeight: 600 }}>CONTACT</h4>
                <span className="info"><i className="icon fas fa-phone-alt" style={{ marginRight: '8px' }}></i> Mobile: (+88) – 1990 – 6886 <br /> Hotline: 1800 – 1102</span>
                <span className="info"><i className="icon far fa-envelope" style={{ marginRight: '8px' }}></i> Mail: <a href="mailto:contact@leartsstore.com">contact@leartsstore.com</a></span>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12 learts-mb-30">
              <div className="contact-info">
                <h4 className="title" style={{ fontWeight: 600 }}> HOUR OF OPERATION</h4>
                <span className="info"><i className="icon far fa-clock" style={{ marginRight: '8px' }}></i> Monday – Friday : 09:00 – 20:00 <br /> Sunday & Saturday: 10:30 – 22:00</span>
              </div>
            </div>
          </div>
          {/* Contact Information End */}

          {/* Contact Map Start */}
          <div className="row learts-mt-60">
            <div className="col">
              <iframe 
                className="contact-map" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2136.986005919501!2d-73.9685579655238!3d40.75862446708152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258e4a1c884e5%3A0x24fe1071086b36d5!2sThe%20Atrium!5e0!3m2!1sen!2sbd!4v1585132512970!5m2!1sen!2sbd" 
                style={{ border: 0, width: '100%', height: '400px' }} 
                allowFullScreen={true}
                loading="lazy"
                title="Store Map Location"
              ></iframe>
            </div>
          </div>
          {/* Contact Map End */}
        </div>
      </div>
      {/* Contact Information & Map Section End */}

      {/* Contact Form Section Start */}
      <div className="section section-padding pt-0">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-title2 text-center">
            <h2 className="title" style={{ fontFamily: 'var(--font-serif)' }}>Send a message</h2>
          </div>
          {/* Section Title End */}

          <div className="row">
            <div className="col-lg-8 col-12 mx-auto">
              <div className="contact-form">
                <form onSubmit={handleContactSubmit} id="contact-form">
                  <div className="row learts-mb-n30">
                    <div className="col-md-6 col-12 learts-mb-30">
                      <input type="text" placeholder="Your Name *" name="name" required />
                    </div>
                    <div className="col-md-6 col-12 learts-mb-30">
                      <input type="email" placeholder="Email *" name="email" required />
                    </div>
                    <div className="col-12 learts-mb-30">
                      <textarea name="message" placeholder="Message *" required style={{ height: '150px', resize: 'vertical' }}></textarea>
                    </div>
                    <div className="col-12 text-center learts-mb-30">
                      <button type="submit" className="btn btn-dark btn-outline-hover-dark" style={{ padding: '12px 35px' }}>Submit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Section End */}
    </div>
  );
};
export default ContactUs;
