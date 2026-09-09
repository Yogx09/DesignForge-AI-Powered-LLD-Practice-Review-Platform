import { SubmissionContent } from './types';

export const GOLD_STANDARD_PARKING_LOT: SubmissionContent = {
  assumptions: `- Multi-floor layout with 3 floors, each having 50 spots.
- Single Entry and Exit Gate per floor for concurrency testing.
- Vehicle types: Motorcycle, Compact Car, Large Truck, and Electric Car (EV).
- Spot allocation follows "Nearest to Entrance" strategy by default, but is pluggable via Strategy pattern.
- Pricing calculation uses dynamic Hourly + Surge Fee strategy.
- Concurrency: Spot state transitions are protected with mutex locking to prevent double bookings.`,
  diagramMermaid: `classDiagram
    class ParkingLot {
        -String id
        -List~ParkingFloor~ floors
        -IParkingStrategy allocationStrategy
        -IFeeStrategy feeStrategy
        +parkVehicle(Vehicle v) ParkingTicket
        +unparkVehicle(ParkingTicket t) Receipt
    }
    class ParkingFloor {
        -int floorNumber
        -Map~SpotType, List~ParkingSpot~~ spots
        +getAvailableSpot(SpotType type) ParkingSpot
    }
    class ParkingSpot {
        <<abstract>>
        -String id
        -SpotType type
        -boolean isOccupied
        -Vehicle currentVehicle
        +assignVehicle(Vehicle v) boolean
        +vacate() Vehicle
    }
    class Vehicle {
        <<abstract>>
        -String licensePlate
        -VehicleType type
    }
    class ParkingTicket {
        -String ticketId
        -String spotId
        -long entryTimestamp
        -Vehicle vehicle
    }
    class IParkingStrategy {
        <<interface>>
        +findSpot(List~ParkingFloor~ floors, Vehicle v) ParkingSpot
    }
    class IFeeStrategy {
        <<interface>>
        +calculateFee(ParkingTicket ticket, long exitTimestamp) double
    }
    ParkingLot "1" *-- "many" ParkingFloor
    ParkingFloor "1" *-- "many" ParkingSpot
    ParkingLot ..> IParkingStrategy
    ParkingLot ..> IFeeStrategy
    ParkingSpot o-- Vehicle`,
  language: 'typescript',
  code: `// Enums
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

// Vehicle Polymorphic Abstraction
export abstract class Vehicle {
  constructor(
    public readonly licensePlate: string,
    public readonly type: VehicleType
  ) {}
}

export class Motorcycle extends Vehicle {
  constructor(plate: string) { super(plate, VehicleType.MOTORCYCLE); }
}

export class Car extends Vehicle {
  constructor(plate: string) { super(plate, VehicleType.CAR); }
}

export class Truck extends Vehicle {
  constructor(plate: string) { super(plate, VehicleType.TRUCK); }
}

// Parking Spot Abstraction (SRP + Encapsulation)
export abstract class ParkingSpot {
  private occupied = false;
  private currentVehicle: Vehicle | null = null;

  constructor(
    public readonly id: string,
    public readonly type: SpotType,
    public readonly floorNumber: number
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

export class CompactSpot extends ParkingSpot {
  constructor(id: string, floor: number) { super(id, SpotType.COMPACT, floor); }
}

export class LargeSpot extends ParkingSpot {
  constructor(id: string, floor: number) { super(id, SpotType.LARGE, floor); }
}

// Ticket & Receipt
export class ParkingTicket {
  constructor(
    public readonly ticketId: string,
    public readonly spotId: string,
    public readonly floorNumber: number,
    public readonly entryTime: number,
    public readonly vehicle: Vehicle
  ) {}
}

// Strategy Interfaces (DIP + OCP)
export interface IParkingStrategy {
  findSpot(floors: ParkingFloor[], vehicle: Vehicle): ParkingSpot | null;
}

export interface IFeeStrategy {
  calculateFee(ticket: ParkingTicket, exitTime: number): number;
}

// Concrete Strategies
export class NearestFirstParkingStrategy implements IParkingStrategy {
  public findSpot(floors: ParkingFloor[], vehicle: Vehicle): ParkingSpot | null {
    for (const floor of floors) {
      const spot = floor.findAvailableSpotForVehicle(vehicle);
      if (spot) return spot;
    }
    return null;
  }
}

export class HourlyFeeStrategy implements IFeeStrategy {
  constructor(private hourlyRate: number = 20) {}
  public calculateFee(ticket: ParkingTicket, exitTime: number): number {
    const durationHours = Math.max(1, Math.ceil((exitTime - ticket.entryTime) / 3600000));
    return durationHours * this.hourlyRate;
  }
}

// Floor Aggregate
export class ParkingFloor {
  private spots: Map<string, ParkingSpot> = new Map();

  constructor(public readonly floorNumber: number) {}

  public addSpot(spot: ParkingSpot): void {
    this.spots.set(spot.id, spot);
  }

  public findAvailableSpotForVehicle(vehicle: Vehicle): ParkingSpot | null {
    for (const spot of this.spots.values()) {
      if (spot.isAvailable()) {
        if (vehicle.type === VehicleType.CAR && spot.type === SpotType.COMPACT) return spot;
        if (vehicle.type === VehicleType.TRUCK && spot.type === SpotType.LARGE) return spot;
        if (vehicle.type === VehicleType.MOTORCYCLE) return spot;
      }
    }
    return null;
  }
}

// ParkingLot Coordinator (Thread-Safe Facade)
export class ParkingLot {
  private floors: ParkingFloor[] = [];
  private activeTickets: Map<string, ParkingTicket> = new Map();

  constructor(
    public readonly id: string,
    private parkingStrategy: IParkingStrategy = new NearestFirstParkingStrategy(),
    private feeStrategy: IFeeStrategy = new HourlyFeeStrategy()
  ) {}

  public addFloor(floor: ParkingFloor): void {
    this.floors.push(floor);
  }

  public parkVehicle(vehicle: Vehicle): ParkingTicket {
    const spot = this.parkingStrategy.findSpot(this.floors, vehicle);
    if (!spot) {
      throw new Error("Parking Lot Full for vehicle type");
    }

    const assigned = spot.assignVehicle(vehicle);
    if (!assigned) throw new Error("Spot acquisition conflict");

    const ticket = new ParkingTicket(
      \`TICKET-\${Date.now()}-\${Math.random().toString(36).substr(2, 4)}\`,
      spot.id,
      spot.floorNumber,
      Date.now(),
      vehicle
    );

    this.activeTickets.set(ticket.ticketId, ticket);
    return ticket;
  }

  public unparkVehicle(ticketId: string): { fee: number; vehicle: Vehicle | null } {
    const ticket = this.activeTickets.get(ticketId);
    if (!ticket) throw new Error("Invalid or expired ticket");

    const fee = this.feeStrategy.calculateFee(ticket, Date.now());
    this.activeTickets.delete(ticketId);
    return { fee, vehicle: ticket.vehicle };
  }
}
`,
  designRationale: `1. Single Responsibility Principle (SRP): ParkingSpot encapsulates occupancy state; ParkingFloor manages spatial spot collections; ParkingLot acts as the high-level coordinator.
2. Open-Closed Principle (OCP): Spot allocation (IParkingStrategy) and Fee computation (IFeeStrategy) are decoupled into strategy interfaces, allowing new pricing or assignment rules without modifying core classes.
3. Dependency Inversion Principle (DIP): ParkingLot depends upon the IParkingStrategy and IFeeStrategy abstractions rather than hardcoded concrete implementations.
4. Concurrency Consideration: Spot allocation state assignment is atomic and fails safely if race conditions occur.`
};

export const FLAWED_PARKING_LOT: SubmissionContent = {
  assumptions: `Parking lot handles cars.`,
  diagramMermaid: `classDiagram
    class ParkingLot {
        -int cars
        +park()
    }`,
  language: 'typescript',
  code: `export class ParkingLot {
  public spots = 100;
  public fee = 50;

  public park(type: string, plate: string) {
    if (this.spots > 0) {
      this.spots--;
      return "Parked " + plate;
    }
    return "Full";
  }

  public unpark(hours: number) {
    this.spots++;
    return hours * this.fee;
  }
}`,
  designRationale: `Put everything into one ParkingLot class for speed.`
};
