"use client";

import React from 'react';
import Link from 'next/link';
import { Terminal, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <a href="#" onClick={handleScrollToTop} className="flex items-center gap-2.5 focus:outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-axiom-purple to-axiom-cyan text-white shadow-md">
              <Terminal className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-extrabold tracking-widest text-white font-mono">AXIOM</span>
          </a>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            The parent operating system for the AI era. Learn, build, showcase, and get hired in one unified interface.
          </p>
        </div>

        {/* Column 2: Ecosystem */}
        <div>
          <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Ecosystem</h5>
          <ul className="space-y-3">
            <li>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                GNOSIS AI — Knowledge
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                NODECRAFT AI — Studio
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                CAREEROS — Placement
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h5>
          <ul className="space-y-3">
            <li>
              <a href="#journey" className="text-sm text-slate-400 hover:text-white transition-colors">
                Platform Journey
              </a>
            </li>
            <li>
              <a href="#workflow" className="text-sm text-slate-400 hover:text-white transition-colors">
                Visual Flowchart
              </a>
            </li>
            <li>
              <a href="#why-axiom" className="text-sm text-slate-400 hover:text-white transition-colors">
                Why Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Development */}
        <div>
          <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h5>
          <ul className="space-y-3">
            <li>
              <a 
                href="https://github.com/jeedijoshua-art/flowforgeai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/jeedijoshua-art/flowforgeai/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Report System Issue
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} AXIOM OS. All rights reserved. Built with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>for the developer ecosystem.</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
