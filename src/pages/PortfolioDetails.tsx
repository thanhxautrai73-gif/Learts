import React from 'react';
import { useParams, Link } from 'react-router-dom';

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
    desc: 'My personalized Walnut or Maple Cutting Board makes a wonderful gift. Custom Wedding gift. Unique anniversary gift. My boards are of the highest quality and made here in the US with all natural wood.'
  },
  {
    id: 3,
    image: '/assets/images/portfolio/portfolio-3.webp',
    title: 'Elegant Kitchen Utensils',
    desc: 'This is made of porcelain, lead free and stain resistant. Perfect utensil organizer for kitchen decor.'
  },
  {
    id: 4,
    image: '/assets/images/portfolio/portfolio-4.webp',
    title: 'Handmade Coffee Mug',
    desc: 'Each coffee mug is thrown on the potter wheel and hand-painted. Beautiful rustic aesthetics.'
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

export const PortfolioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const itemId = id ? parseInt(id) : 2; // Defaults to Wooden Cutting Board (id 2) as in the static page!
  const item = portfolioItems.find((p) => p.id === itemId) || portfolioItems[1];

  return (
    <div className="portfolio-details-template">
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
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>{item.title}</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item"><Link to="/portfolio">Portfolio</Link></li>
                  <li className="breadcrumb-item active">{item.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section Start */}
      <div className="section section-padding border-bottom">
        <div className="container">
          <div className="row learts-mb-n30">
            {/* Portfolio Image */}
            <div className="col-xl-8 col-12 learts-mb-30">
              <div className="portfolio-image">
                <img src={item.image} alt={item.title} style={{ width: '100%', maxHeight: '550px', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Portfolio Content */}
            <div className="col-xl-4 col-12 learts-mb-30">
              <div className="portfolio-content" style={{ paddingLeft: '15px' }}>
                <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '15px', color: '#111' }}>{item.title}</h2>
                <div className="desc" style={{ color: '#555', lineHeight: '1.8' }}>
                  <p>{item.desc}</p>
                  <p>It is oval shape, which will not make the utensils scatter when you put many cooking utensils in it. It is dishwasher safe.</p>
                  <p>The product itself is of highest craftsmanship and carefully vetted by our workshop experts.</p>
                </div>
                <ul className="meta" style={{ listStyle: 'none', padding: 0, marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <span className="name" style={{ fontWeight: 600, width: '120px' }}>Date:</span>
                    <span className="value" style={{ color: '#666' }}>November 22, 2020</span>
                  </li>
                  <li style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <span className="name" style={{ fontWeight: 600, width: '120px' }}>Categories:</span>
                    <span className="value category" style={{ display: 'flex', gap: '8px' }}>
                      <Link to="/portfolio" style={{ color: 'var(--color-primary)' }}>Decor</Link>
                      <Link to="/portfolio" style={{ color: 'var(--color-primary)' }}>Toy</Link>
                    </span>
                  </li>
                  <li style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <span className="name" style={{ fontWeight: 600, width: '120px' }}>Tags:</span>
                    <span className="value tags">
                      <Link to="/portfolio" style={{ color: '#666' }}>trending</Link>
                    </span>
                  </li>
                  <li style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <span className="name" style={{ fontWeight: 600, width: '120px' }}>Links:</span>
                    <span className="value">
                      <a href="https://learts.thememove.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>learts.thememove.com</a>
                    </span>
                  </li>
                  <li style={{ display: 'flex', paddingBottom: '8px' }}>
                    <span className="name" style={{ fontWeight: 600, width: '120px' }}>Share:</span>
                    <span className="value social" style={{ display: 'flex', gap: '15px', color: '#666' }}>
                      <a href="#"><i className="fab fa-facebook-f"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                      <a href="#"><i className="fab fa-pinterest-p"></i></a>
                      <a href="#"><i className="far fa-envelope"></i></a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="section-title2 text-center" style={{ marginBottom: '40px' }}>
            <h2 className="title title-icon-both" style={{ fontFamily: 'var(--font-serif)' }}>Project Overview</h2>
            <p className="text-muted">You don’t need expensive ornaments to make your house look more fashionable.</p>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="portfolio-overview" style={{ color: '#555', lineHeight: '1.8' }}>
                <p>Back in 1989, the first time I got on the Internet, at that time I was still pretty young. I didn’t go to college so I had to find a stable job for myself. I never found what I was into and what I could do well for a living. I tried and got rejected so many times.</p>
                <p>Google and Facebook weren’t even around as well at that time. One day in 1999, I suddenly had this idea of creating a website that introduce my handmade projects, providing not only handcraft lessons but also selling stuff to earn some money for myself.</p>
                
                {/* Collage grid with local files */}
                <div className="row learts-mt-30 learts-mb-30" style={{ margin: '30px 0' }}>
                  <div className="col-lg-6 col-12 learts-mb-30">
                    <div className="sale-banner7" style={{ overflow: 'hidden', borderRadius: '4px' }}>
                      <div className="inner">
                        <div className="image">
                          <img src="/assets/images/product/single/3/banner/banner-1.webp" alt="Collage 1" style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-12 learts-mb-30">
                    <div className="row g-3">
                      <div className="col-sm-6 col-12">
                        <div className="sale-banner7" style={{ overflow: 'hidden', borderRadius: '4px' }}>
                          <div className="inner">
                            <div className="image">
                              <img src="/assets/images/product/single/3/banner/banner-2.webp" alt="Collage 2" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-12">
                        <div className="sale-banner7" style={{ overflow: 'hidden', borderRadius: '4px' }}>
                          <div className="inner">
                            <div className="image">
                              <img src="/assets/images/product/single/3/banner/banner-3.webp" alt="Collage 3" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-12">
                        <div className="sale-banner7" style={{ overflow: 'hidden', borderRadius: '4px' }}>
                          <div className="inner">
                            <div className="image">
                              <img src="/assets/images/product/single/3/banner/banner-4.webp" alt="Collage 4" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-12">
                        <div className="sale-banner7" style={{ overflow: 'hidden', borderRadius: '4px' }}>
                          <div className="inner">
                            <div className="image">
                              <img src="/assets/images/product/single/3/banner/banner-5.webp" alt="Collage 5" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p>Then I got to learn about how to start a website on my own. I created a website called leartshandmade.com. I spent years developing it, teaching HTML to myself, networking with in-field professionals, and growing it into a profitable business.</p>
                <p>Throughout the years, I cooperated with plenty of craft companies to grow my website. I had worked as the craft expert for Miimo Studio (miimo.thememove.com), and created fun crafts for kids from 2009-2016. Also, I have self-published many online magazines, including ForHer.mag.com, LiveLife.com & ForEverYoung.net.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortfolioDetails;
