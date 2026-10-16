import Link from "next/link";
import { APP_NAME } from "@/config/app";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-container">
        <Link href="/">{APP_NAME}</Link>
      </div>
    </header>
  );
}
