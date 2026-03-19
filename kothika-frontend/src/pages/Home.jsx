import React, { useState, useEffect } from 'react';
import { Clock, User, Tag as TagIcon, BookOpen, ArrowRight } from 'lucide-react';

// ⚠️ IMPORTANT: FOR YOUR LOCAL VS CODE ⚠️
// 1. Uncomment the import line below to use your real backend:
// import { postService } from '../api/postService';

// 2. Delete the temporary mock service object below before saving in your local editor!
const postService = {
  getAllPosts: async () => ({
    data: [
      {
        id: '1',
        title: 'Tech Trends 2026',
        content: 'Technology is evolving rapidly with AI, cloud computing, and automation transforming industries. Developers must continuously learn to keep up with these massive changes.',
        categoryName: 'TECHNOLOGY',
        status: 'PUBLISHED',
        authorName: 'Deepak',
        readingTime: 5,
        tags: [{ id: '1', name: 'Technology' }, { id: '2', name: 'AI' }]
      },
      {
        id: '2',
        title: 'Hidden Draft Post',
        content: 'This post is a draft, so it will be filtered out and will NOT appear on the public home page.',
        categoryName: 'LIFESTYLE',
        status: 'DRAFT',
        authorName: 'Deepak',
        readingTime: 3,
        tags: [{ id: '3', name: 'Drafting' }]
      }
    ]
  })
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      try {
        setLoading(true);
        const response = await postService.getAllPosts();
        
        let allPosts = [];
        if (Array.isArray(response.data)) {
          allPosts = response.data;
        } else if (response.data && Array.isArray(response.data.content)) {
          allPosts = response.data.content;
        }
        
        // Filter ONLY published posts for the public home page
        const publishedPosts = allPosts.filter(post => post.status === 'PUBLISHED');
        setPosts(publishedPosts);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedPosts();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* --- HERO SECTION --- */}
      <div className="w-full bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Welcome to Kothika
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Discover insights, tutorials, and stories from our creative writers. Explore the latest trends in technology, lifestyle, and more.
        </p>
      </div>

      {/* --- PUBLISHED POSTS GRID --- */}
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Latest Articles</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No articles published yet</h3>
            <p className="text-gray-500">Check back later for exciting new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group cursor-pointer">
                
                {/* Optional: A placeholder image for the blog card */}
                <div className="h-48 bg-gray-200 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent z-10"></div>
                  {/* We are using a gradient placeholder, but later you can add real images! */}
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <BookOpen size={48} opacity={0.2} />
                  </div>
                  <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {post.categoryName || 'Uncategorized'}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow leading-relaxed">
                    {post.content}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <User size={16} />
                        <span className="truncate max-w-[120px] font-medium">{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <Clock size={14} />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                          <TagIcon size={14} className="text-gray-400 flex-shrink-0" />
                          <div className="flex gap-2">
                            {post.tags.slice(0, 2).map((tag, idx) => {
                              let displayTag = tag;
                              try {
                                if (typeof tag === 'string') {
                                  const match = tag.match(/name=([^,)]+)/);
                                  if (match && match[1]) displayTag = match[1].trim();
                                } else if (tag && tag.name) {
                                  displayTag = tag.name;
                                }
                              } catch (e) {}
                              return (
                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md whitespace-nowrap">
                                  #{displayTag}
                                </span>
                              );
                            })}
                            {post.tags.length > 2 && (
                              <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={18} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;