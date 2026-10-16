import Link from "next/link";

export function ServicePage({ title }: { title: string }) {
  return (
    <main className="page-container service-page">
      <Link href="/" className="back-link">
        ← Voltar aos serviços
      </Link>
      <h1>{title}</h1>
    </main>
  );
}
