import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { PracticeService } from '../src/services/PracticeService.js';
import { HeuristicEvaluator } from '../src/evaluators/HeuristicEvaluator.js';

describe('PracticeService & API Integration Tests', () => {
  const service = new PracticeService(undefined, undefined, new HeuristicEvaluator());

  it('should list all available problems', () => {
    const problems = service.getProblems();
    expect(problems.length).toBeGreaterThanOrEqual(5);
    expect(problems.some(p => p.id === 'parking-lot')).toBe(true);
    expect(problems.some(p => p.id === 'elevator-system')).toBe(true);
  });

  it('should create attempt, submit multiple versions, and calculate comparison deltas', async () => {
    const attempt = await service.getOrCreateAttempt('parking-lot', 'test-user-1');
    expect(attempt.id).toBeDefined();
    expect(attempt.submissions.length).toBe(0);

    // Attempt Version 1 (Basic submission)
    const sub1Content = {
      assumptions: 'Basic parking lot assumptions.',
      diagramMermaid: 'classDiagram class ParkingLot',
      code: 'class ParkingLot { park() {} }',
      language: 'typescript' as const,
      designRationale: 'Simple monolith'
    };

    const res1 = await service.submitSolution(attempt.id, sub1Content);
    expect(res1.submission.version).toBe(1);
    expect(res1.evaluation.status).toBe('COMPLETED');
    expect(res1.comparison).toBeUndefined();

    // Attempt Version 2 (Improved submission with patterns & interfaces)
    const sub2Content = {
      assumptions: 'Multi-floor structure with distinct gates and concurrency limits.',
      diagramMermaid: `classDiagram
        class ParkingLot
        class ParkingFloor
        class ParkingSpot
        class IParkingStrategy
        ParkingLot *-- ParkingFloor
        ParkingFloor *-- ParkingSpot`,
      code: `
        export enum VehicleType { CAR, TRUCK }
        export interface IParkingStrategy { findSpot(): any; }
        export abstract class Vehicle { constructor(public id: string) {} }
        export class Car extends Vehicle {}
        export class ParkingSpot {
          private occupied = false;
          public park() { this.occupied = true; }
        }
      `,
      language: 'typescript' as const,
      designRationale: 'Applied Strategy pattern for spot finding and Open-Closed principle for vehicle types.'
    };

    const res2 = await service.submitSolution(attempt.id, sub2Content);
    expect(res2.submission.version).toBe(2);
    expect(res2.comparison).toBeDefined();
    expect(res2.comparison?.previousVersion).toBe(1);
    expect(res2.comparison?.currentVersion).toBe(2);
    expect(res2.comparison?.scoreDelta).toBeGreaterThanOrEqual(0);
  });

  it('should respond with health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should fetch problem catalog via HTTP', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.problems.length).toBeGreaterThanOrEqual(5);
  });

  it('should fetch specific problem detail via HTTP', async () => {
    const res = await request(app).get('/api/problems/elevator-system');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.problem.title).toContain('Elevator');
  });

  it('should return 404 for unknown problem', async () => {
    const res = await request(app).get('/api/problems/non-existent-problem');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
