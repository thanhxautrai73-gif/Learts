import React from 'react';
import { Link } from 'react-router-dom';

interface PortfolioItem {
  id: number;
  image: string;
  title: string;
  desc: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    image: '/assets/images/portfolio/portfolio-1.webp',
    title: 'Fresh Fruit Keeper',
    desc: 'I made this out of brushed stainless steel. It has a beautiful polished look.'
  },
  {
    id: 2,
    image: '/assets/images/portfolio/portfolio-2.webp',
    title: 'Wooden Cutting Board',
    desc: 'My personalized Walnut or Maple Cutting Board makes a wonderful gift.'
  },
  {
    id: 3,
    image: '/assets/images/portfolio/portfolio-3.webp',
    title: 'Elegant Kitchen Utensils',
    desc: 'This is made of porcelain, lead free and stain resistant.'
  },
  {
    id: 4,
    image: '/assets/images/portfolio/portfolio-4.webp',
    title: 'Handmade Coffee Mug',
    desc: 'Each coffee mug is thrown on the potter wheel and hand-painted.'
  },
  {
    id: 5,
    image: '/assets/images/portfolio/portfolio-5.webp',
    title: 'Decor Ceramic Jar',
    desc: 'A gorgeous stoneware ceramic storage container for cookies or sugar.'
  },
  {
    id: 6,
    image: '/assets/images/portfolio/portfolio-6.webp',
    title: 'Wool Knitted Blanket',
    desc: 'Super soft oversized knitted blanket made from pure merino sheep wool.'
  }
];

export const Portfolio: React.FC = () => {
  return (
    <div className="portfolio-page-template">
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
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Portfolio</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Portfolio</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Title Section End */}

      {/* Portfolio Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4 learts-mb-n30">
            {portfolioItems.map((item) => (
              <div className="col learts-mb-30" key={item.id}>
                <div className="portfolio">
                  <div className="thumbnail" style={{ overflow: 'hidden' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                  </div>
                  <div className="content" style={{ padding: '20px 0' }}>
                    <h4 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                      <Link to="/portfolio">{item.title}</Link>
                    </h4>
                    <div className="desc">
                      <p>{item.desc}</p>
                    </div>
                    <div className="link">
                      <Link to="/portfolio" style={{ fontWeight: 600 }}>Read more</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Portfolio Section End */}
    </div>
  );
};
export default Portfolio;
