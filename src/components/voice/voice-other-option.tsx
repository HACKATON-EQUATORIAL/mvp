/** Saída sempre disponível quando nenhuma opção serve: pede outras palavras. */
export function OtherOption({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="voice-link" onClick={onClick}>
      Nada disso
    </button>
  );
}
