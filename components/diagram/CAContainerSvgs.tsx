import type { ReactNode } from 'react'
import { CA_LAYERS } from '@/lib/ca-data'

type ContainerSvgProps = {
  children: ReactNode
  stroke: string
}

type LayerLabelProps = {
  x: number
  y: number
  title: string
  maxLineLength?: number
  textAnchor?: 'start' | 'middle'
}

function splitTitle(title: string, maxLineLength = 24) {
  if (title.length <= maxLineLength) return [title]

  const words = title.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    if (nextLine.length > maxLineLength && currentLine) {
      lines.push(currentLine)
      currentLine = word
      continue
    }

    currentLine = nextLine
  }

  if (currentLine) lines.push(currentLine)
  return lines
}

function LayerContainerSvg({ children, stroke }: ContainerSvgProps) {
  return (
    <g fill={stroke} fillOpacity={0.18} stroke={stroke} strokeWidth={1.5}>
      {children}
    </g>
  )
}

function LayerLabel({ x, y, title, maxLineLength, textAnchor = 'start' }: LayerLabelProps) {
  const lines = splitTitle(title, maxLineLength)
  const lineSpacing = 24

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="#1A1A1F"
      fontSize={20}
      fontWeight={700}
      fontFamily="var(--font-sans)"
      aria-label={title}
    >
      {lines.map((line, index) => (
        <tspan key={`${title}-${line}-${index}`} x={x} dy={index === 0 ? 0 : lineSpacing}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

export function createCAContainerSvg() {
  return (
    <svg
      width={894}
      height={553}
      viewBox="0 0 894 553"
      role="img"
      aria-label="Clean Architecture container diagram backgrounds"
    >
      <rect width={880} height={540} fill="#ffffff" />

      <LayerContainerSvg
        stroke={CA_LAYERS['interface-adapters'].colorHex}
      >
        <rect x={33} y={31} width={209.241} height={379.208} rx={8} ry={8} />
      </LayerContainerSvg>

      <LayerContainerSvg
        stroke={CA_LAYERS['application-business-rules'].colorHex}
      >
        <path d="M252.205 38C252.205 34.134 255.339 31 259.205 31H603.904C607.77 31 610.904 34.134 610.904 38V223.583C610.904 227.449 614.038 230.583 617.904 230.583H853C856.866 230.583 860 233.717 860 237.583V403.208C860 407.074 856.866 410.208 853 410.208H259.205C255.339 410.208 252.205 407.074 252.205 403.208V38Z" />
      </LayerContainerSvg>

      <LayerContainerSvg
        stroke={CA_LAYERS['enterprise-business-rules'].colorHex}
      >
        <rect x={620.867} y={31} width={239.133} height={189.604} rx={8} ry={8} />
      </LayerContainerSvg>

      <LayerContainerSvg
        stroke={CA_LAYERS['frameworks-drivers'].colorHex}
      >
        <rect x={33} y={420.188} width={827} height={89.812} rx={8} ry={8} />
      </LayerContainerSvg>

      <LayerLabel x={55} y={90} title={CA_LAYERS['interface-adapters'].name} />
      <LayerLabel x={280} y={90} title={CA_LAYERS['application-business-rules'].name} maxLineLength={32} />
      <LayerLabel x={640} y={90} title={CA_LAYERS['enterprise-business-rules'].name} maxLineLength={20} />
      <LayerLabel x={446.5} y={470} title={CA_LAYERS['frameworks-drivers'].name} textAnchor="middle" />
    </svg>
  )
}
