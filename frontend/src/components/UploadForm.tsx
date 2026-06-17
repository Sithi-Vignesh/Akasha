import React, { useCallback, useState } from 'react';
import { UploadCloud, File, CheckCircle } from 'lucide-react';

interface UploadFormProps {
  onAnalyze: (file: File, company: string, jd: string) => void;
  isLoading: boolean;
}

export function UploadForm({ onAnalyze, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [company, setCompany] = useState('');
  const [jd, setJd] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateFile = (f: File) => {
    setErrorMsg(null);
    if (f.size > 10 * 1024 * 1024) return "Your resume exceeds 10MB. Please compress and try again.";
    if (f.size === 0) return "Your story seems empty. Upload a valid resume.";
    const validMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExts = ['.pdf', '.docx'];
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    
    if (!validMimes.includes(f.type) && !validExts.includes(ext)) {
      return "Akasha only speaks PDF and DOCX.";
    }
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const err = validateFile(droppedFile);
      if (err) setErrorMsg(err);
      else setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const err = validateFile(selectedFile);
      if (err) setErrorMsg(err);
      else setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setErrorMsg("Please upload your resume.");
    if (!company.trim()) return setErrorMsg("Please enter the company name.");
    if (!jd.trim()) return setErrorMsg("Please enter the job description.");
    onAnalyze(file, company.trim(), jd.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 z-10 relative">
      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 flex flex-col gap-6">
        
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors
            ${isHovering ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--glass-border)] hover:border-[var(--text-secondary)]'}
            ${file ? 'border-[var(--success)] bg-[var(--success)]/5' : ''}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
          onDragLeave={() => setIsHovering(false)}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {file ? (
            <>
              <CheckCircle size={32} className="text-[var(--success)] mb-4" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <UploadCloud size={32} className="text-[var(--text-secondary)] mb-4" />
              <p className="font-medium mb-1">Drag & drop your resume</p>
              <p className="text-sm text-[var(--text-secondary)]">PDF or DOCX up to 10MB</p>
            </>
          )}
        </div>
        {errorMsg && <p className="text-[var(--error)] text-sm font-medium">{errorMsg}</p>}

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm text-[var(--text-secondary)]">Company Name</label>
          <input 
            type="text" 
            placeholder="e.g. Google DeepMind"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-transparent border border-[var(--glass-border)] rounded-xl p-4 focus:outline-none focus:border-[var(--accent)] transition-colors placeholder-[var(--text-secondary)]/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm text-[var(--text-secondary)]">Job Description</label>
          <textarea 
            placeholder="Paste the full job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={5}
            className="w-full bg-transparent border border-[var(--glass-border)] rounded-xl p-4 focus:outline-none focus:border-[var(--accent)] transition-colors placeholder-[var(--text-secondary)]/50 leading-relaxed resize-y"
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-display font-bold text-lg bg-[var(--accent)] text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2
            ${isLoading ? 'opacity-80 pointer-events-none' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2 animate-pulse">
              Analyzing...
            </span>
          ) : (
            "Analyze with Akasha"
          )}
        </button>

      </form>
    </div>
  );
}
