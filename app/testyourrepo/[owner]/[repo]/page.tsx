import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/testyourrepo/Dashboard';
import { hasRepository } from '@/lib/repo-registry';

export default async function OwnerRepoPage(
  props: PageProps<'/testyourrepo/[owner]/[repo]'>
) {
  const { owner, repo } = await props.params;
  if (!hasRepository(owner, repo)) {
    notFound();
  }
  return (
    <main className="page-shell">
      <section className="content-area">
        <div className="text-display">
          {repo} by {owner}
        </div>
        <p className="text-body">
          Check if your project follows clean architecture!
        </p>
        <Dashboard owner={owner} repo={repo} />
      </section>
    </main>
  );
}
