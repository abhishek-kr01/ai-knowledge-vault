import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="page">
      <header className="topbar">
        <Link href="/" className="brand">
          AI Knowledge Vault
        </Link>
        <Link href="/new" className="button button-secondary">
          New Note
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
}
