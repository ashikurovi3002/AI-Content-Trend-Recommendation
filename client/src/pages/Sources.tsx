import React, { useState, useEffect } from 'react';
import { Database, Plus, Search, Filter, Save, Globe, Video, Activity, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

interface Source {
  _id: string;
  name: string;
  type: string;
  url: string;
  category: string;
  isActive: boolean;
  lastChecked?: string;
}

const Sources = () => {
  const [showForm, setShowForm] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('website');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchSources = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/sources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSources(data);
      }
    } catch (err) {
      console.error('Failed to fetch sources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, type, url, category })
      });
      
      if (response.ok) {
        setShowForm(false);
        setName('');
        setUrl('');
        setCategory('');
        fetchSources();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add source');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sources</h1>
          <p className="text-sm text-slate-500">Manage your content sources here.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md text-sm font-medium transition-all hover:-translate-y-[1px]"
          >
            {showForm ? 'Cancel' : <><Plus size={16} /> Add Source</>}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Source</h2>
          {error && <div className="mb-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}
          <form className="flex flex-col gap-4 max-w-2xl" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. TechCrunch" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform Type</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value="website">Website / Blog</option>
                  <option value="youtube">YouTube Channel</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
                <input 
                  type="url" 
                  placeholder="https://" 
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input 
                  type="text" 
                  placeholder="e.g. Technology" 
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
              </div>
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : <><Save size={16} /> Save Source</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-lg">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search sources..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading sources...</div>
        ) : sources.length === 0 && !showForm ? (
          <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
              <Database size={48} className="mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No Sources Found</h3>
              <p className="max-w-sm mb-4">You haven't added any content sources yet. Add a source to start collecting data.</p>
              <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors">
                  <Plus size={16} />
                  Add Your First Source
              </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sources.map(source => (
              <div key={source._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${source.type === 'youtube' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {source.type === 'youtube' ? <Video size={20} /> : <Globe size={20} />}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{source.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Activity size={14} /> {source.category}</span>
                      <a href={source.url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{source.url}</a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock size={14} /> 
                    {source.lastChecked ? new Date(source.lastChecked).toLocaleDateString() : 'Never checked'}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${source.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {source.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sources;
