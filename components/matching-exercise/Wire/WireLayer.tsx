'use client';
// components/matching-exercise/Wire/WireLayer.tsx
// One full-screen SVG overlay that draws every wire (committed + the in-progress one)
// as a <line> child. A single always-mounted <svg> means the pointer handlers exist
// before any wire does.
import Wire from './Wire';
// TODO: `useState` is unused, and `PointerEvent` only serves the dead handler props below — remove both.
import { useState, type PointerEvent } from 'react';

type Point = { x: number; y: number };

interface WireLayerProps {
    wires: Array<{ startPoint: Point; endPoint: Point; color: string }>;
    currentWire: {startPoint: Point; endPoint: Point; color: string } | null;
}

export default function WireLayer({ wires, currentWire }: WireLayerProps) {
    return (
        <svg
            width="100%"
            height="100%"
            style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: -1 }}>
            {wires.map((wire, index) => (
                <Wire key={index} startPoint={wire.startPoint} endPoint={wire.endPoint} color={wire.color} />
            ))}
            {currentWire && (
                <Wire startPoint={currentWire.startPoint} endPoint={currentWire.endPoint} color={currentWire.color} />
            )}
        </svg>
    );
}
