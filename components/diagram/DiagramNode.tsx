import styles from "./DiagramNode.module.css";

interface DiagramNodeProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

enum NodeCategory {
  InterfaceAdapters = "Interface Adapters",
  ApplicationBusinessRules = "Application Business Rules",
  EnterpriseBusinessRules = "Enterprise Business Rules",
  FrameworksAndDrivers = "Frameworks & Drivers",
}

const titleToCategory: Record<string, NodeCategory> = {
  controller: NodeCategory.InterfaceAdapters,
  presenter: NodeCategory.InterfaceAdapters,
  "view model": NodeCategory.InterfaceAdapters,
  "input data": NodeCategory.ApplicationBusinessRules,
  "input boundary": NodeCategory.ApplicationBusinessRules,
  "use case interactor": NodeCategory.ApplicationBusinessRules,
  "output data": NodeCategory.ApplicationBusinessRules,
  "output boundary": NodeCategory.ApplicationBusinessRules,
  "data access interface": NodeCategory.ApplicationBusinessRules,
  entities: NodeCategory.EnterpriseBusinessRules,
  view: NodeCategory.FrameworksAndDrivers,
  "data access object": NodeCategory.FrameworksAndDrivers,
  database: NodeCategory.FrameworksAndDrivers,
};

const categoryToClassName: Record<NodeCategory, string> = {
  [NodeCategory.InterfaceAdapters]: styles.interfaceAdapters,
  [NodeCategory.ApplicationBusinessRules]: styles.applicationBusinessRules,
  [NodeCategory.EnterpriseBusinessRules]: styles.enterpriseBusinessRules,
  [NodeCategory.FrameworksAndDrivers]: styles.frameworksAndDrivers,
};

const categoryToSelectedClassName: Record<NodeCategory, string> = {
  [NodeCategory.InterfaceAdapters]: styles.selectedInterfaceAdapters,
  [NodeCategory.ApplicationBusinessRules]:
    styles.selectedApplicationBusinessRules,
  [NodeCategory.EnterpriseBusinessRules]:
    styles.selectedEnterpriseBusinessRules,
  [NodeCategory.FrameworksAndDrivers]: styles.selectedFrameworksAndDrivers,
};

const NODE_WIDTH = 160;
const NODE_HEIGHT = 33;
const SHADOW_PADDING = 8;

export const DiagramNode = ({
  label,
  isSelected,
  onClick,
}: DiagramNodeProps) => {
  const category = titleToCategory[label.toLowerCase()];
  if (!category) throw new Error(`DiagramNode: unknown label: "${label}"`);

  return (
    <svg
      width={NODE_WIDTH + SHADOW_PADDING * 2}
      height={NODE_HEIGHT + SHADOW_PADDING * 2}
      onClick={onClick}
      className={`${styles.node} ${categoryToClassName[category]} ${categoryToSelectedClassName[category]}`}
    >
      <rect
        x={SHADOW_PADDING}
        y={SHADOW_PADDING}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx="5"
        ry="5"
        className={`${styles.nodeRect} ${isSelected ? styles.selected : ""}`}
      />
      <text
        x={NODE_WIDTH / 2 + SHADOW_PADDING}
        y={NODE_HEIGHT / 2 + SHADOW_PADDING}
        textAnchor="middle"
        dominantBaseline="middle"
        className={`text-mono ${styles.nodeLabel}`}
      >
        {label}
      </text>
    </svg>
  );
};
