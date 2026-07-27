'use client'

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

type Direction = 'left' | 'right' | 'up' | 'down';

type PathSegment = {
  direction: Direction;
  length: number;
};

interface ManhattanArrowProps {
  start: {
    x: number;
    y: number;
  };
  path: PathSegment[];
  type: 'dependency' | 'implements'
  rotation: 0 | 90 | 180 | 270; 
}

export default function ManhattanArrow({ start, path, type, rotation }: ManhattanArrowProps) {
  let x = start.x;
  let y = start.y;
  let d = '';

  d += `M ${x} ${y} `;

  for (const { direction, length } of path) {
    if (direction === 'left') {
      x -= length;
    } else if (direction === 'right') {
      x += length;
    } else if (direction === 'up') {
      y -= length;
    } else if (direction === 'down') {
      y += length;
    }

    d+= `L ${x} ${y} `;
  }

  console.log(d);

  return (
    <svg 
      width={1000}
      height={700}
      viewBox="0 0 1000 700"
      style={{
        overflow: 'visible',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        border: '1px solid transparent', // for debugging
      }}
    >
      <path
        d={d}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <foreignObject
        x={x - 10}
        y={y - 10}
        width={20}
        height={20}
      >
        { type === "dependency" ? 
          <PlayArrowIcon
            style={{
              width: '20px',
              height: '20px',
              color: 'black',
              transform: `rotate(${rotation}deg)`,
            }}
          />
          :
          <PlayArrowOutlinedIcon
            style={{
              width: '20px',
              height: '20px',
              color: 'black',
              transform: `rotate(${rotation}deg)`,
            }}
          />
        }
      </foreignObject>
    </svg> 
  )
}