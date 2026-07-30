function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatStorageSize(kb: number): string {
  if (kb < 1024) return `${round(kb, kb < 10 ? 1 : 0)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${round(mb, mb < 10 ? 2 : 1)} MB`;

  const gb = mb / 1024;
  return `${round(gb, 2)} GB`;
}
