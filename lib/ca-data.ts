// lib/ca-data.ts
// ─────────────────────────────────────────────────────────────
// Single source of truth for all Clean Architecture content.
//
// USED BY: CADiagram, ComponentSidebar, ExerciseBoard, ComponentPieces.
// Never hardcode layer names, colors, or descriptions inside a component.
// Always import from here so the data stays consistent site-wide.
// ─────────────────────────────────────────────────────────────

export type LayerId =
  | 'interface-adapters'
  | 'application-business-rules'
  | 'enterprise-business-rules'
  | 'frameworks-drivers'

export interface CALayer {
  id: LayerId
  name: string
  /** CSS custom property value — use as background-color in inline styles or module CSS */
  colorHex: string
  /** Human-readable description shown in tooltips or the sidebar */
  description: string
}

export interface CAComponent {
  id: string
  name: string
  layer: LayerId
  /** Full explanation shown in the sidebar when the component is clicked */
  description: string
  /** IDs of other components this one depends on (solid arrow points away from this component) */
  dependsOn: { id: string; reason: string }[];
    /** IDs of interfaces this component implements (dashed arrow) */
  implements: { id: string; reason: string }[];
}

// ── Layers ───────────────────────────────────────────────────
export const CA_LAYERS: Record<LayerId, CALayer> = {
  'interface-adapters': {
    id: 'interface-adapters',
    name: 'Interface Adapters',
    colorHex: '#3FAE5C', // brand-green
    description:
      'Converts data between the format convenient for use cases and the format convenient for external agencies like databases or the web.',
  },
  'application-business-rules': {
    id: 'application-business-rules',
    name: 'Application Business Rules',
    colorHex: '#E2477C', // brand-pink
    description:
      'Contains the use cases of the application. Orchestrates the flow of data to and from the entities.',
  },
  'enterprise-business-rules': {
    id: 'enterprise-business-rules',
    name: 'Enterprise Business Rules',
    colorHex: '#F5C242', // brand-yellow
    description:
      'The innermost layer. Entities encapsulate the most general and high-level business rules of the enterprise.',
  },
  'frameworks-drivers': {
    id: 'frameworks-drivers',
    name: 'Frameworks & Drivers',
    colorHex: '#207FD4', // brand-blue
    description:
      'The outermost layer. Contains frameworks, tools, databases, and UI. Nothing in this layer should be known by inner layers.',
  },
}

// ── Components ───────────────────────────────────────────────
export const CA_COMPONENTS: CAComponent[] = [
  {
    id: 'view',
    name: 'View',
    layer: 'frameworks-drivers',
    description:
      'Displays audio-visual information such as buttons, graphics, and sound effects. The user interacts directly with the View.',
    dependsOn: [
      { id: 'view-model', reason: 'The View reads display data from the ViewModel, which contains all the information shown to the user. When the ViewModel updates, it alerts the View to re-render.' },
      { id: 'controller', reason: 'The user interacts with the View, which causes the Controller to react. The View depends on the Controller to know what to do with the user input.' },
    ],
    implements: [],
  },
  {
    id: 'data-access',
    name: 'Data Access Object',
    layer: 'frameworks-drivers',
    description:
      'Reads and writes persistent data to a file or database outside the program.',
    dependsOn: [
      { id: 'database', reason: 'Talks directly to the underlying data store to read and write records.' },
    ],
    implements: [
      { id: 'data-access-interface', reason: 'Provides data to and saves information from the Use Case layer. Requires concrete knowledge of how to access the database, a network API, or a file.' },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    layer: 'frameworks-drivers',
    description:
      'The actual data store. An external detail that every inner layer is completely unaware of.',
    dependsOn: [],
    implements: [],
  },
  {
    id: 'controller',
    name: 'Controller',
    layer: 'interface-adapters',
    description:
      'Converts raw user input into usable pieces of data in the format described by the Input ​​Data, then invokes the Use Case Interactor to actually carry out the user request.',
    dependsOn: [
      { id: 'input-data', reason: ' Creates and populates an input data object to pass to the Use Case Interactor.' },
      { id: 'input-boundary', reason: ' Calls its methods to trigger use case logic.' },
    ],
    implements: [],
  },
  {
    id: 'presenter',
    name: 'Presenter',
    layer: 'interface-adapters',
    description:
      'The presenter class receives information (from the Use Case Interactor using the Output Data Object) and puts readable strings and values into the ViewModel to be displayed in the View.',
    dependsOn: [
      { id: 'output-data', reason: 'Receives the Output Data object produced by the Use Case Inand reads its values.' },
      { id: 'view-model', reason: 'Updates the ViewModel with formatted strings and values to be displayed.' },
    ],
    implements: [
      { id: 'output-boundary', reason: 'Fills in the formatting logic defined by the Output Boundary.' },
    ],
  },
  {
    id: 'view-model',
    name: 'View Model',
    layer: 'interface-adapters',
    description:
      'Information that the view will display. Any piece of information displayed by the view isbe stored in the view model.',
    dependsOn: [],
    implements: [],
  },
  {
    id: 'use-case-interactor',
    name: 'Use Case Interactor',
    layer: 'application-business-rules',
    description:
      'Contains the main logic for executing a specific use case. Provides the Input Boundary to specify how to invoke the Use Case Interactor, the InputData to specify the information it needs, the Data Access Interface to specify the persistence API it relies on, the OutputData to specify which method it will call when it is done, and the OutputData to specify the information it is sending back to the user.',
    dependsOn: [
      { id: 'input-data', reason: 'Uses the Input Data to execute the use case.' },
      { id: 'output-boundary', reason: 'Calls methods in this class to push results to the Presenter.' },
      { id: 'output-data', reason: 'Packages the result of the use case into an Output Data object.' },
      { id: 'data-access-interface', reason: 'Uses it to look up or store information in the database.' },
      { id: 'entities', reason: 'Operates on Entities to carry out business logic.' },
    ],
    implements: [
      { id: 'input-boundary', reason: 'Executes what the controller called into.' },
    ],
  },
  {
    id: 'input-boundary',
    name: 'Input Boundary',
    layer: 'application-business-rules',
    description:
      'An interface implemented by a Use Case Interactor that gives a decoupled way for the Controller to execute business logic.',
    dependsOn: [],
    implements: [],
  },
  {
    id: 'input-data',
    name: 'Input Data',
    layer: 'application-business-rules',
    description:
      'Object created by Controller that is passed to the Use Case Interactor and is in the most optimal format for the interactor. ',
    dependsOn: [],
    implements: [],
  },
  {
    id: 'output-boundary',
    name: 'Output Boundary',
    layer: 'application-business-rules',
    description:
      'An interface implemented by a Presenter class that gives the Use Case Interactor a way to send results outwards.',
    dependsOn: [],
    implements: [],
  },
  {
    id: 'output-data',
    name: 'Output Data',
    layer: 'application-business-rules',
    description:
      'Object created by the Use Case Interactor to pass the results of the use case to the Presenter.',
    dependsOn: [],
    implements: [],
  },
  {
    id: 'data-access-interface',
    name: 'Data Access Interface',
    layer: 'application-business-rules',
    description:
      'An interface implemented by the Data Access class that gives the Use Case Interactor a decoupled way to store and retrieve data without knowing anything about the database.',
    dependsOn: [],
    implements: [],
  },
  {
    id: 'entities',
    name: 'Entities',
    layer: 'enterprise-business-rules',
    description:
      'A class that stores information about the building blocks of your program. An example is a car rental app might have classes to represent individual cars (for example, a Car class) and individual renters (a Renter class)',
    dependsOn: [],
    implements: [],
  },
]
