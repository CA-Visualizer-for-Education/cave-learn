'use client';

import Wire from './Wire';
import styles from './WireLayer.module.css';

type Point = { x: number; y: number };

interface WireLayerProps {
    wires: Array<{ startPoint: Point; endPoint: Point; color: string }>;
    currentWire: {startPoint: Point; endPoint: Point; color: string } | null;
}

export default function WireLayer({ wires, currentWire }: WireLayerProps) {
    return (
        <svg className={styles['wire-layer']}>
            {wires.map((wire, index) => (
                <Wire key={index} startPoint={wire.startPoint} endPoint={wire.endPoint} color={wire.color} />
            ))}
            {currentWire && (
                <Wire startPoint={currentWire.startPoint} endPoint={currentWire.endPoint} color={currentWire.color} />
            )}
        </svg>
    );
}
