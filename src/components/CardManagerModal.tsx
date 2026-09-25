import React, { useState } from 'react';
import { ProjectCard } from '../types/project';
import { X, Plus, Trash2, Edit3, Download, Copy, RotateCcw, Check, Sparkles } from 'lucide-react';

interface CardManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: ProjectCard[];
  onSaveCards: (updated: ProjectCard[]) => void;
  onResetDefaults: () => void;
}

export default function CardManagerModal({
  isOpen,
  onClose,
  cards,
  onSaveCards,
  onResetDefaults,
}: CardManagerModalProps) {
  const [copied, setCopied] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // Form state for adding/editing a card
  const [form, setForm] = useState<Partial<ProjectCard>>({
    title: '',
    subtitle: '',
    category: 'Desktop & Systems',
    badge: 'NEW',
    color: 'cyan',
    description: '',
    tags: [],
    stats: '',
    links: { github: '', live: '', download: '' },
    featured: true,
  });
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingCardId('new');
    setForm({
      title: '',
      subtitle: '',
      category: 'Desktop & Systems',
      badge: 'NEW',
      color: 'cyan',
      description: '',
      tags: [],
      stats: '',
      links: { github: '', live: '', download: '' },
      featured: true,
    });
    setTagsInput('');
  };

  const handleStartEdit = (card: ProjectCard) => {
    setEditingCardId(card.id);
    setForm({ ...card });
    setTagsInput(card.tags ? card.tags.join(', ') : '');
  };

  const handleDelete = (id: string) => {
    const updated = cards.filter(c => c.id !== id);
    onSaveCards(updated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingCardId === 'new') {
      const newCard: ProjectCard = {
        id: form.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
        title: form.title.trim(),
        subtitle: form.subtitle?.trim() || '',
        category: form.category || 'Desktop & Systems',
        badge: form.badge?.trim() || 'FEATURED',
        color: (form.color as any) || 'cyan',
        description: form.description?.trim() || '',
        tags: parsedTags,
        stats: form.stats?.trim() || 'Active',
        links: {
          github: form.links?.github?.trim() || '',
          live: form.links?.live?.trim() || '',
          download: form.links?.download?.trim() || '',
        },
        featured: true,
      };
      onSaveCards([newCard, ...cards]);
    } else if (editingCardId) {
      const updated = cards.map(c => {
        if (c.id === editingCardId) {
          return {
            ...c,
            ...form,
            tags: parsedTags,
            links: { ...c.links, ...form.links },
          } as ProjectCard;
        }
        return c;
      });
      onSaveCards(updated);
    }

    setEditingCardId(null);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(cards, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'projects.json');
    dlAnchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-white/15 bg-[#0e1322] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <div>
              <h2 className="font-mono text-base font-bold tracking-wide text-white">
                PROJECT CARDS MANAGER
              </h2>
              <p className="text-xs text-slate-400">
                Easily add, edit, or delete project cards. Changes update live immediately!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <button
              onClick={handleStartAdd}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:from-purple-400 hover:to-indigo-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Project Card</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Copy full JSON configuration to clipboard"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Config'}</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Download projects.json"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onResetDefaults}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
                title="Restore default card list"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Inline Add / Edit Form */}
          {editingCardId && (
            <form
              onSubmit={handleSaveForm}
              className="rounded-xl border border-purple-500/40 bg-purple-950/20 p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <h3 className="font-mono text-sm font-bold text-purple-300">
                  {editingCardId === 'new' ? '➕ CREATE NEW PROJECT CARD' : '✏️ EDIT PROJECT CARD'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingCardId(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title || ''}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. OmniRoute-LLM"
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={form.subtitle || ''}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="e.g. Unified LLM Gateway & Router"
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={form.category || 'Desktop & Systems'}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#121727] px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="Desktop & Systems">Desktop & Systems</option>
                    <option value="AI & LLM">AI & LLM</option>
                    <option value="Mobile & Android">Mobile & Android</option>
                    <option value="Web & Tools">Web & Tools</option>
                    <option value="Games & Creative">Games & Creative</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Color Theme & Badge</label>
                  <div className="flex gap-2">
                    <select
                      value={form.color || 'cyan'}
                      onChange={e => setForm({ ...form, color: e.target.value as any })}
                      className="w-1/2 rounded-lg border border-white/15 bg-[#121727] px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="cyan">Cyan</option>
                      <option value="purple">Purple</option>
                      <option value="sakura">Sakura (Pink)</option>
                      <option value="emerald">Emerald (Green)</option>
                      <option value="amber">Amber (Gold)</option>
                    </select>

                    <input
                      type="text"
                      value={form.badge || 'FEATURED'}
                      onChange={e => setForm({ ...form, badge: e.target.value })}
                      placeholder="Badge (e.g. STABLE)"
                      className="w-1/2 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this software do? Why is it useful?"
                  className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="Python, FastAPI, Docker, React"
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Stats / Version String</label>
                  <input
                    type="text"
                    value={form.stats || ''}
                    onChange={e => setForm({ ...form, stats: e.target.value })}
                    placeholder="e.g. v2.4 • Windows x64"
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={form.links?.github || ''}
                    onChange={e => setForm({ ...form, links: { ...form.links, github: e.target.value } })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Live Web App URL (Optional)</label>
                  <input
                    type="url"
                    value={form.links?.live || ''}
                    onChange={e => setForm({ ...form, links: { ...form.links, live: e.target.value } })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">Download / Release URL (Optional)</label>
                  <input
                    type="url"
                    value={form.links?.download || ''}
                    onChange={e => setForm({ ...form, links: { ...form.links, download: e.target.value } })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCardId(null)}
                  className="rounded-lg border border-white/10 px-4 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-500 px-5 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-purple-400 transition-colors"
                >
                  Save Card
                </button>
              </div>
            </form>
          )}

          {/* Cards List */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Project Cards ({cards.length})
            </h3>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {cards.map(card => (
                <div
                  key={card.id}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-white/20 hover:bg-white/[0.06] transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">
                        {card.title}
                      </span>
                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[0.65rem] font-mono text-slate-300">
                        {card.badge}
                      </span>
                    </div>
                    <div className="text-[0.72rem] text-slate-400 truncate">
                      {card.category} • {card.stats}
                    </div>
                    <p className="text-[0.70rem] text-slate-400 line-clamp-1">
                      {card.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => handleStartEdit(card)}
                      className="rounded-md p-1.5 text-slate-400 hover:text-purple-300 hover:bg-purple-500/20 transition-colors"
                      title="Edit this card"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Remove this card"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 bg-black/40 text-xs text-slate-400">
          <span>Config path: <code className="font-mono text-purple-300">src/config/projects.json</code></span>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
