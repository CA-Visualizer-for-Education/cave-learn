'use client';
import Link from 'next/link';

export default function OwnerRepoError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-shell">
      <section className="content-area">
        <h1 className="text-display">Not available</h1>
        <p className="text-body">{error.message}</p>
        <Link href="/testyourrepo">Go back to start a new session</Link>
      </section>
    </main>
  );
}
