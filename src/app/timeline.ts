import { Stage } from './stage';

export class Timeline {
  /**
   * Stages of the simulation
   *
   * Mapped to the position on the timeline
   */
  stages: Stage[] = [];
  /**
   * Program used to generate this timeline
   */
  lines: string
}
