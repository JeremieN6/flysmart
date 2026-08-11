/*
  Mention unique pour tous les blocs maquettes de la page.

  Elle existait en trois formulations et trois styles differents. Un seul
  composant garantit qu elles restent identiques, et qu aucun bloc
  d illustration ne finisse par en perdre une au fil des retouches.
*/
export default function IllustrationNote({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-xs leading-relaxed ${className}`}
      style={{ color: "var(--steel)" }}
    >
      Aperçu produit — données d&apos;illustration.
      {children ? <> {children}</> : null}
    </p>
  );
}
