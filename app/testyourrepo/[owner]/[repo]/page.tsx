import { Dashboard } from '@/components/testyourrepo/Dashboard';
import { getRepositoryPort } from '@/lib/repo-registry';

export default async function OwnerRepoPage(
  props: PageProps<'/testyourrepo/[owner]/[repo]'>
) {
  const { owner, repo } = await props.params;
  const port = getRepositoryPort(owner, repo);
  return (
    <main className="page-shell">
      <section className="content-area">
        <div className="text-display">
          {repo} by {owner}
        </div>
        <p className="text-body">
          Check if your project follows clean architecture!
        </p>
        <Dashboard port={port} />
      </section>
    </main>
  );
}
