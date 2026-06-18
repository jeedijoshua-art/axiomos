"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  originalX: number;
  originalY: number;
  depth: number; // For parallax depth
}

export const EcosystemBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const scrollRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      'rgba(139, 92, 246, ', // Purple
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(167, 139, 250, ', // Light purple
      'rgba(16, 185, 129, ',  // Emerald
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const w = canvas.width;
      const h = canvas.height;
      particles = [];
      
      // Scale particle count based on screen size
      const count = Math.min(Math.floor((w * h) / 15000), 100);
      
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const depth = Math.random() * 0.6 + 0.4; // 0.4 to 1.0
        
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          depth,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    resizeCanvas();

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Smooth scroll parallax
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.1;
      
      // Smooth mouse movement
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // Parallax updates for HTML orbs
      if (containerRef.current) {
        const orbs = containerRef.current.querySelectorAll('.aurora-orb');
        const scrollVal = scrollRef.current.current;
        const mouseX = mouseRef.current.x > 0 ? (mouseRef.current.x - w / 2) * 0.02 : 0;
        const mouseY = mouseRef.current.x > 0 ? (mouseRef.current.y - h / 2) * 0.02 : 0;
        
        orbs.forEach((orb, index) => {
          const depth = (index + 1) * 0.4;
          const scrollOffset = scrollVal * depth * 0.12;
          const htmlOrb = orb as HTMLElement;
          htmlOrb.style.transform = `translate3d(${mouseX * depth}px, ${mouseY * depth - scrollOffset}px, 0)`;
        });
      }

      // Draw connections first
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Calculate scroll offset based on depth
        const scrollOffset = scrollRef.current.current * (p1.depth - 0.3) * 0.15;
        const p1Y = (p1.y - scrollOffset + h) % h;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2Y = (p2.y - scrollOffset + h) % h;

          const dx = p1.x - p2.x;
          const dy = p1Y - p2Y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect particles close to each other
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.09 * p1.depth;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1Y);
            ctx.lineTo(p2.x, p2Y);
            
            // Neon gradient link
            const grad = ctx.createLinearGradient(p1.x, p1Y, p2.x, p2Y);
            const color1 = p1.color.includes('139') ? '#8b5cf6' : p1.color.includes('6') ? '#06b6d4' : '#10b981';
            const color2 = p2.color.includes('139') ? '#8b5cf6' : p2.color.includes('6') ? '#06b6d4' : '#10b981';
            grad.addColorStop(0, `rgba(${color1 === '#8b5cf6' ? '139, 92, 246' : color1 === '#06b6d4' ? '6, 182, 212' : '16, 185, 129'}, ${alpha})`);
            grad.addColorStop(1, `rgba(${color2 === '#8b5cf6' ? '139, 92, 246' : color2 === '#06b6d4' ? '6, 182, 212' : '16, 185, 129'}, ${alpha})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6 * p1.depth;
            ctx.stroke();
          }
        }

        // Connect to mouse if active
        if (mouseRef.current.x > 0) {
          const dxMouse = p1.x - mouseRef.current.x;
          const dyMouse = p1Y - mouseRef.current.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < 160) {
            const alpha = (1 - distMouse / 160) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1Y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Subtle mouse force (attraction/repulsion based on node speed)
            const force = (160 - distMouse) / 160;
            p1.x += (dxMouse / distMouse) * force * 0.4;
            p1.y += (dyMouse / distMouse) * force * 0.4;
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Parallax position
        const scrollOffset = scrollRef.current.current * (p.depth - 0.3) * 0.15;
        const drawY = (p.y - scrollOffset + h) % h;

        ctx.beginPath();
        ctx.arc(p.x, drawY, p.radius * p.depth * 1.2, 0, Math.PI * 2);
        
        // Dynamic opacity based on mouse distance
        let finalOpacity = 0.35 * p.depth;
        if (mouseRef.current.x > 0) {
          const dx = p.x - mouseRef.current.x;
          const dy = drawY - mouseRef.current.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            finalOpacity = (0.35 + (1 - d / 150) * 0.55) * p.depth;
          }
        }

        ctx.fillStyle = `${p.color}${finalOpacity})`;
        
        // Add subtle neon glow to nodes
        ctx.shadowBlur = 8 * p.depth;
        ctx.shadowColor = p.color.includes('139') ? '#8b5cf6' : p.color.includes('6') ? '#06b6d4' : '#10b981';
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for other drawing
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background">
      {/* Mesh/Aurora Gradient Orbs */}
      <div className="aurora-orb absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-axiom-purple/10 blur-[120px] animate-float-slow pointer-events-none transition-transform duration-300 ease-out" />
      <div className="aurora-orb absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-axiom-cyan/8 blur-[150px] animate-float-medium pointer-events-none transition-transform duration-300 ease-out" />
      <div className="aurora-orb absolute top-[35%] right-[10%] w-[45%] h-[45%] rounded-full bg-axiom-purple/5 blur-[120px] animate-float-fast pointer-events-none transition-transform duration-300 ease-out" />
      <div className="aurora-orb absolute bottom-[20%] left-[5%] w-[40%] h-[40%] rounded-full bg-axiom-emerald/4 blur-[100px] animate-float-slow pointer-events-none transition-transform duration-300 ease-out" />
      
      {/* Living Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      
      {/* Fine Scanline or Noise Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.1)_50%,_transparent_50%)] bg-[length:100%_4px] opacity-10" />
    </div>
  );
};

export default EcosystemBackground;
