import { ActivityCard } from "@/components/testyourself/ActivityCard";
import { TypeBadge } from "@/components/testyourself/TypeBadge";
import styles from "./page.module.css";

export default function TestYourselfPage() {
  return <main className="page-shell">
    <div className={`content-area ${styles.intro}`}>
      <h1 className="text-display">Test Yourself</h1>
      <p className={`text-body ${styles.description}`}>
        Use interactive activities to put your knowledge of clean architecture to the test. <br/>
        Choose from different activity types to test what your really stuck on.
      </p>
      <section className={styles.typeBadges}>
        <TypeBadge type="DRAG AND DROP" />
        <TypeBadge type="MATCHING" />
        <TypeBadge type="QUIZ" />
        <TypeBadge type="MULTIPLE CHOICE" />
      </section>
    </div>
    <section className={`content-area ${styles.cardList}`}>
      <ActivityCard exercise="Fill in the diagram"/>
      <ActivityCard exercise=""/>
      <ActivityCard exercise=""/>
    </section>
  </main>
}
