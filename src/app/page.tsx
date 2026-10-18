import type { Metadata } from "next";
import { TrackSelection } from "./_components/track-selection";

export const metadata: Metadata = { title: "Escolha um serviço" };

export default function Home() {
  return <TrackSelection />;
}
