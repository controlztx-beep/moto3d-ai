import type { Motorcycle, Part } from "@/stores/configuratorStore";

export function buildConfiguratorContext(params: {
  motorcycles: Motorcycle[];
  selectedMotorcycleId: string | null;
  parts: Part[];
  equippedParts: string[];
  globalColor: string;
  globalMaterial: string;
  totalPrice: number;
  selectedPartData: Part | null;
  configName?: string;
}): string {
  const lines: string[] = [];

  if (params.configName) {
    lines.push(`Configuration name: ${params.configName}`);
  }

  const moto = params.motorcycles.find(
    (m) => m.id === params.selectedMotorcycleId,
  );
  if (moto) {
    lines.push(
      `Motorcycle: ${moto.brand} ${moto.name} (${moto.model_year})`,
      `Category: ${moto.category}`,
      `Description: ${moto.description}`,
      `Base price: $${moto.base_price.toLocaleString("en-US")}`,
    );
  } else {
    lines.push("Motorcycle: (none selected)");
  }

  lines.push(
    `Paint color: ${params.globalColor}`,
    `Paint material: ${params.globalMaterial}`,
    `Total configured price: $${params.totalPrice.toLocaleString("en-US")}`,
  );

  const equipped = params.equippedParts
    .map((id) => params.parts.find((p) => p.id === id))
    .filter(Boolean) as Part[];

  if (equipped.length === 0) {
    lines.push("Equipped upgrades: none (all stock in this build)");
  } else {
    lines.push("Equipped upgrades:");
    for (const p of equipped) {
      lines.push(
        `  - ${p.name} (${p.category}): $${p.price.toLocaleString("en-US")}`,
      );
    }
  }

  if (params.selectedPartData) {
    const sp = params.selectedPartData;
    lines.push(
      "Currently selected part in UI:",
      `  Name: ${sp.name}`,
      `  Category: ${sp.category}`,
      `  Description: ${sp.description}`,
      `  Price: $${sp.price.toLocaleString("en-US")}`,
      `  Weight: ${sp.weight} kg`,
      `  Material: ${sp.material}`,
      `  Stock/OEM: ${sp.is_stock ? "stock" : "aftermarket"}`,
      `  Specifications JSON: ${JSON.stringify(sp.specifications)}`,
    );
  } else {
    lines.push("Currently selected part: none");
  }

  return lines.join("\n");
}
