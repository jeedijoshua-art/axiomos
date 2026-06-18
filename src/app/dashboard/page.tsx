"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ReactFlow, MiniMap, Controls, Background, useNodesState, 
  useEdgesState, addEdge, Connection, Edge, Node,
  Panel, MarkerType, Handle, Position
} from '@xyflow/react';
import { 
  Layers, Brain, Zap, Briefcase, Network, 
  HelpCircle, Menu, X, ArrowUpRight, Play, Save, Plus, Trash2, 
  Search, FileText, CheckCircle2, RefreshCw, BarChart2, BookOpen,
  FolderPlus, Star, ShieldAlert, Cpu, Rocket, Sun, Moon
} from 'lucide-react';
import EcosystemBackground from '@/components/EcosystemBackground';
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM NODE TYPES FOR REACT FLOW ---
interface NodeData extends Record<string, unknown> {
  label: string;
  kind: 'input' | 'ai' | 'output';
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

// Input Node Component
const InputNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="px-4 py-3 rounded-xl border border-axiom-purple/40 bg-black/90 backdrop-blur-md text-left w-56 shadow-lg shadow-axiom-purple/5 relative">
      <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
        <span className="text-[10px] font-black text-axiom-purple uppercase tracking-wider font-mono">📥 Input Node</span>
        <span className="text-[8px] text-slate-500 font-mono">Source</span>
      </div>
      <label className="text-[9px] text-slate-400 font-bold block mb-1">Enter Text Data</label>
      <textarea 
        className="w-full bg-slate-900 border border-white/10 rounded p-1.5 text-[10px] text-white focus:outline-none focus:border-axiom-purple font-mono resize-none h-12"
        placeholder={data.placeholder || "Paste your input notes..."}
        value={data.value || ''}
        onChange={(e) => data.onChange?.(e.target.value)}
      />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-axiom-purple !border-none" />
    </div>
  );
};

// AI Processing Node Component
const AiNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="px-4 py-3 rounded-xl border border-axiom-cyan/40 bg-black/90 backdrop-blur-md text-left w-56 shadow-lg shadow-axiom-cyan/5 relative">
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-axiom-cyan !border-none" />
      <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
        <span className="text-[10px] font-black text-axiom-cyan uppercase tracking-wider font-mono">🤖 AI Agent Node</span>
        <span className="text-[8px] text-axiom-cyan font-bold font-mono">Gemini 2.5</span>
      </div>
      <label className="text-[9px] text-slate-400 font-bold block mb-1">Prompt / Instructions</label>
      <textarea 
        className="w-full bg-slate-900 border border-white/10 rounded p-1.5 text-[10px] text-white focus:outline-none focus:border-axiom-cyan font-mono resize-none h-12"
        placeholder="e.g. Translate input to Spanish..."
        value={data.value || ''}
        onChange={(e) => data.onChange?.(e.target.value)}
      />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-axiom-cyan !border-none" />
    </div>
  );
};

// Output Node Component
const OutputNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="px-4 py-3 rounded-xl border border-axiom-emerald/40 bg-black/90 backdrop-blur-md text-left w-56 shadow-lg shadow-axiom-emerald/5 relative">
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-axiom-emerald !border-none" />
      <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
        <span className="text-[10px] font-black text-axiom-emerald uppercase tracking-wider font-mono">📤 Output Node</span>
        <span className="text-[8px] text-slate-500 font-mono">Results</span>
      </div>
      <label className="text-[9px] text-slate-400 font-bold block mb-1">Generated Output</label>
      <div className="w-full bg-slate-900/50 border border-white/5 rounded p-2 text-[10px] text-slate-200 font-mono min-h-12 max-h-24 overflow-y-auto whitespace-pre-wrap">
        {data.value || <span className="text-slate-600 italic">Awaiting pipeline trigger...</span>}
      </div>
    </div>
  );
};

const nodeTypes = {
  inputNode: InputNode,
  aiNode: AiNode,
  outputNode: OutputNode
};

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync state from query parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Initialize theme from localStorage on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
  };

  // --- MOCK GNOSIS DATABASE ---
  const [gnosisDocs, setGnosisDocs] = useState([
    { id: '1', name: 'neural_transformer_notes.pdf', size: '2.4 MB', parsed: true },
    { id: '2', name: 'ats_alignment_checklist.txt', size: '412 KB', parsed: true },
    { id: '3', name: 'psychology_study_guide.pdf', size: '1.8 MB', parsed: true }
  ]);
  const [newDocName, setNewDocName] = useState('');

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    setGnosisDocs([
      ...gnosisDocs,
      {
        id: String(gnosisDocs.length + 1),
        name: newDocName.toLowerCase().endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
        size: '1.2 MB',
        parsed: true
      }
    ]);
    setNewDocName('');
  };

  // --- INTERACTIVE ATS CHECKER ---
  const [atsResumeText, setAtsResumeText] = useState('');
  const [atsJobText, setAtsJobText] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [calculatingAts, setCalculatingAts] = useState(false);

  const handleCalculateAts = () => {
    if (!atsResumeText || !atsJobText) return;
    setCalculatingAts(true);
    setAtsScore(null);
    setTimeout(() => {
      setCalculatingAts(false);
      setAtsScore(Math.floor(Math.random() * 20) + 75); // generates a score between 75 and 95
    }, 1500);
  };

  // --- NODECRAFT CANVAS STATE ---
  const initialNodes: Node<NodeData>[] = [
    {
      id: 'n1',
      type: 'inputNode',
      data: { 
        label: 'Input Node', 
        kind: 'input', 
        value: 'Machine Learning is a branch of artificial intelligence focused on building systems that learn from data.',
        placeholder: 'Input your raw text...'
      },
      position: { x: 50, y: 150 }
    },
    {
      id: 'n2',
      type: 'aiNode',
      data: { 
        label: 'AI Agent Node', 
        kind: 'ai', 
        value: 'Summarize the input text into a single key sentence.' 
      },
      position: { x: 320, y: 150 }
    },
    {
      id: 'n3',
      type: 'outputNode',
      data: { 
        label: 'Output Node', 
        kind: 'output', 
        value: '' 
      },
      position: { x: 580, y: 150 }
    }
  ];

  const initialEdges: Edge[] = [
    { 
      id: 'e1-2', 
      source: 'n1', 
      target: 'n2', 
      animated: true,
      style: { stroke: '#8b5cf6' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
    },
    { 
      id: 'e2-3', 
      source: 'n2', 
      target: 'n3',
      style: { stroke: '#06b6d4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' }
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const nextNodeId = useRef(4);

  // Handle node parameter change inside custom inputs
  const handleNodeDataChange = (nodeId: string, value: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              value
            }
          };
        }
        return n;
      })
    );
  };

  // Bind change handlers
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onChange: (val: string) => handleNodeDataChange(n.id, val)
        }
      }))
    );
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#8b5cf6' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
    }, eds));
  }, [setEdges]);

  // Add new nodes
  const handleAddNewNode = (kind: 'input' | 'ai' | 'output') => {
    const id = `n${nextNodeId.current}`;
    nextNodeId.current += 1;

    const labels = {
      input: 'Input Node',
      ai: 'AI Agent Node',
      output: 'Output Node'
    };

    const typeMap = {
      input: 'inputNode',
      ai: 'aiNode',
      output: 'outputNode'
    };

    const position = {
      x: 100 + Math.random() * 150,
      y: 100 + Math.random() * 150
    };

    const newNode: Node<NodeData> = {
      id,
      type: typeMap[kind],
      data: {
        label: labels[kind],
        kind,
        value: kind === 'input' ? 'New raw content...' : kind === 'ai' ? 'Translate to Spanish.' : '',
        placeholder: 'Input your text here...',
        onChange: (val: string) => handleNodeDataChange(id, val)
      },
      position
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // Run React Flow execution simulator
  const handleRunPipeline = () => {
    const inputNode = nodes.find(n => n.type === 'inputNode');
    const aiNode = nodes.find(n => n.type === 'aiNode');
    const outputNode = nodes.find(n => n.type === 'outputNode');

    if (!inputNode || !aiNode || !outputNode) return;

    setIsRunningPipeline(true);

    // Set output node to running loading state
    setNodes((nds) =>
      nds.map((n) => {
        if (n.type === 'outputNode') {
          return { ...n, data: { ...n.data, value: 'AI Agent compiling inputs...' } };
        }
        return n;
      })
    );

    setTimeout(() => {
      // Simulate Gemini processing
      const inputText = inputNode.data.value || '';
      const promptText = aiNode.data.value || '';
      let result = '';

      if (promptText.toLowerCase().includes('translate')) {
        result = "El aprendizaje automático es una rama de la inteligencia artificial enfocada en construir sistemas que aprenden de los datos.";
      } else if (promptText.toLowerCase().includes('summarize')) {
        result = "Summary: Machine Learning focuses on building computational systems that learn directly from input datasets.";
      } else {
        result = `[Gemini Output]: Processed input text ("${inputText.substring(0, 20)}...") following prompt details: "${promptText}".`;
      }

      setNodes((nds) =>
        nds.map((n) => {
          if (n.type === 'outputNode') {
            return { ...n, data: { ...n.data, value: result } };
          }
          return n;
        })
      );
      setIsRunningPipeline(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans bg-background">
      {/* Global Background */}
      <EcosystemBackground />

      {/* Workspace App Panel Container */}
      <div className="relative z-10 flex flex-1 h-screen overflow-hidden pt-16">
        
        {/* SIDEBAR NAVIGATION */}
        <aside 
          className={`h-full border-r border-white/5 bg-black/60 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between z-20 ${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-none'
          }`}
        >
          <div className="py-6 flex flex-col space-y-6 flex-1">
            <div className="px-6 flex items-center justify-between">
              <span className="text-[10px] font-black text-axiom-purple tracking-widest uppercase font-mono">AXIOM OS WORKSPACE</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sidebar list links */}
            <nav className="flex flex-col px-3 gap-1">
              {[
                { id: 'overview', name: 'Overview', icon: Network },
                { id: 'gnosis', name: 'Gnosis AI', icon: Brain },
                { id: 'nodecraft', name: 'NodeCraft AI', icon: Zap },
                { id: 'careeros', name: 'CareerOS', icon: Briefcase },
                { id: 'guide', name: 'Workflow Guide', icon: Layers },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-axiom-purple/20 to-axiom-cyan/10 border-l-2 border-axiom-purple text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IconComp className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
            <span>AXIOM OS v1.0.0</span>
            <span className="text-axiom-cyan animate-pulse">● Connected</span>
          </div>
        </aside>

        {/* Closed sidebar trigger button */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-6 left-6 z-30 p-2.5 rounded-full border border-white/10 bg-black/90 backdrop-blur-xl text-white shadow-lg shadow-axiom-purple/10 hover:scale-105 transition-transform"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* MAIN PANEL CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto bg-slate-950/40 p-6 md:p-10 flex flex-col">
          
          {/* Header/Title block */}
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg border transition-colors flex items-center justify-center cursor-pointer ${
                  theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400 hover:text-white'
                }`}
                title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <div>
                <span className="text-[10px] font-bold text-axiom-purple uppercase font-mono tracking-wider">Workspace Node</span>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                  {activeTab === 'overview' && 'System Overview'}
                  {activeTab === 'gnosis' && 'Gnosis AI'}
                  {activeTab === 'nodecraft' && 'NodeCraft Studio'}
                  {activeTab === 'careeros' && 'CareerOS Growth'}
                  {activeTab === 'guide' && 'Workflow Orchestration'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Dark/Light Switch */}
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-8 w-14 items-center rounded-full border transition-colors focus:outline-none cursor-pointer ${
                  theme === 'light' ? 'bg-slate-200 border-slate-300' : 'bg-white/5 border-white/10'
                }`}
                aria-label="Toggle theme"
                title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                <span
                  className={`${
                    theme === 'light' ? 'translate-x-7 bg-slate-900 text-white' : 'translate-x-1 bg-white text-slate-900'
                  } inline-flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-transform duration-300`}
                >
                  {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </span>
              </button>

              <Link 
                href="/"
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Back to Landing</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* DYNAMIC SUB-VIEW TEMPLATE RENDER */}
          <div className="flex-1 flex flex-col">
            
            {/* VIEW 1: SYSTEM OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Central Controller</span>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 text-axiom-purple" />
                      <span>AXIOM CORE OS</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Coordinates knowledge parsing vectors from Gnosis AI into NodeCraft automation nodes and compiles final ATS resume packages.
                    </p>
                  </div>
                  {/* Card 2 */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Logical Pipeline</span>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-axiom-cyan" />
                      <span>Active Workflows</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Currently running 3 connection matrices in NodeCraft. Live automated resumes generated from documents list successfully.
                    </p>
                  </div>
                  {/* Card 3 */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Metrics Monitoring</span>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <BarChart2 className="h-4 w-4 text-axiom-emerald" />
                      <span>ATS Alignment</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ecosystem files maintain an average match index of 88% on target tech roles inside the CareerOS indexer.
                    </p>
                  </div>
                </div>

                {/* Ecosystem Visualizer Diagram */}
                <div className="p-6 rounded-2xl glass-panel border border-white/5 bg-black/60 relative overflow-hidden flex-1 flex flex-col justify-center min-h-[300px]">
                  <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                  
                  <div className="text-center mb-8">
                    <h4 className="text-sm font-bold text-white">System Lifecycle Connection Matrix</h4>
                    <p className="text-[10px] text-slate-500">Real-time assets pipeline transfer map</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-around gap-6 relative">
                    {[
                      { step: 'Documents', role: 'Raw Data Source', color: 'border-white/10' },
                      { step: 'Gnosis AI', role: 'Knowledge Extraction', color: 'border-axiom-purple/30 text-axiom-purple' },
                      { step: 'NodeCraft AI', role: 'Logical Flow automation', color: 'border-axiom-cyan/30 text-axiom-cyan' },
                      { step: 'CareerOS', role: 'ATS Career builder', color: 'border-axiom-emerald/30 text-axiom-emerald' },
                      { step: 'Opportunities', role: 'Active Placement', color: 'border-white/20' }
                    ].map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-axiom-purple/20 to-axiom-cyan/25" />
                        )}
                        <div className={`w-40 p-4 rounded-xl border bg-slate-950 text-center shadow-lg ${item.color}`}>
                          <span className="text-[8px] font-bold font-mono text-slate-500 uppercase">Step 0{index+1}</span>
                          <h5 className="text-xs font-bold text-white mt-1">{item.step}</h5>
                          <span className="text-[9px] text-slate-400 leading-tight mt-1 block">{item.role}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: GNOSIS PAGE */}
            {activeTab === 'gnosis' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Brain className="h-5 w-5 text-axiom-purple" />
                      <span>Learn & Analyze Workspace</span>
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      GNOSIS AI is the parent ecosystem's knowledge library. It transforms raw notes, textbook PDFs, books, and study guides into parsed vector nodes, ready to be utilized in logical NodeCraft pipelines or resume compilation.
                    </p>
                    
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Workspace Use Cases</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                        <strong className="text-white">Research Workspace</strong>
                        <p className="mt-1 text-[11px]">Query across large sets of scientific PDFs simultaneously using local vectorized databases.</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                        <strong className="text-white">Smart Course Notes</strong>
                        <p className="mt-1 text-[11px]">Organize syllabi, set learning habits, and study definitions with custom practice test generators.</p>
                      </div>
                    </div>
                  </div>

                  {/* Document uploader tracker */}
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>Course Materials Library</span>
                      <span className="text-[10px] text-axiom-purple font-mono font-bold uppercase">{gnosisDocs.length} Active Files</span>
                    </h3>
                    
                    <form onSubmit={handleAddDoc} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add file name (e.g. bio_notes.pdf)..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-axiom-purple"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                      />
                      <button 
                        type="submit"
                        className="bg-axiom-purple hover:bg-axiom-purple/90 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </form>

                    <div className="space-y-2 pt-2">
                      {gnosisDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01] text-xs">
                          <span className="text-slate-300 font-mono flex items-center gap-2">
                            <FileText className="h-4 w-4 text-axiom-purple" />
                            <span>{doc.name}</span>
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-mono">{doc.size}</span>
                            <span className="text-[9px] font-bold text-axiom-emerald font-mono uppercase bg-axiom-emerald/10 px-2 py-0.5 rounded border border-axiom-emerald/20">Vectorized</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  {/* CTA card to deploy outside */}
                  <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-axiom-purple/5 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📚</span>
                      <h4 className="text-sm font-bold text-white">GNOSIS Platform</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Launch the complete standalone Gnosis application. Write notes, analyze textbooks, set study habits, and review flashcard queues.
                    </p>
                    <a 
                      href="https://gnosisapp-theta.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold bg-white text-black py-2.5 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <span>Launch Gnosis</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: NODECRAFT CANVAS BUILDER */}
            {activeTab === 'nodecraft' && (
              <div className="flex-1 flex flex-col min-h-[500px] border border-white/5 rounded-2xl overflow-hidden glass-panel bg-slate-950/90 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Control Tool Panel header */}
                <div className="p-4 border-b border-white/5 bg-black/60 flex items-center justify-between z-10 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAddNewNode('input')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-axiom-purple/30 bg-axiom-purple/5 hover:bg-axiom-purple/10 text-white text-xs font-bold transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Input Node</span>
                    </button>
                    <button 
                      onClick={() => handleAddNewNode('ai')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-axiom-cyan/30 bg-axiom-cyan/5 hover:bg-axiom-cyan/10 text-axiom-cyan text-xs font-bold transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>AI Node</span>
                    </button>
                    <button 
                      onClick={() => handleAddNewNode('output')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-axiom-emerald/30 bg-axiom-emerald/5 hover:bg-axiom-emerald/10 text-axiom-emerald text-xs font-bold transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Output Node</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* execution indicator */}
                    {isRunningPipeline && (
                      <span className="text-[10px] text-axiom-cyan font-mono animate-pulse flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Running Logic...</span>
                      </span>
                    )}
                    <motion.a
                      href="https://flowforgeai-flax.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all bg-gradient-to-r from-axiom-purple via-slate-900 to-axiom-cyan hover:opacity-95 border border-white/10 hover:border-white/20 shadow-md shadow-axiom-purple/5"
                    >
                      <Rocket className="h-3.5 w-3.5 text-axiom-cyan animate-pulse" />
                      <span>Launch NodeCraft AI</span>
                    </motion.a>
                    <button 
                      onClick={handleRunPipeline}
                      disabled={isRunningPipeline}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white text-black hover:bg-slate-200 text-xs font-bold disabled:opacity-50 transition-all shadow-md active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5 fill-black" />
                      <span>Execute Pipeline</span>
                    </button>
                  </div>
                </div>

                {/* React Flow Render Viewport */}
                <div className="flex-1 h-full relative" style={{ minHeight: '400px' }}>
                  {/* Preview Badge Overlay */}
                  <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-slate-950/90 backdrop-blur-md text-[10px] text-slate-300 shadow-md">
                    <span className="h-2 w-2 rounded-full bg-axiom-cyan animate-pulse" />
                    <span className="font-bold uppercase tracking-wider">Live Product Available</span>
                    <span className="text-slate-600">|</span>
                    <a 
                      href="https://flowforgeai-flax.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-axiom-cyan hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Launch NodeCraft AI</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                  >
                    <Background color="rgba(255, 255, 255, 0.03)" gap={16} />
                    <Controls />
                    <MiniMap 
                      nodeStrokeColor={(n) => {
                        if (n.type === 'inputNode') return '#8b5cf6';
                        if (n.type === 'aiNode') return '#06b6d4';
                        if (n.type === 'outputNode') return '#10b981';
                        return '#eee';
                      }}
                      nodeColor={(n) => '#030303'}
                      maskColor="rgba(0, 0, 0, 0.7)"
                    />
                  </ReactFlow>
                </div>
              </div>
            )}

            {/* VIEW 4: CAREEROS PAGE */}
            {activeTab === 'careeros' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Left block: copy / ATS widget */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-axiom-emerald" />
                      <span>CareerOS Placement Tools</span>
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      CAREEROS is the career-deployment suite of the AXIOM ecosystem. It takes the notes analyzed in Gnosis and the custom workflows compiled in NodeCraft, and processes them to construct job-specific cover letters, format professional resumes, and calculate target ATS compliance scores.
                    </p>
                  </div>

                  {/* ATS Scoring Widget Mockup */}
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>Interactive ATS Match Tester</span>
                      <span className="text-[10px] text-axiom-emerald font-mono uppercase">Simulation Node</span>
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">Paste Resume Content</label>
                          <textarea 
                            className="w-full h-24 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-axiom-emerald resize-none"
                            placeholder="e.g. Worked on building React interfaces and deploying workflows..."
                            value={atsResumeText}
                            onChange={(e) => setAtsResumeText(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">Target Job Description</label>
                          <textarea 
                            className="w-full h-24 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-axiom-emerald resize-none"
                            placeholder="e.g. Looking for a Frontend Engineer with experience in React Flow and Next.js..."
                            value={atsJobText}
                            onChange={(e) => setAtsJobText(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <button 
                          onClick={handleCalculateAts}
                          disabled={calculatingAts || !atsResumeText || !atsJobText}
                          className="px-4 py-2 bg-axiom-emerald hover:bg-axiom-emerald/90 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {calculatingAts ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                          <span>Calculate ATS Fit</span>
                        </button>

                        <AnimatePresence>
                          {atsScore !== null && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-3"
                            >
                              <div className="h-10 w-10 rounded-full border-2 border-axiom-emerald flex items-center justify-center font-mono text-sm font-bold text-white">
                                {atsScore}%
                              </div>
                              <span className="text-[10px] font-bold text-axiom-emerald font-mono uppercase bg-axiom-emerald/10 px-2 py-0.5 rounded border border-axiom-emerald/20">ALIGNMENT MET</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right block: CTA */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-axiom-emerald/5 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💼</span>
                      <h4 className="text-sm font-bold text-white">CareerOS Platform</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Launch the complete standalone CareerOS web application to draft resumes, check cover letter configurations, and manage your placement progress.
                    </p>
                    <a 
                      href="https://careeros-six.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold bg-white text-black py-2.5 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <span>Launch CareerOS</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 5: WORKFLOW GUIDE */}
            {activeTab === 'guide' && (
              <div className="p-6 rounded-2xl glass-panel border border-white/5 bg-slate-950/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="max-w-2xl mx-auto space-y-8 relative timeline-line-glow pl-6 md:pl-0">
                  <div className="text-center md:text-left mb-6">
                    <h3 className="text-sm font-bold text-white">The Connected Workflow Lifecycle</h3>
                    <p className="text-[10px] text-slate-500">Go from raw documentation files to active job placement step-by-step</p>
                  </div>

                  {[
                    { step: 'Research', desc: 'Import reference materials, notes, PDFs, or syllabi into Gnosis AI.' },
                    { step: 'Learn', desc: 'Scan through document concepts, auto-generate study guides, and chat with AI tutors.' },
                    { step: 'Summarize', desc: 'Pin key definitions and export concept notes to your workspace clipboard.' },
                    { step: 'Build', desc: 'Design automated flows in NodeCraft by mapping input texts directly into custom AI prompt chains.' },
                    { step: 'Automate', desc: 'Run node execution threads via API logic with zero coding required.' },
                    { step: 'Create Projects', desc: 'Formulate real-world automations to highlight in your personal portfolio.' },
                    { step: 'Generate Resume', desc: 'Synthesize details in CareerOS to output custom ATS-optimized CVs.' },
                    { step: 'Apply', desc: 'Scan resume documents against target roles to verify matching scores.' },
                    { step: 'Get Hired', desc: 'Highlight functional, working pipelines in interviews and land the opportunity.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row relative">
                      <div className="absolute left-[-21px] md:left-1/2 md:-translate-x-1/2 top-1.5 h-4 w-4 rounded-full border border-axiom-purple bg-slate-950 z-20 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-axiom-purple" />
                      </div>
                      <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:order-last'}`}>
                        <div className="text-[10px] font-bold text-axiom-purple font-mono mb-0.5">STEP 0{idx+1}</div>
                        <h4 className="text-xs font-bold text-white mb-1">{item.step}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal max-w-sm md:ml-auto md:mr-0">{item.desc}</p>
                      </div>
                      <div className="hidden md:block w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030303] text-slate-400 flex flex-col items-center justify-center font-mono gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-axiom-purple" />
        <span>Initializing AXIOM Core...</span>
      </div>
    }>
      <Dashboard />
    </Suspense>
  );
}
