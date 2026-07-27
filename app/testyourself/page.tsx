import { ActivityCard } from "@/components/testyourself/ActivityCard";
import { TypeBadge } from "@/components/testyourself/TypeBadge";

export default function TestYourselfPage() {
  return <main className="page-shell">
    <div
      style={{ padding: "var(--space-8) var(--space-10)" }}
      className="content-area"
    >
      <h1 className="text-display">Test Yourself</h1>
      <p
        style={{ maxWidth: "70%", marginBottom: "var(--space-6)" }}
        className="text-body"
      >
        Use interactive activities to put your knowledge of clean architecture to the test. <br/>
        Choose from different activity types to test what your really stuck on.
      </p>
      <section style={{display: "flex"}}>
        <TypeBadge type="DRAG AND DROP" />
        <TypeBadge type="MATCHING" />
        <TypeBadge type="QUIZ" />
        <TypeBadge type="MULTIPLE CHOICE" />
      </section>
    </div>
    <section className="content-area">
      <ActivityCard exercise="Fill in the diagram"/>
      <ActivityCard exercise=""/>
      <ActivityCard exercise=""/>
    </section>
  </main>
}
