'use client';
// components/matching-exercise/Wire/WireLayer.tsx
// One full-screen SVG overlay that draws every wire (committed + the in-progress one)
// as a <line> child. A single always-mounted <svg> means the pointer handlers exist
// before any wire does.
import Wire from './Wire';
import { useState, type PointerEvent } from 'react';

type Point = { x: number; y: number };

interface WireLayerProps {
    wires: Array<{ startPoint: Point; endPoint: Point; colour: string }>;
}

export default function WireLayer({ wires }: WireLayerProps) {
    // startPoint === null means "no drag in progress"; a non-null value is the drag origin.
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [endPoint, setEndPoint] = useState<Point>({ x: 0, y: 0 });
    const [dragState, setDragState] = useState<boolean>(false);

    const handlePointerDown = (event: PointerEvent<SVGSVGElement>): void => {
        console.log("down dog");
        event.preventDefault();
        setDragState(true);
        setStartPoint({ x: event.clientX, y: event.clientY });
        setEndPoint({ x: event.clientX, y: event.clientY });
    }

    const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
        event.preventDefault();
        if (dragState) {
            setEndPoint({ x: event.clientX, y: event.clientY });
        }
    }

    const handlePointerUp = () => {
        setDragState(false);
    }

    return (
        <svg
            width="100%"
            height="100%"
            style={{ position: 'fixed', top: 0, left: 0 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {wires.map((wire, index) => (
                <Wire key={index} startPoint={wire.startPoint} endPoint={wire.endPoint} colour={wire.colour} />
            ))}
            {startPoint !== null && (
                <Wire startPoint={startPoint} endPoint={endPoint} colour="blue" />
            )}
        </svg>
    );
}
