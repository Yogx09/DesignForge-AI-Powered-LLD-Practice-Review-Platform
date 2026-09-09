import { dbManager } from '../db/database.js';
import { Attempt, Submission, EvaluationResult } from '../domain/types.js';

export class DatabaseAttemptRepository {
  private memoryAttempts: Map<string, Attempt> = new Map();

  public async getAllByProblemId(problemId: string): Promise<Attempt[]> {
    const pool = dbManager.getPool();
    if (!pool) {
      return Array.from(this.memoryAttempts.values()).filter(a => a.problemId === problemId);
    }

    try {
      const res = await pool.query('SELECT * FROM attempts WHERE problem_id = $1', [problemId]);
      const attempts: Attempt[] = [];
      for (const row of res.rows) {
        const att = await this.getById(row.id);
        if (att) attempts.push(att);
      }
      return attempts;
    } catch (err) {
      return Array.from(this.memoryAttempts.values()).filter(a => a.problemId === problemId);
    }
  }

  public async getById(id: string): Promise<Attempt | undefined> {
    const pool = dbManager.getPool();
    if (!pool) {
      return this.memoryAttempts.get(id);
    }

    try {
      const attRes = await pool.query('SELECT * FROM attempts WHERE id = $1', [id]);
      if (attRes.rows.length === 0) return this.memoryAttempts.get(id);

      const attRow = attRes.rows[0];
      const subRes = await pool.query(
        'SELECT * FROM submissions WHERE attempt_id = $1 ORDER BY version ASC',
        [id]
      );

      const submissions: Submission[] = [];
      for (const subRow of subRes.rows) {
        const evalRes = await pool.query('SELECT * FROM evaluations WHERE submission_id = $1', [subRow.id]);
        let evaluation: EvaluationResult | undefined;
        if (evalRes.rows.length > 0) {
          const er = evalRes.rows[0];
          evaluation = {
            id: er.id,
            submissionId: er.submission_id,
            attemptId: er.attempt_id,
            problemId: er.problem_id,
            status: er.status,
            overallScore: er.overall_score,
            criteriaFeedback: er.criteria_feedback,
            strengths: er.strengths,
            criticalConcerns: er.critical_concerns,
            actionableRecommendations: er.actionable_recommendations,
            deterministicChecks: er.deterministic_checks,
            evaluatorUsed: er.evaluator_used,
            durationMs: er.duration_ms,
            createdAt: er.created_at
          };
        }

        submissions.push({
          id: subRow.id,
          attemptId: subRow.attempt_id,
          problemId: subRow.problem_id,
          version: subRow.version,
          content: subRow.content,
          createdAt: subRow.created_at,
          evaluationId: evaluation?.id,
          evaluation
        });
      }

      const attempt: Attempt = {
        id: attRow.id,
        problemId: attRow.problem_id,
        userId: attRow.user_id,
        status: attRow.status,
        createdAt: attRow.created_at,
        updatedAt: attRow.updated_at,
        submissions
      };

      this.memoryAttempts.set(id, attempt);
      return attempt;
    } catch (err) {
      return this.memoryAttempts.get(id);
    }
  }

  public async getByProblemAndUser(problemId: string, userId: string): Promise<Attempt | undefined> {
    const pool = dbManager.getPool();
    if (!pool) {
      return Array.from(this.memoryAttempts.values()).find(
        a => a.problemId === problemId && a.userId === userId
      );
    }

    try {
      const res = await pool.query(
        'SELECT id FROM attempts WHERE problem_id = $1 AND user_id = $2 LIMIT 1',
        [problemId, userId]
      );
      if (res.rows.length > 0) {
        return this.getById(res.rows[0].id);
      }
      return undefined;
    } catch (err) {
      return Array.from(this.memoryAttempts.values()).find(
        a => a.problemId === problemId && a.userId === userId
      );
    }
  }

  public async save(attempt: Attempt): Promise<void> {
    this.memoryAttempts.set(attempt.id, attempt);

    const pool = dbManager.getPool();
    if (!pool) return;

    try {
      await pool.query(
        `INSERT INTO attempts (id, problem_id, user_id, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE
         SET status = $4, updated_at = $6`,
        [attempt.id, attempt.problemId, attempt.userId, attempt.status, attempt.createdAt, attempt.updatedAt]
      );

      for (const sub of attempt.submissions) {
        await pool.query(
          `INSERT INTO submissions (id, attempt_id, problem_id, version, content, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [sub.id, sub.attemptId, sub.problemId, sub.version, JSON.stringify(sub.content), sub.createdAt]
        );

        if (sub.evaluation) {
          const ev = sub.evaluation;
          await pool.query(
            `INSERT INTO evaluations (
              id, submission_id, attempt_id, problem_id, status,
              overall_score, criteria_feedback, strengths, critical_concerns,
              actionable_recommendations, deterministic_checks, evaluator_used, duration_ms, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (id) DO UPDATE SET
              overall_score = $6, criteria_feedback = $7, strengths = $8,
              critical_concerns = $9, actionable_recommendations = $10,
              deterministic_checks = $11, evaluator_used = $12, duration_ms = $13`,
            [
              ev.id, ev.submissionId, ev.attemptId, ev.problemId, ev.status,
              ev.overallScore, JSON.stringify(ev.criteriaFeedback), JSON.stringify(ev.strengths),
              JSON.stringify(ev.criticalConcerns), JSON.stringify(ev.actionableRecommendations),
              JSON.stringify(ev.deterministicChecks), ev.evaluatorUsed, ev.durationMs, ev.createdAt
            ]
          );
        }
      }
    } catch (err: any) {
      console.warn('Could not persist attempt to PostgreSQL, saved in memory:', err.message);
    }
  }
}
