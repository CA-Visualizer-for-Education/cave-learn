// app/testyourrepo/page.tsx — Repository Testing Page (route: /testyourrepo)

'use client';
import { UrlInput } from '@/components/testyourrepo/UrlInput';

export default function TestYourRepoPage() {
  // Subtract height of header
  return (
    <main className="page-shell">
      <section className="content-area">
        <h1 className="text-display">Test Your Repository</h1>
        <p className="text-body">
          Paste your Github repository link below to see whether your repository
          follows Clean Architecture.
        </p>
        <UrlInput />
      </section>
    </main>
  );
}
