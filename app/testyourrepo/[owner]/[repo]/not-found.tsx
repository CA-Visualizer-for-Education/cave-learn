import Link from 'next/link';

export default function OwnerRepoNotFound() {
  return (
    <main className="page-shell">
      <section className="content-area">
        <h1 className="text-display">Not available</h1>
        <p className="text-body">
          This repository hasn't been analyzed yet, or its session was cleaned up
          after a few hours of inactivity.
        </p>
        <Link href="/testyourrepo">Go back to start a new session</Link>
      </section>
    </main>
  );
}
