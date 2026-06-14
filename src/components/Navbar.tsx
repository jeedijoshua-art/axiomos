"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Terminal, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ecosystem', href: '#ecosystem-visual' },
    { name: 'Products', href: '#journey' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Why Axiom', href: '#why-axiom' },
    { name: 'Roadmap', href: '#roadmap' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    // If not on home page, redirect to home page first with hash
    if (pathname !== '/') {
      window.location.href = `/${id}`;
      return;
    }

    const cleanId = id.replace('#', '');
    const element = document.getElementById(cleanId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        scrolled 
          ? 'py-3 bg-black/60 backdrop-blur-xl border-b border-white/5' 
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-axiom-purple to-axiom-cyan text-white shadow-lg shadow-axiom-purple/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <Terminal className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-extrabold tracking-widest text-white font-mono">
            AXIOM
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 px-3 py-2"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 active:scale-95 bg-white text-black hover:bg-slate-200 shadow-md shadow-white/5 h-9 px-4 overflow-hidden"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-axiom-purple" />
            <span>Launch Platform</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-slate-500" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-3">
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg text-xs font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 h-8 px-3"
          >
            Launch
          </Link>
          <button 
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass-panel border-b border-white/5 p-6 md:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-250">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-base font-medium text-slate-300 hover:text-white py-1 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="h-px bg-white/5 my-1" />
          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center text-sm font-semibold border border-white/10 text-white rounded-lg h-10 hover:bg-white/5 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1 text-sm font-semibold bg-white text-black rounded-lg h-10 hover:bg-slate-200 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-axiom-purple" />
              <span>Launch Platform</span>
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
