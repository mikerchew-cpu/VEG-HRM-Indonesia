export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[var(--card)] border border-[var(--card-border)] rounded-[var(--radius-md)] p-5 ${className}`}
    >
      {children}
    </div>
  );
}
