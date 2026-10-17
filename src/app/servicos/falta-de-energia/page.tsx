import type { Metadata } from "next";
import { ServicePage } from "@/app/servicos/_components/service-page";

export const metadata: Metadata = { title: "Informar falta de energia" };

export default function Page() {
  return <ServicePage title="Informar falta de energia" />;
}
