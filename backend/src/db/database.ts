import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export class DatabaseManager {
  private pool: pg.Pool | null = null;
  private isConnected = false;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      try {
        this.pool = new Pool({
          connectionString: databaseUrl,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
          connectionTimeoutMillis: 5000
        });
        this.initSchema();
      } catch (err: any) {
        console.warn('PostgreSQL connection initialization failed, using in-memory store:', err.message);
      }
    } else {
      console.log('ℹ️  No DATABASE_URL configured, running with durable In-Memory storage.');
    }
  }

  private async initSchema() {
    if (!this.pool) return;
    try {
      const client = await this.pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS attempts (
            id VARCHAR(64) PRIMARY KEY,
            problem_id VARCHAR(64) NOT NULL,
            user_id VARCHAR(64) NOT NULL,
            status VARCHAR(32) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS submissions (
            id VARCHAR(64) PRIMARY KEY,
            attempt_id VARCHAR(64) REFERENCES attempts(id) ON DELETE CASCADE,
            problem_id VARCHAR(64) NOT NULL,
            version INT NOT NULL,
            content JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS evaluations (
            id VARCHAR(64) PRIMARY KEY,
            submission_id VARCHAR(64) REFERENCES submissions(id) ON DELETE CASCADE,
            attempt_id VARCHAR(64) NOT NULL,
            problem_id VARCHAR(64) NOT NULL,
            status VARCHAR(32) NOT NULL,
            overall_score INT NOT NULL,
            criteria_feedback JSONB NOT NULL,
            strengths JSONB NOT NULL,
            critical_concerns JSONB NOT NULL,
            actionable_recommendations JSONB NOT NULL,
            deterministic_checks JSONB NOT NULL,
            evaluator_used VARCHAR(64) NOT NULL,
            duration_ms INT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        this.isConnected = true;
        console.log('✅ PostgreSQL schema initialized successfully.');
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.warn('⚠️  Could not connect to PostgreSQL host, falling back to memory store:', err.message);
      this.isConnected = false;
    }
  }

  public getPool(): pg.Pool | null {
    return this.isConnected ? this.pool : null;
  }

  public hasDatabase(): boolean {
    return this.isConnected;
  }
}

export const dbManager = new DatabaseManager();
