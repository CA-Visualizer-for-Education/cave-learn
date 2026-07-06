'use client';

import type { PointerEvent } from 'react';

interface WireProps {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    dragState: boolean;
    handlePointerDown: (event: PointerEvent<SVGSVGElement>) => void;
    handlePointerMove: (event: PointerEvent<SVGSVGElement>) => void;
    handlePointerUp: () => void;
    colour: string;
}

// component/matching-exercise/Wire.tsx — Wire component for connect the definition to the description
export default function Wire({ startPoint, endPoint, dragState, handlePointerDown, handlePointerMove, handlePointerUp, colour }: WireProps) {
    // const [startPoint, setStartPoint] = useState({'x': 0, 'y': 0});
    // const [endPoint, setEndPoint] = useState({'x': 0, 'y': 0});
    // const [dragState, setDragState] = useState(false);

    // const handlePointerDown = (event: { clientX: number; clientY: number; }) => {
    //     setDragState(true);
    //     setStartPoint({'x': event.clientX, 'y': event.clientY});
    //     setEndPoint({'x': event.clientX, 'y': event.clientY});
    // }

    // const handlePointerMove = (event: { clientX: number; clientY: number; }) => {
    //     if (dragState) {
    //         setEndPoint({'x': event.clientX, 'y': event.clientY});
    //     }
    // }

    // const handlePointerUp = () => {
    //     setDragState(false);
    // }

    return <>
        <svg width="100vw" height="100vh" style={{ border: '1px solid #ccc' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}>
            <line
                x1={startPoint.x}
                y1={startPoint.y}
                x2={endPoint.x}
                y2={endPoint.y}
                stroke={colour}
                strokeWidth="4"
            />
        </svg>
    </>;
}
