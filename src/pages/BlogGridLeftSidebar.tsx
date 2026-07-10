import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  image: string;
  date: string;
  views: number;
  title: string;
  desc: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: '/assets/images/blog/s870/blog-1.webp',
    date: 'January 22, 2020',
    views: 201,
    title: 'Start a Kickass Online Blog',
    desc: 'Working on writing our first book has been one of the most amazing projects. It seems like it will be forever until I get to show you what we’ve been working on.'
  },
  {
    id: 2,
    image: '/assets/images/blog/s870/blog-2.webp',
    date: 'January 22, 2020',
    views: 158,
    title: 'Tile Tray with Brass Handles',
    desc: 'Happy New Year All! I am back after the holiday break and so excited for all the home projects I have planned in 2020. So when they asked me to come up with a tutorial...'
  },
  {
    id: 3,
    image: '/assets/images/blog/s870/blog-3.webp',
    date: 'January 22, 2020',
    views: 119,
    title: 'Dining Table Chairs Makeover',
    desc: 'I did not know exactly the shape I was looking for, but knew that I wanted to paint them with this SUPER pretty Krylon Italian Olive color. I stopped at a local thrift store...'
  }
];

export const BlogGridLeftSidebar: React.FC = () => {
  return (
    <div className="blog-page-template">
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
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Blog Grid Left Sidebar</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Blog Grid</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-padding">
        <div className="container">
          <div className="row learts-mb-n50">
            {/* Sidebar Column (Left Side) */}
            <div className="col-xl-3 col-lg-4 col-12 order-lg-1 learts-mb-50">
              <div className="widgets" style={{ marginRight: '15px' }}>
                <div className="widget learts-mb-40">
                  <h3 className="widget-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>About Me</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.7', marginTop: '15px' }}>
                    Learts is a place where you can share design stories, handicraft tutorials and browse our latest collections.
                  </p>
                </div>
                <div className="widget learts-mb-40">
                  <h3 className="widget-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Recent Posts</h3>
                  <ul className="widget-list" style={{ listStyle: 'none', padding: 0, marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {blogPosts.map((post) => (
                      <li key={post.id} style={{ display: 'flex', gap: '10px' }}>
                        <img src={post.image} alt={post.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <Link to="/blog" style={{ fontSize: '0.9rem', color: '#111', fontWeight: 600, display: 'block', lineHeight: '1.3' }}>{post.title}</Link>
                          <span style={{ fontSize: '0.75rem', color: '#999' }}>{post.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Blog Area (Right Side) */}
            <div className="col-xl-9 col-lg-8 col-12 order-lg-2 learts-mb-50">
              <div className="row learts-mb-n40">
                {blogPosts.map((post) => (
                  <div className="col-md-6 col-12 learts-mb-40" key={post.id}>
                    <div className="blog" style={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="blog-image">
                        <Link to={`/blog`} className="image">
                          <img src={post.image} alt={post.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                        </Link>
                      </div>
                      <div className="blog-content" style={{ padding: '20px' }}>
                        <ul className="meta" style={{ display: 'flex', gap: '15px', listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#999', marginBottom: '10px' }}>
                          <li><i className="far fa-calendar"></i> {post.date}</li>
                          <li><i className="far fa-eye"></i> {post.views} Views</li>
                        </ul>
                        <h4 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '12px' }}>
                          <Link to={`/blog`} style={{ color: '#111' }}>{post.title}</Link>
                        </h4>
                        <p className="desc" style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>{post.desc.substring(0, 100)}...</p>
                        <Link to={`/blog`} className="link" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-primary)' }}>Read More</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlogGridLeftSidebar;
