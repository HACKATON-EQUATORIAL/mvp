import type { Metadata } from "next";
import { ServicePage } from "@/app/servicos/_components/service-page";

export const metadata: Metadata = { title: "Consultar débitos" };

export default function Page() {
  return <ServicePage title="Consultar débitos" />;
}
