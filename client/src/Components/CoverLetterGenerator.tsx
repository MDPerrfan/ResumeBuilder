import React from "react";
import { Copy, FileText, Sparkles, UploadCloud, X } from "lucide-react";
import { aiApi } from "../utils/apiClient";
import { resumeToAiContext } from "../utils/resumeText";
import { parseResumeFile } from "../utils/parseResumeFile";

type ResumeData = {
  personal_info?: Record<string, string>;
  professional_summary?: string;
  experience?: Array<{ company?: string; position?: string; description?: string }>;
  education?: Array<{ institution?: string; degree?: string; field?: string }>;
  skills?: string[];
  project?: Array<{ name?: string; description?: string }>;
};

type Props = {
  resumeData?: ResumeData;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
  onRequireAuth: () => void;
  onError: (message: string) => void;
  allowUpload?: boolean;
};

export default function CoverLetterGenerator({
  resumeData,
  isSignedIn,
  getToken,
  onRequireAuth,
  onError,
  allowUpload = false,
}: Props) {
  const [prompt, setPrompt] = React.useState("");
  const [coverLetter, setCoverLetter] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [uploadedResume, setUploadedResume] = React.useState<ResumeData | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [parsing, setParsing] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const effectiveResume = resumeData || uploadedResume;
  const context = React.useMemo(
    () => (effectiveResume ? resumeToAiContext(effectiveResume) : null),
    [effectiveResume]
  );
  const hasResumeBasics = Boolean(
    context?.name || context?.summary || context?.experience
  );

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
      onError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const clearUpload = () => {
    setUploadedResume(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!isSignedIn) return onRequireAuth();
    if (!prompt.trim()) return;
    if (!hasResumeBasics) {
      onError("Upload a resume or open the builder so we can match your profile.");
      return;
    }

    try {
      setLoading(true);
      setCoverLetter("");
      const token = await getToken();
      const result = await aiApi.generateCoverLetter(
        { jobDescription: prompt.trim(), resumeContext: context },
        token
      );
      setCoverLetter(result?.coverLetter || result?.data?.coverLetter || "");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onError("Could not copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pt-2 pb-2 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-xl space-y-6">
        
        {/* Header Title */}
        <div>
          <h3 className="flex items-center gap-2.5 text-xl font-semibold text-white tracking-tight">
            <span className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <FileText className="size-5" />
            </span>
            Cover Letter
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            {allowUpload
              ? "Upload your resume, then describe the role to generate a tailored letter."
              : "Paste a job description or brief prompt to generate a tailored letter."}
          </p>
        </div>

        {allowUpload && !resumeData && (
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
                className="w-full flex flex-col items-center gap-2 p-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-950 transition disabled:opacity-50 text-slate-400 hover:text-indigo-300 cursor-pointer"
              >
                {parsing ? (
                  <div className="size-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="size-7 text-indigo-400" />
                )}
                <span className="text-sm font-medium text-slate-300">
                  {parsing ? "Reading file..." : "Upload PDF or DOCX (optional)"}
                </span>
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
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          placeholder="Paste job description or describe the role you're applying for..."
          className="w-full p-4 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
          disabled={loading}
        />

        {!hasResumeBasics && (
          <div className="rounded-xl border border-amber-800/40 bg-amber-950/30 p-4 text-sm text-amber-300">
            {allowUpload
              ? "Upload a resume file so the letter matches your experience and tone."
              : "Add your name, summary, or experience first so the letter matches your resume."}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Sparkles className="size-4" />
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="size-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        )}

        {!loading && !coverLetter && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-500">Your generated cover letter will appear here.</p>
          </div>
        )}

        {!loading && coverLetter && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Result</p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition"
              >
                <Copy className="size-3.5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {coverLetter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}