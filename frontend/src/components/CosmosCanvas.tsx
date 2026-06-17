import React, { useEffect, useRef } from 'react';

export type CosmosState = 'idle' | 'disrupted' | 'calm';

interface CosmosProps {
  cosmosState: CosmosState;
  isDarkMode: boolean;
}

interface CosmosLetter {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  rotation: number;
  baseVx: number;
  baseVy: number;
  targetX: number | null;
  targetY: number | null;
  assigned: boolean;
  baseOpacity: number;
}

const SENTENCES = [
  "Parsing your story...",
  "Chunking the cosmos...",
  "Vectorizing your experience...",
  "Searching the galaxy...",
  "Consulting the hiring oracle...",
  "Assembling your destiny...",
  "Still consulting the cosmos..."
];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export function CosmosCanvas({ cosmosState, isDarkMode }: CosmosProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lettersRef = useRef<CosmosLetter[]>([]);
  const stateRef = useRef({
    phase: 'idle', // 'idle', 'disrupting', 'assembling', 'holding', 'dissolving', 'calming'
    startTime: 0,
    sentenceIndex: 0,
    cycleStartTime: 0,
  });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      let count = 150;
      if (width < 768) count = 75;
      else if (width < 1024) count = 100;
      
      if (lettersRef.current.length !== count) {
        lettersRef.current = Array.from({ length: count }, () => {
          const vx = (Math.random() - 0.5) * 0.6;
          const vy = (Math.random() - 0.5) * 0.6;
          const opacity = 0.08 + Math.random() * 0.12;
          return {
            char: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
            x: Math.random() * width,
            y: Math.random() * height,
            vx, vy, baseVx: vx, baseVy: vy,
            opacity, baseOpacity: opacity,
            size: 10 + Math.random() * 6,
            rotation: (Math.random() - 0.5) * 30 * (Math.PI / 180),
            targetX: null, targetY: null, assigned: false
          };
        });
      }
    };

    initCanvas();
    let resizeTimeout: any;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initCanvas, 200);
    };
    window.addEventListener('resize', onResize);

    const render = (time: number) => {
      rafId = requestAnimationFrame(render);
      if (width < 768) {
         // Mobile simplification: just float, no assembly
         ctx.clearRect(0, 0, width, height);
         // apply physics for idle
         applyIdlePhysics(ctx);
         return;
      }

      ctx.clearRect(0, 0, width, height);
      const state = stateRef.current;
      
      // State transition logic
      if (cosmosState === 'disrupted' && state.phase === 'idle') {
        state.phase = 'disrupting';
        state.startTime = time;
        // Kick velocities
        lettersRef.current.forEach(l => {
          l.vx = l.baseVx * 8 + (Math.random() - 0.5) * 2;
          l.vy = l.baseVy * 8 + (Math.random() - 0.5) * 2;
          l.opacity = Math.random() * 0.35 + 0.05;
        });
      } else if (cosmosState === 'calm' && ['disrupting', 'assembling', 'holding', 'dissolving'].includes(state.phase)) {
        state.phase = 'calming';
        state.startTime = time;
      } else if (cosmosState === 'idle' && state.phase !== 'idle') {
        state.phase = 'idle';
        lettersRef.current.forEach(l => {
          l.assigned = false;
          (l as any).targetChar = null;
        });
      }

      const elapsed = time - state.startTime;

      if (state.phase === 'disrupting') {
         if (elapsed > 1500) {
           state.phase = 'assembling';
           state.cycleStartTime = time;
           state.sentenceIndex = 0;
           assignTargets(width, height, SENTENCES[0]);
         }
      }

      if (['assembling', 'holding', 'dissolving'].includes(state.phase)) {
        const cycleElapsed = time - state.cycleStartTime;
        if (cycleElapsed > 1800) {
           // next sentence
           state.cycleStartTime = time;
           state.phase = 'assembling';
           state.sentenceIndex = (state.sentenceIndex + 1) % SENTENCES.length;
           // If we're at index 6, keep showing it if time exceeds
           let nextIdx = state.sentenceIndex;
           if (state.sentenceIndex === 0 && cycleElapsed > 11000) {
               nextIdx = 6;
           }
           assignTargets(width, height, SENTENCES[nextIdx]);
        } else if (cycleElapsed > 1400) {
           state.phase = 'dissolving';
        } else if (cycleElapsed > 800) {
           state.phase = 'holding';
        }
      }

      // Render loops
      lettersRef.current.forEach(l => {
        // Apply physics
        if (state.phase === 'idle') {
          l.x += l.baseVx;
          l.y += l.baseVy;
          l.opacity = l.baseOpacity;
        } else if (state.phase === 'disrupting') {
           l.x += l.vx;
           l.y += l.vy;
           l.opacity = (Math.sin(time * 0.01 + l.x) + 1) / 2 * 0.35 + 0.05;
        } else if (state.phase === 'calming') {
           l.vx *= 0.95;
           l.vy *= 0.95;
           if (Math.abs(l.vx) < Math.abs(l.baseVx)) l.vx = l.baseVx;
           if (Math.abs(l.vy) < Math.abs(l.baseVy)) l.vy = l.baseVy;
           l.x += l.vx;
           l.y += l.vy;
           l.opacity += (l.baseOpacity - l.opacity) * 0.05;
           if (elapsed > 2000) state.phase = 'idle';
        } else {
           // assembly phases
           if (l.assigned && l.targetX != null && l.targetY != null) {
              if (state.phase === 'assembling') {
                 l.x += (l.targetX - l.x) * 0.08;
                 l.y += (l.targetY - l.y) * 0.08;
                 l.opacity += (1.0 - l.opacity) * 0.1;
                 l.rotation *= 0.9;
              } else if (state.phase === 'holding') {
                 l.x = l.targetX;
                 l.y = l.targetY;
                 l.opacity = 1.0;
                 l.rotation = 0;
              } else if (state.phase === 'dissolving') {
                 if (l.vx === l.baseVx) {
                     l.vx = (Math.random() - 0.5) * 10;
                     l.vy = (Math.random() - 0.5) * 10;
                 }
                 l.x += l.vx;
                 l.y += l.vy;
                 l.opacity += (l.baseOpacity - l.opacity) * 0.1;
              }
           } else {
              // unassigned continues chaotic
              l.x += l.vx;
              l.y += l.vy;
              
              // Wrap boundaries for all unassigned or idle
              if (l.x < 0) l.x = width;
              if (l.x > width) l.x = 0;
              if (l.y < 0) l.y = height;
              if (l.y > height) l.y = 0;
           }
        }

        if (state.phase !== 'assembling' && state.phase !== 'holding' || (!l.assigned)) {
            if (l.x < 0) l.x = width;
            if (l.x > width) l.x = 0;
            if (l.y < 0) l.y = height;
            if (l.y > height) l.y = 0;
        }

        // Draw
        ctx.save();
        ctx.globalAlpha = l.opacity;
        ctx.font = `600 ${(l.assigned && state.phase !== 'disrupting' && state.phase !== 'calming' && state.phase !== 'idle' && state.phase !== 'dissolving' && l.opacity > 0.5) ? 'clamp(1.2rem, 2.5vw, 2rem)' : l.size + 'px'} 'Space Grotesk'`;
        
        ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#000000';
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rotation);
        
        let charToDraw = l.char;
        if (l.assigned && (state.phase === 'assembling' || state.phase === 'holding')) {
           // We assign target characters to letters? The instructions say "assign... match nearest floating letter". Wait, the letter's character must change to the target character so words make sense!
           // Or does the letter just move to the spot? Better to draw the target character instead of l.char if assigned. 
           // I will store targetChar in letter if assigned.
           charToDraw = (l as any).targetChar || l.char;
           if (state.phase === 'holding') {
               ctx.fillStyle = `var(--text-primary)`; // ensure correct color
           }
        }
        ctx.fillText(charToDraw, 0, 0);
        ctx.restore();
      });
    };

    const applyIdlePhysics = (ctx: CanvasRenderingContext2D) => {
        lettersRef.current.forEach(l => {
          l.x += l.baseVx;
          l.y += l.baseVy;
          if (l.x < 0) l.x = width;
          if (l.x > width) l.x = 0;
          if (l.y < 0) l.y = height;
          if (l.y > height) l.y = 0;
          ctx.save();
          ctx.globalAlpha = l.baseOpacity;
          ctx.font = `${l.size}px 'Space Grotesk'`;
          ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#000000';
          ctx.translate(l.x, l.y);
          ctx.rotate(l.rotation);
          ctx.fillText(l.char, 0, 0);
          ctx.restore();
        });
    }

    const assignTargets = (w: number, h: number, text: string) => {
       lettersRef.current.forEach(l => {
           l.assigned = false;
           (l as any).targetChar = null;
       });
       
       let fontSize = Math.min(32, w * 0.9 / text.length);
       
       const totalWidth = text.length * (fontSize * 0.6); // approximation
       let startX = (w - totalWidth) / 2;
       const targetY = h / 2;

       for(let i=0; i<text.length; i++) {
           if (text[i] === ' ') {
               startX += fontSize * 0.6;
               continue;
           }
           const targetX = startX;
           startX += fontSize * 0.6;

           // Find closest unassigned letter
           let closest = null;
           let minDist = Infinity;
           for(const l of lettersRef.current) {
               if (!l.assigned) {
                   const dist = Math.hypot(l.x - targetX, l.y - targetY);
                   if (dist < minDist) {
                       minDist = dist;
                       closest = l;
                   }
               }
           }

           if (closest) {
               closest.assigned = true;
               closest.targetX = targetX;
               closest.targetY = targetY;
               (closest as any).targetChar = text[i];
               closest.opacity = 0; // hide temporarily to fade in? or keep current opacity
           }
       }
    };

    rafId = requestAnimationFrame(render);
    return () => {
       cancelAnimationFrame(rafId);
       window.removeEventListener('resize', onResize);
    };
  }, [cosmosState, isDarkMode]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
      {window.innerWidth < 768 && cosmosState === 'disrupted' && (
         <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none p-4 text-center">
            <h2 className="font-display font-bold text-xl md:text-2xl animate-pulse text-[var(--text-primary)]">
               {SENTENCES[0]}
            </h2>
         </div>
      )}
    </>
  );
}
