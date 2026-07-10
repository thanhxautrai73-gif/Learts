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
    title: 'Minimalist Dining Set',
    desc: 'Complete dinnerware set featuring clean edges and neutral hues.'
  }
];

export const Portfolio4Columns: React.FC = () => {
  return (
    <div className="portfolio-page-template">
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
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Portfolio 4 Columns</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Portfolio 4 Columns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 learts-mb-n30">
            {portfolioItems.map((item) => (
              <div className="col learts-mb-30" key={item.id}>
                <div className="portfolio">
                  <div className="portfolio-thumb">
                    <Link to={`/portfolio-details/${item.id}`} className="image">
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                    </Link>
                  </div>
                  <div className="portfolio-info" style={{ marginTop: '15px' }}>
                    <h4 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0 0 5px' }}>
                      <Link to={`/portfolio-details/${item.id}`} style={{ color: '#111' }}>{item.title}</Link>
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#777', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Portfolio4Columns;
