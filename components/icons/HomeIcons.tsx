import type { SVGProps } from "react";

/** Small star icon for promos and home accents. */
export function IconStars(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 2.5 13.8 8.1h5.9l-4.8 3.5 1.8 5.6L12 15.8 7.3 17.2l1.8-5.6L4.3 8.1h5.9L12 2.5z" />
    </svg>
  );
}
