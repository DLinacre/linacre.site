import { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { TERMINAL_LINES } from '../data/core';

interface TerminalIntroProps {
  onComplete?: () => void;
}

export default function TerminalIntro({ onComplete }: TerminalIntroProps) {
  const [renderedLines, setRenderedLines] = useState<any[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [_currentLineIdx, setCurrentLineIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto scroll terminal body
  useEffect(() => {
    const el = terminalBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [renderedLines, currentLineText]);

  // Initial render when prefers-reduced-motion is true
  useEffect(() => {
    if (prefersReduced) {
      skipAnimation();
    } else {
      runTypewriter();
    }
  }, []);

  const skipAnimation = () => {
    setIsSkipped(true);
    setIsTyping(false);
    setCurrentLineText('');

    // Render all lines instantly
    const allLines: any[] = [];
    TERMINAL_LINES.forEach(line => {
      if (line.type !== 'gap' && line.type !== 'prompt') {
        allLines.push(line);
      } else if (line.type === 'gap') {
        allLines.push({ type: 'gap' });
      } else if (line.type === 'prompt') {
        allLines.push({ type: 'prompt' });
      }
    });
    setRenderedLines(allLines);
    if (onComplete) onComplete();
  };

  const runTypewriter = async () => {
    let lineIdx = 0;

    const typeLine = async (line: any) => {
      return new Promise<void>(resolve => {
        setIsTyping(true);
        let charIdx = 0;
        let typedText = '';

        const typeInterval = setInterval(() => {
          if (charIdx < line.text.length) {
            typedText += line.text[charIdx];
            setCurrentLineText(typedText);
            charIdx++;
          } else {
            clearInterval(typeInterval);
            setIsTyping(false);
            // Append line to rendered lines list
            setRenderedLines(prev => [...prev, { ...line, text: line.text }]);
            setCurrentLineText('');
            resolve();
          }
        }, 25);
      });
    };

    while (lineIdx < TERMINAL_LINES.length) {
      const line = TERMINAL_LINES[lineIdx];
      setCurrentLineIdx(lineIdx);

      if (line.type === 'gap') {
        setRenderedLines(prev => [...prev, { type: 'gap' }]);
        await new Promise(resolve => setTimeout(resolve, 80));
      } else if (line.type === 'prompt') {
        setRenderedLines(prev => [...prev, { type: 'prompt' }]);
        await new Promise(resolve => setTimeout(resolve, 100));
      } else if (line.type === 'cmd') {
        // Typing animation for commands
        await typeLine(line);
        await new Promise(resolve => setTimeout(resolve, 300));
      } else if (line.type === 'out') {
        // Instant render for command output with a small delay
        await new Promise(resolve => setTimeout(resolve, 100));
        setRenderedLines(prev => [...prev, line]);
      }

      lineIdx++;
    }

    if (onComplete) onComplete();
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 font-mono" id="intro-terminal">
      {/* Terminal Container */}
      <div
        className="linacre-surface overflow-hidden transition-all"
        style={{ transitionDuration: 'var(--linacre-duration-base)' }}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted dark:bg-[#0B1220] border-b border-amber-color/15 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan" />
            <span>david@linacre.site: ~</span>
          </div>
          <div className="w-14 text-right">
            {!isSkipped && (
              <button
                onClick={skipAnimation}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors border border-border-color/60 hover:border-border-color bg-background/50 px-1.5 py-0.5 rounded cursor-pointer"
              >
                skip
              </button>
            )}
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalBodyRef}
          tabIndex={0}
          role="region"
          aria-label="Terminal output"
          className="p-5 min-h-[280px] max-h-[400px] overflow-y-auto text-sm leading-relaxed space-y-2 select-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          style={{ scrollbarColor: 'rgba(34,211,238,0.15) transparent' }}
        >
          {renderedLines.map((line, idx) => {
            if (line.type === 'gap') {
              return <div key={idx} className="h-2" />;
            }
            if (line.type === 'prompt') {
              return (
                <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-amber-color select-none">$</span>
                  <span className="w-2 h-4 bg-amber-color animate-pulse" />
                </div>
              );
            }
            if (line.type === 'cmd') {
              return (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-color select-none">$</span>
                  <span className="text-foreground font-medium">{line.text}</span>
                </div>
              );
            }
            if (line.type === 'out') {
              let textClass = 'text-muted-foreground';
              if (line.cls === 'dim') textClass = 'text-muted-foreground/60';
              if (line.cls === 'amb') textClass = 'text-amber-color/90';
              return (
                <div key={idx} className={`pl-4 ${textClass}`}>
                  {line.text}
                </div>
              );
            }
            return null;
          })}

          {/* Current typing line */}
          {isTyping && (
            <div className="flex items-start gap-2">
              <span className="text-amber-color select-none">$</span>
              <span className="text-foreground font-medium">{currentLineText}</span>
              <span className="w-2 h-4 bg-amber-color animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Subtext info */}
      <p className="text-[11px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5 select-none">
        <Sparkles className="w-3 h-3 text-amber-color animate-spin-slow" />
        <span>Try hovering on category chips in the toolkit below</span>
      </p>
    </div>
  );
}
