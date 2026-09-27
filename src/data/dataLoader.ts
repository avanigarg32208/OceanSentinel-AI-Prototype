export interface PrototypeData {
  ais: Record<string, string>[];
  vessels: Record<string, string>[];
  spills: Record<string, string>[];
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",");

    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });

    return row;
  });
}

async function loadCSV(path: string) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  const text = await response.text();

  return parseCSV(text);
}

export async function loadAllData(): Promise<PrototypeData> {
  const [ais, vessels, spills] = await Promise.all([
    loadCSV("/data/ais.csv"),
    loadCSV("/data/vessels.csv"),
    loadCSV("/data/spills.csv"),
  ]);

  return {
    ais,
    vessels,
    spills,
  };
}