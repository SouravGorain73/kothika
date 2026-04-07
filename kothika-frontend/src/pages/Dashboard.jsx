import React, { useState, useEffect, useContext } from 'react';
import { Plus, Clock, User, Tag as TagIcon, X, AlertCircle, Edit2, Trash2, Feather, MoreHorizontal } from 'lucide-react';
import { postService } from '../api/postService';
import { categoryService } from '../api/categoryService';
import { tagService } from '../api/tagService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const initialFormState = {
    title: '',
    content: '',
    categoryId: '',
    tagIds: [],
    status: 'DRAFT',
    readingTime: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (showModal && categories.length === 0) {
      loadFormData();
    }
  }, [showModal]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else if (response.data && Array.isArray(response.data.content)) {
        setPosts(response.data.content);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [catsRes, tagsRes] = await Promise.all([
        categoryService.getAllCategories(),
        tagService.getAllTags(),
      ]);
      setCategories(catsRes.data || []);
      setTags(tagsRes.data || []);
      return { loadedCats: catsRes.data || [], loadedTags: tagsRes.data || [] };
    } catch (err) {
      setFormError('Failed to load categories or tags.');
      return { loadedCats: [], loadedTags: [] };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleEditClick = async (post) => {
    let currentCats = categories;
    let currentTags = tags;
    if (currentCats.length === 0 || currentTags.length === 0) {
      const { loadedCats, loadedTags } = await loadFormData();
      currentCats = loadedCats;
      currentTags = loadedTags;
    }

    const matchedCategory = currentCats.find((c) => c.name === post.categoryName);
    const categoryId = matchedCategory ? matchedCategory.id : '';

    const tagIds = [];
    if (post.tags) {
      post.tags.forEach((postTag) => {
        let tagName = '';
        if (typeof postTag === 'string') {
          const match = postTag.match(/name=([^,)]+)/);
          if (match && match[1]) tagName = match[1].trim();
          else tagName = postTag;
        } else if (postTag && postTag.name) {
          tagName = postTag.name;
        }
        const matchedTag = currentTags.find((t) => t.name === tagName);
        if (matchedTag) tagIds.push(matchedTag.id);
      });
    }

    setFormData({
      title: post.title,
      content: post.content,
      categoryId: categoryId,
      tagIds: tagIds,
      status: post.status,
      readingTime: post.readingTime,
    });
    setEditingPostId(post.id);
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      try {
        await postService.deletePost(id);
        fetchPosts();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete');
      }
    }
    setActiveMenu(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (formData.tagIds.length === 0) {
      setFormError('Please select at least one tag.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...formData, readingTime: parseInt(formData.readingTime, 10) };
      if (editingPostId) {
        await postService.updatePost(editingPostId, payload);
      } else {
        await postService.createPost(payload);
      }
      setShowModal(false);
      setEditingPostId(null);
      setFormData(initialFormState);
      fetchPosts();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setFormData(initialFormState);
    setEditingPostId(null);
    setFormError('');
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    if (status === 'PUBLISHED') return 'bg-green-500/10 text-green-400 border-green-500/20';
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-dark-800">Dashboard</h1>
            <p className="text-sm text-dark-600">Manage your posts</p>
          </div>
        </div>
      </div>

      {/* Compose Box */}
      <div className="border-b border-dark-400/50 p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <button
              onClick={openCreateModal}
              className="w-full text-left text-dark-600 text-xl py-2 hover:text-dark-700 transition-colors"
            >
              What's on your mind?
            </button>
            <div className="flex justify-end pt-2 border-t border-dark-400/50 mt-3">
              <button
                onClick={openCreateModal}
                className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
              >
                <Feather size={16} />
                New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex justify-between items-center animate-slide-down">
          <span>{error}</span>
          <button onClick={() => setError('')} className="hover:text-red-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="post-card animate-pulse-soft">
              <div className="flex gap-3">
                <div className="w-10 h-10 skeleton rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 skeleton w-1/3" />
                  <div className="h-4 skeleton w-full" />
                  <div className="h-4 skeleton w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
            <Feather size={32} className="text-brand" />
          </div>
          <h3 className="text-xl font-bold text-dark-800 mb-2">No posts yet</h3>
          <p className="text-dark-600 mb-6 max-w-sm">
            Share your first thought with the world. Click the button to start writing.
          </p>
          <button onClick={openCreateModal} className="btn-primary">
            Write your first post
          </button>
        </div>
      ) : (
        <div>
          {posts.map((post, index) => (
            <div key={post.id} className="post-card animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {post.authorName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Author & Meta */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-dark-800 text-[15px] truncate">
                        {post.authorName}
                      </span>
                      <span className="text-dark-600 text-sm">·</span>
                      <span className="text-dark-600 text-sm flex items-center gap-1 shrink-0">
                        <Clock size={12} />
                        {post.readingTime} min
                      </span>
                    </div>

                    {/* More menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === post.id ? null : post.id);
                        }}
                        className="p-1.5 rounded-full hover:bg-brand/10 hover:text-brand transition-colors text-dark-600"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {activeMenu === post.id && (
                        <div className="absolute right-0 top-full mt-1 glass-card shadow-2xl overflow-hidden animate-scale-in z-30 w-40">
                          <button
                            onClick={() => handleEditClick(post)}
                            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-dark-200 transition-colors text-left text-sm"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post.id)}
                            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-dark-200 transition-colors text-left text-sm text-red-400"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category + Status badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="tag-pill">{post.categoryName || 'Uncategorized'}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-bold text-dark-800 mb-1 leading-snug">{post.title}</h3>

                  {/* Content */}
                  <p className="text-dark-700 text-[15px] leading-relaxed mb-3 line-clamp-3">{post.content}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-brand hover:underline cursor-pointer"
                        >
                          #{parseTagName(tag)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-12 px-4">
          <div className="glass-card w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-dark-400/50">
              <h3 className="text-lg font-bold text-dark-800">
                {editingPostId ? 'Edit Post' : 'Create Post'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPostId(null);
                }}
                className="p-2 rounded-full hover:bg-dark-200 transition-colors text-dark-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 hide-scrollbar">
              {formError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form id="postForm" onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    maxLength="25"
                    placeholder="Give your post a title"
                    className="input-dark"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-dark-600 mt-1 text-right">{formData.title.length}/25</p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Content *</label>
                  <textarea
                    name="content"
                    required
                    maxLength="500"
                    rows="5"
                    placeholder="What's happening?"
                    className="input-dark resize-none"
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-dark-600 mt-1 text-right">{formData.content.length}/500</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Category *</label>
                    <select
                      name="categoryId"
                      required
                      className="input-dark bg-dark-100"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Status *</label>
                    <select
                      name="status"
                      className="input-dark bg-dark-100"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>

                  {/* Reading Time */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">Read time (min) *</label>
                    <input
                      type="number"
                      name="readingTime"
                      required
                      min="1"
                      placeholder="5"
                      className="input-dark"
                      value={formData.readingTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Tags *</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-dark-200/50 rounded-xl border border-dark-400/50">
                    {tags.length === 0 ? (
                      <p className="text-sm text-dark-600 italic">No tags available</p>
                    ) : (
                      tags.map((tag) => (
                        <button
                          type="button"
                          key={tag.id}
                          onClick={() => handleTagToggle(tag.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                            formData.tagIds.includes(tag.id)
                              ? 'bg-brand/20 border-brand/50 text-brand'
                              : 'bg-dark-300/50 border-dark-400/50 text-dark-700 hover:border-dark-500'
                          }`}
                        >
                          #{tag.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-dark-400/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingPostId(null);
                }}
                className="btn-outline text-sm py-2 px-5"
              >
                Cancel
              </button>
              <button
                form="postForm"
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-sm py-2 px-6 flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : editingPostId ? (
                  'Update'
                ) : (
                  'Publish'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;