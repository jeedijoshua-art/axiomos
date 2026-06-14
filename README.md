# ⚙️ AXIOM OS

> One Operating System for the AI Era. Learn. Build. Automate. Get Hired.

**AXIOM** is a world-class AI SaaS parent operating system that connects three independent AI platforms into a unified personal and professional development lifecycle:

1. **📚 GNOSIS AI** (`Learn & Research`) — Multi-document vector search, PDF summaries, and cognitive study workspaces.
   - *Tool Repository:* [jeedijoshua-art/memora](https://github.com/jeedijoshua-art/memora)
2. **⚡ NODECRAFT AI** (`Build & Automate`) — An interactive visual drag-and-drop workspace canvas to configure and chain AI agent nodes with zero coding.
   - *Tool Repository:* [jeedijoshua-art/flowforgeai](https://github.com/jeedijoshua-art/flowforgeai)
3. **💼 CAREEROS** (`Showcase & Get Hired`) — An AI-powered placement suite to optimize cover letters, resume ATS alignment, and format portfolio items.
   - *Tool Repository:* [jeedijoshua-art/careeros](https://github.com/jeedijoshua-art/careeros)


```
       [ DOCUMENTS ]
             │
             ▼
        GNOSIS AI  (Knowledge Extraction)
             │
             ▼
       NODECRAFT AI (AI Agent Canvas Builder)
             │
             ▼
        CAREEROS   (ATS CV Optimizer)
             │
             ▼
     [ OPPORTUNITIES ]
```

---

## 🚀 Key Features

### 🌌 Living AI Background
- Performance-tuned HTML5 canvas particle fields.
- Dynamic scrolling parallax depth adjustments.
- Interactive mouse-reactive node-net attraction forces and auroras.

### 🎛️ Unified Workspace Dashboard
- Collapsible sidebar panel navigation wrapped inside Next.js Suspense frames.
- **Overview Monitor**: Real-time status cards checking documents-to-jobs assets throughput.
- **Gnosis Manager**: Course materials library list allowing users to mock PDF indexing.
- **NodeCraft Studio**: Connect nodes, adjust prompt text parameters, and trigger pipeline execution with simulated API delays and visual execution pulses.
- **CareerOS Suite**: Interactive ATS score calculator assessing cv-to-description alignment percentage.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first variables & custom themes)
- **Visual Nodes**: [@xyflow/react](https://reactflow.dev/) (React Flow v12 canvas elements)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP ScrollTrigger](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Getting Started

### 1. Install Dependencies
Clone the repository and install packages:
```bash
npm install --legacy-peer-deps
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the landing page. Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to explore the system nodes.

### 3. Build for Production
Verify all types compile successfully:
```bash
npm run build
```

---

## 📂 Project Directory Structure

```
axiom/
├── src/
│   ├── app/
│   │   ├── globals.css      # Design tokens & glassmorphism keyframes
│   │   ├── layout.tsx       # Root layout wrapping Suspense boundaries
│   │   ├── icon.svg         # Branded vector favicon
│   │   ├── page.tsx         # Responsive ecosystem landing page
│   │   └── dashboard/
│   │       └── page.tsx     # Unified sidebar tabs & NodeCraft canvas
│   └── components/
│       ├── EcosystemBackground.tsx  # Interactive particle nodes canvas
│       ├── Navbar.tsx               # Sticky scroll-sensitive navigation
│       └── Footer.tsx               # Social hooks & credits footer
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
