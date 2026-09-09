import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PracticeService } from './services/PracticeService.js';
import { SubmissionContent } from './domain/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const practiceService = new PracticeService();

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CipherLLD Practice Platform API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 1. Get Problem Catalog
app.get('/api/problems', (req: Request, res: Response) => {
  try {
    const problems = practiceService.getProblems();
    res.json({
      success: true,
      count: problems.length,
      problems: problems.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        difficulty: p.difficulty,
        timeEstimate: p.timeEstimate,
        description: p.description,
        requirementsCount: p.functionalRequirements.length,
        concepts: p.referenceKeyConcepts
      }))
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get Problem Detail by ID
app.get('/api/problems/:id', (req: Request, res: Response) => {
  try {
    const problem = practiceService.getProblem(req.params.id as string);
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    res.json({ success: true, problem });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Start or Resume Attempt for a Problem
app.post('/api/attempts', async (req: Request, res: Response) => {
  try {
    const { problemId, userId } = req.body;
    if (!problemId) {
      return res.status(400).json({ success: false, error: 'problemId is required' });
    }
    const attempt = await practiceService.getOrCreateAttempt(problemId, userId || 'reviewer-candidate');
    res.json({ success: true, attempt });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get Attempt by ID
app.get('/api/attempts/:id', async (req: Request, res: Response) => {
  try {
    const attempt = await practiceService.getAttempt(req.params.id as string);
    if (!attempt) {
      return res.status(404).json({ success: false, error: 'Attempt not found' });
    }
    res.json({ success: true, attempt });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Submit Solution for Evaluation
app.post('/api/attempts/:id/submit', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const content: SubmissionContent = req.body.content;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Submission content is required' });
    }

    const result = await practiceService.submitSolution(id, content);
    res.json({
      success: true,
      submission: result.submission,
      evaluation: result.evaluation,
      comparison: result.comparison
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Compare Two Submissions
app.get('/api/attempts/:id/compare', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const v1 = parseInt(req.query.v1 as string, 10);
    const v2 = parseInt(req.query.v2 as string, 10);

    if (isNaN(v1) || isNaN(v2)) {
      return res.status(400).json({ success: false, error: 'Valid v1 and v2 version query params are required' });
    }

    const comparison = await practiceService.compareAttempts(id, v1, v2);
    res.json({ success: true, comparison });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Serve In-App Documentation Notes
app.get('/api/docs/:docName', (req: Request, res: Response) => {
  const docName = (req.params.docName as string).toLowerCase();
  const validDocs: Record<string, string> = {
    research: path.resolve(__dirname, '../../RESEARCH_NOTE.md'),
    design: path.resolve(__dirname, '../../DESIGN_NOTE.md'),
    ai_usage: path.resolve(__dirname, '../../AI_USAGE.md')
  };

  const filePath = validDocs[docName];
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Documentation file not found' });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({ success: true, docName, content });
});

// Serve frontend static build if available (Unified production mode)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
  });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 CipherLLD Practice Platform Backend running on http://localhost:${PORT}`);
  });
}

export { app, practiceService };
