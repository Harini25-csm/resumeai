// PDF Export Utility for ResumeAI

declare global {
  interface Window {
    html2pdf: any;
  }
}

export interface PDFOptions {
  filename?: string;
  image?: { type: string; quality: number };
  html2canvas?: { scale: number };
  jsPDF?: { unit: string; format: string; orientation: string };
}

export const downloadResume = async (
  elementId: string = 'resume',
  options: PDFOptions = {}
): Promise<void> => {
  // Default options
  const defaultOptions: PDFOptions = {
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  const pdfOptions = { ...defaultOptions, ...options };

  // Load html2pdf library dynamically
  if (!window.html2pdf) {
    try {
      // Load html2pdf from CDN
      await loadHtml2Pdf();
    } catch (error) {
      console.error('Failed to load html2pdf:', error);
      throw new Error('PDF export library not available');
    }
  }

  // Get the element to export
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Generate and download PDF
    await window.html2pdf()
      .from(element)
      .set(pdfOptions)
      .save();
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Load html2pdf library from CDN
const loadHtml2Pdf = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.html2pdf) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load html2pdf library'));
    };

    document.head.appendChild(script);
  });
};

// Alternative: Download resume as HTML (fallback)
export const downloadResumeAsHTML = (
  elementId: string = 'resume',
  filename: string = 'resume.html'
): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const htmlContent = element.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Check if PDF export is available
export const isPDFExportAvailable = (): boolean => {
  return !!window.html2pdf;
};

// Preload html2pdf library
export const preloadHtml2Pdf = async (): Promise<void> => {
  try {
    await loadHtml2Pdf();
  } catch (error) {
    console.warn('Failed to preload html2pdf:', error);
  }
};
