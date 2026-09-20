import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CornerDownLeft } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'system';
  text: string;
  timestamp?: string;
}

interface NeuralTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTopic?: string;
}

export const NeuralTerminalModal: React.FC<NeuralTerminalModalProps> = ({
  isOpen,
  onClose,
  activeTopic = 'Relational Databases & SQL',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: 'system',
      text: 'MetaMind Neural CLI v2.4.0 [DEBLUN Engine Ready]\nType "help" to view diagnostic commands, or ask any technical query.',
    },
    {
      type: 'output',
      text: `Context Loaded: [${activeTopic}] • Neural Synapse Active`,
    },
  ]);

  const modalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // GSAP Window Entrance
  useEffect(() => {
    if (isOpen && modalRef.current && !isMinimized) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
      );
    }
  }, [isOpen, isMinimized]);

  // Auto scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  if (!isOpen) return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newHistory: TerminalLine[] = [
      ...history,
      { type: 'input', text: `student@metamind:~$ ${cmd}`, timestamp: timeStr },
    ];

    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      newHistory.push({
        type: 'output',
        text: `Available Terminal Commands:\n  • status     : View active neural retention & cognitive index\n  • streak     : Check current active study streak\n  • recall     : Active recall question for ${activeTopic}\n  • clear      : Clear terminal screen\n  • <query>    : Ask any computer science concept doubt`,
      });
    } else if (lower === 'status') {
      newHistory.push({
        type: 'output',
        text: `[SYSTEM DIAGNOSTICS]\n• Target Module  : ${activeTopic}\n• Synapse Edge   : +68% Over Cramming Baseline\n• Retention Rate : 92% (Day 7 Decay Guard Active)\n• Engine Latency : 12ms (ANSI SQL-92 Compliant)`,
      });
    } else if (lower === 'streak') {
      newHistory.push({
        type: 'output',
        text: ` 🔥 LEARNING STREAK: 5 DAYS CONTINUOUS\n ----------------------------------------\n [Mon] [Tue] [Wed] [Thu] [Fri: ACTIVE]\n Total XP Accumulated: +1,240 XP`,
      });
    } else if (lower === 'recall') {
      newHistory.push({
        type: 'output',
        text: `💡 ACTIVE RECALL DRILL:\nWhy can a Primary Key attribute NEVER be assigned a NULL value in Relational Algebra?\n(Type your reasoning to analyze understanding)`,
      });
    } else {
      newHistory.push({
        type: 'output',
        text: `🤖 MetaMind Socratic Response:\nAnalyzing "${cmd}" within ${activeTopic}...\nIn relational systems, maintaining strict entity constraints guarantees tuple uniqueness. Deconstruct the schema into functional dependencies before applying 3NF or BCNF decompositions.`,
      });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div
      ref={modalRef}
      className={`fixed z-50 transition-all font-mono text-xs ${
        isMinimized
          ? 'bottom-5 right-5 w-72 rounded-2xl bg-[#0B0F19] border border-slate-700 p-3 shadow-2xl flex items-center justify-between text-slate-200 cursor-pointer'
          : 'bottom-6 right-6 w-[94vw] max-w-lg sm:w-[480px] h-[380px] rounded-2xl bg-[#0B0F19] border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200'
      }`}
    >
      {/* Mac OS Window Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#111827] border-b border-slate-800 select-none">
        {/* Traffic Light Dots */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:brightness-90 transition-all cursor-pointer shadow-2xs"
            title="Close Terminal"
          />
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] hover:brightness-90 transition-all cursor-pointer shadow-2xs"
            title={isMinimized ? 'Expand' : 'Minimize'}
          />
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] hover:brightness-90 transition-all cursor-pointer shadow-2xs"
            title="Focus Window"
          />
          <span className="text-[11px] text-slate-400 font-mono ml-2 truncate">
            metamind@cli: ~ (zsh)
          </span>
        </div>

        {/* Right Status Pill */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Terminal Console Output Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 p-3.5 space-y-2 overflow-y-auto custom-scrollbar bg-[#0B0F19] leading-relaxed select-text"
          >
            {history.map((line, idx) => (
              <div
                key={idx}
                className={`whitespace-pre-wrap ${
                  line.type === 'input'
                    ? 'text-indigo-400 font-bold'
                    : line.type === 'system'
                    ? 'text-slate-400 text-[11px] border-b border-slate-800/80 pb-1.5'
                    : 'text-emerald-300'
                }`}
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Terminal Prompt Input Bar */}
          <form
            onSubmit={handleCommandSubmit}
            className="flex items-center gap-2 p-2.5 bg-[#111827] border-t border-slate-800"
          >
            <span className="text-indigo-400 font-bold shrink-0 text-xs">
              $&gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type 'help' or any query..."
              className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 outline-none font-mono text-xs"
              autoFocus
            />
            <span className="cursor-blink w-1.5 h-3.5 bg-emerald-400 inline-block shrink-0" />
            <button
              type="submit"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Submit command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
