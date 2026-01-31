import React, { useState } from 'react';
import { Copy, Check, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useActionScript } from '../hooks/useActionScript';

type ScriptScenario = 'extension_request' | 'text_friend' | 'self_advocacy';
type ScriptTone = 'gentle' | 'direct' | 'warm';

interface ActionScriptPanelProps {
  defaultScenario?: ScriptScenario;
  defaultContext?: {
    course?: string;
    deadline?: string;
  };
}

const scenarios: { id: ScriptScenario; label: string; description: string }[] = [
  { id: 'extension_request', label: 'Extension Request', description: 'Email template for requesting deadline extension' },
  { id: 'text_friend', label: 'Text a Friend', description: 'Message template for reaching out' },
  { id: 'self_advocacy', label: 'Self-Advocacy', description: 'Script for advocating for your needs' },
];

const tones: { id: ScriptTone; label: string }[] = [
  { id: 'gentle', label: 'Gentle' },
  { id: 'direct', label: 'Direct' },
  { id: 'warm', label: 'Warm' },
];

export const ActionScriptPanel: React.FC<ActionScriptPanelProps> = ({
  defaultScenario,
  defaultContext,
}) => {
  const [scenario, setScenario] = useState<ScriptScenario>(defaultScenario || 'extension_request');
  const [tone, setTone] = useState<ScriptTone>('gentle');
  const [context, setContext] = useState(defaultContext || {});
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { result, loading, error, generateScript } = useActionScript();

  const handleGenerate = async () => {
    await generateScript(scenario, tone, context);
    setExpanded(true);
  };

  const handleCopy = async () => {
    if (result?.script) {
      await navigator.clipboard.writeText(result.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-violet-400" />
          <span className="font-medium text-white">Action Scripts</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Scenario Selection */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Scenario</label>
            <div className="grid grid-cols-1 gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    scenario === s.id
                      ? 'bg-violet-500/20 border-violet-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-sm">{s.label}</div>
                  <div className="text-xs opacity-70">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Tone</label>
            <div className="flex gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    tone === t.id
                      ? 'bg-violet-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context Fields (for extension request) */}
          {scenario === 'extension_request' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Course</label>
                <input
                  type="text"
                  value={context.course || ''}
                  onChange={(e) => setContext({ ...context, course: e.target.value })}
                  placeholder="e.g., CSC110"
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Deadline</label>
                <input
                  type="text"
                  value={context.deadline || ''}
                  onChange={(e) => setContext({ ...context, deadline: e.target.value })}
                  placeholder="e.g., Friday"
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg font-medium text-white transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Script'}
          </button>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3 p-4 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{result.title}</h4>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-slate-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              
              <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">
                {result.script}
              </pre>

              {result.checklist.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <h5 className="text-xs font-medium text-slate-400 mb-2">Checklist</h5>
                  <ul className="space-y-1">
                    {result.checklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-violet-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggested_next_steps.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <h5 className="text-xs font-medium text-slate-400 mb-2">Next Steps</h5>
                  <ul className="space-y-1">
                    {result.suggested_next_steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-emerald-400">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
