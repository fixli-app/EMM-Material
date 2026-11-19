import { beforeEach, describe, expect, it } from "vitest";
import { loadComparedMaterials, saveComparedMaterials } from "@/lib/materialStorage";
import { applications, materials, motorDesignerApplications, propertyLabels, somaloyMaterialFamilies } from "@/data/materials";

describe("datasheet-backed Somaloy catalogue", () => {
  it("contains every selectable density variant in the supplied datasheet", () => {
    const documentedMaterials = materials.filter((material) => material.datasheet);

    expect(documentedMaterials).toHaveLength(28);
    expect(documentedMaterials.map((material) => material.id).sort()).toEqual([
      "somaloy-1000-3p",
      "somaloy-1000-3p-742",
      "somaloy-1000-5p",
      "somaloy-1000-5p-740",
      "somaloy-110i-1p",
      "somaloy-110i-1p-710",
      "somaloy-110i-5p",
      "somaloy-110i-5p-714",
      "somaloy-130i-1p",
      "somaloy-130i-1p-722",
      "somaloy-130i-5p",
      "somaloy-130i-5p-730",
      "somaloy-500-1p",
      "somaloy-500-1p-722",
      "somaloy-700-1p",
      "somaloy-700-1p-739",
      "somaloy-700-3p",
      "somaloy-700-3p-740",
      "somaloy-700-7p-73",
      "somaloy-700-7p-74a",
      "somaloy-700-7p-74b",
      "somaloy-700-7p-75",
      "somaloy-700hr-1p",
      "somaloy-700hr-1p-735",
      "somaloy-700hr-3p",
      "somaloy-700hr-3p-740",
      "somaloy-700hr-5p",
      "somaloy-700hr-5p-740",
    ]);
    expect(materials.filter((material) => material.category.includes("7P")).map((material) => material.id))
      .toEqual([
        "somaloy-700-7p-73",
        "somaloy-700-7p-74a",
        "somaloy-700-7p-75",
        "somaloy-700-7p-74b",
      ]);
  });

  it("groups density options under one grade and keeps tall-part 7P separate", () => {
    const sevenP = somaloyMaterialFamilies.find((family) => family.name === "Somaloy 700 7P");
    const standard7001P = materials.find((material) => material.id === "somaloy-700-1p-739");
    const tallParts = sevenP?.variants.find((material) => material.datasheet?.variantLabel === "Tall parts");

    expect(somaloyMaterialFamilies).toHaveLength(13);
    expect(sevenP?.variants.map((material) => material.datasheet?.densityGPerCm3)).toEqual([7.5, 7.4, 7.4, 7.3]);
    expect(tallParts?.datasheet?.additives).toBe("0.5% 7P Lube");
    expect(standard7001P?.datasheet?.densityGPerCm3).toBe(7.39);
    expect(standard7001P?.specifications?.["B@10kA/m"]).toBe("1.5 T");
    expect(standard7001P?.specifications?.["Core loss 1T/100Hz"]).toBe("10 W/kg");
  });

  it("exposes one TRS specification for every coated grade", () => {
    materials.filter((material) => material.datasheet).forEach((material) => {
      const record = material.datasheet!;
      const trs = record.mechanical.transverseRuptureStrengthAmbientMPa
        ?? record.mechanical.transverseRuptureStrengthAt150CMPa;

      expect(material.specifications?.["TRS"]).toBe(`${trs} MPa`);
      expect(material.specifications).not.toHaveProperty("TRS ambient");
      expect(material.specifications).not.toHaveProperty("TRS at 150°C");
    });
  });

  it("keeps key magnetic and loss measurements exact for every additional density", () => {
    const expected = [
      ["somaloy-700-1p-739", 7.39, 47, 1.50, 540, 270, 10, 135],
      ["somaloy-700hr-1p-735", 7.35, 34, 1.45, 450, 900, 11, 136],
      ["somaloy-700-3p-740", 7.40, 130, 1.55, 780, 150, 11, 143],
      ["somaloy-700hr-3p-740", 7.40, 130, 1.53, 660, 300, 11, 140],
      ["somaloy-1000-3p-742", 7.42, 140, 1.57, 900, 55, 11, undefined],
      ["somaloy-700hr-5p-740", 7.40, 60, 1.52, 600, 600, 6.8, 99],
      ["somaloy-1000-5p-740", 7.40, 65, 1.53, 700, 80, 6.8, undefined],
      ["somaloy-130i-1p-722", 7.22, 41, 1.30, 270, 5900, 13, 143],
      ["somaloy-500-1p-722", 7.22, 55, 1.43, 550, 50, 13, 174],
      ["somaloy-130i-5p-730", 7.30, 40, 1.41, 340, 17000, 8.3, 101],
      ["somaloy-110i-1p-710", 7.10, 50, 1.23, 210, 3100, 15, 161],
      ["somaloy-110i-5p-714", 7.14, 44, 1.25, 210, 6000, 10, 111],
      ["somaloy-700-7p-73", 7.30, 55, 1.44, 420, undefined, 7.2, 94],
      ["somaloy-700-7p-74a", 7.40, 60, 1.50, 440, undefined, 6.8, 89],
      ["somaloy-700-7p-74b", 7.40, 60, 1.49, 420, undefined, 6.8, 89],
    ] as const;

    expected.forEach(([id, density, trs, b10, mumax, resistivity, loss100, loss1000]) => {
      const record = materials.find((material) => material.id === id)?.datasheet;
      expect(record?.densityGPerCm3).toBe(density);
      expect(record?.mechanical.transverseRuptureStrengthAt150CMPa).toBe(trs);
      expect(materials.find((material) => material.id === id)?.specifications?.["TRS"]).toBe(`${trs} MPa`);
      expect(materials.find((material) => material.id === id)?.specifications).not.toHaveProperty("TRS ambient");
      expect(materials.find((material) => material.id === id)?.specifications).not.toHaveProperty("TRS at 150°C");
      expect(record?.magnetic.bAt10000AmT).toBe(b10);
      expect(record?.magnetic.maximumRelativePermeability).toBe(mumax);
      expect(record?.physical.resistivityMicroOhmM).toBe(resistivity);
      expect(record?.coreLossAt1T.find((row) => row.frequencyHz === 100)?.wattsPerKg).toBe(loss100);
      expect(record?.coreLossAt1T.find((row) => row.frequencyHz === 1000)?.wattsPerKg).toBe(loss1000);
    });
  });

  it("keeps exact sourced values and omits measurements absent from the datasheet", () => {
    const grade = materials.find((material) => material.id === "somaloy-700hr-3p");
    const sevenP = materials.find((material) => material.id === "somaloy-700-7p-75");
    const highStrength = materials.find((material) => material.id === "somaloy-1000-3p");
    const somaloy1000FiveP740 = materials.find((material) => material.id === "somaloy-1000-5p-740");

    expect(grade?.name).toBe("Somaloy 700HR 3P 7.52 g/cm³");
    expect(grade?.datasheet?.densityGPerCm3).toBe(7.52);
    expect(grade?.datasheet?.magnetic.maximumRelativePermeability).toBe(770);
    expect(grade?.specifications?.["TRS"]).toBe("120 MPa");
    expect(grade?.datasheet?.physical.resistivityMicroOhmM).toBe(600);
    expect(highStrength?.specifications?.["Core loss 1T/1kHz"]).toBe("143 W/kg");
    expect(highStrength?.specifications?.["Core loss 1T/1kHz (15×15 mm cross-section)"]).toBe("288 W/kg");
    expect(somaloy1000FiveP740?.datasheet?.mechanical.tensileStrengthMPa).toBe(25);
    expect(somaloy1000FiveP740?.datasheet?.mechanical.tensileYieldStrengthMPa).toBe(25);
    expect(somaloy1000FiveP740?.specifications?.["Tensile strength/yield strength"]).toBe("25/25 MPa");
    expect(sevenP?.datasheet?.physical).not.toHaveProperty("resistivityMicroOhmM");
    expect(sevenP?.scoreProperties).not.toHaveProperty("resistivity");
    expect(sevenP?.scoreProperties?.saturationInduction).toBe(73);
    expect(highStrength?.scoreProperties?.saturationInduction).toBe(100);
    expect(sevenP?.description).toBe(
      "Somaloy 700 7P at 7.50 g/cm³: core loss @1T/100Hz 6.5 W/kg; core loss @1T/1kHz 84 W/kg.",
    );
    expect(sevenP?.description).not.toContain("resistivity");
    expect(grade?.description).toContain("TRS 120 MPa");
    expect(grade?.description).toContain("B @10kA/m 1.57 T");
    expect(sevenP?.properties).not.toHaveProperty("thermalResistance");
    expect(sevenP?.properties).not.toHaveProperty("costEfficiency");
    expect(sevenP?.properties).not.toHaveProperty("sustainability");
    expect(sevenP?.specifications).not.toHaveProperty("Resistivity");
    expect(propertyLabels).not.toHaveProperty("thermalResistance");
    expect(propertyLabels).not.toHaveProperty("costEfficiency");
    expect(propertyLabels).not.toHaveProperty("sustainability");
  });

  it("matches the portfolio density, magnetic, resistivity, TRS, and core-loss values for every grade", () => {
    const expected = [
      ["somaloy-700-1p", 7.45, 40, 1.56, 540, 400, 9.9, 126, 152],
      ["somaloy-700hr-1p", 7.45, 35, 1.53, 440, 1000, 10, 125, 136],
      ["somaloy-700-3p", 7.57, 125, 1.61, 850, 200, 10, 132, 183, 10.2],
      ["somaloy-700hr-3p", 7.52, 120, 1.57, 770, 600, 10, 130, 147, 10.4],
      ["somaloy-1000-3p", 7.56, 140, 1.63, 950, 70, 10, 143, 288, 10.3],
      ["somaloy-700hr-5p", 7.5, 60, 1.57, 600, 700, 6.6, 92, 106],
      ["somaloy-1000-5p", 7.52, 65, 1.59, 720, 90, 6.6, 103, 217],
      ["somaloy-130i-1p", 7.35, 33, 1.4, 290, 8000, 12, 132, 134],
      ["somaloy-500-1p", 7.37, 50, 1.51, 500, 70, 13, 156, 305, 12.6],
      ["somaloy-130i-5p", 7.44, 35, 1.47, 350, 20000, 8, 93, 94],
      ["somaloy-700-7p-75", 7.5, 60, 1.55, 500, undefined, 6.5, 84, undefined],
      ["somaloy-110i-1p", 7.26, 34, 1.33, 220, 7600, 14, 153, 155, 14.4],
      ["somaloy-110i-5p", 7.3, 42, 1.33, 220, 18000, 9.9, 108, 109],
    ] as const;

    expected.forEach(([id, density, trs, b10, mumax, resistivity, loss100, loss1000, loss15x15, portfolioLoss100]) => {
      const material = materials.find((item) => item.id === id);
      const record = material?.datasheet;
      expect(record).toBeDefined();
      expect(record?.densityGPerCm3).toBe(density);
      expect(record?.mechanical.transverseRuptureStrengthAt150CMPa).toBe(trs);
      expect(record?.magnetic.bAt10000AmT).toBe(b10);
      expect(record?.magnetic.maximumRelativePermeability).toBe(mumax);
      expect(record?.physical.resistivityMicroOhmM).toBe(resistivity);
      expect(record?.coreLossAt1T.find((row) => row.frequencyHz === 100)?.wattsPerKg).toBe(loss100);
      expect(record?.coreLossAt1T.find((row) => row.frequencyHz === 1000)?.wattsPerKg).toBe(loss1000);
      expect(record?.coreLossAt1T15x15mmAt1kHz).toBe(loss15x15);
      expect(material?.specifications?.["Portfolio core loss 1T/100Hz (page 4)"])
        .toBe(portfolioLoss100 === undefined ? undefined : `${portfolioLoss100} W/kg`);
    });
  });

  it("matches each grade's documented process parameters", () => {
    const expected = [
      ["somaloy-700-1p", "0.4% Kenolube", "#40", 800, "Room temperature", "Air", 530],
      ["somaloy-700hr-1p", "0.4% Kenolube", "#40", 800, "Room temperature", "Air", 530],
      ["somaloy-700-3p", "0.3% 3P Lube", "#40", 800, "80°C", "Steam", 530],
      ["somaloy-700hr-3p", "0.3% 3P Lube", "#40", 800, "80°C", "Steam", 530],
      ["somaloy-1000-3p", "0.3% 3P Lube", "#40", 800, "80°C", "Steam", 530],
      ["somaloy-700hr-5p", "0.3% 5P Lube", "#40", 800, "100°C", "Nitrogen", 650],
      ["somaloy-1000-5p", "0.3% 5P Lube", "#40", 800, "100°C", "Nitrogen", 650],
      ["somaloy-130i-1p", "0.5% Kenolube", "#100", 800, "Room temperature", "Air", 530],
      ["somaloy-500-1p", "0.5% Kenolube", "#100", 800, "Room temperature", "Air", 500],
      ["somaloy-130i-5p", "0.3% 5P Lube", "#100", 800, "80°C", "Nitrogen", 650],
      ["somaloy-700-7p-75", "0.3% 7P Lube", "#80", undefined, "100°C", "99% N₂ + 1% O₂", 620],
      ["somaloy-110i-1p", "0.5% Kenolube", "#200", 800, "Room temperature", "Air", 530],
      ["somaloy-110i-5p", "0.4% 5P Lube", "#200", 800, "60°C", "Nitrogen", 650],
    ] as const;

    expected.forEach(([id, additives, particleSize, pressure, dieTemperature, atmosphere, treatmentTemperature]) => {
      const record = materials.find((material) => material.id === id)?.datasheet;
      expect(record?.additives).toBe(additives);
      expect(record?.particleSizeClass).toBe(particleSize);
      expect(record?.compactionPressureMPa).toBe(pressure);
      expect(record?.dieTemperature).toBe(dieTemperature);
      expect(record?.heatTreatmentAtmosphere).toBe(atmosphere);
      expect(record?.heatTreatmentTemperatureC).toBe(treatmentTemperature);
    });
  });

  it("preserves the four non-Somaloy catalogue records", () => {
    const ironMaterials = materials.filter((material) => material.brand === "Iron");
    expect(ironMaterials.map((material) => material.id).sort()).toEqual([
      "abc-phosphorus",
      "asc100-iron",
      "fe65si",
      "pasc-phosphorus",
    ]);
    expect(ironMaterials.find((material) => material.id === "fe65si")?.properties?.thermalResistance).toBe(75);
    expect(ironMaterials.find((material) => material.id === "pasc-phosphorus")?.properties?.costEfficiency).toBe(75);
  });

  it("keeps curated motor recommendations aligned with current products", () => {
    const productIds = new Set(materials.map((material) => material.id));
    const findApplication = (id: string) => {
      const application = motorDesignerApplications.find((item) => item.id === id);
      expect(application).toBeDefined();
      return application!;
    };

    motorDesignerApplications.forEach((application) => {
      expect(application.recommendedMaterialIds.every((id) => productIds.has(id))).toBe(true);
      expect(application.recommendedMaterialIds.slice().sort()).toEqual(application.recommendedGroups.flat().slice().sort());
      expect(application.recommendedLabels.length).toBe(application.recommendedGroups.length);
    });
    expect(applications.every((application) => application.recommendedMaterials.every((id) => productIds.has(id)))).toBe(true);

    expect(findApplication("light-mobility").recommendedMaterialIds).toContain("somaloy-1000-3p");
    expect(findApplication("electric-pumps").recommendedMaterialIds).toContain("somaloy-700-1p");
    expect(findApplication("electric-pumps").recommendedMaterialIds).not.toContain("somaloy-700hr-5p");
    expect(findApplication("electric-pumps").recommendedMaterialIds).not.toContain("somaloy-700hr-3p");
    expect(findApplication("robotics-compact").recommendedMaterialIds).toContain("somaloy-1000-3p");
    expect(findApplication("drones").recommendedMaterialIds).toContain("somaloy-1000-3p");
    expect(findApplication("solenoids-actuators").recommendedMaterialIds).not.toContain("somaloy-1000-3p");
  });
});

describe("compare-list storage migration", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
        clear: () => values.clear(),
      },
    });
  });

  it("hydrates saved density variants by ID and drops unavailable variants", () => {
    window.localStorage.setItem("hoganas-compare", JSON.stringify([
      { id: "somaloy-700-7p-73", name: "old variant", properties: { thermalResistance: 99 } },
      { id: "somaloy-700-7p-75", name: "stale copy", properties: { thermalResistance: 99 } },
    ]));

    const restored = loadComparedMaterials();
    expect(restored.map((material) => material.id)).toEqual(["somaloy-700-7p-73", "somaloy-700-7p-75"]);
    expect(restored[0].name).toBe("Somaloy 700 7P 7.30 g/cm³");
    expect(restored[0].datasheet?.densityGPerCm3).toBe(7.3);
    expect(restored[0].specifications).not.toHaveProperty("Thermal Resistance");
  });

  it("stores current selections as stable IDs", () => {
    const grade = materials.find((material) => material.id === "somaloy-700hr-3p");
    saveComparedMaterials([grade!]);
    expect(JSON.parse(window.localStorage.getItem("hoganas-compare") || "[]")).toEqual(["somaloy-700hr-3p"]);
  });
});
