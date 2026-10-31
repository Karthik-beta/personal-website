/** Below 360px the header can't fit the word next to Resume, so only screen readers get it. */
export function MenuLabel() {
  return <span className="max-[360px]:sr-only">Menu</span>;
}
