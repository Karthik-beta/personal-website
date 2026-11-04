/** Three short, verifiable statements. Sentences, not big-number tiles. */
export function ProofStrip({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map((item, index) => (
        <li key={index} className="max-w-[30ch] text-lg">
          {item}
        </li>
      ))}
    </ul>
  );
}
