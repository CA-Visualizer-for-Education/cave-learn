// components/matching-exercise/Wire/Wire.tsx
// A single wire line. Rendered as a child of WireLayer's shared <svg>.
type Point = { x: number; y: number };

interface WireProps {
    startPoint: Point;
    endPoint: Point;
    colour: string;
}

export default function Wire({ startPoint, endPoint, colour }: WireProps) {
    return (
        <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke={colour}
            strokeWidth="4"
        />
    );
}
