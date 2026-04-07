import React, { useState, useEffect, useContext } from 'react';
import { Clock, User, Tag as TagIcon, BookOpen, Feather } from 'lucide-react';
import { postService } from '../api/postService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
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
        const publishedPosts = allPosts.filter((post) => post.status === 'PUBLISHED');
        setPosts(publishedPosts);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedPosts();
  }, []);

  const parseTagName = (tag) => {
    if (typeof tag === 'string') {
      const match = tag.match(/name=([^,)]+)/);
      return match && match[1] ? match[1].trim() : tag;
    }
    return tag?.name || tag;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-dark-400/50 px-4 py-3">
        <h1 className="text-xl font-bold text-dark-800">Home</h1>
      </div>

      {/* Hero Banner */}
      {!isAuthenticated && (
        <div className="border-b border-dark-400/50 p-6 bg-gradient-to-br from-brand/10 via-dark-100 to-purple-500/10">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-dark-800 mb-2">Welcome to Kothika</h2>
            <p className="text-dark-600 mb-4 text-[15px] leading-relaxed">
              Discover insights, tutorials, and stories from creative writers. Join our community to start sharing.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-sm py-2"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-outline text-sm py-2"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex border-b border-dark-400/50">
        <button className="flex-1 py-3.5 text-[15px] font-bold text-brand relative hover:bg-dark-100/50 transition-colors">
          Latest
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brand rounded-full" />
        </button>
        <button className="flex-1 py-3.5 text-[15px] font-medium text-dark-600 hover:bg-dark-100/50 transition-colors">
          Popular
        </button>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="post-card animate-pulse-soft">
              <div className="flex gap-3">
                <div className="w-10 h-10 skeleton rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 skeleton w-40" />
                  <div className="h-5 skeleton w-full" />
                  <div className="h-4 skeleton w-3/4" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-dark-600" />
          </div>
          <h3 className="text-xl font-bold text-dark-800 mb-2">No articles published yet</h3>
          <p className="text-dark-600 max-w-sm">
            Check back later for exciting new content from our writers!
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="post-card animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {post.authorName?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Author & Meta Row */}
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <span className="font-bold text-dark-800 text-[15px] truncate">
                      {post.authorName}
                    </span>
                    <span className="text-dark-600 text-sm">·</span>
                    <span className="text-dark-600 text-sm flex items-center gap-1 shrink-0">
                      <Clock size={12} />
                      {post.readingTime} min read
                    </span>
                  </div>

                  {/* Category */}
                  <div className="mb-2">
                    <span className="tag-pill">{post.categoryName || 'Uncategorized'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-bold text-dark-800 mb-1 leading-snug">
                    {post.title}
                  </h3>

                  {/* Content preview */}
                  <p className="text-dark-700 text-[15px] leading-relaxed mb-3 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-brand hover:underline cursor-pointer">
                          #{parseTagName(tag)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engagement bar */}
                  <div className="flex items-center gap-6 mt-3 text-dark-600">
                    <button className="flex items-center gap-1.5 hover:text-brand transition-colors text-sm group">
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs">Reply</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors text-sm group">
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-xs">Repost</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors text-sm group">
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xs">Like</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-brand transition-colors text-sm group">
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-xs">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;