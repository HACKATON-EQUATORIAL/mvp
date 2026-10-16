import Link from "next/link";
import { services } from "@/app/_lib/services";

export function ServiceList() {
  return (
    <nav aria-label="Serviços" className="service-list">
      {services.map((service) => (
        <Link key={service.slug} href={`/servicos/${service.slug}`}>
          <span>{service.title}</span>
          <span className="chevron" aria-hidden="true">
            ›
          </span>
        </Link>
      ))}
    </nav>
  );
}
