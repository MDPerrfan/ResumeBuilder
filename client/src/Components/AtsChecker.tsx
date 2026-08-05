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
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-500";
};

const scoreRing = (score: number) => {
  if (score >= 70) return "from-green-100 to-green-200 ring-green-300";
  if (score >= 40) return "from-amber-100 to-amber-200 ring-amber-300";
  return "from-red-100 to-red-200 ring-red-300";
};

const priorityStyle = {
  high: "border-red-200 bg-red-50",
  medium: "border-amber-200 bg-amber-50",
  low: "border-slate-200 bg-slate-50",
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Target className="size-5 text-purple-600" />
          ATS Compatibility
        </h3>
        <p className="text-sm text-gray-500 mt-1">
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
              className="w-full flex flex-col items-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/30 transition disabled:opacity-50"
            >
              {parsing ? (
                <div className="size-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              ) : (
                <UploadCloud className="size-8 text-purple-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {parsing ? "Reading file..." : "Upload PDF or DOCX"}
              </span>
              <span className="text-xs text-gray-400">Max recommended: 5 MB</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-3 bg-violet-50 border border-violet-200 rounded-lg">
              <span className="text-sm text-violet-800 truncate">{fileName}</span>
              <button
                type="button"
                onClick={clearUpload}
                className="p-1 text-violet-600 hover:bg-violet-100 rounded"
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
        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-purple-600 focus:border-purple-600 outline-none resize-none"
      />

      {!hasJd && !hasResumeContent && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            Upload your resume and add a job description to begin.
          </p>
        </div>
      )}

      {hasJd && !hasResumeContent && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {resumeData
            ? "Your resume is mostly empty. Fill in sections to improve matching."
            : "Upload a resume file to analyze against this job description."}
        </div>
      )}

      {showResults && (
        <>
          <div
            className={`flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br ${scoreRing(result.score)} ring hover:ring transition-colors`}
          >
            <div className={`text-4xl font-bold ${scoreColor(result.score)}`}>
              {result.score}%
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Overall match</p>
              <p className="text-xs text-gray-600">
                {result.matched.length} of {result.total} keywords found
              </p>
            </div>
          </div>

          {result.breakdown.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Section breakdown
              </p>
              {result.breakdown.map((row) => (
                <div key={row.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-24 shrink-0">{row.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{row.pct}%</span>
                </div>
              ))}
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <Lightbulb className="size-3.5 text-amber-500" />
                Suggested improvements
              </p>
              {result.suggestions.map((tip, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border text-sm ${priorityStyle[tip.priority as keyof typeof priorityStyle] || priorityStyle.low}`}
                >
                  <p className="font-medium text-gray-900">{tip.title}</p>
                  <p className="text-gray-600 mt-0.5 text-xs leading-relaxed">{tip.detail}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <KeywordList
              title="Matched"
              icon={<CheckCircle2 className="size-4 text-green-600" />}
              words={result.matched}
              empty="No matches yet"
              chipClass="bg-green-50 text-green-700 border-green-200"
            />
            <KeywordList
              title="Missing"
              icon={<AlertCircle className="size-4 text-amber-600" />}
              words={result.missing.slice(0, 24)}
              empty="All keywords matched"
              chipClass="bg-amber-50 text-amber-700 border-amber-200"
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
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
        {icon}
        {title} ({words.length})
      </p>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {words.length === 0 ? (
          <span className="text-xs text-gray-400">{empty}</span>
        ) : (
          words.map((w) => (
            <span key={w} className={`text-xs px-2 py-0.5 rounded border ${chipClass}`}>
              {w}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
