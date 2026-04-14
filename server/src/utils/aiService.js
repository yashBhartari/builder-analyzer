import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getClient = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// Fallback mock when no API key configured
const mockAnalysis = (resumeText, jobDescription) => {
  const wordCount = resumeText.split(/\s+/).length;
  const hasQuantifiables = /\d+%|\d+\s*(users|projects|teams|clients)/i.test(resumeText);
  const hasActionVerbs = /led|developed|increased|managed|built|designed|improved/i.test(resumeText);

  const mockKeywords = jobDescription
    ? jobDescription.toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 15) || []
    : ['javascript', 'python', 'react', 'sql', 'agile'];

  const matched = mockKeywords.filter(k => resumeText.toLowerCase().includes(k));
  const missing = mockKeywords.filter(k => !resumeText.toLowerCase().includes(k));

  // Pseudo-random factor based on length string
  const hash = Array.from(resumeText).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20;

  const atsScore = Math.min(100, 50 + hash + matched.length * 3 + (hasQuantifiables ? 10 : 0) + (wordCount > 300 ? 5 : 0));
  const readability = wordCount > 200 && wordCount < 800 ? 70 + (hash % 10) : 55 + (hash % 15);
  const jobFit = jobDescription ? Math.min(100, (matched.length / Math.max(mockKeywords.length, 1)) * 100 + (hash % 10)) : 0;

  return {
    scores: {
      overall: Math.round((atsScore + readability) / 2),
      ats: Math.round(atsScore),
      keywordMatch: jobDescription ? Math.round(jobFit) : 0,
      readability: Math.round(readability),
      formatting: 70,
      quantifiableAchievements: hasQuantifiables ? 75 : 40,
      jobFit: Math.round(jobFit)
    },
    strengths: [
      hasActionVerbs ? 'Strong use of action verbs in experience section' : 'Resume has clear structure',
      hasQuantifiables ? 'Includes quantifiable achievements' : 'Professional tone maintained',
      wordCount > 300 ? 'Adequate resume length' : 'Concise and focused content'
    ].filter(Boolean),
    weaknesses: [
      !hasQuantifiables ? 'Lacks quantifiable achievements (e.g., "increased revenue by 25%")' : null,
      wordCount < 200 ? 'Resume may be too short for applicant tracking systems' : null,
      missing.length > 5 ? 'Missing several industry-standard keywords' : null
    ].filter(Boolean),
    suggestions: [
      {
        category: 'Keywords',
        priority: 'high',
        text: `Add missing keywords: ${missing.slice(0, 5).join(', ')}`,
        example: `Include these terms naturally in your experience descriptions`
      },
      {
        category: 'Achievements',
        priority: 'high',
        text: 'Quantify your achievements with numbers and metrics',
        example: '"Managed a team of 5 engineers" → "Led 5-person engineering team, delivering 3 projects 20% ahead of schedule"'
      },
      {
        category: 'Summary',
        priority: 'medium',
        text: 'Add a compelling professional summary at the top',
        example: 'A 3-4 sentence overview of your experience, key skills, and career goals'
      }
    ],
    keywords: { matched, missing, recommended: ['leadership', 'communication', 'problem-solving'] },
    skillsAnalysis: {
      present: resumeText.toLowerCase().match(/javascript|python|react|node|sql|aws|docker/g) || [],
      missing: ['kubernetes', 'terraform', 'graphql'].filter(s => !resumeText.toLowerCase().includes(s)),
      recommended: ['git', 'ci/cd', 'agile methodologies']
    },
    sectionAnalysis: {
      hasContactInfo: /email|phone|\@/.test(resumeText),
      hasSummary: /summary|objective|profile/i.test(resumeText),
      hasExperience: /experience|work|employment/i.test(resumeText),
      hasEducation: /education|degree|university|college/i.test(resumeText),
      hasSkills: /skills|technologies|tools/i.test(resumeText),
      hasProjects: /project/i.test(resumeText),
      hasCertifications: /certif|credential/i.test(resumeText),
      missingSections: ['languages', 'publications'].filter(s => !resumeText.toLowerCase().includes(s))
    },
    rewrites: [
      {
        section: 'summary',
        original: '',
        suggested: 'Results-driven software engineer with 3+ years of experience building scalable web applications. Proficient in modern JavaScript frameworks, cloud infrastructure, and agile methodologies. Passionate about delivering exceptional user experiences.'
      }
    ]
  };
};

export const analyzeResumeWithAI = async (resumeText, jobDescription = null, jobTitle = null) => {
  const startTime = Date.now();

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
    console.log('⚠️  No Gemini API key - using mock analysis');
    await new Promise(r => setTimeout(r, 1500)); // Simulate processing time
    return { ...mockAnalysis(resumeText, jobDescription), processingTime: Date.now() - startTime, aiModel: 'mock' };
  }

  const client = getClient();

  const systemPrompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist with 15+ years of HR and recruitment experience. Analyze resumes thoroughly and provide detailed, actionable feedback.

Always respond with valid JSON matching exactly this structure:
{
  "scores": {
    "overall": <0-100>,
    "ats": <0-100>,
    "keywordMatch": <0-100>,
    "readability": <0-100>,
    "formatting": <0-100>,
    "quantifiableAchievements": <0-100>,
    "jobFit": <0-100>
  },
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "suggestions": [
    {
      "category": "string",
      "priority": "high|medium|low",
      "text": "string",
      "example": "string"
    }
  ],
  "keywords": {
    "matched": ["string", ...],
    "missing": ["string", ...],
    "recommended": ["string", ...]
  },
  "skillsAnalysis": {
    "present": ["string", ...],
    "missing": ["string", ...],
    "recommended": ["string", ...]
  },
  "sectionAnalysis": {
    "hasContactInfo": boolean,
    "hasSummary": boolean,
    "hasExperience": boolean,
    "hasEducation": boolean,
    "hasSkills": boolean,
    "hasProjects": boolean,
    "hasCertifications": boolean,
    "missingSections": ["string", ...]
  },
  "rewrites": [
    {
      "section": "string",
      "original": "string",
      "suggested": "string"
    }
  ]
}`;

  const userPrompt = `Analyze this resume${jobTitle ? ` for a ${jobTitle} position` : ''}:

RESUME:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n\nEvaluate keyword match and job fit against this JD.` : 'Provide general ATS optimization analysis.'}

Be specific, actionable, and constructive. Focus on ATS optimization, impactful language, and industry best practices.
Respond ONLY with the raw JSON.`;

  try {
    const model = client.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });
    
    // Combining system prompt and user prompt since gemini-1.5 handles instructions in the prompt
    const prompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if returned
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    const parsed = JSON.parse(cleanJson);
    return { ...parsed, processingTime: Date.now() - startTime, aiModel: 'gemini-flash-latest' };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    // Fallback to mock
    return { ...mockAnalysis(resumeText, jobDescription), processingTime: Date.now() - startTime, aiModel: 'fallback' };
  }
};

export const generateAIContent = async (type, context) => {
  const getMockContent = () => {
    const mockContent = {
      summary: `Results-driven ${context.jobTitle || 'professional'} with ${context.yearsExp || '3+'} years of experience in ${context.skills?.join(', ') || 'software development'}. Proven track record of delivering high-quality solutions and driving measurable business impact. Passionate about innovation and continuous learning.`,
      experience_bullet: `• Led development of ${context.project || 'key feature'}, resulting in 30% improvement in system performance and enhanced user experience for 10,000+ users`,
      skills: ['Problem Solving', 'Communication', 'Team Leadership', 'Agile/Scrum', 'Project Management']
    };
    return mockContent[type] || mockContent.summary;
  };

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
    return getMockContent();
  }

  const client = getClient();
  const prompts = {
    summary: `Write a professional resume summary for a ${context.jobTitle} with ${context.yearsExp} years of experience in ${context.skills?.join(', ')}. Keep it to 3-4 sentences. Be specific and impactful.`,
    experience_bullet: `Write 3 strong resume bullet points for this experience: ${context.description}. Use action verbs and quantify achievements where possible.`,
    skills: `Suggest 10 relevant technical and soft skills for a ${context.jobTitle} role in ${context.industry}. Return as JSON array.`
  };

  const model = client.getGenerativeModel({ model: "gemini-flash-latest" });

  try {
    const prompt = `You are a professional resume writer. Be concise, impactful, and ATS-friendly.\n\n${prompts[type] || prompts.summary}`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini content generation error:', error.message);
    // Fallback to mock content if Google API fails or is overloaded
    return getMockContent();
  }
};
