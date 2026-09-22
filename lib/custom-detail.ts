// A made-to-order cart line carries its brief as "Label: value" lines (see
// CreateFlow's handleSubmit). This turns that back into rows a customer can
// read, dropping the flow's "None" placeholders. Anything not in that shape
// is returned as-is for display as written.

export type DetailRow = { label: string; value: string };

export function parseDetail(detail: string): DetailRow[] | null {
  const rows = detail
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const matches = rows.map((row) => /^([A-Za-z][A-Za-z ]{0,24}):\s*(.*)$/.exec(row));
  if (rows.length < 2 || !matches.every(Boolean)) return null;

  return matches
    .map((m) => ({ label: m![1].trim(), value: m![2].trim() }))
    .filter((r) => r.value && r.value !== 'None' && !(r.label === 'Quantity' && r.value === '1'));
}
