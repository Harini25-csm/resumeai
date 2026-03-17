// ATS (Applicant Tracking System) Score Analyzer Utility

export interface ATSScoreResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  actionVerbs: string[];
  sectionHeadings: string[];
  suggestions: string[];
}

// Common ATS keywords by category
const ATS_KEYWORDS = {
  technical: [
    'javascript', 'react', 'node.js', 'python', 'java', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'html', 'css', 'typescript', 'mongodb', 'postgresql',
    'api', 'rest', 'graphql', 'microservices', 'cloud', 'devops', 'ci/cd',
    'agile', 'scrum', 'machine learning', 'ai', 'data analysis'
  ],
  business: [
    'project management', 'leadership', 'strategy', 'planning', 'budget',
    'timeline', 'stakeholders', 'communication', 'collaboration', 'teamwork',
    'presentation', 'negotiation', 'analytical', 'problem solving', 'critical thinking'
  ],
  action: [
    'managed', 'led', 'developed', 'implemented', 'created', 'designed',
    'optimized', 'improved', 'increased', 'reduced', 'achieved', 'launched',
    'coordinated', 'facilitated', 'mentored', 'trained', 'automated', 'streamlined'
  ]
};

// Important section headings for ATS
const SECTION_HEADINGS = [
  'summary', 'experience', 'education', 'skills', 'projects', 'certifications',
  'professional summary', 'work experience', 'technical skills', 'academic background'
];

// Strong action verbs that ATS systems love
const STRONG_ACTION_VERBS = [
  'architected', 'engineered', 'orchestrated', 'pioneered', 'spearheaded',
  'revolutionized', 'transformed', 'innovated', 'modernized', 'refactored',
  'scaled', 'deployed', 'integrated', 'migrated', 'consolidated', 'optimized'
];

export function calculateATSScore(resumeText: string, jobDescription: string): ATSScoreResult {
  // Normalize text (lowercase, remove special characters)
  const normalizeText = (text: string) => 
    text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const normalizedResume = normalizeText(resumeText);
  const normalizedJobDesc = normalizeText(jobDescription);

  // Extract keywords from job description
  const jobKeywords = extractKeywords(normalizedJobDesc);
  
  // Calculate keyword matching score
  const keywordScore = calculateKeywordScore(normalizedResume, jobKeywords);
  
  // Calculate action verbs score
  const actionVerbScore = calculateActionVerbScore(normalizedResume);
  
  // Calculate section headings score
  const sectionScore = calculateSectionScore(normalizedResume);
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (keywordScore.score * 0.5) +    // 50% weight for keyword matching
    (actionVerbScore.score * 0.3) + // 30% weight for action verbs
    (sectionScore.score * 0.2)      // 20% weight for section headings
  );

  // Generate suggestions
  const suggestions = generateSuggestions(normalizedResume, jobKeywords);

  return {
    score: overallScore,
    matchedKeywords: keywordScore.matched,
    missingKeywords: keywordScore.missing,
    actionVerbs: actionVerbScore.found,
    sectionHeadings: sectionScore.found,
    suggestions
  };
}

function extractKeywords(text: string): string[] {
  const words = text.split(' ').filter(word => word.length > 3);
  const keywords: string[] = [];
  
  // Extract technical and business keywords
  [...ATS_KEYWORDS.technical, ...ATS_KEYWORDS.business].forEach(keyword => {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  // Extract unique words that might be important
  words.forEach(word => {
    if (word.length > 5 && !keywords.includes(word)) {
      keywords.push(word);
    }
  });
  
  return Array.from(new Set(keywords)); // Remove duplicates
}

function calculateKeywordScore(resumeText: string, jobKeywords: string[]) {
  const matched: string[] = [];
  const missing: string[] = [];
  
  jobKeywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const score = jobKeywords.length > 0 ? (matched.length / jobKeywords.length) * 100 : 0;
  
  return { score, matched, missing };
}

function calculateActionVerbScore(resumeText: string) {
  const found: string[] = [];
  
  // Check for strong action verbs
  STRONG_ACTION_VERBS.forEach(verb => {
    if (resumeText.includes(verb)) {
      found.push(verb);
    }
  });
  
  // Check for regular action verbs
  ATS_KEYWORDS.action.forEach(verb => {
    if (resumeText.includes(verb) && !found.includes(verb)) {
      found.push(verb);
    }
  });
  
  const score = found.length > 0 ? Math.min((found.length / 10) * 100, 100) : 0;
  
  return { score, found };
}

function calculateSectionScore(resumeText: string) {
  const found: string[] = [];
  
  SECTION_HEADINGS.forEach(heading => {
    if (resumeText.includes(heading)) {
      found.push(heading);
    }
  });
  
  const score = (found.length / SECTION_HEADINGS.length) * 100;
  
  return { score, found };
}

function generateSuggestions(resumeText: string, jobKeywords: string[]): string[] {
  const suggestions: string[] = [];
  
  // Check for missing keywords
  const missingKeywords = jobKeywords.filter(keyword => !resumeText.includes(keyword));
  if (missingKeywords.length > 0) {
    suggestions.push(`Add these keywords from job description: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  
  // Check for action verbs
  const actionVerbsFound = ATS_KEYWORDS.action.filter(verb => resumeText.includes(verb));
  if (actionVerbsFound.length < 5) {
    suggestions.push('Use more action verbs to describe your experience');
  }
  
  // Check for quantifiable achievements
  if (!resumeText.match(/\d+%|\$\d+|\d+\s*(years?|months?|projects?|clients?)/)) {
    suggestions.push('Add quantifiable achievements (%, $, numbers, years)');
  }
  
  // Check for section headings
  const sectionsFound = SECTION_HEADINGS.filter(heading => resumeText.includes(heading));
  if (sectionsFound.length < 4) {
    suggestions.push('Add clear section headings (Summary, Experience, Skills, Education)');
  }
  
  // Check for length
  const wordCount = resumeText.split(' ').length;
  if (wordCount < 300) {
    suggestions.push('Consider adding more detail to your experience');
  } else if (wordCount > 800) {
    suggestions.push('Consider condensing your resume for better readability');
  }
  
  return suggestions;
}

// Helper function to get score color
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

// Helper function to get progress bar color
export function getProgressColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}
