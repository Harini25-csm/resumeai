import { useState } from 'react';

interface ResumeData {
  summary: string;
  skills: string;
  achievements: string;
  bulletPoints: string;
}

interface GenerateResumeParams {
  role: string;
  skills: string;
  experience: string;
  education?: string;
}

export function useResumeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResumeData | null>(null);

  const generateResume = async (params: GenerateResumeParams) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate resume');
      }

      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'No data received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Resume generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
  };

  return {
    generateResume,
    isLoading,
    error,
    data,
    reset,
  };
}
