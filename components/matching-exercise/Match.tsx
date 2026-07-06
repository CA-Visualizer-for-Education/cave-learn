'use client';

import { useState } from 'react';
import Wire from './Wire'; 

// component/matching-exercise/Match.tsx — Uses multiple lines
export default function Match() {
    // const [wires, setWires] = useState(Array(13).fill({ dragState: false, startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 }, colour: 'blue' }));

    const [startPoint, setStartPoint] = useState({'x': 0, 'y': 0});
    const [endPoint, setEndPoint] = useState({'x': 0, 'y': 0});
    const [dragState, setDragState] = useState(false);

    const handlePointerDown = (event: { clientX: number; clientY: number; }) => {
        setDragState(true);
        setStartPoint({'x': event.clientX, 'y': event.clientY});
        setEndPoint({'x': event.clientX, 'y': event.clientY});
    }

    const handlePointerMove = (event: { clientX: number; clientY: number; }) => {
        if (dragState) {
            setEndPoint({'x': event.clientX, 'y': event.clientY});
        }
    }

    const handlePointerUp = () => {
        setDragState(false);
    }

    return <>
        {/* {wires.map((wire) => (
            <Wire startPoint={wire.startPoint} endPoint={wire.endPoint} dragState={wire.dragState} colour={wire.colour} />
        ))} */}
        <Wire startPoint={startPoint} endPoint={endPoint} dragState={dragState} handlePointerDown={handlePointerDown} handlePointerMove={handlePointerMove} handlePointerUp={handlePointerUp} colour="blue" />
    </>;
}
