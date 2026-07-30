import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, ArrowRight, X, Hash } from 'lucide-react';
import { BLOG_POSTS } from '../data';
import { BlogPost } from '../types';
import { mdToHtml } from '../lib/markdown';

export default function Blog() {
  const getPostFromUrl = () => {
    const parts = window.location.pathname.split('/');
    if (parts.length === 3 && parts[1] === 'blog') {
      const slug = parts[2];
      return BLOG_POSTS.find(p => p.slug === slug) || null;
    }
    return null;
  };

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => getPostFromUrl());

  useEffect(() => {
    const handlePopState = () => {
      setSelectedPost(getPostFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (selectedPost) {
      const newPath = `/blog/${selectedPost.slug}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    } else {
      if (window.location.pathname.startsWith('/blog/')) {
        const newPath = '/blog';
        if (window.location.pathname !== newPath) {
          window.history.pushState(null, '', newPath);
        }
      }
    }
  }, [selectedPost]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 14 } }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'concurrency':
        return 'text-amber-color bg-amber-color/10 border-amber-color/20';
      case 'styling':
        return 'text-cyan bg-cyan/10 border-cyan/20';
      case 'caching':
        return 'text-emerald-color bg-emerald-color/10 border-emerald-color/20';
      default:
        return 'text-purple-color bg-purple-color/10 border-purple-color/20';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 animate-fade-in"
    >
      {/* Title Hero */}
      <motion.section variants={itemVariants} className="text-center md:text-left space-y-4 max-w-3xl" id="blog-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          Technical Logs & Case Studies
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          The <span className="text-amber-color">Linacre</span> Blog
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Practical engineering notes on interface systems, frontend theming, delivery quality, and cloud caching.
        </p>
      </motion.section>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="blog-posts-grid">
        {BLOG_POSTS.map((post, _idx) => (
          <motion.a
            key={post.slug}
            href={`/blog/${post.slug}`}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            onClick={(e) => {
              e.preventDefault();
              setSelectedPost(post);
            }}
            className="group flex flex-col justify-between bg-muted/20 dark:bg-[#161b26] border border-border-color rounded-xl p-5 hover:bg-muted/35 dark:hover:bg-[#1c2230] hover:border-border-hi transition-all cursor-pointer border-t-[3px] border-t-border-color focus:outline-none focus:ring-2 focus:ring-cyan/50"
            aria-label={`Read article: ${post.title}`}
          >
            <div>
              {/* Category / Read time */}
              <div className="flex items-center justify-between mb-3.5">
                <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="font-display text-sm font-bold text-foreground group-hover:text-cyan transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed mt-2.5 line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground/70 border-t border-border-color/20 pt-3.5 mt-5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.date}
              </span>
              <span className="text-cyan group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
                Read Logs <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Full Article Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-[#030c14] border border-border-color rounded-xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-blog-title"
            >
              {/* Top Bar */}
              <div className="bg-[#061520] px-4 py-3 flex items-center justify-between border-b border-border-color/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  <span className="text-muted-foreground/60 text-[10px] ml-2">article_viewer.sh</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Close article"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(selectedPost.category)}`}>
                      {selectedPost.category}
                    </span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="text-muted-foreground/70 flex items-center gap-1 font-mono text-[10px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedPost.date}
                    </span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="text-muted-foreground/70 flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPost.readTime}
                    </span>
                  </div>

                  <h2 id="modal-blog-title" className="font-display text-xl font-bold text-foreground leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>

                {/* Article Content — rendered through the same markdown
                    pipeline as the prerendered /blog/:slug pages (TASK-001,
                    12 Jul 2026). mdToHtml escapes all text before applying
                    inline formatting, and post content is first-party data
                    from src/data.ts, so this is safe to inject. */}
                <div
                  className="md-body max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(selectedPost.content) }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border-color/30">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-border-color/30 rounded text-foreground flex items-center gap-0.5">
                      <Hash className="w-2.5 h-2.5 text-cyan" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 border border-border-color rounded-lg text-xs font-mono hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
