import { Problem } from '../domain/types.js';
import { STANDARD_LLD_RUBRIC } from '../domain/Rubric.js';

export const SEED_PROBLEMS: Problem[] = [
  {
    id: 'parking-lot',
    title: 'Multi-Floor Smart Parking Lot System',
    category: 'Object-Oriented Design',
    difficulty: 'Medium',
    timeEstimate: '45 mins',
    description: 'Design an automated multi-floor parking lot system that manages parking spots for various vehicle types, assigns parking tickets, calculates dynamic parking fees upon exit, and supports pluggable spot assignment algorithms.',
    functionalRequirements: [
      'The parking lot has multiple floors, each containing multiple parking spots of different types (Compact, Large, Motorcycle, EV Charging, Handicapped).',
      'The system must support various vehicle types: Motorcycle, Car, Van/Truck, and Electric Car.',
      'Upon vehicle entry, the system automatically finds and allocates an optimal available spot, marks it occupied, and generates an entry Ticket with timestamp and spot details.',
      'If no suitable spot is available for the vehicle type, the entry gate should display "Lot Full" and reject entry.',
      'Upon vehicle exit, the system calculates the fee based on duration and vehicle type using a configurable pricing strategy (e.g., Hourly, Flat-rate, Peak-hour surge pricing).',
      'The system must support pluggable spot assignment strategies (e.g., Nearest to Entrance, Lowest Floor First, Random).'
    ],
    nonFunctionalRequirements: [
      'Thread safety for concurrent vehicle entries/exits at multiple gates.',
      'Extensibility to add new vehicle types, spot types, or pricing models without modifying existing core logic (Open-Closed Principle).',
      'Loose coupling between payment processing and ticket management.'
    ],
    constraints: [
      'Motorcycles can park in Motorcycle, Compact, or Large spots.',
      'Cars can park in Compact or Large spots.',
      'Trucks/Vans can only park in Large spots.',
      'EV cars prefer EV Charging spots but can use standard spots if EV spots are full.'
    ],
    expectedEntities: [
      'ParkingLot (Singleton/Coordinator)',
      'ParkingFloor',
      'ParkingSpot (Abstract/Subclasses)',
      'Vehicle (Abstract/Subclasses)',
      'ParkingTicket',
      'IParkingStrategy / SpotAssignmentStrategy',
      'IFeeCalculationStrategy / PricingStrategy',
      'PaymentProcessor / Payment'
    ],
    referenceKeyConcepts: [
      'Strategy Pattern (Spot Assignment, Fee Calculation)',
      'Factory Pattern (Vehicle/Spot Creation)',
      'Singleton Pattern (ParkingLot Manager)',
      'State Pattern (Spot availability lifecycle)',
      'Observer Pattern (Display Board updates)'
    ],
    starterTemplate: {
      assumptions: `- Single entry and exit gate per floor for MVP; can scale to multiple gates.\n- Payment is simulated synchronously at checkout.\n- Lost ticket penalty can be handled as an edge case.`,
      diagramMermaid: `classDiagram
    class ParkingLot {
        -String id
        -List~ParkingFloor~ floors
        -IParkingStrategy parkingStrategy
        -IFeeStrategy feeStrategy
        +parkVehicle(Vehicle v) Ticket
        +unparkVehicle(Ticket t) Receipt
    }
    class ParkingFloor {
        -int floorNumber
        -Map~SpotType, List~ParkingSpot~~ spots
        +findAvailableSpot(SpotType type) ParkingSpot
    }
    class ParkingSpot {
        <<abstract>>
        -String spotId
        -SpotType type
        -boolean isOccupied
        -Vehicle currentVehicle
        +assignVehicle(Vehicle v)
        +removeVehicle()
    }
    class Vehicle {
        <<abstract>>
        -String licensePlate
        -VehicleType type
    }
    class ParkingTicket {
        -String ticketId
        -String spotId
        -long entryTime
        -Vehicle vehicle
    }
    class IParkingStrategy {
        <<interface>>
        +findSpot(List~ParkingFloor~ floors, Vehicle v) ParkingSpot
    }
    ParkingLot "1" *-- "many" ParkingFloor
    ParkingFloor "1" *-- "many" ParkingSpot
    ParkingLot ..> IParkingStrategy
    ParkingSpot o-- Vehicle`,
      language: 'typescript',
      code: `// Define Enums
export enum VehicleType {
  MOTORCYCLE,
  CAR,
  TRUCK,
  ELECTRIC
}

export enum SpotType {
  MOTORCYCLE,
  COMPACT,
  LARGE,
  ELECTRIC
}

// Vehicle Abstraction
export abstract class Vehicle {
  constructor(
    public readonly licensePlate: string,
    public readonly type: VehicleType
  ) {}
}

export class Car extends Vehicle {
  constructor(licensePlate: string) {
    super(licensePlate, VehicleType.CAR);
  }
}

// Parking Spot Abstraction
export abstract class ParkingSpot {
  private occupied = false;
  private currentVehicle: Vehicle | null = null;

  constructor(
    public readonly id: string,
    public readonly type: SpotType
  ) {}

  public isAvailable(): boolean {
    return !this.occupied;
  }

  public assignVehicle(vehicle: Vehicle): boolean {
    if (!this.isAvailable()) return false;
    this.currentVehicle = vehicle;
    this.occupied = true;
    return true;
  }

  public vacate(): Vehicle | null {
    const v = this.currentVehicle;
    this.currentVehicle = null;
    this.occupied = false;
    return v;
  }
}

// TODO: Implement Floor, Ticket, Strategy, and ParkingLot Manager
`,
      designRationale: `1. Used Strategy Pattern for Spot Allocation (IParkingStrategy) and Fee Calculation (IFeeStrategy) to allow adding new parking algorithms without changing ParkingLot core logic.\n2. ParkingSpot and Vehicle are polymorphic abstractions allowing future additions like Handicap spots or Ambulances.\n3. Encapsulated spot occupancy state inside ParkingSpot.`
    },
    rubric: STANDARD_LLD_RUBRIC
  },
  {
    id: 'elevator-system',
    title: 'Elevator Dispatch & Management System',
    category: 'State Machine & Concurrency',
    difficulty: 'Hard',
    timeEstimate: '60 mins',
    description: 'Design an intelligent elevator management system for a multi-story skyscraper with multiple elevator cars, optimizing passenger pickup/drop-off dispatching, respecting door states, and handling emergency scenarios.',
    functionalRequirements: [
      'The building has N floors and M elevator cars.',
      'Users can request an elevator from any floor with UP/DOWN directional buttons (Hall Calls).',
      'Users inside an elevator car can select target destination floors (Car Calls).',
      'An Elevator Controller dispatches the most suitable elevator car using a scheduling algorithm (e.g. SCAN/Elevator algorithm, Shortest Seek Time First, Nearest Car).',
      'Each elevator car transitions through valid states: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN, MAINTENANCE.',
      'Elevator cars have capacity/weight limits and emergency stop controls.'
    ],
    nonFunctionalRequirements: [
      'High throughput: Minimize passenger wait times and energy consumption.',
      'Safety & Thread Safety: Mutual exclusion when updating car requests in multi-threaded environment.',
      'Extensibility for custom dispatching algorithms.'
    ],
    constraints: [
      'An elevator cannot change direction while it still has pending requests in its current traveling direction.',
      'Doors must not open while the car is in motion.'
    ],
    expectedEntities: [
      'ElevatorSystem / ElevatorController',
      'ElevatorCar',
      'IElevatorState (State Pattern)',
      'IDispatchStrategy (Strategy Pattern)',
      'FloorRequest / InternalRequest',
      'Door',
      'Display'
    ],
    referenceKeyConcepts: [
      'State Pattern (Elevator Car States: Idle, Moving, DoorOpen)',
      'Strategy Pattern (Dispatching Algorithm)',
      'Producer-Consumer / Priority Queue (Request Scheduling)',
      'Observer Pattern (Display / Bell notification when arriving at floor)'
    ],
    starterTemplate: {
      assumptions: `- Floors are indexed from 1 to N.\n- Elevator movements between floors take simulated time.\n- Passenger weight checks occur when doors are open.`,
      diagramMermaid: `classDiagram
    class ElevatorController {
        -List~ElevatorCar~ cars
        -IDispatchStrategy dispatchStrategy
        +requestElevator(int floor, Direction dir)
        +step()
    }
    class ElevatorCar {
        -int id
        -int currentFloor
        -Direction currentDirection
        -ElevatorState state
        -TreeSet~int~ upRequests
        -TreeSet~int~ downRequests
        +addDestination(int floor)
        +move()
    }
    class IDispatchStrategy {
        <<interface>>
        +selectCar(List~ElevatorCar~ cars, int floor, Direction dir) ElevatorCar
    }
    ElevatorController "1" *-- "many" ElevatorCar
    ElevatorController ..> IDispatchStrategy`,
      language: 'typescript',
      code: `export enum Direction { UP, DOWN, IDLE }
export enum ElevatorStatus { IDLE, MOVING, STOPPED, MAINTENANCE }

export class ElevatorCar {
  public currentFloor = 1;
  public direction = Direction.IDLE;
  public status = ElevatorStatus.IDLE;

  constructor(public readonly id: number, public readonly capacity: number) {}

  public moveToFloor(floor: number) {
    // TODO: Implement car movement and state validation
  }
}

// TODO: Implement ElevatorController, DispatchStrategy, and Request Queues
`,
      designRationale: `1. State Pattern separates state-specific transition rules (e.g., doors cannot open while MOVING).\n2. Strategy Pattern isolates the dispatch algorithm (LOOK / SCAN vs proximity-based).\n3. Two prioritized sets (UpQueue and DownQueue) ensure starvation-free scheduling.`
    },
    rubric: STANDARD_LLD_RUBRIC
  },
  {
    id: 'rate-limiter',
    title: 'Distributed API Rate Limiter',
    category: 'System & Concurrency',
    difficulty: 'Medium',
    timeEstimate: '45 mins',
    description: 'Design an extensible, in-memory/distributed API Rate Limiter that throttles incoming client requests based on configured limits (e.g. 100 requests per minute per user/IP/API-Key) across multiple algorithms.',
    functionalRequirements: [
      'Rate limit requests identified by client key (User ID, API Key, or Client IP).',
      'Return HTTP 429 Too Many Requests with retry-after header if rate limit exceeded, or allow request to pass through.',
      'Support multiple rate limiting algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log, Sliding Window Counter.',
      'Support tier-based limits (e.g., Free: 10 req/min, Pro: 100 req/min, Enterprise: 1000 req/min).',
      'Configurable rules per API route / endpoint.'
    ],
    nonFunctionalRequirements: [
      'Low latency overhead (sub-millisecond evaluation).',
      'Thread safety under concurrent requests from the same client.',
      'Pluggable storage backend (In-Memory for single node, Redis for distributed cluster).'
    ],
    constraints: [
      'Must handle clock drift and burst traffic gracefully.',
      'Memory footprint should be bounded and periodically cleaned of expired buckets.'
    ],
    expectedEntities: [
      'RateLimiter (Coordinator)',
      'IRateLimitStrategy (TokenBucket, SlidingWindow, etc.)',
      'RateLimitRule (Limit, WindowDuration, Unit)',
      'ClientIdentifier (UserId, IpAddress, ApiKey)',
      'RateLimitResult (isAllowed, remainingTokens, resetTimeMs)',
      'TokenBucket / WindowState'
    ],
    referenceKeyConcepts: [
      'Strategy Pattern (Rate Limiting Algorithms)',
      'Factory Pattern (Strategy & Rule instantiation)',
      'Decorator / Chain of Responsibility (Middleware pipeline)',
      'Atomic Operations & Synchronization'
    ],
    starterTemplate: {
      assumptions: `- Millisecond precision timestamps.\n- In-memory thread-safe state store for local nodes.\n- Rejection returns metadata about remaining tokens and retry delay.`,
      diagramMermaid: `classDiagram
    class RateLimiterService {
        -Map~String, IRateLimitStrategy~ strategyRegistry
        -RuleManager ruleManager
        +allowRequest(String clientId, String endpoint) RateLimitResult
    }
    class IRateLimitStrategy {
        <<interface>>
        +isAllowed(String key, RateLimitRule rule) RateLimitResult
    }
    class TokenBucketStrategy {
        -Map~String, TokenBucket~ buckets
        +isAllowed(String key, RateLimitRule rule) RateLimitResult
    }
    class SlidingWindowStrategy {
        -Map~String, Queue~Long~~ requestTimestamps
        +isAllowed(String key, RateLimitRule rule) RateLimitResult
    }
    RateLimiterService ..> IRateLimitStrategy
    TokenBucketStrategy ..|> IRateLimitStrategy
    SlidingWindowStrategy ..|> IRateLimitStrategy`,
      language: 'typescript',
      code: `export interface RateLimitResult {
  isAllowed: boolean;
  remainingTokens: number;
  retryAfterMs: number;
}

export interface IRateLimitStrategy {
  isAllowed(clientId: string, maxRequests: number, windowMs: number): RateLimitResult;
}

// TODO: Implement TokenBucketStrategy, SlidingWindowStrategy, and RateLimiterService
`,
      designRationale: `1. IRateLimitStrategy decouples the algorithmic execution from the HTTP middleware layer.\n2. Strategy pattern enables easy A/B testing of algorithms across different client tiers.\n3. Mutex/atomic token replenishment protects against race conditions.`
    },
    rubric: STANDARD_LLD_RUBRIC
  },
  {
    id: 'splitwise',
    title: 'Expense Sharing Application (Splitwise Clone)',
    category: 'Object-Oriented Design',
    difficulty: 'Medium',
    timeEstimate: '50 mins',
    description: 'Design a peer-to-peer and group expense sharing platform that allows users to record shared expenses with custom split strategies (Equal, Exact Amount, Percentage, Shares) and compute simplified settled balances.',
    functionalRequirements: [
      'Users can create individual or group expenses.',
      'Support multiple Split Strategies: EQUAL split, EXACT amount split, PERCENTAGE split, and SHARES split.',
      'Validate split inputs (e.g. percentages sum to 100%, exact splits sum to total amount).',
      'Track balance sheets: Show who owes whom how much across all recorded expenses.',
      'Simplify Debt Graph: Algorithm to minimize total number of transactions required to settle up balances across a group of users.'
    ],
    nonFunctionalRequirements: [
      'Data consistency and arithmetic precision (handle rounding issues properly e.g. $100 split 3 ways).',
      'Extensibility for new split types (e.g., Adjustment/Credit split) without rewriting expense management.'
    ],
    constraints: [
      'All users in an expense must exist in the system.',
      'Negative expense amounts or zero amounts are invalid.'
    ],
    expectedEntities: [
      'User',
      'Group',
      'Expense',
      'Split (EqualSplit, ExactSplit, PercentSplit)',
      'ISplitStrategy / ExpenseValidator',
      'BalanceSheet / BalanceManager',
      'IDebtSimplificationStrategy'
    ],
    referenceKeyConcepts: [
      'Strategy Pattern (Split Calculation & Validation)',
      'Factory Pattern (Expense & Split Creation)',
      'Composite / Group Pattern (Individual vs Group expenses)',
      'Graph / Greedy Algorithm (Debt Simplification min-cash-flow)'
    ],
    starterTemplate: {
      assumptions: `- Double precision currency with rounding to 2 decimal places.\n- Users can settle debts partially or in full.\n- Group balances aggregate individual peer balances.`,
      diagramMermaid: `classDiagram
    class ExpenseManager {
        -Map~String, User~ users
        -Map~String, Map~String, Double~~ balanceSheet
        +createExpense(String paidBy, double amount, List~Split~ splits, SplitType type)
        +showBalances()
        +simplifyGroupDebts(String groupId)
    }
    class Expense {
        -String id
        -double amount
        -User paidBy
        -List~Split~ splits
        -ISplitValidator validator
    }
    class Split {
        <<abstract>>
        -User user
        -double amount
    }
    class EqualSplit
    class PercentSplit {
        -double percentage
    }
    class ExactSplit
    Split <|-- EqualSplit
    Split <|-- PercentSplit
    Split <|-- ExactSplit
    Expense "1" *-- "many" Split`,
      language: 'typescript',
      code: `export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}
}

export abstract class Split {
  constructor(public readonly user: User, public amount: number = 0) {}
}

// TODO: Implement EqualSplit, PercentSplit, ExactSplit, Expense, and ExpenseManager with Debt Simplifier
`,
      designRationale: `1. Split hierarchy combined with Strategy Pattern decouples split verification math from the core Expense entity.\n2. BalanceSheet is maintained via an adjacency balance map (UserA -> UserB -> NetAmount).\n3. Debt simplification is implemented via a pluggable IDebtSimplificationStrategy.`
    },
    rubric: STANDARD_LLD_RUBRIC
  },
  {
    id: 'snake-and-ladder',
    title: 'Snake & Ladder Board Game Engine',
    category: 'Game Engine & Patterns',
    difficulty: 'Easy',
    timeEstimate: '35 mins',
    description: 'Design a modular, multi-player Snake & Ladder board game engine supporting customizable board dimensions, configurable dice count/faces, dynamic snakes/ladders/special powerups, and event observation.',
    functionalRequirements: [
      'Initialize game board of size N x N (typically 100 cells) with configurable snakes and ladders.',
      'Support 2 or more players taking turns in round-robin fashion.',
      'Dice roll mechanism supporting 1 or more dice with configurable sides (default 1 to 6).',
      'Players move forward based on dice total. If a player lands on a Ladder bottom, they climb to top. If they land on a Snake head, they slide to tail.',
      'Winning condition: A player must land exactly on the final cell (e.g. 100). If roll exceeds required count, player does not move.',
      'Support Game Events / Notifications: PlayerTurn, SnakeEncountered, LadderClimbed, PlayerWon.'
    ],
    nonFunctionalRequirements: [
      'Extensibility: Easy to add new board elements (e.g. Teleporters, Mines, Double-Roll tiles) via Open-Closed Principle.',
      'Decoupled UI / CLI rendering using Observer pattern.'
    ],
    constraints: [
      'Snakes and Ladders cannot create infinite loops.',
      'Cell 1 and Cell 100 cannot contain a snake head or ladder bottom.'
    ],
    expectedEntities: [
      'Game (Engine/Coordinator)',
      'Board',
      'Cell / BoardEntity (Snake, Ladder, PowerUp)',
      'Player',
      'Dice',
      'IGameObserver (Game Event Listener)',
      'IGameState (Ongoing, Finished)'
    ],
    referenceKeyConcepts: [
      'Observer Pattern (Game state listeners, logs, UI updates)',
      'Strategy / Decorator Pattern (Special Board Tiles)',
      'State Pattern (Turn management & Game Status)',
      'Command Pattern (Move History & Replay/Undo)'
    ],
    starterTemplate: {
      assumptions: `- Players play in fixed FIFO order.\n- Extra turn on rolling a 6 can be a configurable rule.`,
      diagramMermaid: `classDiagram
    class GameEngine {
        -Board board
        -Queue~Player~ players
        -Dice dice
        -List~IGameObserver~ observers
        +playTurn()
        +isGameOver() boolean
    }
    class Board {
        -int size
        -Map~Integer, BoardSpecialEntity~ specials
        +getNextPosition(int currentPos, int steps) int
    }
    class BoardSpecialEntity {
        <<interface>>
        +apply(int currentPosition) int
    }
    class Snake
    class Ladder
    BoardSpecialEntity <|.. Snake
    BoardSpecialEntity <|.. Ladder
    GameEngine *-- Board`,
      language: 'typescript',
      code: `export class Player {
  public position = 0;
  constructor(public readonly id: string, public readonly name: string) {}
}

export class Dice {
  constructor(public readonly faces: number = 6) {}
  public roll(): number {
    return Math.floor(Math.random() * this.faces) + 1;
  }
}

// TODO: Implement Board, Snake, Ladder, GameEngine, and Observer
`,
      designRationale: `1. BoardSpecialEntity interface allows adding portals, trampolines, and power-ups without touching the Board loop.\n2. Observer pattern broadcasts player actions to allow decoupled terminal/web rendering.\n3. Queue-based turn manager handles round-robin rotations cleanly.`
    },
    rubric: STANDARD_LLD_RUBRIC
  }
];
