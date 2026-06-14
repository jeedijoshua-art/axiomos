"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Sparkles, AlertCircle, ArrowDown, CheckCircle2,
  FileText, Activity, Brain, Users, ArrowUpRight, GraduationCap,
  Layers, Hammer, Briefcase, Zap, Star, Shield, ArrowRightLeft,
  ChevronRight, Network, Code, HelpCircle, Database, ChevronLeft
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EcosystemBackground from '@/components/EcosystemBackground';

// Responsive container wrapper
const SectionWrapper: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = "", children }) => (
  <section id={id} className={`relative py-20 md:py-28 px-6 overflow-hidden border-b border-white/5 ${className}`}>
    <div className="max-w-7xl mx-auto relative z-10">
      {children}
    </div>
  </section>
);

// Intersecting Counter Component
const ScrollingCounter: React.FC<{ value: number; label: string; suffix?: string }> = ({ value, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [triggered, value]);

  return (
    <div ref={ref} className="text-center p-6 glass-panel rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 font-mono flex items-center justify-center gap-0.5">
        <span>{count}</span>
        <span className="text-axiom-purple">{suffix}</span>
      </div>
      <div className="text-xs md:text-sm text-slate-400 font-medium tracking-wider uppercase">{label}</div>
    </div>
  );
};

// Mouse spotlight hover effect hook/component
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl glass-panel border border-white/5 p-8 transition-all duration-300 hover:border-white/10 ${className}`}
      style={{
        background: 'radial-gradient(circle 350px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.08), transparent 85%)'
      }}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [activeHeroNode, setActiveHeroNode] = useState<string | null>(null);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'gnosis' | 'nodecraft' | 'careeros'>('gnosis');
  const [activeArchNode, setActiveArchNode] = useState<string | null>(null);

  const heroNodes = [
    {
      id: 'gnosis',
      name: 'GNOSIS AI',
      role: 'KNOWLEDGE BASE',
      icon: '📚',
      x: '15%',
      y: '20%',
      desc: 'Central Knowledge Hub. Upload documents, generate summaries, and compile class notes with interactive study assistants.',
      details: ['Document Chat', 'AI Summaries', 'Smart Notes', 'Research Workspace']
    },
    {
      id: 'nodecraft',
      name: 'NODECRAFT AI',
      role: 'WORKFLOW STUDIO',
      icon: '⚡',
      x: '85%',
      y: '30%',
      desc: 'Visual Workflow Builder. Chain input parameters, custom prompt nodes, and Gemini outputs onto an infinite logic canvas.',
      details: ['Visual Workflow Builder', 'AI Automation', 'Node Based Canvas', 'Project Creation']
    },
    {
      id: 'careeros',
      name: 'CAREEROS',
      role: 'CAREER PIPELINE',
      icon: '💼',
      x: '50%',
      y: '80%',
      desc: 'AI Career Growth Suite. Build ATS-optimized resumes, track job search stages, and format professional assets.',
      details: ['AI Resume Builder', 'ATS Optimization', 'Professional Export', 'Career Growth Tools']
    }
  ];

  const audiences = [
    { 
      name: 'Students', icon: '🎓', module: 'Knowledge Hub',
      desc: 'Transform study materials into an intelligent learning system.',
      steps: ['Upload notes, PDFs, and syllabi', 'Generate AI summaries instantly', 'Create flashcards automatically', 'Chat with study materials', 'Organize knowledge efficiently'] 
    },
    { 
      name: 'Creators', icon: '🎨', module: 'Workflow Studio',
      desc: 'Automate content production and creative workflows.',
      steps: ['Generate content ideas', 'Build content pipelines', 'Automate publishing tasks', 'Repurpose content across platforms', 'Save hours of repetitive work'] 
    },
    { 
      name: 'Professionals', icon: '💼', module: 'Workflow Studio',
      desc: 'Optimize daily work through intelligent automation.',
      steps: ['Automate repetitive tasks', 'Organize information efficiently', 'Build custom AI workflows', 'Increase productivity', 'Streamline operations'] 
    },
    { 
      name: 'Job Seekers', icon: '🚀', module: 'Career Suite',
      desc: 'Accelerate career growth with AI-powered tools.',
      steps: ['Build ATS-friendly resumes', 'Generate tailored cover letters', 'Prepare for interviews', 'Track career progress', 'Improve application quality'] 
    },
    { 
      name: 'Researchers', icon: '🔬', module: 'Knowledge Hub',
      desc: 'Turn large amounts of information into actionable insights.',
      steps: ['Analyze research papers', 'Generate AI notes', 'Extract key findings', 'Build research knowledge bases', 'Accelerate discovery'] 
    },
    { 
      name: 'Startup Founders', icon: '💡', module: 'Workflow Studio',
      desc: 'Scale operations without increasing complexity.',
      steps: ['Automate business workflows', 'Manage company knowledge', 'Build AI-powered processes', 'Improve team efficiency', 'Focus on growth'] 
    }
  ];

  const testimonials = [
    {
      quote: "AXIOM completely transformed how I learn and build. I go from research in Gnosis directly to automated workflow builders, and then CareerOS packages my work for jobs.",
      author: "Alex Rivers",
      role: "AI Developer & Graduate Student"
    },
    {
      quote: "The context switching between ChatGPT, Notion, and build platforms was killing my agency's productivity. AXIOM unified our knowledge bases and automation studio into a single system.",
      author: "Marcus Chen",
      role: "Founder, Synthetix Labs"
    },
    {
      quote: "I landed my junior software engineering role by showcasing the visual pipelines I built in NodeCraft. The ATS resume builder in CareerOS is stellar.",
      author: "Elena Rostov",
      role: "Frontend Engineer"
    },
    {
      quote: "Gnosis is the best research assistant I've used. I upload hundreds of research papers and can query across them in one centralized chat. Superb architecture.",
      author: "Dr. Sarah Jenkins",
      role: "Lead ML Researcher"
    }
  ];

  const roadmapPhases = [
    { phase: "Phase 1", title: "Knowledge Hub", desc: "Release Gnosis AI. Multi-document vector search, smart study workspaces, flashcard generators, and interactive note canvases." },
    { phase: "Phase 2", title: "Workflow Studio", desc: "Integrate NodeCraft AI canvas. Drag-and-drop node logic, custom prompt chains, and live API execution templates." },
    { phase: "Phase 3", title: "CareerOS", desc: "Launch ATS alignment metrics, PDF resume builders, portfolio compilation cards, and smart cover letter generation." },
    { phase: "Phase 4", title: "Analytics Engine", desc: "Introduce ecosystem usage metrics, personal learning speed recommendations, and token optimization metrics." },
    { phase: "Phase 5", title: "Team Collaboration", desc: "Launch shared workspaces, multiplayer canvas editing, database credentials vault, and team knowledge graphs." },
    { phase: "Phase 6", title: "Marketplace Hub", desc: "Allow developers to share, install, and monetize pre-built workflow logic, system templates, and custom agents." },
    { phase: "Phase 7", title: "AI Agent Ecosystem", desc: "Support fully autonomous, long-running agent threads triggered by external system hooks." }
  ];

  return (
    <div className="relative min-h-screen selection:bg-axiom-purple/30 text-slate-100 flex flex-col font-sans">
      {/* Ecosystem Canvas Particles */}
      <EcosystemBackground />

      {/* Header Sticky Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full pt-16">
        
        {/* Section 1: Hero OS */}
        <section id="hero" className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8 relative z-10 flex flex-col items-center">
            
            {/* Version Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-axiom-purple/30 bg-axiom-purple/10 text-xs text-white/95"
            >
              <Sparkles className="h-3.5 w-3.5 text-axiom-cyan animate-pulse" />
              <span className="font-semibold tracking-wider font-mono">AXIOM OS 1.0</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
            >
              One Operating System<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-axiom-purple via-axiom-cyan to-axiom-emerald">
                For The AI Era
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              <span className="font-semibold text-white">Learn. Build. Automate. Get Hired.</span><br />
              Connect your knowledge, workflows and career growth inside one intelligent ecosystem.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
            >
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-axiom-purple to-axiom-cyan text-white font-semibold rounded-lg text-sm px-8 py-3.5 shadow-lg shadow-axiom-purple/20 hover:opacity-95 transition-opacity"
              >
                <span>Launch Platform</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a 
                href="#ecosystem-visual"
                className="inline-flex items-center justify-center border border-white/10 hover:border-white/20 bg-white/5 text-white font-semibold rounded-lg text-sm px-8 py-3.5 transition-all hover:bg-white/10"
              >
                Explore Ecosystem
              </a>
            </motion.div>
          </div>

          {/* Interactive Ecosystem Hub Visualizer */}
          <div id="ecosystem-visual" className="w-full max-w-5xl mx-auto mt-24 relative aspect-[16/9] md:aspect-[2.2/1] rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md overflow-hidden p-6">
            <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
            
            {/* Connection Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="none">
              {/* NodeCraft logic trail */}
              <motion.path 
                d="M 500,250 C 300,250 300,120 150,120" 
                className="stroke-axiom-purple/40 fill-none stroke-[2]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.path 
                d="M 500,250 C 700,250 700,150 850,150" 
                className="stroke-axiom-cyan/40 fill-none stroke-[2]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
              />
              <motion.path 
                d="M 500,250 C 500,380 500,380 500,380" 
                className="stroke-axiom-emerald/40 fill-none stroke-[2]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.9 }}
              />
            </svg>

            {/* AXIOM CORE Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-28 w-28 rounded-full bg-gradient-to-tr from-axiom-purple via-slate-950 to-axiom-cyan border-2 border-white/20 flex flex-col items-center justify-center text-center shadow-2xl shadow-axiom-purple/30 cursor-pointer group"
                onClick={() => setActiveHeroNode(null)}
              >
                <div className="h-full w-full rounded-full flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl gap-1 p-2">
                  <div className="text-xl animate-pulse">⚙️</div>
                  <span className="text-xs font-black tracking-widest text-white font-mono">AXIOM</span>
                  <span className="text-[8px] text-axiom-cyan font-bold uppercase tracking-wider">Core OS</span>
                </div>
              </motion.div>
            </div>

            {/* Connected Product Nodes */}
            {heroNodes.map((node) => (
              <div 
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: node.y, left: node.x }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -4 }}
                  onHoverStart={() => setActiveHeroNode(node.id)}
                  onClick={() => setActiveHeroNode(activeHeroNode === node.id ? null : node.id)}
                  className={`px-4 py-3 rounded-2xl glass-panel border flex items-center gap-3 shadow-lg cursor-pointer transition-all duration-300 ${
                    activeHeroNode === node.id 
                      ? 'border-axiom-purple/80 bg-slate-900/90 shadow-axiom-purple/10' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xl">{node.icon}</div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white tracking-wide">{node.name}</div>
                    <div className="text-[8px] text-slate-400 font-semibold tracking-wider uppercase font-mono">{node.role}</div>
                  </div>
                </motion.div>
              </div>
            ))}

            {/* Detail Overlay box */}
            <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none md:max-w-md">
              <AnimatePresence mode="wait">
                {activeHeroNode ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-5 glass-panel rounded-2xl border border-white/10 bg-slate-950/90 pointer-events-auto shadow-2xl"
                  >
                    {heroNodes.map((n) => n.id === activeHeroNode && (
                      <div key={n.id} className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{n.icon}</span>
                          <span className="text-sm font-bold text-white">{n.name}</span>
                          <span className="text-[9px] text-axiom-purple font-mono bg-axiom-purple/10 px-1.5 py-0.5 rounded border border-axiom-purple/20">Active Node</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{n.desc}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {n.details.map((feat) => (
                            <span key={feat} className="text-[9px] text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">{feat}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 glass-panel rounded-xl border border-white/5 bg-slate-950/60"
                  >
                    <p className="text-xs text-slate-400 leading-relaxed flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-axiom-cyan flex-shrink-0" />
                      <span>Hover over the product nodes to inspect the central lifecycle mechanics.</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Section 2: The Problem */}
        <SectionWrapper id="problem" className="bg-black/20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-purple tracking-widest uppercase font-mono">Workflow Friction</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Context Switching Is Destroying Productivity
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Modern work is fragmented across too many unintegrated tools. Copied structures get lost.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* The Old Way */}
            <div className="glass-panel border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 uppercase tracking-wider font-mono">Traditional Workflow</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">The Fragmented Tool Stack</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  You constantly copy, format, paste, and jump between isolated apps, losing context and wasting hours organizing drafts.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'ChatGPT', reason: 'Disconnected logic queries' },
                  { name: 'Notion', reason: 'Manual file summaries and note cataloging' },
                  { name: 'Workflow Builders', reason: 'Rigid setups requiring manual triggers' },
                  { name: 'Resume Builders', reason: 'Out-of-context template adjustments' },
                  { name: 'Multiple Tabs & Copy Paste', reason: 'Risk of information degradation' },
                  { name: 'Context Loss', reason: 'No shared intelligence layer' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-red-500/10 bg-red-500/[0.02] text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <span className="text-red-500">✕</span> {item.name}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">{item.reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Axiom Way */}
            <div className="relative rounded-3xl overflow-hidden p-[1px] bg-gradient-to-b from-axiom-purple/40 via-white/5 to-white/5 flex">
              <div className="w-full glass-panel rounded-3xl p-8 md:p-10 flex flex-col justify-between space-y-8 bg-slate-950/80">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-axiom-cyan bg-axiom-cyan/10 px-2.5 py-1 rounded-full border border-axiom-cyan/20 uppercase tracking-wider font-mono">AXIOM OS</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">The Unified Operating System</h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    One unified workspace where data, visual workflow builders, and career deployment portfolios interact with zero friction.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Unified Ecosystem', desc: 'Central AXIOM dashboard' },
                    { name: 'Shared Knowledge', desc: 'Notes and source PDFs parsed across pipelines' },
                    { name: 'Connected Workflows', desc: 'Automations generated directly from Gnosis studies' },
                    { name: 'Career Pipeline', desc: 'Showcase projects instantly linked to CV' },
                    { name: 'Automation Studio', desc: 'Auto-run agent routines' },
                    { name: 'Zero Context Switching', desc: 'Full pipeline under one tab' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-axiom-cyan/10 bg-axiom-cyan/[0.02] text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <span className="text-axiom-cyan">✓</span> {item.name}
                      </span>
                      <span className="text-axiom-cyan/70 font-mono text-[10px]">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </SectionWrapper>

        {/* Section 3: The Journey */}
        <SectionWrapper id="journey">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-purple tracking-widest uppercase font-mono">Continuous Growth</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Your AI-Powered Growth Journey
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Learn faster, build real-world systems, and turn your projects into opportunities.
            </p>
            
            {/* Timeline connectors */}
            <div className="flex items-center justify-center gap-4 md:gap-8 pt-4">
              <span className="text-xs font-bold text-axiom-purple flex items-center gap-1"><span className="text-sm">📚</span> Learn</span>
              <span className="text-slate-600">→</span>
              <span className="text-xs font-bold text-axiom-cyan flex items-center gap-1"><span className="text-sm">⚡</span> Build</span>
              <span className="text-slate-600">→</span>
              <span className="text-xs font-bold text-axiom-emerald flex items-center gap-1"><span className="text-sm">💼</span> Showcase</span>
              <span className="text-slate-600">→</span>
              <span className="text-xs font-bold text-white flex items-center gap-1"><span className="text-sm">🚀</span> Get Hired</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* CARD 1: GNOSIS */}
            <SpotlightCard className="flex flex-col justify-between h-full space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">📚</div>
                  <span className="text-[10px] font-bold text-axiom-purple border border-axiom-purple/20 bg-axiom-purple/10 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    STEP 1 — LEARN
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">GNOSIS AI</h3>
                <h4 className="text-xs text-slate-400 font-mono tracking-wider uppercase mb-4">Knowledge Hub</h4>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
                  Every great project starts with learning. Upload PDFs, research papers, class notes, books, and study materials. Use AI to summarize content, generate smart notes, ask questions, and instantly understand complex topics.
                </p>
                
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Key Features</h5>
                <ul className="space-y-2">
                  {['Document Chat', 'AI Summaries', 'Smart Notes', 'Research Workspace'].map((feat) => (
                    <li key={feat} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-axiom-purple flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/5">
                <a 
                  href="https://gnosisapp-theta.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between text-xs font-bold border border-white/10 hover:border-white/20 hover:bg-white/5 px-4 py-2.5 rounded-lg text-white transition-all group"
                >
                  <span>Open Gnosis</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </SpotlightCard>

            {/* CARD 2: NODECRAFT */}
            <SpotlightCard className="relative flex flex-col justify-between h-full space-y-8 border-axiom-cyan/30 bg-slate-900/10">
              <div className="absolute top-0 right-0 h-28 w-28 bg-axiom-cyan/5 blur-[40px] pointer-events-none rounded-full" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">⚡</div>
                  <span className="text-[10px] font-bold text-axiom-cyan border border-axiom-cyan/20 bg-axiom-cyan/10 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    STEP 2 — BUILD
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">NODECRAFT AI</h3>
                <h4 className="text-xs text-slate-400 font-mono tracking-wider uppercase mb-4">Workflow Studio</h4>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
                  Knowledge becomes valuable when you apply it. Design AI workflows, automate repetitive tasks, connect powerful tools, and build real-world projects that strengthen your portfolio and practical skills. Transform ideas into working systems.
                </p>
                
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Key Features</h5>
                <ul className="space-y-2">
                  {['Visual Workflow Builder', 'AI Automation', 'Node Based Canvas', 'Project Creation'].map((feat) => (
                    <li key={feat} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-axiom-cyan flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/5">
                <Link 
                  href="/dashboard?tab=nodecraft" 
                  className="w-full inline-flex items-center justify-between text-xs font-bold border border-axiom-cyan/30 hover:border-axiom-cyan/50 bg-axiom-cyan/5 hover:bg-axiom-cyan/10 px-4 py-2.5 rounded-lg text-axiom-cyan transition-all group"
                >
                  <span>Open NodeCraft</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </SpotlightCard>

            {/* CARD 3: CAREEROS */}
            <SpotlightCard className="flex flex-col justify-between h-full space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">💼</div>
                  <span className="text-[10px] font-bold text-axiom-emerald border border-axiom-emerald/20 bg-axiom-emerald/10 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    STEP 3 — GET HIRED
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">CAREEROS</h3>
                <h4 className="text-xs text-slate-400 font-mono tracking-wider uppercase mb-4">Career Suite</h4>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
                  Your skills deserve opportunities. Convert your learning and projects into a professional resume that stands out. Generate ATS-optimized resumes, improve job applications, and present your achievements with confidence.
                </p>
                
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Key Features</h5>
                <ul className="space-y-2">
                  {['AI Resume Builder', 'ATS Optimization', 'Professional Export', 'Career Growth Tools'].map((feat) => (
                    <li key={feat} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-axiom-emerald flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/5">
                <a 
                  href="https://careeros-six.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between text-xs font-bold border border-white/10 hover:border-white/20 hover:bg-white/5 px-4 py-2.5 rounded-lg text-white transition-all group"
                >
                  <span>Open CareerOS</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </SpotlightCard>

          </div>
        </SectionWrapper>

        {/* Section 4: Why Axiom Works */}
        <SectionWrapper id="why-axiom" className="bg-black/20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-purple tracking-widest uppercase font-mono">Synergy</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Why This Journey Works
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Traditional learning is broken and fragmented. AXIOM closes the operational gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-8 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-axiom-purple/10 text-axiom-purple text-xl">📚</div>
                <h4 className="text-base font-bold text-white">Learning Without Building Creates Limited Experience</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Passively consuming tutorials leads to tutorial hell. AXIOM immediately guides you from learning concepts to building active workflows in NodeCraft AI.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-axiom-cyan/10 text-axiom-cyan text-xl">⚡</div>
                <h4 className="text-base font-bold text-white">Building Without Showcasing Creates Limited Opportunities</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Creating portfolio projects without presenting them properly makes you invisible to recruiters. CareerOS helps you package your automated workflows and turn them into visible opportunities.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl glass-panel border-white/10 bg-axiom-purple/5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white text-xl">✓</div>
                <h4 className="text-base font-bold text-white">AXIOM Connects Learning, Building and Career Growth</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A complete unified pipeline that helps you learn valuable skills, apply them directly in our automation studio, and package them automatically into professional ATS resumes and project portfolios.
                </p>
              </div>
            </div>

          </div>
        </SectionWrapper>

        {/* Section 5: Workflow Flowchart */}
        <SectionWrapper id="workflow">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-cyan tracking-widest uppercase font-mono">Dynamic Process</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              From Knowledge To Opportunity
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              See how information flows through the AXIOM ecosystem to yield real-world career results.
            </p>
          </div>

          {/* Graphical Flowchart */}
          <div className="relative overflow-x-auto pb-6">
            <div className="min-w-[900px] flex items-center justify-between px-6 py-8 glass-panel rounded-3xl border border-white/5 bg-black/60 relative">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              
              {[
                { name: 'Documents', desc: 'PDF, Books, Notes', color: 'border-white/10 text-slate-400', step: 'Start' },
                { name: 'GNOSIS AI', desc: 'Vector Knowledge Hub', color: 'border-axiom-purple/40 text-axiom-purple', step: '01' },
                { name: 'Extraction', desc: 'Core Concept Map', color: 'border-white/10 text-slate-400', step: 'Process' },
                { name: 'NODECRAFT', desc: 'AI Workflow Studio', color: 'border-axiom-cyan/40 text-axiom-cyan', step: '02' },
                { name: 'Workflows', desc: 'Automations Executed', color: 'border-white/10 text-slate-400', step: 'Process' },
                { name: 'CAREEROS', desc: 'Career Suite', color: 'border-axiom-emerald/40 text-axiom-emerald', step: '03' },
                { name: 'Opportunities', desc: 'ATS Cover Letters & CV', color: 'border-white/20 text-white', step: 'Finish' }
              ].map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-slate-700 to-slate-800 relative mx-2">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-axiom-purple/80 animate-ping" />
                      <div className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-slate-500" />
                    </div>
                  )}
                  <div className={`w-36 flex flex-col items-center text-center p-3 rounded-xl border bg-slate-950/85 z-10 shadow-lg ${item.color}`}>
                    <span className="text-[8px] font-bold tracking-widest uppercase opacity-70 font-mono mb-1">{item.step}</span>
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">{item.desc}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Section 6: Product Showcase */}
        <SectionWrapper id="showcase" className="bg-black/20">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="text-xs font-bold text-axiom-purple tracking-widest uppercase font-mono">Mock Workspace</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Interactive Dashboard Previews
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Inspect the core workspaces without entering the dashboard. Click below to toggle the screens.
            </p>
          </div>

          <div className="space-y-8">
            {/* Tab switch buttons */}
            <div className="flex justify-center gap-2 p-1.5 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md max-w-md mx-auto">
              <button 
                onClick={() => setActiveShowcaseTab('gnosis')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  activeShowcaseTab === 'gnosis' 
                    ? 'bg-axiom-purple text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                GNOSIS
              </button>
              <button 
                onClick={() => setActiveShowcaseTab('nodecraft')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  activeShowcaseTab === 'nodecraft' 
                    ? 'bg-axiom-cyan text-black shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                NODECRAFT
              </button>
              <button 
                onClick={() => setActiveShowcaseTab('careeros')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  activeShowcaseTab === 'careeros' 
                    ? 'bg-axiom-emerald text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                CAREEROS
              </button>
            </div>

            {/* Showcase Visual Monitor Frame */}
            <div className="glass-panel border border-white/5 rounded-3xl overflow-hidden aspect-[16/10] max-w-4xl mx-auto shadow-2xl relative">
              <div className="h-10 bg-slate-950 border-b border-white/5 px-4 flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full bg-red-500/20 border border-red-500/30" />
                <span className="h-3.5 w-3.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                <span className="h-3.5 w-3.5 rounded-full bg-green-500/20 border border-green-500/30" />
                <div className="flex-1 text-center text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                  AXIOM OS INTERFACE — {activeShowcaseTab.toUpperCase()}
                </div>
              </div>

              <div className="p-6 h-full bg-slate-950/80 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeShowcaseTab === 'gnosis' && (
                    <motion.div 
                      key="gnosis-preview"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full"
                    >
                      <div className="md:col-span-1 border border-white/5 rounded-2xl p-4 bg-black/40 space-y-4">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-axiom-purple" />
                          <span>Knowledge Source</span>
                        </h4>
                        <div className="space-y-2">
                          {['lecture_notes_ch1.pdf', 'research_ml_transformers.pdf', 'syllabus_cognitive_psych.pdf'].map((doc) => (
                            <div key={doc} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-mono text-slate-400 flex items-center justify-between">
                              <span>{doc}</span>
                              <span className="text-[8px] text-axiom-purple">Vectorized</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2 border border-white/5 rounded-2xl p-5 bg-black/40 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Brain className="h-4 w-4 text-axiom-purple" />
                            <span>Gnosis Cognitive Tutor</span>
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-mono p-3 rounded-lg border border-axiom-purple/10 bg-axiom-purple/[0.01]">
                            <strong>Question:</strong> "Summarize the key tenets of transformer networks."<br /><br />
                            <strong>AI Tutor:</strong> "The transformer model utilizes self-attention mechanisms to weigh influence of different input tokens regardless of distance..."
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] bg-axiom-purple/10 text-axiom-purple border border-axiom-purple/20 px-2 py-0.5 rounded">PDF Parser active</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Vector DB: 1.2k tokens</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeShowcaseTab === 'nodecraft' && (
                    <motion.div 
                      key="nodecraft-preview"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="flex flex-col justify-between h-full space-y-6"
                    >
                      <div className="border border-white/5 rounded-2xl p-6 bg-black/40 aspect-[2.5/1] flex items-center justify-around relative">
                        <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
                        
                        <div className="p-3 rounded-xl border border-axiom-purple/30 bg-slate-950 z-10 flex flex-col text-left w-36 shadow-lg shadow-axiom-purple/5">
                          <span className="text-[9px] font-bold text-axiom-purple uppercase">📥 Input Node</span>
                          <span className="text-[9px] text-slate-400 mt-1 font-mono truncate">"Source text..."</span>
                        </div>
                        
                        <div className="h-px bg-dashed border-t-2 border-dashed border-slate-700 flex-1 mx-2" />
                        
                        <div className="p-3 rounded-xl border border-axiom-cyan/40 bg-slate-950 z-10 flex flex-col text-left w-36 shadow-lg shadow-axiom-cyan/5">
                          <span className="text-[9px] font-bold text-axiom-cyan uppercase">🤖 AI Core Node</span>
                          <span className="text-[9px] text-slate-400 mt-1 font-mono">Gemini 2.5 Flash</span>
                        </div>

                        <div className="h-px bg-dashed border-t-2 border-dashed border-slate-700 flex-1 mx-2" />

                        <div className="p-3 rounded-xl border border-axiom-emerald/30 bg-slate-950 z-10 flex flex-col text-left w-36 shadow-lg shadow-axiom-emerald/5">
                          <span className="text-[9px] font-bold text-axiom-emerald uppercase">📤 Output Node</span>
                          <span className="text-[9px] text-slate-400 mt-1 font-mono truncate">"Spanish translated..."</span>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <span className="text-[10px] text-slate-400 font-mono">Auto-saving workflow...</span>
                        <span className="text-[10px] text-axiom-cyan font-bold font-mono">STATUS: ACTIVE</span>
                      </div>
                    </motion.div>
                  )}

                  {activeShowcaseTab === 'careeros' && (
                    <motion.div 
                      key="careeros-preview"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
                    >
                      <div className="border border-white/5 rounded-2xl p-4 bg-black/40 space-y-4">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-axiom-emerald" />
                          <span>ATS Resume Generator</span>
                        </h4>
                        <div className="space-y-2.5 font-mono text-[10px] text-slate-400">
                          <div className="border-b border-white/5 pb-2">
                            <strong className="text-white text-xs">ELENA ROSTOV</strong><br />
                            Frontend Software Engineer
                          </div>
                          <div>
                            <span className="text-axiom-emerald">EXPERIENCE:</span><br />
                            - Built visual compiler canvas node pipelines using React and Redux. Reduced setup time by 40%.
                          </div>
                        </div>
                      </div>
                      <div className="border border-white/5 rounded-2xl p-5 bg-black/40 flex flex-col justify-between">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-white">ATS Alignment Rating</h4>
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full border-4 border-axiom-emerald/30 border-t-axiom-emerald flex items-center justify-center font-mono text-xl font-bold text-white">
                              89%
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-white">ATS Target: Met</span>
                              <p className="text-[10px] text-slate-400 leading-normal">
                                Content contains target verbs ("built", "compiled") matched with your NodeCraft workflows.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex justify-between">
                          <span className="text-[10px] text-slate-500 font-mono">Format: PDF (A4 Standard)</span>
                          <span className="text-[10px] text-axiom-emerald font-bold font-mono">ATS OPTIMIZED</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Section 7: Audience */}
        <SectionWrapper id="audience">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-cyan tracking-widest uppercase font-mono">Audience Profile</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Built For Everyone
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Empower your study or professional automation setups with AXIOM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((aud) => (
              <SpotlightCard key={aud.name} className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{aud.icon}</span>
                    <h3 className="text-lg font-bold text-white">{aud.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-axiom-cyan border border-axiom-cyan/25 bg-axiom-cyan/5 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    {aud.module}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed mt-3">{aud.desc}</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <ul className="space-y-1.5">
                    {aud.steps.map((st, idx) => (
                      <li key={idx} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                        <span className="text-axiom-cyan font-bold">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </SectionWrapper>

        {/* Section 8: Metrics */}
        <SectionWrapper id="metrics" className="bg-black/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollingCounter value={1000} suffix="+" label="Documents Processed" />
            <ScrollingCounter value={500} suffix="+" label="AI Workflows Built" />
            <ScrollingCounter value={250} suffix="+" label="Career Assets Generated" />
            <ScrollingCounter value={99} suffix="%" label="Automation Efficiency" />
          </div>
        </SectionWrapper>

        {/* Section 9: Ecosystem Architecture */}
        <SectionWrapper id="architecture">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-purple tracking-widest uppercase font-mono">Architecture</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              The Living Ecosystem
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              AXIOM connects existing assets with upcoming automation modules dynamically.
            </p>
          </div>

          <div className="glass-panel border border-white/5 rounded-3xl p-8 max-w-4xl mx-auto relative overflow-hidden aspect-[16/9] md:aspect-[2.2/1] flex items-center justify-center">
            <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
            
            {/* Diagram connecting branches */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Central OS Node */}
              <div className="z-10 absolute">
                <div className="h-24 w-24 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center flex-col shadow-2xl text-center shadow-axiom-purple/20 p-2">
                  <span className="text-[10px] font-black text-white tracking-wider font-mono">AXIOM OS</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Core</span>
                </div>
              </div>

              {/* Active Products around */}
              {[
                { name: 'GNOSIS', pos: 'top-10 left-12 md:left-24', status: 'Active', color: 'text-axiom-purple' },
                { name: 'NODECRAFT', pos: 'top-10 right-12 md:right-24', status: 'Active', color: 'text-axiom-cyan' },
                { name: 'CAREEROS', pos: 'bottom-10 left-1/2 -translate-x-1/2', status: 'Active', color: 'text-axiom-emerald' },
                { name: 'Analytics', pos: 'bottom-20 left-10 md:left-20', status: 'Soon', color: 'text-slate-500' },
                { name: 'Marketplace', pos: 'bottom-20 right-10 md:right-20', status: 'Soon', color: 'text-slate-500' },
                { name: 'Collab', pos: 'top-1/2 -translate-y-1/2 left-8 md:left-12', status: 'Soon', color: 'text-slate-500' },
                { name: 'AI Agents', pos: 'top-1/2 -translate-y-1/2 right-8 md:right-12', status: 'Soon', color: 'text-slate-500' }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`absolute ${item.pos} z-10`}
                  onMouseEnter={() => setActiveArchNode(item.name)}
                  onMouseLeave={() => setActiveArchNode(null)}
                >
                  <div className={`px-3 py-2 rounded-xl glass-panel border border-white/5 bg-slate-950/90 text-center shadow-md cursor-pointer transition-all hover:border-white/20 hover:scale-105`}>
                    <div className="text-xs font-bold text-white">{item.name}</div>
                    <div className={`text-[7px] font-bold uppercase tracking-wider font-mono ${
                      item.status === 'Active' ? 'text-axiom-cyan' : 'text-slate-500'
                    }`}>
                      {item.status === 'Active' ? 'LIVE NOW' : 'COMING SOON'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Section 10: Roadmap */}
        <SectionWrapper id="roadmap" className="bg-black/20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-purple tracking-widest uppercase font-mono">Milestones</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Ecosystem Roadmap
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Our technical trajectory connecting AI knowledge layers with career opportunity vectors.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative timeline-line-glow pl-6 md:pl-0 space-y-12">
            {roadmapPhases.map((phase, idx) => (
              <div key={idx} className="flex flex-col md:flex-row relative">
                {/* Timeline connector dot */}
                <div className="absolute left-[-21px] md:left-1/2 md:-translate-x-1/2 top-1.5 h-4.5 w-4.5 rounded-full border-2 border-axiom-purple bg-slate-950 z-20 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-axiom-purple animate-pulse" />
                </div>
                
                {/* Layout split */}
                <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:order-last'}`}>
                  <div className="text-xs font-bold text-axiom-purple font-mono mb-1">{phase.phase}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{phase.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md md:ml-auto md:mr-0">{phase.desc}</p>
                </div>
                
                {/* Spacer for secondary side */}
                <div className="hidden md:block w-1/2" />
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Section 11: Testimonials */}
        <SectionWrapper id="testimonials">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-axiom-cyan tracking-widest uppercase font-mono">Feedback</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Trusted By AI Innovators
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              See what engineers, creators, and students say about building systems in the AXIOM OS.
            </p>
          </div>

          {/* Testimonial horizontal slide marquee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((test, index) => (
              <div key={index} className="p-6 md:p-8 rounded-2xl glass-panel border border-white/5 bg-slate-950/45 flex flex-col justify-between gap-6">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{test.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-axiom-purple to-axiom-cyan flex items-center justify-center font-bold text-xs text-white">
                    {test.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{test.author}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Section 12: Final CTA */}
        <section className="relative py-28 px-6 text-center border-t border-white/5 bg-slate-950/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-axiom-purple/5 to-axiom-cyan/5 blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-8 relative z-10 flex flex-col items-center">
            
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Stop Managing Tools.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-axiom-purple to-axiom-cyan">
                Start Building Systems.
              </span>
            </h2>
            
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Everything you need to learn, build, automate, and grow powered by one intelligent operating system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-axiom-purple to-axiom-cyan text-white font-semibold rounded-lg text-sm px-8 py-3.5 shadow-lg shadow-axiom-purple/20 hover:opacity-95 transition-opacity"
              >
                <span>Launch AXIOM</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a 
                href="#ecosystem-visual"
                className="inline-flex items-center justify-center border border-white/10 hover:border-white/20 bg-white/5 text-white font-semibold rounded-lg text-sm px-8 py-3.5 transition-all hover:bg-white/10"
              >
                Explore Products
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}
