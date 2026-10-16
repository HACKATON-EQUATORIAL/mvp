import { AudioRecorder } from "@/app/_components/audio-recorder";
import { ServiceList } from "@/app/_components/service-list";

export default function Home() {
  return (
    <main className="page-container home-page">
      <h1>Como podemos ajudar?</h1>
      <p className="intro">Escolha um serviço ou grave um áudio.</p>
      <ServiceList />
      <AudioRecorder />
      <p className="test-notice">Ambiente de teste</p>
    </main>
  );
}
