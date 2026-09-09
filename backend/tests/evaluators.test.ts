import { describe, it, expect } from 'vitest';
import { DeterministicValidator } from '../src/evaluators/DeterministicValidator.js';
import { HeuristicEvaluator } from '../src/evaluators/HeuristicEvaluator.js';
import { SEED_PROBLEMS } from '../src/data/seedProblems.js';
import { SubmissionContent } from '../src/domain/types.js';

describe('DeterministicValidator & HeuristicEvaluator', () => {
  const parkingLotProblem = SEED_PROBLEMS.find(p => p.id === 'parking-lot')!;
  const validator = new DeterministicValidator();
  const heuristicEvaluator = new HeuristicEvaluator();

  it('should analyze code structure and identify classes, interfaces, and patterns', () => {
    const code = `
      export enum SpotType { COMPACT, LARGE }
      export interface IPricingStrategy { calculate(): number; }
      export abstract class Vehicle { constructor(public id: string) {} }
      export class Car extends Vehicle implements IPricingStrategy {
        public calculate() { return 10; }
      }
    `;

    const analysis = validator.analyzeCode(code);
    expect(analysis.classes).toContain('Car');
    expect(analysis.interfaces).toContain('IPricingStrategy');
    expect(analysis.enums).toContain('SpotType');
    expect(analysis.abstractClasses).toContain('Vehicle');
    expect(analysis.hasDesignPatternsIdentified).toContain('Strategy');
  });

  it('should fail validation if code is empty or missing required sections', () => {
    const emptySubmission: SubmissionContent = {
      assumptions: '',
      diagramMermaid: '',
      code: '',
      language: 'typescript',
      designRationale: ''
    };

    const { isValid, checks } = validator.validate(parkingLotProblem, emptySubmission);
    expect(isValid).toBe(false);
    expect(checks.some(c => !c.passed)).toBe(true);
  });

  it('should fail validation and score <= 12 for 2-line or stub submissions', async () => {
    const stubSubmission: SubmissionContent = {
      assumptions: '',
      diagramMermaid: '',
      code: `class ParkingLot {\n}`,
      language: 'typescript',
      designRationale: ''
    };

    const { isValid } = validator.validate(parkingLotProblem, stubSubmission);
    expect(isValid).toBe(false);

    const evalResult = await heuristicEvaluator.evaluate(
      parkingLotProblem,
      stubSubmission,
      'test-stub-attempt',
      'test-stub-sub'
    );

    expect(evalResult.status).toBe('COMPLETED');
    expect(evalResult.overallScore).toBeLessThanOrEqual(12);
    expect(evalResult.criticalConcerns.some(c => c.toLowerCase().includes('incomplete'))).toBe(true);
  });

  it('should evaluate valid submission and generate rubric feedback', async () => {
    const validSubmission: SubmissionContent = {
      assumptions: 'Single entry and exit gate per floor with automated ticketing and concurrency mutex locks on spots.',
      diagramMermaid: `classDiagram
        class ParkingLot
        class ParkingFloor
        class ParkingSpot
        class Vehicle
        class IParkingStrategy
        ParkingLot *-- ParkingFloor
        ParkingFloor *-- ParkingSpot`,
      code: `
        export enum VehicleType { CAR, TRUCK }
        export enum SpotType { COMPACT, LARGE }
        export interface IParkingStrategy {
          findSpot(vehicle: Vehicle): ParkingSpot;
        }
        export abstract class Vehicle {
          constructor(public licensePlate: string) {}
        }
        export class Car extends Vehicle {}
        export class ParkingSpot {
          private occupied = false;
          private lock = new Mutex();
          public isAvailable() { return !this.occupied; }
          public park(v: Vehicle) {
            if (!this.isAvailable()) throw new Error("Occupied");
            this.occupied = true;
          }
        }
      `,
      language: 'typescript',
      designRationale: 'Used Strategy pattern for spot finding to adhere to Open-Closed Principle and added mutex locks for thread safety.'
    };

    const evalResult = await heuristicEvaluator.evaluate(
      parkingLotProblem,
      validSubmission,
      'test-attempt-id',
      'test-sub-id'
    );

    expect(evalResult.status).toBe('COMPLETED');
    expect(evalResult.overallScore).toBeGreaterThanOrEqual(70);
    expect(evalResult.criteriaFeedback.length).toBe(5);
    expect(evalResult.strengths.length).toBeGreaterThan(0);
    expect(evalResult.actionableRecommendations.length).toBeGreaterThan(0);
  });
});

