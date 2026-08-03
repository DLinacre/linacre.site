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
        setCurrentLineText('');
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
        await typeLine(line);
        await new Promise(resolve => setTimeout(resolve, 300));
      } else if (line.type === 'out') {
        await new Promise(resolve => setTimeout(resolve, 100));
        setRenderedLines(prev => [...prev, line]);
      }

      lineIdx++;
    }

    if (onComplete) onComplete();
  };

  // Initial render when prefers-reduced-motion is true
  useEffect(() => {
    if (prefersReduced) {
      skipAnimation();
    } else {
      runTypewriter();
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 font-mono" id="intro-terminal">
      <div className="linacre-surface overflow-hidden transition-all">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-border-color bg-[#031018] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <TerminalIcon className="h-3.5 w-3.5 text-cyan" />
              <span>david@linacre: ~ (bash)</span>
            </div>
          </div>
          {!isSkipped && (
            <button
              onClick={skipAnimation}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan hover:text-cyan/80 cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Skip</span>
            </button>
          )}
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalBodyRef}
          className="max-h-[360px] min-h-[160px] overflow-y-auto p-4 text-xs leading-relaxed"
        >
          {renderedLines.map((line, i) => {
            if (line.type === 'gap') return <div key={i} className="h-2" />;
            if (line.type === 'prompt')
              return (
                <div key={i} className="flex items-center gap-1 text-cyan">
                  <span className="font-bold">david@linacre:~$</span>
                  <span className="inline-block h-3.5 w-2 bg-cyan animate-pulse" />
                </div>
              );
            if (line.type === 'cmd')
              return (
                <div key={i} className="flex items-center gap-1 text-foreground">
                  <span className="text-cyan font-bold">david@linacre:~$</span>
                  <span>{line.text}</span>
                </div>
              );
            return (
              <div
                key={i}
                className={
                  line.cls === 'dim'
                    ? 'text-muted-foreground'
                    : line.cls === 'amb'
                    ? 'text-cyan font-bold'
                    : 'text-foreground'
                }
              >
                {line.text}
              </div>
            );
          })}
          {isTyping && (
            <div className="flex items-center gap-1 text-foreground">
              <span className="text-cyan font-bold">david@linacre:~$</span>
              <span>{currentLineText}</span>
              <span className="inline-block h-3.5 w-2 bg-cyan animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
