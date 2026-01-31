import { useState } from "react";
import { Copy, Check, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useActionScript } from "@/hooks/useActionScript";
import { cn } from "@/lib/utils";

type ScriptScenario = "extension_request" | "text_friend" | "self_advocacy";
type ScriptTone = "gentle" | "direct" | "warm";

interface ActionScriptPanelProps {
  defaultScenario?: ScriptScenario;
  defaultContext?: {
    course?: string;
    deadline?: string;
  };
}

const scenarios: { id: ScriptScenario; label: string; description: string }[] = [
  { id: "extension_request", label: "Extension Request", description: "Email template for a deadline extension" },
  { id: "text_friend", label: "Text a Friend", description: "Low-pressure reach-out message" },
  { id: "self_advocacy", label: "Self-Advocacy", description: "Ask for what you need, clearly" },
];

const tones: { id: ScriptTone; label: string }[] = [
  { id: "gentle", label: "Gentle" },
  { id: "direct", label: "Direct" },
  { id: "warm", label: "Warm" },
];

export const ActionScriptPanel = ({
  defaultScenario,
  defaultContext,
}: ActionScriptPanelProps) => {
  const [scenario, setScenario] = useState<ScriptScenario>(defaultScenario || "extension_request");
  const [tone, setTone] = useState<ScriptTone>("gentle");
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
    <div className="rounded-2xl bg-card/60 border border-border/40 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-card/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Action Scripts</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Scenario</label>
            <div className="grid grid-cols-1 gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={cn(
                    "text-left p-3 rounded-xl border transition-colors",
                    scenario === s.id
                      ? "bg-primary/15 border-primary/40 text-foreground"
                      : "bg-card/40 border-border/40 text-foreground/80 hover:bg-card/70"
                  )}
                >
                  <div className="font-medium text-sm">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Tone</label>
            <div className="flex gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    tone === t.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/60 text-foreground/80 hover:bg-card/80"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {scenario === "extension_request" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Course</label>
                <input
                  type="text"
                  value={context.course || ""}
                  onChange={(e) => setContext({ ...context, course: e.target.value })}
                  placeholder="e.g., CSC110"
                  className="w-full px-3 py-2 bg-background/60 border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Deadline</label>
                <input
                  type="text"
                  value={context.deadline || ""}
                  onChange={(e) => setContext({ ...context, deadline: e.target.value })}
                  placeholder="e.g., Friday"
                  className="w-full px-3 py-2 bg-background/60 border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg font-medium text-primary-foreground transition-colors"
          >
            {loading ? "Generating..." : "Generate Script"}
          </button>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {result && (
            <div className="space-y-3 p-4 bg-background/60 rounded-lg border border-border/40">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{result.title}</h4>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-card/70 hover:bg-card/90 text-xs text-foreground transition-colors"
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

              <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans leading-relaxed">
                {result.script}
              </pre>

              {result.checklist.length > 0 && (
                <div className="pt-3 border-t border-border/40">
                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Checklist</h5>
                  <ul className="space-y-1">
                    {result.checklist.map((item, i) => (
                      <li key={`${item}-${i}`} className="flex items-start gap-2 text-xs text-foreground/80">
                        <span className="text-primary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggested_next_steps.length > 0 && (
                <div className="pt-3 border-t border-border/40">
                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Next Steps</h5>
                  <ul className="space-y-1">
                    {result.suggested_next_steps.map((step, i) => (
                      <li key={`${step}-${i}`} className="flex items-start gap-2 text-xs text-foreground/80">
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
