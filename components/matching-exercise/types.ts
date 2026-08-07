// components/matching-exercise/types.ts
// Shared shapes for the matching exercise. These were duplicated across
// MatchingComponentBoard, WireLayer and Wire; they live here so the board,
// the SVG layer and the owning page all agree on one definition.

/** A viewport-space coordinate, as produced by getBoundingClientRect / pointer events. */
export type Point = { x: number; y: number };

/** Which column of the board a piece belongs to. */
export type Side = 'component' | 'description';

/** One end of a wire: the piece it is attached to, and which column that piece is in. */
export type Anchor = { side: Side; id: string };

/** A connection the learner has drawn, stored by piece id rather than by position. */
export type Wire = { componentId: string; descriptionId: string };

/** A wire resolved to on-screen coordinates, ready to be drawn as an SVG line. */
export type WireSegment = { id: string; startPoint: Point; endPoint: Point; color: string };
