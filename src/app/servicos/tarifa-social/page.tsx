import type { Metadata } from "next";
import { ServicePage } from "@/app/servicos/_components/service-page";

export const metadata: Metadata = { title: "Cadastro de Tarifa Social" };

export default function Page() {
  return <ServicePage title="Cadastro de Tarifa Social" />;
}
