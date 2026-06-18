export const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function analyzeResume(file: File, companyName: string, jobDescription: string) {
  const formData = new FormData();
  formData.append('resume_file', file);
  formData.append('company_name', companyName);
  formData.append('job_description', jobDescription);

  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to analyze resume');
  }

  return res.json();
}

export async function generateResume(
  companyName: string,
  jobDescription: string,
  fitScore: number,
  fitSummary: string,
  gaps: string[],
  suggestions: string[],
  resumeChunks: string[]
) {
  const res = await fetch(`${API_BASE_URL}/api/generate-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company_name: companyName,
      job_description: jobDescription,
      fit_score: fitScore,
      fit_summary: fitSummary,
      gaps,
      suggestions,
      resume_chunks: resumeChunks,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate resume');
  }

  return res.json();
}