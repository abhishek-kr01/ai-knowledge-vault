export default function StatusBadge({ status }) {
  const normalized = status || "processing";
  const className = `status-badge status-${normalized}`;
  return <span className={className}>{normalized}</span>;
}
