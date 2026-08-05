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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FileText className="size-5 text-purple-600" />
          Cover Letter
        </h3>
        <p className="text-sm text-gray-500 mt-1">
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
              className="w-full flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/30 transition disabled:opacity-50"
            >
              {parsing ? (
                <div className="size-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              ) : (
                <UploadCloud className="size-7 text-purple-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {parsing ? "Reading file..." : "Upload PDF or DOCX (optional)"}
              </span>
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
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        placeholder="Paste job description or describe the role you're applying for..."
        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-purple-600 focus:border-purple-600 outline-none resize-none"
        disabled={loading}
      />

      {!hasResumeBasics && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {allowUpload
            ? "Upload a resume file so the letter matches your experience and tone."
            : "Add your name, summary, or experience first so the letter matches your resume."}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Sparkles className="size-4" />
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="size-10 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && !coverLetter && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">Your generated cover letter will appear here.</p>
        </div>
      )}

      {!loading && coverLetter && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Result</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
            >
              <Copy className="size-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {coverLetter}
          </div>
        </div>
      )}
    </div>
  );
}
