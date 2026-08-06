import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Target,
  UploadCloud,
  Lightbulb,
  X,
} from "lucide-react";
import { resumeToPlainText } from "../utils/resumeText";
import { computeAtsScore } from "../utils/atsScore";
import { parseResumeFile } from "../utils/parseResumeFile";

type ResumeData = {
  personal_info?: Record<string, string>;
  professional_summary?: string;
  experience?: Array<{ company?: string; position?: string; description?: string }>;
  education?: Array<{ institution?: string; degree?: string; field?: string }>;
  skills?: string[];
  project?: unknown[];
  languages?: unknown[];
  custom_sections?: unknown[];
};

type Props = {
  resumeData?: ResumeData;
  onError?: (message: string) => void;
};

const scoreColor = (score: number) => {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-rose-400";
};

const scoreRing = (score: number) => {
  if (score >= 70) return "from-emerald-950/40 to-emerald-900/20 border-emerald-500/30";
  if (score >= 40) return "from-amber-950/40 to-amber-900/20 border-amber-500/30";
  return "from-rose-950/40 to-rose-900/20 border-rose-500/30";
};

const priorityStyle = {
  high: "border-rose-900/50 bg-rose-950/30 text-rose-200",
  medium: "border-amber-900/50 bg-amber-950/30 text-amber-200",
  low: "border-slate-800 bg-slate-950/50 text-slate-300",
};

export default function AtsChecker({ resumeData, onError }: Props) {
  const [jobDescription, setJobDescription] = React.useState("");
  const [uploadedResume, setUploadedResume] = React.useState<ResumeData | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [parsing, setParsing] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const effectiveResume = resumeData || uploadedResume;
  const resumeText = React.useMemo(
    () => (effectiveResume ? resumeToPlainText(effectiveResume) : ""),
    [effectiveResume]
  );
  const hasResumeContent = resumeText.trim().length > 20;

  const result = React.useMemo(
    () => (effectiveResume ? computeAtsScore(effectiveResume, jobDescription) : null),
    [effectiveResume, jobDescription]
  );

  const hasJd = jobDescription.trim().length > 0;
  const showResults = hasJd && hasResumeContent && result;

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setParsing(true);
    setUploadedResume(null);
    setFileName("");
    try {
      const data = await parseResumeFile(file);
      setUploadedResume(data);
      setFileName(file.name);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const clearUpload = () => {
    setUploadedResume(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-xl space-y-6">
      <div>
        <h3 className="flex items-center gap-2.5 text-xl font-semibold text-white tracking-tight">
          <span className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Target className="size-5" />
          </span>
          ATS Compatibility
        </h3>
        <p className="text-sm text-slate-400 mt-2">
          Upload a PDF or Word resume, then paste the job description to analyze.
        </p>
      </div>

      {!resumeData && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          {!fileName ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={parsing}
              className="w-full flex flex-col items-center gap-2 p-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-950 transition disabled:opacity-50 text-slate-400 hover:text-indigo-300 cursor-pointer"
            >
              {parsing ? (
                <div className="size-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              ) : (
                <UploadCloud className="size-8 text-indigo-400" />
              )}
              <span className="text-sm font-medium text-slate-300">
                {parsing ? "Reading file..." : "Upload PDF or DOCX"}
              </span>
              <span className="text-xs text-slate-500">Max recommended: 5 MB</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-3.5 bg-indigo-950/30 border border-indigo-900/50 rounded-xl">
              <span className="text-sm text-indigo-200 truncate">{fileName}</span>
              <button
                type="button"
                onClick={clearUpload}
                className="p-1 text-indigo-400 hover:bg-indigo-900/50 rounded transition"
                aria-label="Remove file"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
        placeholder="Paste the job description here..."
        className="w-full p-4 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
      />

      {!hasJd && !hasResumeContent && (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
          <p className="text-sm text-slate-500">
            Upload your resume and add a job description to begin.
          </p>
        </div>
      )}

      {hasJd && !hasResumeContent && (
        <div className="rounded-xl border border-amber-800/40 bg-amber-950/30 p-4 text-sm text-amber-300">
          {resumeData
            ? "Your resume is mostly empty. Fill in sections to improve matching."
            : "Upload a resume file to analyze against this job description."}
        </div>
      )}

      {showResults && (
        <>
          <div
            className={`flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br ${scoreRing(result.score)} border transition-colors shadow-lg`}
          >
            <div className={`text-4xl font-bold ${scoreColor(result.score)}`}>
              {result.score}%
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Overall match</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {result.matched.length} of {result.total} keywords found
              </p>
            </div>
          </div>

          {result.breakdown.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Section breakdown
              </p>
              {result.breakdown.map((row) => (
                <div key={row.id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-24 shrink-0 font-medium">{row.label}</span>
                  <div className="flex-1 h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-10 text-right font-medium">{row.pct}%</span>
                </div>
              ))}
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Lightbulb className="size-3.5 text-amber-400" />
                Suggested improvements
              </p>
              {result.suggestions.map((tip, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-sm ${priorityStyle[tip.priority as keyof typeof priorityStyle] || priorityStyle.low}`}
                >
                  <p className="font-semibold text-white">{tip.title}</p>
                  <p className="text-slate-300 mt-1 text-xs leading-relaxed">{tip.detail}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <KeywordList
              title="Matched"
              icon={<CheckCircle2 className="size-4 text-emerald-400" />}
              words={result.matched}
              empty="No matches yet"
              chipClass="bg-emerald-950/40 text-emerald-300 border-emerald-900/50"
            />
            <KeywordList
              title="Missing"
              icon={<AlertCircle className="size-4 text-amber-400" />}
              words={result.missing.slice(0, 24)}
              empty="All keywords matched"
              chipClass="bg-amber-950/40 text-amber-300 border-amber-900/50"
            />
          </div>
        </>
      )}
    </div>
  );
}

function KeywordList({
  title,
  icon,
  words,
  empty,
  chipClass,
}: {
  title: string;
  icon: React.ReactNode;
  words: string[];
  empty: string;
  chipClass: string;
}) {
  return (
    <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-3">
        {icon}
        {title} ({words.length})
      </p>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
        {words.length === 0 ? (
          <span className="text-xs text-slate-500 italic">{empty}</span>
        ) : (
          words.map((w) => (
            <span key={w} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${chipClass}`}>
              {w}
            </span>
          ))
        )}
      </div>
    </div>
  );
}