import React, { useState } from 'react';
import type { ChatPlugin, PluginId } from '@/features/chat/chat.types';
import { chatService } from '@/features/chat/chat.service';
import {
  X,
  Puzzle,
  Download,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface PluginMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPluginsUpdated?: (plugins: ChatPlugin[]) => void;
}

export const PluginMarketplaceModal: React.FC<PluginMarketplaceModalProps> = ({
  isOpen,
  onClose,
  onPluginsUpdated,
}) => {
  const [plugins, setPlugins] = useState<ChatPlugin[]>(() => chatService.getInstalledPlugins());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingId, setInstallingId] = useState<PluginId | null>(null);

  // Custom Plugin Creator State
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('⚡');
  const [customDescription, setCustomDescription] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  if (!isOpen) return null;

  const categories = [
    'All',
    'Customization',
    'Custom',
    'Core',
    'STEM & Math',
    'Engineering',
    'Active Recall',
    'Research',
  ];

  const filtered = plugins.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.customPrompt && p.customPrompt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleInstall = (id: PluginId) => {
    setInstallingId(id);
    setTimeout(() => {
      const updated = chatService.installPlugin(id);
      setPlugins(updated);
      setInstallingId(null);
      if (onPluginsUpdated) onPluginsUpdated(updated);
    }, 600);
  };

  const handleToggle = (id: PluginId) => {
    const updated = chatService.togglePlugin(id);
    setPlugins(updated);
    if (onPluginsUpdated) onPluginsUpdated(updated);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPrompt.trim()) return;

    chatService.createCustomPlugin({
      name: customName,
      icon: customIcon,
      description: customDescription || 'Custom prompt personalization module.',
      customPrompt: customPrompt,
      category: 'Custom',
    });

    const refreshed = chatService.getInstalledPlugins();
    setPlugins(refreshed);
    setIsCreatingCustom(false);
    setCustomName('');
    setCustomPrompt('');
    setCustomDescription('');
    setSelectedCategory('Custom');
    if (onPluginsUpdated) onPluginsUpdated(refreshed);
  };

  const handleDeleteCustom = (id: string) => {
    if (!window.confirm('Delete this custom plugin?')) return;
    const refreshed = chatService.deleteCustomPlugin(id);
    setPlugins(refreshed);
    if (onPluginsUpdated) onPluginsUpdated(refreshed);
  };

  const popularEmojis = ['⚡', '🧬', '🚀', '💡', '🎓', '🔬', '🏛️', '📊', '💻', '🎯', '✨'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Plugin & Customization Store</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 text-[11px] font-semibold">
                  Modular AI
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Download verified learning plugins or build your own custom AI reasoning modules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingCustom(!isCreatingCustom)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isCreatingCustom
                  ? 'bg-slate-200 text-slate-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isCreatingCustom ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Customizer</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Plugin</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CUSTOM PLUGIN CREATION PANEL */}
        {isCreatingCustom && (
          <form
            onSubmit={handleSaveCustom}
            className="p-5 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 border-b border-indigo-100 space-y-4 animate-in slide-in-from-top duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Build New Custom Prompt Plugin</span>
              </h3>
              <span className="text-[11px] text-indigo-700 font-medium">
                Saves automatically to your personal workspace
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plugin Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LeetCode Grinder, Biology Cell Tutor"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Icon Emoji
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="w-12 px-2 py-1.5 text-center bg-white border border-slate-200 rounded-xl text-sm outline-none"
                  />
                  <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5">
                    {popularEmojis.slice(0, 7).map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCustomIcon(emoji)}
                        className="p-1 text-xs hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Focuses on edge cases & memory"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Instruction / Prompt Augmentation Rule *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Always structure explanations into 3 concrete rules, highlight potential memory leaks, and ask a tricky interview question at the end."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save & Activate Plugin</span>
              </button>
            </div>
          </form>
        )}

        {/* Search & Category Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search plugins & prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Plugin Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30">
          {filtered.map((plugin) => {
            const isInstalled = !!plugin.isInstalled;
            const isEnabled = !!plugin.isEnabled;
            const isBusy = installingId === plugin.id;

            return (
              <div
                key={plugin.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isEnabled
                    ? 'bg-white border-indigo-200/80 shadow-sm ring-1 ring-indigo-500/10'
                    : isInstalled
                    ? 'bg-white border-slate-200'
                    : 'bg-white/70 border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shadow-2xs">
                        {plugin.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{plugin.name}</span>
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            v{plugin.version}
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {plugin.author} • {plugin.downloadsCount} installs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                        {plugin.badge}
                      </span>
                      {plugin.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustom(plugin.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Delete custom plugin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plugin.description}
                  </p>

                  {/* Custom Prompt Rule if custom plugin */}
                  {plugin.customPrompt && (
                    <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900 font-mono">
                      <strong>Custom Rule:</strong> {plugin.customPrompt}
                    </div>
                  )}

                  {/* Feature Tags */}
                  {plugin.features && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {plugin.features.map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-medium"
                        >
                          • {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{plugin.isCustom ? 'Custom Extension' : 'Safe & Verified'}</span>
                  </div>

                  {isInstalled ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        {isEnabled ? 'Active in Chat' : 'Disabled'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggle(plugin.id)}
                        className="cursor-pointer text-indigo-600 hover:text-indigo-700 transition-transform active:scale-95"
                        title={isEnabled ? 'Click to disable' : 'Click to enable'}
                      >
                        {isEnabled ? (
                          <ToggleRight className="w-7 h-7 text-indigo-600 fill-indigo-100" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-slate-300" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleInstall(plugin.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      {isBusy ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Installing...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Install Plugin</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>
              {plugins.filter((p) => p.isEnabled).length} active plugins currently enriching cognitive diagnostics.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
