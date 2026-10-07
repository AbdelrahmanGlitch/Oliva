type Props = {
  className?: string;
  /** show the "Kitchen & Home Furniture" descriptor under the wordmark */
  descriptor?: boolean;
  title?: string;
};

/**
 * SVG redraw of OLIVA's wordmark: a high-contrast serif where the V and A share a stroke
 * and a long hairline crossbar runs through both (see research/assets/logo).
 */
export function OlivaLogo({ className, descriptor = false, title = "OLIVA" }: Props) {
  return (
    <span className={`inline-flex flex-col items-center ${className ?? ""}`}>
      <svg viewBox="0 0 336 100" role="img" aria-label={title} className="block h-full w-auto" fill="currentColor">
        {/* O */}
        <path
          fillRule="evenodd"
          d="M4 50a38 40 0 1 0 76 0a38 40 0 1 0-76 0ZM11.5 50a30.5 38.8 0 1 0 61 0a30.5 38.8 0 1 0-61 0Z"
        />
        {/* L */}
        <rect x="98" y="10" width="7" height="80" />
        <rect x="92" y="10" width="19" height="1.3" />
        <rect x="92" y="88.7" width="58" height="1.3" />
        <rect x="148.7" y="77" width="1.3" height="13" />
        {/* I */}
        <rect x="170" y="10" width="7" height="80" />
        <rect x="164" y="10" width="19" height="1.3" />
        <rect x="164" y="88.7" width="19" height="1.3" />
        {/* V + A sharing one stroke */}
        <polygon points="196,10 206,10 242.6,90 239.6,90" />
        <polygon points="239.6,90 241.4,90 282.2,10 280.4,10" />
        <polygon points="280.4,10 283,10 327,90 317.5,90" />
        <rect x="189" y="10" width="24" height="1.3" />
        <rect x="309" y="88.7" width="26" height="1.3" />
        {/* long hairline crossbar */}
        <rect x="221" y="60" width="88" height="1.3" />
      </svg>
      {descriptor && (
        <span className="mt-[0.5em] block whitespace-nowrap font-display text-[0.5em] tracking-[0.42em] uppercase leading-none">
          Kitchen &amp; Home Furniture
        </span>
      )}
    </span>
  );
}
