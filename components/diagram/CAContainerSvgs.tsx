import { CA_LAYERS } from '@/lib/ca-data'

type ContainerSvgProps = {
  x: number
  y: number
  width: number
  height: number
  title: string
  fill: string
  stroke: string
}

function splitTitle(title: string) {
  if (title.length <= 18) return [title]

  const words = title.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    if (nextLine.length > 18 && currentLine) {
      lines.push(currentLine)
      currentLine = word
      continue
    }

    currentLine = nextLine
  }

  if (currentLine) lines.push(currentLine)
  return lines
}

function LayerContainerSvg({ x, y, width, height, title, fill, stroke }: ContainerSvgProps) {
  const lines = splitTitle(title)
  const centerY = height / 2
  const lineSpacing = 18
  const firstLineOffset = lines.length > 1 ? -(lineSpacing / 2) * (lines.length - 1) : 0

  return (
    <svg x={x} y={y} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={10}
        ry={10}
        fill={fill}
        stroke={stroke}
        strokeWidth={3}
      />
      <text
        x={width / 2}
        y={centerY + firstLineOffset}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize={18}
        fontWeight={700}
        fontFamily="inherit"
      >
        {lines.map((line, index) => (
          <tspan key={`${title}-${line}-${index}`} x={width / 2} dy={index === 0 ? 0 : lineSpacing}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  )
}

export function createCAContainerSvg() {
  return (
    <svg
      width={1180}
      height={720}
      viewBox="0 0 1180 720"
      role="img"
      aria-label="Clean Architecture container diagram backgrounds"
    >
      <rect x={35} y={20} width={1110} height={660} rx={12} ry={12} fill="#ffffff" stroke="#E7E7E7" strokeWidth={2} />

      <LayerContainerSvg
        x={60}
        y={40}
        width={260}
        height={500}
        title={CA_LAYERS['interface-adapters'].name}
        fill={CA_LAYERS['interface-adapters'].colorHex}
        stroke={CA_LAYERS['interface-adapters'].colorHex}
      />

      <LayerContainerSvg
        x={340}
        y={40}
        width={760}
        height={510}
        title={CA_LAYERS['application-business-rules'].name}
        fill={CA_LAYERS['application-business-rules'].colorHex}
        stroke={CA_LAYERS['application-business-rules'].colorHex}
      />

      <LayerContainerSvg
        x={790}
        y={40}
        width={310}
        height={240}
        title={CA_LAYERS['enterprise-business-rules'].name}
        fill={CA_LAYERS['enterprise-business-rules'].colorHex}
        stroke={CA_LAYERS['enterprise-business-rules'].colorHex}
      />

      <LayerContainerSvg
        x={60}
        y={560}
        width={1040}
        height={100}
        title={CA_LAYERS['frameworks-drivers'].name}
        fill={CA_LAYERS['frameworks-drivers'].colorHex}
        stroke={CA_LAYERS['frameworks-drivers'].colorHex}
      />
    </svg>
  )
}
