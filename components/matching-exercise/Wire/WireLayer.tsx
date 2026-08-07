'use client';
// components/matching-exercise/Wire/WireLayer.tsx
// One viewport-sized <svg> holding every wire on the board, so all the lines
// share a single coordinate space (see WireLayer.module.css).
import Wire from './Wire';
import type { WireSegment } from '../types';
import styles from './WireLayer.module.css';

/*
wires: the committed connections, already resolved to on-screen coordinates.
currentWire: the wire being dragged right now, or null when the learner is not dragging.
*/
interface WireLayerProps {
    wires: WireSegment[];
    currentWire: WireSegment | null;
}

export default function WireLayer({ wires, currentWire }: WireLayerProps) {
    return (
        <svg className={styles['wire-layer']}>
            {wires.map((wire) => (
                <Wire key={wire.id} startPoint={wire.startPoint} endPoint={wire.endPoint} color={wire.color} />
            ))}
            {currentWire && (
                <Wire startPoint={currentWire.startPoint} endPoint={currentWire.endPoint} color={currentWire.color} />
            )}
        </svg>
    );
}
