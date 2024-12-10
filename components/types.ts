export interface Task {
  id: number;
  name: string;
  estimates: Record<number, number>;
}

export interface TeamMember {
  id: number;
  name: string;
}

export interface AnimalPoint {
  points: number;
  animal: string;
  emoji: string;
  description: string;
  timeEstimate: string;
}