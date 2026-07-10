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

export const BlogGridFullWidth: React.FC = () => {
  return (
    <div className="blog-page-template">
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
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Blog Grid Full Width</h1>
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
        <div className="container-fluid" style={{ padding: '0 30px' }}>
          <div className="row learts-mb-n40">
            {blogPosts.map((post) => (
              <div className="col-xl-4 col-md-6 col-12 learts-mb-40" key={post.id}>
                <div className="blog" style={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className="blog-image">
                    <Link to={`/blog`} className="image">
                      <img src={post.image} alt={post.title} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
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
  );
};
export default BlogGridFullWidth;
