import React from 'react';
import { useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <div className="footer1-section section section-padding bg-light">
      <div className="container">
        <div className="row text-center row-cols-1">
          {/* Footer Logo */}
          <div className="footer1-logo col text-center">
            <img src="/assets/images/logo/logo.webp" alt="Learts Logo" />
          </div>

          {/* Footer Menu */}
          <div className="footer1-menu col">
            <ul className="widget-menu justify-content-center">
              <li><a href="#">About us</a></li>
              <li><a href="#">Store location</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Policy</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          {/* Footer Subscribe Form */}
          <div className="footer1-subscribe d-flex flex-column col">
            <form id="mc-form" className="mc-form widget-subscibe" onSubmit={(e) => e.preventDefault()}>
              <input id="mc-email" autoComplete="off" type="email" placeholder="Enter your e-mail address" />
              <button id="mc-submit" className="btn btn-dark">subscribe</button>
            </form>
          </div>

          {/* Footer Social icons */}
          <div className="footer1-social col">
            <ul className="widget-social justify-content-center">
              <li className="hintT-top" data-hint="Twitter">
                <a href="https://www.twitter.com/" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li className="hintT-top" data-hint="Facebook">
                <a href="https://www.facebook.com/" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li className="hintT-top" data-hint="Instagram">
                <a href="https://www.instagram.com/" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
              <li className="hintT-top" data-hint="Youtube">
                <a href="https://www.youtube.com/" aria-label="Youtube">
                  <i className="fab fa-youtube"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* Footer Copyright */}
          <div className="footer1-copyright col">
            <p className="copyright">
              &copy; {new Date().getFullYear()} learts. All Rights Reserved | <strong>(+00) 123 567990</strong> | <a href="mailto:contact@learts.com">contact@learts.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
