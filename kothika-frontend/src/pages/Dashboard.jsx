import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, Clock, User, Tag as TagIcon, X, AlertCircle, Edit2, Trash2 } from 'lucide-react';

// ⚠️ IMPORTANT: FOR YOUR LOCAL VS CODE ⚠️
// 1. Uncomment the THREE import lines below to use your real backend:
// import { postService } from '../api/postService';
// import { categoryService } from '../api/categoryService';
// import { tagService } from '../api/tagService';

// 2. Delete the temporary mock service objects below before saving in your local editor!
const postService = {
  getAllPosts: async () => ({ data: [
    {
      id: '1',
      title: 'Tech Trends 2026',
      content: 'Technology is evolving rapidly with AI, cloud computing, and automation transforming industries...',
      categoryName: 'TECHNOLOGY',
      status: 'PUBLISHED',
      authorName: 'Deepak',
      readingTime: 5,
      tags: [{ id: '1', name: 'Technology' }, { id: '2', name: 'AI' }]
    },
    {
      id: '2',
      title: 'Future Tech 2026',
      content: 'Artificial Intelligence, cloud computing, and automation are reshaping modern industries...',
      categoryName: 'TECHNOLOGY',
      status: 'PUBLISHED',
      authorName: 'Deepak',
      readingTime: 6,
      tags: [{ id: '1', name: 'Technology' }, { id: '3', name: 'Automation' }]
    }
  ] }),
  createPost: async (data) => ({ data: { ...data, id: Date.now().toString(), authorName: 'You' } }),
  updatePost: async (id, data) => ({ data: { ...data, id, authorName: 'You' } }),
  deletePost: async (id) => ({ data: 'Post deleted successfully' })
};
const categoryService = {
  getAllCategories: async () => ({ data: [{ id: '1', name: 'Technology' }, { id: '2', name: 'Lifestyle' }] })
};
const tagService = {
  getAllTags: async () => ({ data: [{ id: '1', name: 'AI' }, { id: '2', name: 'Cloud' }, { id: '3', name: 'Java' }] })
};

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- MODAL & FORM STATE ---
  const [showModal, setShowModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null); // Tracks if we are editing an existing post
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const initialFormState = {
    title: '',
    content: '',
    categoryId: '',
    tagIds: [],
    status: 'DRAFT',
    readingTime: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // Fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch Categories & Tags ONLY when the modal opens
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
        tagService.getAllTags()
      ]);
      setCategories(catsRes.data || []);
      setTags(tagsRes.data || []);
      return { loadedCats: catsRes.data || [], loadedTags: tagsRes.data || [] };
    } catch (err) {
      setFormError('Failed to load categories or tags from server.');
      return { loadedCats: [], loadedTags: [] };
    }
  };

  // --- FORM & ACTION HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => {
      const isSelected = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: isSelected 
          ? prev.tagIds.filter(id => id !== tagId) 
          : [...prev.tagIds, tagId]
      };
    });
  };

  const handleEditClick = async (post) => {
    // 1. Ensure categories and tags are loaded first
    let currentCats = categories;
    let currentTags = tags;
    
    if (currentCats.length === 0 || currentTags.length === 0) {
      const { loadedCats, loadedTags } = await loadFormData();
      currentCats = loadedCats;
      currentTags = loadedTags;
    }

    // 2. Find the category ID based on the post's categoryName
    const matchedCategory = currentCats.find(c => c.name === post.categoryName);
    const categoryId = matchedCategory ? matchedCategory.id : '';

    // 3. Find the tag IDs based on the post's tags
    const tagIds = [];
    if (post.tags) {
      post.tags.forEach(postTag => {
        let tagName = '';
        if (typeof postTag === 'string') {
          const match = postTag.match(/name=([^,)]+)/);
          if (match && match[1]) tagName = match[1].trim();
        } else if (postTag && postTag.name) {
          tagName = postTag.name;
        }
        
        const matchedTag = currentTags.find(t => t.name === tagName);
        if (matchedTag) tagIds.push(matchedTag.id);
      });
    }

    // 4. Populate form and open modal
    setFormData({
      title: post.title,
      content: post.content,
      categoryId: categoryId,
      tagIds: tagIds,
      status: post.status,
      readingTime: post.readingTime
    });
    setEditingPostId(post.id);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await postService.deletePost(id);
        // Refresh posts after successful deletion
        fetchPosts();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete post');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.tagIds.length === 0) {
      setFormError("Please select at least one tag.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        readingTime: parseInt(formData.readingTime, 10)
      };
      
      // Determine if we are Updating or Creating based on editingPostId
      if (editingPostId) {
        await postService.updatePost(editingPostId, payload);
      } else {
        await postService.createPost(payload);
      }
      
      // Success! Close modal, clear form, and refresh posts
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
    setEditingPostId(null); // Ensure we are in "Create" mode
    setFormError('');
    setShowModal(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 px-6 pb-12">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" /> Dashboard
          </h2>
          <p className="text-gray-600 mt-2">Manage your Kothika blogs</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      {/* --- DASHBOARD GRID --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Create your first blog post to get started.</p>
          <button 
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Write a Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.categoryName || 'Uncategorized'}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${post.status === 'PUBLISHED' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {post.status}
                  </span>
                </div>
                
                {/* ACTION BUTTONS (Edit & Delete) */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEditClick(post)} 
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit Post"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(post.id)} 
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow">{post.content}</p>
              
              <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <User size={16} />
                    <span className="truncate max-w-[120px]">{post.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar mt-2">
                    <TagIcon size={14} className="text-gray-400 flex-shrink-0" />
                    <div className="flex gap-2">
                      {post.tags.map((tag, idx) => {
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- POST MODAL (CREATE/EDIT) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingPostId ? 'Edit Post' : 'Create New Post'}
              </h3>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingPostId(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 text-sm border border-red-100">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" /> 
                  <p>{formError}</p>
                </div>
              )}

              <form id="postForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      maxLength="25"
                      placeholder="e.g. Future Tech 2026"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{formData.title.length}/25</p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status *</label>
                    <select
                      name="status"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                    <select
                      name="categoryId"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select a category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Reading Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Reading Time (mins) *</label>
                    <input
                      type="number"
                      name="readingTime"
                      required
                      min="1"
                      placeholder="5"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.readingTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content *</label>
                  <textarea
                    name="content"
                    required
                    maxLength="500"
                    rows="5"
                    placeholder="Write your blog post content here..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={formData.content}
                    onChange={handleInputChange}
                  ></textarea>
                  <p className="text-xs text-gray-400 mt-1 text-right">{formData.content.length}/500</p>
                </div>

                {/* Tags (Multi-select Checkboxes) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (Select at least one) *</label>
                  <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {tags.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No tags available.</p>
                    ) : (
                      tags.map(tag => (
                        <label 
                          key={tag.id} 
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors text-sm
                            ${formData.tagIds.includes(tag.id) ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                        >
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={formData.tagIds.includes(tag.id)}
                            onChange={() => handleTagToggle(tag.id)}
                          />
                          #{tag.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingPostId(null);
                }}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                form="postForm"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting 
                  ? (editingPostId ? 'Updating...' : 'Publishing...') 
                  : (editingPostId ? 'Update Post' : 'Publish Post')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;