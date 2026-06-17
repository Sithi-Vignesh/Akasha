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

export async function generateResume(file: File, companyName: string, jobDescription: string) {
  const formData = new FormData();
  formData.append('resume_file', file);
  formData.append('company_name', companyName);
  formData.append('job_description', jobDescription);

  const res = await fetch(`${API_BASE_URL}/api/generate-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to generate resume');
  }

  return res.json();
}
