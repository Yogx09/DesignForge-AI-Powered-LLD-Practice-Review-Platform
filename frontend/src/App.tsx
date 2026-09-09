import React, { useEffect, useState } from 'react';
import {
  getProblems,
  getProblemById,
  startOrGetAttempt,
  submitSolution
} from './api';
import {
  ProblemSummary,
  Problem,
  Attempt,
  SubmissionContent,
  EvaluationResult,
  AttemptComparison,
  Submission
} from './types';
import { Sidebar, NavTab } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ProblemDetailView } from './components/ProblemDetailView';
import { PracticeStudioView } from './components/PracticeStudioView';
import { FeedbackDashboardView } from './components/FeedbackDashboardView';
import { ProgressView } from './components/ProgressView';
import { EvaluationModal } from './components/EvaluationModal';
import { AttemptHistoryModal } from './components/AttemptHistoryModal';
import { DocViewerModal } from './components/DocViewerModal';
import { AIMentorModal } from './components/AIMentorModal';
import { SearchModal } from './components/SearchModal';
import { GOLD_STANDARD_PARKING_LOT, FLAWED_PARKING_LOT } from './sampleSolutions';
import { AlertCircle, Box, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

type PracticeStage = 'details' | 'studio' | 'feedback';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [practiceStage, setPracticeStage] = useState<PracticeStage>('details');
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [submissionContent, setSubmissionContent] = useState<SubmissionContent>({
    assumptions: '',
    diagramMermaid: '',
    code: '',
    language: 'typescript',
    designRationale: ''
  });

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [latestEvaluation, setLatestEvaluation] = useState<EvaluationResult | null>(null);
  const [latestComparison, setLatestComparison] = useState<AttemptComparison | null>(null);
  const [latestVersion, setLatestVersion] = useState<number>(1);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load problem catalog
  useEffect(() => {
    const initCatalog = async () => {
      try {
        const list = await getProblems();
        setProblems(list);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to API');
      }
    };
    initCatalog();
  }, []);

  const handleSelectProblem = async (problemId: string) => {
    try {
      setError(null);
      setActiveProblemId(problemId);
      setCurrentTab('problems');
      setPracticeStage('details');

      const prob = await getProblemById(problemId);
      setActiveProblem(prob);

      const attempt = await startOrGetAttempt(problemId, 'candidate-yogesh');
      setCurrentAttempt(attempt);

      if (attempt.submissions && attempt.submissions.length > 0) {
        const lastSub = attempt.submissions[attempt.submissions.length - 1];
        setSubmissionContent(lastSub.content);
        if (lastSub.evaluation) {
          setLatestEvaluation(lastSub.evaluation);
          setLatestVersion(lastSub.version);
        }
      } else {
        setSubmissionContent(prob.starterTemplate);
        setLatestEvaluation(null);
        setLatestComparison(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load problem');
    }
  };

  const handleStartPractice = () => {
    setPracticeStage('studio');
  };

  const handleChangeContent = (updated: Partial<SubmissionContent>) => {
    setSubmissionContent(prev => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    if (!activeProblem) return;
    setSubmissionContent({
      assumptions: '',
      diagramMermaid: '',
      code: '',
      language: 'typescript',
      designRationale: ''
    });
  };

  const handleSubmitSolution = async () => {
    if (!currentAttempt || !activeProblem) return;

    try {
      setIsEvaluating(true);
      setError(null);

      const res = await submitSolution(currentAttempt.id, submissionContent);

      setCurrentAttempt(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          submissions: [...prev.submissions, res.submission]
        };
      });

      setLatestEvaluation(res.evaluation);
      setLatestVersion(res.submission.version);
      if (res.comparison) {
        setLatestComparison(res.comparison);
      }

      setPracticeStage('feedback');

      if (res.evaluation.overallScore >= 80) {
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err: any) {
      setError(err.message || 'Evaluation failed');
    } finally {
      setIsEvaluating(false);
    }
  };

  // 1-Click Instant Demo for Reviewer
  const handleTrySampleDemo = async () => {
    try {
      setActiveProblemId('parking-lot');
      const prob = await getProblemById('parking-lot');
      setActiveProblem(prob);

      const attempt = await startOrGetAttempt('parking-lot', 'instant-reviewer');
      setCurrentAttempt(attempt);
      setSubmissionContent(GOLD_STANDARD_PARKING_LOT);

      setIsEvaluating(true);
      const res = await submitSolution(attempt.id, GOLD_STANDARD_PARKING_LOT);

      setCurrentAttempt(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          submissions: [...prev.submissions, res.submission]
        };
      });

      setLatestEvaluation(res.evaluation);
      setLatestVersion(res.submission.version);
      setPracticeStage('feedback');

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err: any) {
      setError(err.message || 'Sample demo failed');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectNavTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (tab === 'overview') {
      setActiveProblemId(null);
    } else if (tab === 'mentor') {
      setIsMentorOpen(true);
    } else if (tab === 'docs') {
      setIsDocsOpen(true);
    } else if (tab === 'attempts') {
      setIsHistoryOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectNavTab}
        solvedCount={3}
      />

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <AppHeader
          onSearchOpen={() => setIsSearchOpen(true)}
          onTrySampleDemo={handleTrySampleDemo}
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        />

        {/* Main Body */}
        <main style={{ flex: 1, padding: '16px 28px' }}>
          {error && (
            <div style={{
              padding: '12px 18px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-rose)',
              fontSize: '0.88rem',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* SCREEN 1: Overview Dashboard */}
          {currentTab === 'overview' && !activeProblemId && (
            <OverviewDashboard
              problems={problems}
              onSelectProblem={handleSelectProblem}
              onViewAllProblems={() => setCurrentTab('problems')}
              onTrySampleDemo={handleTrySampleDemo}
            />
          )}

          {/* SCREEN 1B: Problems Catalog Grid */}
          {currentTab === 'problems' && !activeProblemId && (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 8px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                Problem Catalog ({problems.length})
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                Select a problem to view requirements, architecture hints, and start your practice session.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                {problems.map(p => (
                  <div
                    key={p.id}
                    className="designlab-card"
                    style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span className="badge badge-medium">{p.difficulty}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.timeEstimate}</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                        {p.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                        {p.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectProblem(p.id)}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      <span>Open Challenge</span> <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 2, 3, 4: Active Problem Practice Lifecycle */}
          {activeProblemId && activeProblem && (
            <div>
              {/* Screen 2: Problem Detail Overview */}
              {practiceStage === 'details' && (
                <ProblemDetailView
                  problem={activeProblem}
                  onStartPractice={handleStartPractice}
                  onBackToProblems={() => setActiveProblemId(null)}
                />
              )}

              {/* Screen 3: Practice Studio */}
              {practiceStage === 'studio' && (
                <PracticeStudioView
                  problem={activeProblem}
                  submissionContent={submissionContent}
                  onChangeContent={handleChangeContent}
                  onSubmit={handleSubmitSolution}
                  isEvaluating={isEvaluating}
                  onReset={handleReset}
                  onBackToOverview={() => setPracticeStage('details')}
                  onLoadSampleSolution={activeProblem.id === 'parking-lot' ? () => setSubmissionContent(GOLD_STANDARD_PARKING_LOT) : undefined}
                  onLoadFlawedSolution={activeProblem.id === 'parking-lot' ? () => setSubmissionContent(FLAWED_PARKING_LOT) : undefined}
                />
              )}

              {/* Screen 4: Feedback Dashboard */}
              {practiceStage === 'feedback' && latestEvaluation && (
                <FeedbackDashboardView
                  evaluation={latestEvaluation}
                  comparison={latestComparison || undefined}
                  version={latestVersion}
                  problemTitle={activeProblem.title}
                  onImproveAndResubmit={() => setPracticeStage('studio')}
                  onBackToOverview={() => setPracticeStage('details')}
                />
              )}
            </div>
          )}

          {/* Progress Analytics Tab */}
          {currentTab === 'progress' && (
            <ProgressView
              problems={problems}
              attempt={currentAttempt}
              onSelectProblem={handleSelectProblem}
              onOpenHistoryModal={() => setIsHistoryOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <EvaluationModal isOpen={isEvaluating} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        problems={problems}
        onSelectProblem={handleSelectProblem}
      />

      <AIMentorModal
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
      />

      <DocViewerModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {currentAttempt && (
        <AttemptHistoryModal
          attempt={currentAttempt}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectSubmission={(sub) => {
            setSubmissionContent(sub.content);
            if (sub.evaluation) {
              setLatestEvaluation(sub.evaluation);
              setLatestVersion(sub.version);
            }
            setPracticeStage('studio');
          }}
        />
      )}
    </div>
  );
};
export default App;
