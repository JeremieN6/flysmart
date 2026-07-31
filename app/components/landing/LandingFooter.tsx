export default function LandingFooter() {
  return (
    <footer
      className="py-10 px-6"
      style={{ borderTop: "1px solid rgba(186,199,226,0.08)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
            <div>
              <span className="font-display text-2xl font-semibold" style={{ color: "var(--amber)" }}>Fly<span style={{ color: "var(--cream)" }}>Smart</span></span><p className="text-xs mt-2 max-w-xs" style={{ color: "var(--steel)" }}>La solution pour les coordinateurs de déplacements professionnels en PME.</p></div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm" style={{ color: "var(--steel)" }}><a href="#problemes" className="hover:opacity-80 transition-opacity">Problemes</a><a href="#pricing" className="hover:opacity-80 transition-opacity">Tarifs</a><a className="hover:opacity-80 transition-opacity" href="/tarifs">Page tarifs</a><a href="#faq" className="hover:opacity-80 transition-opacity">FAQ</a><a href="#contact-demo" className="hover:opacity-80 transition-opacity">Demander une démo</a><a className="hover:opacity-80 transition-opacity" href="/analyse">Auditer un deplacement</a></div>
        </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs" style={{ borderTop: "1px solid rgba(107, 127, 168, 0.08)", color: "var(--steel)" }}><span>© 2026 FlySmart — La solution pour les deplacements pro en PME</span><span>Les economies affichees sont indicatives.</span></div>
      </div>
    </footer>
  );
}
