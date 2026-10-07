export interface MaterialProperty {
  name: string;
  value: number;
  unit?: string;
  rawValue?: string;
}

export interface Material {
  id: string;
  name: string;
  brand: "Somaloy" | "Iron";
  category: string;
  description: string;
  benefits: string[];
  applications: string[];
  industries: string[];
  technologyAreas: string[];
  properties: {
    permeability: number;
    coreLossLow: number;
    coreLossHigh: number;
    saturationInduction: number;
    resistivity: number;
    transverseRuptureStrength: number;
    compressibility: number;
    densityAchievable: number;
    thermalResistance: number;
    costEfficiency: number;
    sustainability: number;
  };
  alloyComposition: string;
  process: string[];
  dataSheetUrl?: string;
  isRe?: boolean;
  temperatureRange?: string;
  typicalDensity?: string;
  particleSize?: string;
  specifications?: Record<string, string>;
}

export interface TechnologyArea {
  id: string;
  name: string;
  description: string;
  subAreas: string[];
  relevantProperties: (keyof Material["properties"])[];
}

export interface Application {
  id: string;
  name: string;
  description: string;
  industries: string[];
  technologyAreas: string[];
  requiredProperties: (keyof Material["properties"])[];
  recommendedMaterials: string[];
  challengeScenarios: ChallengeScenario[];
}

export interface ChallengeScenario {
  id: string;
  name: string;
  description: string;
  propertyBoosts: Partial<Record<keyof Material["properties"], number>>;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
}

export const technologyAreas: TechnologyArea[] = [
  {
    id: "soft-magnetics",
    name: "Soft Magnetic Composites",
    description: "Somaloy® technology for electric motors, inductors and transformers with 3D magnetic flux.",
    subAreas: ["Electric motors", "Inductors", "Transformers", "Axial flux machines", "Sensors", "Solenoids"],
    relevantProperties: ["permeability", "coreLossLow", "coreLossHigh", "saturationInduction", "resistivity", "transverseRuptureStrength", "thermalResistance", "costEfficiency"],
  },
];

export const industries: Industry[] = [
  { id: "automotive", name: "Automotive & EV", description: "Traction motors, AC compressors, pumps, DC/DC converters and on-vehicle chargers." },
  { id: "industrial", name: "Industrial", description: "Industrial motor drives, AC compressors, ventilation fans and off-board battery charging." },
  { id: "energy", name: "Energy & Renewables", description: "Solar inverters, wind power generators and energy conversion systems." },
  { id: "electronics", name: "Electronics & Power", description: "Inductors, EMI filters, DC/DC converters and power supplies." },
];

export const applications: Application[] = [
  {
    id: "traction-motors",
    name: "Traction Motors",
    description: "High-performance SMC cores for electric vehicle traction motors — axial and radial flux designs for maximum torque density and efficiency.",
    industries: ["automotive"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["saturationInduction", "coreLossLow", "coreLossHigh", "permeability", "transverseRuptureStrength"],
    recommendedMaterials: ["somaloy-700-7p-75", "somaloy-700-7p-74a", "somaloy-1000-3p", "somaloy-700-3p", "somaloy-1000-5p", "somaloy-700hr-5p"],
    challengeScenarios: [
      { id: "axial-flux-ev", name: "Axial flux design", description: "Compact 3D flux path for high power density", propertyBoosts: { saturationInduction: 20, permeability: 15, densityAchievable: 10 } },
      { id: "thermal-challenge", name: "High thermal load", description: "Sustained high-power operation", propertyBoosts: { thermalResistance: 20, transverseRuptureStrength: 15 } },
    ],
  },
  {
    id: "ac-compressors",
    name: "AC Compressor Motors",
    description: "SMC motor cores for air conditioning compressors in automotive and industrial HVAC systems — compact, efficient and vibration-free.",
    industries: ["automotive", "industrial"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "coreLossHigh", "saturationInduction", "compressibility"],
    recommendedMaterials: ["somaloy-700-3p", "somaloy-1000-3p", "somaloy-700hr-5p", "somaloy-700-1p"],
    challengeScenarios: [
      { id: "noise-reduction", name: "Low noise / vibration", description: "Smooth operation in cabin or indoor environments", propertyBoosts: { compressibility: 15, densityAchievable: 10 } },
    ],
  },
  {
    id: "pumps",
    name: "Pumps (Cooling, Oil, Water)",
    description: "SMC cores for electric pumps in automotive cooling, oil and water circulation systems. Compact 3D designs reduce size and weight.",
    industries: ["automotive", "industrial"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "saturationInduction", "costEfficiency", "coreLossLow"],
    recommendedMaterials: ["somaloy-700-1p", "somaloy-500-1p", "somaloy-700-3p", "somaloy-700hr-1p"],
    challengeScenarios: [
      { id: "cost-optimized", name: "Cost-optimized design", description: "High-volume production with competitive cost", propertyBoosts: { costEfficiency: 25, compressibility: 10 } },
    ],
  },
  {
    id: "dc-dc-converters",
    name: "DC/DC Converters & On-Board Chargers",
    description: "SMC magnetic cores for DC/DC converters and on-board/off-board chargers — high-frequency operation with minimal losses.",
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["coreLossHigh", "resistivity", "permeability", "saturationInduction"],
    recommendedMaterials: ["somaloy-130i-5p", "somaloy-110i-5p", "somaloy-130i-1p", "somaloy-110i-1p"],
    challengeScenarios: [
      { id: "high-switching", name: "High switching frequency", description: "Operation above 10 kHz", propertyBoosts: { coreLossHigh: 30, resistivity: 20 } },
    ],
  },
  {
    id: "industrial-drives",
    name: "Industrial Motor Drives",
    description: "SMC stator and rotor cores for industrial servo motors, variable-speed drives and automation systems.",
    industries: ["industrial"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "coreLossLow", "coreLossHigh", "saturationInduction", "transverseRuptureStrength"],
    recommendedMaterials: ["somaloy-700-7p-75", "somaloy-700-7p-74a", "somaloy-1000-3p", "somaloy-700-3p", "somaloy-700hr-5p", "somaloy-1000-5p"],
    challengeScenarios: [
      { id: "high-torque", name: "High torque density", description: "Maximum flux for compact motor design", propertyBoosts: { saturationInduction: 20, densityAchievable: 15 } },
    ],
  },
  {
    id: "ventilation-fans",
    name: "Ventilation Fans & Blowers",
    description: "SMC motor cores for HVAC ventilation fans, blowers and air handling units. Energy-efficient designs for continuous operation.",
    industries: ["industrial"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "coreLossLow", "costEfficiency", "saturationInduction"],
    recommendedMaterials: ["somaloy-700-1p", "somaloy-500-1p", "somaloy-700-3p", "somaloy-700hr-1p"],
    challengeScenarios: [
      { id: "energy-efficiency", name: "Maximum efficiency", description: "IE4/IE5 efficiency class motors", propertyBoosts: { coreLossLow: 20, permeability: 15 } },
    ],
  },
  {
    id: "solar-power",
    name: "Solar Inverters & Renewables",
    description: "SMC cores for solar inverter inductors, wind power generators and energy conversion systems requiring high efficiency.",
    industries: ["energy"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["coreLossHigh", "resistivity", "permeability", "saturationInduction"],
    recommendedMaterials: ["somaloy-130i-5p", "somaloy-110i-5p", "somaloy-700hr-5p", "somaloy-1000-5p"],
    challengeScenarios: [
      { id: "compact-design", name: "Compact design", description: "Maximize power density in limited space", propertyBoosts: { saturationInduction: 25, densityAchievable: 15 } },
    ],
  },
  {
    id: "inductors",
    name: "Inductors & Transformers",
    description: "SMC materials for power inductors, chokes and transformers with high energy density and low losses at medium-to-high frequencies.",
    industries: ["electronics", "energy"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "coreLossHigh", "saturationInduction", "resistivity"],
    recommendedMaterials: ["somaloy-130i-5p", "somaloy-110i-5p", "somaloy-700hr-5p", "somaloy-1000-5p"],
    challengeScenarios: [
      { id: "dc-bias", name: "High DC bias", description: "Maintain permeability under DC pre-magnetization", propertyBoosts: { permeability: 20, saturationInduction: 15 } },
      { id: "emi-filter", name: "EMI filtering", description: "Broad frequency suppression", propertyBoosts: { coreLossHigh: 20, resistivity: 15 } },
    ],
  },
  {
    id: "sensors-solenoids",
    name: "Sensors & Solenoids",
    description: "SMC components for magnetic sensors, solenoids and actuators — 3D flux capability enables innovative designs.",
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "saturationInduction", "costEfficiency"],
    recommendedMaterials: ["somaloy-700-1p", "somaloy-130i-1p", "somaloy-500-1p"],
    challengeScenarios: [
      { id: "fast-response", name: "Fast response", description: "Quick magnetic switching for actuators", propertyBoosts: { resistivity: 20, coreLossHigh: 15 } },
    ],
  },
];

const defaultProps = (): Material["properties"] => ({
  permeability: 0, coreLossLow: 0, coreLossHigh: 0,
  saturationInduction: 0, resistivity: 0, transverseRuptureStrength: 0,
  compressibility: 0, densityAchievable: 0,
  thermalResistance: 0, costEfficiency: 0, sustainability: 0,
});

// ============ MATERIALS ============
// All data from official Höganäs datasheets (800 MPa compaction, IEC 60404)
// Normalized property scores 0–100 based on Somaloy portfolio range

export const materials: Material[] = [
  // =============================================
  // COATED SOMALOY — 7P (Next generation, water-based coating, lowest losses)
  // Somaloy 700 7P is offered in several density variants. The achievable
  // density (7Pn) is the key differentiator — each density gives a different
  // balance of magnetic strength, losses and mechanical robustness.
  // =============================================

  // --- Somaloy 700 7P — 7.30 g/cm³ (0.3% 7P Lube) ---
  {
    id: "somaloy-700-7p-73",
    name: "Somaloy 700 7P 7.30 g/cm³",
    brand: "Somaloy",
    category: "Coated SMC — 7P",
    description: "Next-generation Somaloy 700 7P at 7.30 g/cm³ density (0.3% 7P Lube). Innovative water-based coating delivering the lowest core losses in the Somaloy range. This lower-density variant maximises die-fill and formability for complex geometries. Heat treated in N₂ + 1% O₂ at 620°C.",
    benefits: ["Water-based sustainable coating", "Lowest core losses in Somaloy range", "Excellent thermal conductivity (42 W/m·K)", "Good formability for complex parts"],
    applications: ["High-efficiency electric motors", "Axial flux machines", "Traction motors", "Generators"],
    industries: ["automotive", "industrial", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 46,        // μmax 420
      coreLossLow: 90,         // 7.2 W/kg @1T/100Hz
      coreLossHigh: 91,        // 94 W/kg @1T/1kHz
      saturationInduction: 66, // 1.44 T @10kA/m
      resistivity: 55,
      transverseRuptureStrength: 44, // 55 MPa (up to 120 with curing)
      compressibility: 85,
      densityAchievable: 71,   // 7.30 g/cm³
      thermalResistance: 76,   // HT 620°C
      costEfficiency: 55,
      sustainability: 90,
    },
    alloyComposition: "Iron powder · 7P water-based insulating coating · 0.3% 7P Lube",
    process: ["Compaction at 100°C die (die-wall lubrication)", "Heat treatment in N₂ + 1% O₂ at 620°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_7p-material-data_3786hog.pdf",
    temperatureRange: "HT 620°C (N₂ + 1% O₂)",
    typicalDensity: "7.30 g/cm³",
    particleSize: "Somaloy 700 base powder",
    specifications: {
      "Density": "7.30 g/cm³",
      "μmax": "420",
      "B@4kA/m": "1.16 T",
      "B@10kA/m": "1.44 T",
      "Hc": "137 A/m",
      "TRS": "55 MPa",
      "Thermal conductivity": "42 W/m·K",
      "Core loss 1T/100Hz": "7.2 W/kg",
      "Core loss 1T/400Hz": "32 W/kg",
      "Core loss 1T/1kHz": "94 W/kg",
    },
  },

  // --- Somaloy 700 7P — 7.40 g/cm³ (A) (0.3–0.4% 7P Lube) ---
  {
    id: "somaloy-700-7p-74a",
    name: "Somaloy 700 7P 7.40 g/cm³ (A)",
    brand: "Somaloy",
    category: "Coated SMC — 7P",
    description: "Next-generation Somaloy 700 7P at 7.40 g/cm³ density (0.3–0.4% 7P Lube). Balanced variant combining high permeability and saturation with the low losses of the water-based 7P coating. Ideal all-round grade for efficient electric motors. Heat treated in N₂ + 1% O₂ at 620°C.",
    benefits: ["Balanced magnetics and losses", "Water-based sustainable coating", "High saturation (1.50 T)", "Robust mechanical strength (60 MPa)"],
    applications: ["Traction motors", "Industrial motor drives", "Axial flux machines", "AC compressor motors"],
    industries: ["automotive", "industrial", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 50,        // μmax 440
      coreLossLow: 93,         // 6.8 W/kg @1T/100Hz
      coreLossHigh: 93,        // 89 W/kg @1T/1kHz
      saturationInduction: 76, // 1.50 T @10kA/m
      resistivity: 55,
      transverseRuptureStrength: 48, // 60 MPa (up to 120 with curing)
      compressibility: 88,
      densityAchievable: 79,   // 7.40 g/cm³
      thermalResistance: 76,   // HT 620°C
      costEfficiency: 55,
      sustainability: 90,
    },
    alloyComposition: "Iron powder · 7P water-based insulating coating · 0.3–0.4% 7P Lube",
    process: ["Compaction at 100°C die (die-wall lubrication)", "Heat treatment in N₂ + 1% O₂ at 620°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_7p-material-data_3786hog.pdf",
    temperatureRange: "HT 620°C (N₂ + 1% O₂)",
    typicalDensity: "7.40 g/cm³",
    particleSize: "Somaloy 700 base powder",
    specifications: {
      "Density": "7.40 g/cm³",
      "μmax": "440",
      "B@4kA/m": "1.22 T",
      "B@10kA/m": "1.50 T",
      "Hc": "137 A/m",
      "TRS": "60 MPa",
      "Thermal conductivity": "37 W/m·K",
      "Core loss 1T/100Hz": "6.8 W/kg",
      "Core loss 1T/400Hz": "30 W/kg",
      "Core loss 1T/1kHz": "89 W/kg",
    },
  },

  // --- Somaloy 700 7P — 7.50 g/cm³ (0.3% 7P Lube) ---
  {
    id: "somaloy-700-7p-75",
    name: "Somaloy 700 7P 7.50 g/cm³",
    brand: "Somaloy",
    category: "Coated SMC — 7P",
    description: "Next-generation Somaloy 700 7P at 7.50 g/cm³ density (0.3% 7P Lube). Highest density variant delivering the highest permeability (μmax 500) and saturation (1.55 T) with the lowest losses of the 7P family. Best choice for maximum torque density in electric machines. Heat treated in N₂ + 1% O₂ at 620°C.",
    benefits: ["Highest μmax in 7P range (500)", "Highest saturation (1.55 T)", "Lowest losses of the 7P family", "Water-based sustainable coating"],
    applications: ["Traction motors", "High-torque industrial drives", "Axial flux machines", "Generators"],
    industries: ["automotive", "industrial", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 55,        // μmax 500
      coreLossLow: 95,         // 6.5 W/kg @1T/100Hz
      coreLossHigh: 95,        // 84 W/kg @1T/1kHz
      saturationInduction: 85, // 1.55 T @10kA/m
      resistivity: 55,
      transverseRuptureStrength: 48, // 60 MPa (up to 120 with curing)
      compressibility: 88,
      densityAchievable: 88,   // 7.50 g/cm³
      thermalResistance: 76,   // HT 620°C
      costEfficiency: 55,
      sustainability: 90,
    },
    alloyComposition: "Iron powder · 7P water-based insulating coating · 0.3% 7P Lube",
    process: ["Compaction at 100°C die (die-wall lubrication)", "Heat treatment in N₂ + 1% O₂ at 620°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_7p-material-data_3786hog.pdf",
    temperatureRange: "HT 620°C (N₂ + 1% O₂)",
    typicalDensity: "7.50 g/cm³",
    particleSize: "Somaloy 700 base powder",
    specifications: {
      "Density": "7.50 g/cm³",
      "μmax": "500",
      "B@4kA/m": "1.27 T",
      "B@10kA/m": "1.55 T",
      "Hc": "135 A/m",
      "TRS": "60 MPa",
      "Thermal conductivity": "35 W/m·K",
      "Core loss 1T/100Hz": "6.5 W/kg",
      "Core loss 1T/400Hz": "29 W/kg",
      "Core loss 1T/1kHz": "84 W/kg",
    },
  },

  // --- Somaloy 700 7P — 7.40 g/cm³ (B) (0.5% 7P Lube) ---
  {
    id: "somaloy-700-7p-74b",
    name: "Somaloy 700 7P 7.40 g/cm³ (B)",
    brand: "Somaloy",
    category: "Coated SMC — 7P",
    description: "Next-generation Somaloy 700 7P at 7.40 g/cm³ density with higher lubricant content (0.5% 7P Lube). The extra lubrication eases compaction of demanding geometries while retaining the low losses and water-based coating of the 7P family. Heat treated in N₂ + 1% O₂ at 620°C.",
    benefits: ["Higher lube for easier compaction", "Water-based sustainable coating", "Low core losses", "Robust mechanical strength (60 MPa)"],
    applications: ["Complex motor cores", "Traction motors", "Industrial motor drives", "Axial flux machines"],
    industries: ["automotive", "industrial", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 46,        // μmax 420
      coreLossLow: 93,         // 6.8 W/kg @1T/100Hz
      coreLossHigh: 93,        // 89 W/kg @1T/1kHz
      saturationInduction: 75, // 1.49 T @10kA/m
      resistivity: 55,
      transverseRuptureStrength: 48, // 60 MPa (up to 120 with curing)
      compressibility: 88,
      densityAchievable: 79,   // 7.40 g/cm³
      thermalResistance: 76,   // HT 620°C
      costEfficiency: 55,
      sustainability: 90,
    },
    alloyComposition: "Iron powder · 7P water-based insulating coating · 0.5% 7P Lube",
    process: ["Compaction at 100°C die (die-wall lubrication)", "Heat treatment in N₂ + 1% O₂ at 620°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_7p-material-data_3786hog.pdf",
    temperatureRange: "HT 620°C (N₂ + 1% O₂)",
    typicalDensity: "7.40 g/cm³",
    particleSize: "Somaloy 700 base powder",
    specifications: {
      "Density": "7.40 g/cm³",
      "μmax": "420",
      "B@4kA/m": "1.19 T",
      "B@10kA/m": "1.49 T",
      "Hc": "136 A/m",
      "TRS": "60 MPa",
      "Thermal conductivity": "37 W/m·K",
      "Core loss 1T/100Hz": "6.8 W/kg",
      "Core loss 1T/400Hz": "30 W/kg",
      "Core loss 1T/1kHz": "89 W/kg",
    },
  },

  // =============================================
  // COATED SOMALOY — 5P (Lowest core losses)
  // =============================================

  // --- Somaloy 700HR 5P — Large particles #40, highest resistivity in 5P ---
  {
    id: "somaloy-700hr-5p",
    name: "Somaloy 700HR 5P",
    brand: "Somaloy",
    category: "Coated SMC — 5P",
    description: "Somaloy 700HR with 5P treatment — lowest core losses in the large particle segment. High resistivity variant (HR) for minimised eddy current losses. Inert atmosphere HT at max 650°C.",
    benefits: ["Lowest core losses in #40 segment", "High resistivity (700 μΩm)", "3D isotropic magnetic flux", "Net-shape manufacturing"],
    applications: ["High-efficiency motors", "Axial flux machines", "Generators", "Inductors"],
    industries: ["automotive", "energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 65,       // μmax 600
      coreLossLow: 95,        // 6.6 W/kg @1T/100Hz — best
      coreLossHigh: 92,       // 92 W/kg @1T/1kHz — best in #40
      saturationInduction: 88, // 1.57 T
      resistivity: 58,        // 700 μΩm
      transverseRuptureStrength: 48, // 60 MPa
      compressibility: 88,
      densityAchievable: 88,  // 7.50 g/cm³
      thermalResistance: 80,  // HT 650°C
      costEfficiency: 58,
      sustainability: 75,
    },
    alloyComposition: "Iron powder · 5P insulating coating · Lube 5P (0.3–0.4%)",
    process: ["Compaction 600–800 MPa (heated die)", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf",
    temperatureRange: "HT max 650°C (N₂ atmosphere)",
    typicalDensity: "7.50 g/cm³ @800 MPa",
    particleSize: "#40 mesh (large particles)",
    specifications: {
      "Density": "7.50 g/cm³",
      "μmax": "600",
      "B@10kA/m": "1.57 T",
      "Hc": "120 A/m",
      "Resistivity": "700 μΩm",
      "TRS": "60 MPa",
      "Core loss 1T/100Hz": "6.6 W/kg",
      "Core loss 1T/400Hz": "30 W/kg",
      "Core loss 1T/1kHz": "92 W/kg",
      "Core loss 1T/2kHz": "241 W/kg",
    },
  },

  // --- Somaloy 1000 5P — Large particles #40, highest μmax in 5P ---
  {
    id: "somaloy-1000-5p",
    name: "Somaloy 1000 5P",
    brand: "Somaloy",
    category: "Coated SMC — 5P",
    description: "Somaloy 1000 with 5P treatment — highest permeability among 5P grades. Excellent for motors where magnetic flux density and low losses are both critical.",
    benefits: ["Highest μmax in 5P range (720)", "Low core losses", "High saturation induction", "Excellent for motor design"],
    applications: ["Electric motors", "EV traction motors", "High-performance generators", "Axial flux machines"],
    industries: ["automotive", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 75,       // μmax 720
      coreLossLow: 95,        // 6.6 W/kg @1T/100Hz — tied best
      coreLossHigh: 85,       // 103 W/kg @1T/1kHz
      saturationInduction: 90, // 1.59 T
      resistivity: 25,        // 90 μΩm
      transverseRuptureStrength: 52, // 65 MPa
      compressibility: 88,
      densityAchievable: 88,  // 7.52 g/cm³
      thermalResistance: 80,
      costEfficiency: 55,
      sustainability: 75,
    },
    alloyComposition: "Iron powder · 5P insulating coating · Lube 5P (0.3–0.4%)",
    process: ["Compaction 600–800 MPa (heated die)", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf",
    temperatureRange: "HT max 650°C (N₂ atmosphere)",
    typicalDensity: "7.52 g/cm³ @800 MPa",
    particleSize: "#40 mesh (large particles)",
    specifications: {
      "Density": "7.52 g/cm³",
      "μmax": "720",
      "B@10kA/m": "1.59 T",
      "Hc": "124 A/m",
      "Resistivity": "90 μΩm",
      "TRS": "65 MPa",
      "Tensile strength": "20 MPa",
      "Core loss 1T/100Hz": "6.6 W/kg",
      "Core loss 1T/400Hz": "31 W/kg",
      "Core loss 1T/1kHz": "103 W/kg",
    },
  },

  // --- Somaloy 130i 5P — Medium particles #100, high Bsat + high resistivity ---
  {
    id: "somaloy-130i-5p",
    name: "Somaloy 130i 5P",
    brand: "Somaloy",
    category: "Coated SMC — 5P",
    description: "Somaloy 130i with 5P treatment — very high resistivity (20 000 μΩm) and good saturation. Optimized for medium-frequency applications requiring low eddy current losses.",
    benefits: ["Very high resistivity (20 000 μΩm)", "Good Bsat for #100 powder", "Low high-frequency losses", "Suitable for >1 kHz"],
    applications: ["Power inductors", "High-frequency motors", "EMI filters", "DC/DC converters"],
    industries: ["electronics", "energy", "automotive"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 42,       // μmax 350
      coreLossLow: 88,        // 8.0 W/kg @1T/100Hz
      coreLossHigh: 91,       // 93 W/kg @1T/1kHz
      saturationInduction: 72, // 1.47 T
      resistivity: 95,        // 20 000 μΩm — highest
      transverseRuptureStrength: 30, // 35 MPa
      compressibility: 82,
      densityAchievable: 82,  // 7.44 g/cm³
      thermalResistance: 80,
      costEfficiency: 55,
      sustainability: 72,
    },
    alloyComposition: "Iron powder · 5P organic insulation · Lube 5P (0.3–0.4%)",
    process: ["Compaction 600–800 MPa (heated die)", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf",
    temperatureRange: "HT max 650°C (N₂ atmosphere)",
    typicalDensity: "7.44 g/cm³ @800 MPa",
    particleSize: "#100 mesh (medium particles)",
    specifications: {
      "Density": "7.44 g/cm³",
      "μmax": "350",
      "B@10kA/m": "1.47 T",
      "Hc": "153 A/m",
      "Resistivity": "20 000 μΩm",
      "TRS": "35 MPa",
      "Tensile strength": "15 MPa",
      "Core loss 1T/100Hz": "8.0 W/kg",
      "Core loss 1T/1kHz": "93 W/kg",
      "Core loss 0.5T/5kHz": "205 W/kg",
      "Core loss 0.1T/10kHz": "24 W/kg",
    },
  },

  // --- Somaloy 110i 5P — Fine particles #200, lowest high-freq losses ---
  {
    id: "somaloy-110i-5p",
    name: "Somaloy 110i 5P",
    brand: "Somaloy",
    category: "Coated SMC — 5P",
    description: "Somaloy 110i with 5P treatment — finest particle size (#200) for lowest high-frequency losses. Extremely high resistivity (18 000 μΩm). Ideal for high-frequency inductors and EMI filtering.",
    benefits: ["Lowest high-freq losses in range", "Very high resistivity (18 000 μΩm)", "Fine particle size for HF", "Excellent for >5 kHz"],
    applications: ["High-frequency inductors", "EMI filters", "Current transformers", "Compact power supplies"],
    industries: ["electronics", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 28,       // μmax 220
      coreLossLow: 78,        // 9.9 W/kg @1T/100Hz
      coreLossHigh: 82,       // 108 W/kg @1T/1kHz
      saturationInduction: 48, // 1.33 T
      resistivity: 93,        // 18 000 μΩm
      transverseRuptureStrength: 38, // 42 MPa
      compressibility: 75,
      densityAchievable: 72,  // 7.30 g/cm³
      thermalResistance: 80,
      costEfficiency: 52,
      sustainability: 72,
    },
    alloyComposition: "Iron powder · 5P thin-film insulation · Lube 5P (0.3–0.4%)",
    process: ["Compaction 600–800 MPa (heated die)", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf",
    temperatureRange: "HT max 650°C (N₂ atmosphere)",
    typicalDensity: "7.30 g/cm³ @800 MPa",
    particleSize: "#200 mesh (fine particles)",
    specifications: {
      "Density": "7.30 g/cm³",
      "μmax": "220",
      "B@10kA/m": "1.33 T",
      "Hc": "207 A/m",
      "Resistivity": "18 000 μΩm",
      "TRS": "42 MPa",
      "Tensile strength": "25 MPa",
      "Core loss 1T/100Hz": "9.9 W/kg",
      "Core loss 1T/1kHz": "108 W/kg",
      "Core loss 0.5T/5kHz": "209 W/kg",
      "Core loss 0.1T/10kHz": "18 W/kg",
    },
  },

  // =============================================
  // COATED SOMALOY — 3P (Highest mechanical strength)
  // =============================================

  // --- Somaloy 700HR 3P — #40, high TRS + high resistivity ---
  {
    id: "somaloy-700hr-3p",
    name: "Somaloy 700HR 3P",
    brand: "Somaloy",
    category: "Coated SMC — 3P",
    description: "Somaloy 700HR with 3P treatment — combines high mechanical strength (TRS 120 MPa) with high resistivity (HR variant). Steam treatment at max 530°C.",
    benefits: ["High TRS (120 MPa)", "High resistivity (600 μΩm)", "Steam treatment compatible", "Robust component design"],
    applications: ["Structural motor stators", "EV traction motors", "Generators", "High-stress magnetic parts"],
    industries: ["automotive", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 80,       // μmax 770
      coreLossLow: 76,        // 10.4 W/kg @1T/100Hz
      coreLossHigh: 67,       // 130 W/kg @1T/1kHz
      saturationInduction: 88, // 1.57 T
      resistivity: 55,        // 600 μΩm
      transverseRuptureStrength: 85, // 120 MPa
      compressibility: 88,
      densityAchievable: 88,  // 7.52 g/cm³
      thermalResistance: 65,
      costEfficiency: 62,
      sustainability: 74,
    },
    alloyComposition: "Iron powder · 3P insulating coating · Lube 3P (0.3–0.4%)",
    process: ["Compaction 600–800 MPa (heated die 80°C)", "Heat treatment in steam at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-3p-material-data_2273hog.pdf",
    temperatureRange: "HT max 530°C (steam atmosphere)",
    typicalDensity: "7.52 g/cm³ @800 MPa",
    particleSize: "#40 mesh (large particles)",
    specifications: {
      "Density": "7.52 g/cm³",
      "μmax": "770",
      "B@10kA/m": "1.57 T",
      "Hc": "225 A/m",
      "Resistivity": "600 μΩm",
      "TRS": "120 MPa",
      "Tensile strength": "65 MPa",
      "Core loss 1T/100Hz": "10.4 W/kg",
      "Core loss 1T/400Hz": "45 W/kg",
      "Core loss 1T/1kHz": "130 W/kg",
      "Core loss 1T/2kHz": "319 W/kg",
    },
  },

  // --- Somaloy 700 3P — #40, highest μmax in 3P, lower resistivity ---
  {
    id: "somaloy-700-3p",
    name: "Somaloy 700 3P",
    brand: "Somaloy",
    category: "Coated SMC — 3P",
    description: "Somaloy 700 with 3P treatment — highest magnetic permeability (μmax 850) and saturation (1.61 T) among 3P grades. Excellent for motor stators requiring both strength and flux.",
    benefits: ["Highest μmax in 3P range (850)", "High Bsat (1.61 T)", "Very high TRS (125 MPa)", "Excellent motor grade"],
    applications: ["Motor stators", "EV traction motors", "Generators", "Structural magnetic parts"],
    industries: ["automotive", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 88,       // μmax 850
      coreLossLow: 77,        // 10.2 W/kg @1T/100Hz
      coreLossHigh: 66,       // 132 W/kg @1T/1kHz
      saturationInduction: 92, // 1.61 T
      resistivity: 38,        // 200 μΩm
      transverseRuptureStrength: 88, // 125 MPa
      compressibility: 90,
      densityAchievable: 92,  // 7.57 g/cm³
      thermalResistance: 65,
      costEfficiency: 65,
      sustainability: 74,
    },
    alloyComposition: "Iron powder · 3P insulating coating · Lube 3P (0.3–0.4%)",
    process: ["Compaction 600–800 MPa (heated die 80°C)", "Heat treatment in steam at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-3p-material-data_2273hog.pdf",
    temperatureRange: "HT max 530°C (steam atmosphere)",
    typicalDensity: "7.57 g/cm³ @800 MPa",
    particleSize: "#40 mesh (large particles)",
    specifications: {
      "Density": "7.57 g/cm³",
      "μmax": "850",
      "B@10kA/m": "1.61 T",
      "Hc": "217 A/m",
      "Resistivity": "200 μΩm",
      "TRS": "125 MPa",
      "Tensile strength": "65 MPa",
      "Core loss 1T/100Hz": "10.2 W/kg",
      "Core loss 1T/400Hz": "45 W/kg",
      "Core loss 1T/1kHz": "132 W/kg",
      "Core loss 1T/2kHz": "331 W/kg",
    },
  },

  // --- Somaloy 1000 3P — #40, absolute highest μmax (950) and TRS (140) ---
  {
    id: "somaloy-1000-3p",
    name: "Somaloy 1000 3P",
    brand: "Somaloy",
    category: "Coated SMC — 3P",
    description: "Somaloy 1000 with 3P treatment — the highest permeability (μmax 950), highest Bsat (1.63 T) and highest TRS (140 MPa) in the entire Somaloy range. Premium grade for demanding motor applications.",
    benefits: ["Highest μmax in range (950)", "Highest Bsat (1.63 T)", "Highest TRS (140 MPa)", "Premium motor grade"],
    applications: ["EV traction motors", "Industrial servo motors", "High-torque generators", "Premium motor stators"],
    industries: ["automotive", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 95,       // μmax 950 — absolute highest
      coreLossLow: 76,        // 10.3 W/kg @1T/100Hz
      coreLossHigh: 58,       // 143 W/kg @1T/1kHz
      saturationInduction: 95, // 1.63 T — absolute highest
      resistivity: 22,        // 70 μΩm
      transverseRuptureStrength: 95, // 140 MPa — absolute highest
      compressibility: 90,
      densityAchievable: 90,  // 7.56 g/cm³
      thermalResistance: 65,
      costEfficiency: 52,
      sustainability: 74,
    },
    alloyComposition: "Iron powder · 3P insulating coating · Lube 3P (0.3–0.4%)",
    process: ["Compaction 600–800 MPa (heated die 80°C)", "Heat treatment in steam at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-3p-material-data_2273hog.pdf",
    temperatureRange: "HT max 530°C (steam atmosphere)",
    typicalDensity: "7.56 g/cm³ @800 MPa",
    particleSize: "#40 mesh (large particles)",
    specifications: {
      "Density": "7.56 g/cm³",
      "μmax": "950",
      "B@10kA/m": "1.63 T",
      "Hc": "217 A/m",
      "Resistivity": "70 μΩm",
      "TRS": "140 MPa",
      "Tensile strength": "70 MPa",
      "Core loss 1T/100Hz": "10.3 W/kg",
      "Core loss 1T/400Hz": "46 W/kg",
      "Core loss 1T/1kHz": "143 W/kg",
    },
  },

  // =============================================
  // COATED SOMALOY — 1P (Baseline / most economical)
  // =============================================

  // --- Somaloy 700HR 1P — #40, high resistivity baseline ---
  {
    id: "somaloy-700hr-1p",
    name: "Somaloy 700HR 1P",
    brand: "Somaloy",
    category: "Coated SMC — 1P",
    description: "Somaloy 700HR with 1P treatment — economical baseline with high resistivity (1000 μΩm). Simple air atmosphere HT at max 530°C. Available in all mesh sizes.",
    benefits: ["High resistivity (1000 μΩm)", "Most economical HR grade", "Simple air atmosphere HT", "Room temperature die compaction"],
    applications: ["Solenoids", "Sensors", "Cost-sensitive motors", "Actuators"],
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 50,       // μmax 440
      coreLossLow: 78,        // 10.0 W/kg @1T/100Hz
      coreLossHigh: 70,       // 125 W/kg @1T/1kHz
      saturationInduction: 82, // 1.53 T
      resistivity: 65,        // 1000 μΩm
      transverseRuptureStrength: 30, // 35 MPa
      compressibility: 88,
      densityAchievable: 85,  // 7.45 g/cm³
      thermalResistance: 60,
      costEfficiency: 78,
      sustainability: 72,
    },
    alloyComposition: "Iron powder · 1P insulating coating · 0.4% Kenolube",
    process: ["Compaction 600–800 MPa (room temp die)", "Heat treatment in air at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf",
    temperatureRange: "HT max 530°C (air)",
    typicalDensity: "7.45 g/cm³ @800 MPa",
    particleSize: "#40 mesh (large particles)",
    specifications: {
      "Density": "7.45 g/cm³",
      "μmax": "440",
      "B@10kA/m": "1.53 T",
      "Hc": "225 A/m",
      "Resistivity": "1000 μΩm",
      "TRS": "35 MPa",
      "Tensile strength": "10 MPa",
      "Core loss 1T/100Hz": "10.0 W/kg",
      "Core loss 1T/400Hz": "43 W/kg",
      "Core loss 1T/1kHz": "125 W/kg",
      "Core loss 1T/2kHz": "307 W/kg",
    },
  },

  // --- Somaloy 700 1P — #40, higher μmax than 700HR ---
  {
    id: "somaloy-700-1p",
    name: "Somaloy 700 1P",
    brand: "Somaloy",
    category: "Coated SMC — 1P",
    description: "Somaloy 700 with 1P treatment — higher permeability and Bsat than 700HR at baseline cost. Good all-round performance for cost-sensitive applications.",
    benefits: ["Higher μmax than 700HR (540)", "Good Bsat (1.56 T)", "Most economical", "Simple air atmosphere HT"],
    applications: ["Solenoids", "Sensors", "Actuators", "Cost-effective motor components"],
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 58,       // μmax 540
      coreLossLow: 78,        // 9.9 W/kg @1T/100Hz
      coreLossHigh: 70,       // 126 W/kg @1T/1kHz
      saturationInduction: 87, // 1.56 T
      resistivity: 48,        // 400 μΩm
      transverseRuptureStrength: 35, // 40 MPa
      compressibility: 88,
      densityAchievable: 85,  // 7.45 g/cm³
      thermalResistance: 60,
      costEfficiency: 82,
      sustainability: 72,
    },
    alloyComposition: "Iron powder · 1P insulating coating · 0.4% Kenolube",
    process: ["Compaction 600–800 MPa (room temp die)", "Heat treatment in air at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf",
    temperatureRange: "HT max 530°C (air)",
    typicalDensity: "7.45 g/cm³ @800 MPa",
    particleSize: "#40 mesh (large particles)",
    specifications: {
      "Density": "7.45 g/cm³",
      "μmax": "540",
      "B@10kA/m": "1.56 T",
      "Hc": "210 A/m",
      "Resistivity": "400 μΩm",
      "TRS": "40 MPa",
      "Tensile strength": "15 MPa",
      "Core loss 1T/100Hz": "9.9 W/kg",
      "Core loss 1T/400Hz": "43 W/kg",
      "Core loss 1T/1kHz": "126 W/kg",
      "Core loss 1T/2kHz": "312 W/kg",
    },
  },

  // --- Somaloy 130i 1P — #100, high Bsat baseline ---
  {
    id: "somaloy-130i-1p",
    name: "Somaloy 130i 1P",
    brand: "Somaloy",
    category: "Coated SMC — 1P",
    description: "Somaloy 130i with 1P treatment — medium particle size with high resistivity (8000 μΩm) and good Bsat. Cost-effective option for high-frequency applications.",
    benefits: ["High resistivity (8000 μΩm)", "Good Bsat for #100 (1.40 T)", "Cost-effective", "HF capable"],
    applications: ["Sensors", "Actuators", "Cost-sensitive inductors", "Medium-frequency motors"],
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 35,       // μmax 290
      coreLossLow: 65,        // 12.0 W/kg @1T/100Hz
      coreLossHigh: 66,       // 132 W/kg @1T/1kHz
      saturationInduction: 60, // 1.40 T
      resistivity: 85,        // 8000 μΩm
      transverseRuptureStrength: 28, // 33 MPa
      compressibility: 82,
      densityAchievable: 78,  // 7.35 g/cm³
      thermalResistance: 60,
      costEfficiency: 80,
      sustainability: 70,
    },
    alloyComposition: "Iron powder · 1P organic insulation · 0.5% Kenolube",
    process: ["Compaction 600–800 MPa (room temp die)", "Heat treatment in air at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf",
    temperatureRange: "HT max 530°C (air)",
    typicalDensity: "7.35 g/cm³ @800 MPa",
    particleSize: "#100 mesh (medium particles)",
    specifications: {
      "Density": "7.35 g/cm³",
      "μmax": "290",
      "B@10kA/m": "1.40 T",
      "Hc": "260 A/m",
      "Resistivity": "8000 μΩm",
      "TRS": "33 MPa",
      "Tensile strength": "10 MPa",
      "Core loss 1T/100Hz": "12.0 W/kg",
      "Core loss 1T/1kHz": "132 W/kg",
      "Core loss 0.5T/5kHz": "264 W/kg",
      "Core loss 0.1T/10kHz": "29 W/kg",
    },
  },

  // --- Somaloy 500 1P — #100, higher μmax than 130i ---
  {
    id: "somaloy-500-1p",
    name: "Somaloy 500 1P",
    brand: "Somaloy",
    category: "Coated SMC — 1P",
    description: "Somaloy 500 with 1P treatment — medium particle size with high permeability (μmax 500) and good Bsat (1.51 T). Higher TRS than 130i. Cost-effective general-purpose SMC.",
    benefits: ["High μmax for #100 (500)", "Good Bsat (1.51 T)", "Higher TRS (50 MPa)", "Cost-effective"],
    applications: ["Small motors", "Solenoids", "General SMC components", "Sensors"],
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 55,       // μmax 500
      coreLossLow: 62,        // 12.6 W/kg @1T/100Hz
      coreLossHigh: 50,       // 156 W/kg @1T/1kHz
      saturationInduction: 80, // 1.51 T
      resistivity: 22,        // 70 μΩm
      transverseRuptureStrength: 42, // 50 MPa
      compressibility: 82,
      densityAchievable: 80,  // 7.37 g/cm³
      thermalResistance: 60,
      costEfficiency: 78,
      sustainability: 70,
    },
    alloyComposition: "Iron powder · 1P insulating coating · 0.5% Kenolube",
    process: ["Compaction 600–800 MPa (room temp die)", "Heat treatment in air at max 500°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf",
    temperatureRange: "HT max 500°C (air)",
    typicalDensity: "7.37 g/cm³ @800 MPa",
    particleSize: "#100 mesh (medium particles)",
    specifications: {
      "Density": "7.37 g/cm³",
      "μmax": "500",
      "B@10kA/m": "1.51 T",
      "Hc": "270 A/m",
      "Resistivity": "70 μΩm",
      "TRS": "50 MPa",
      "Tensile strength": "15 MPa",
      "Core loss 1T/100Hz": "12.6 W/kg",
      "Core loss 1T/400Hz": "54 W/kg",
      "Core loss 1T/1kHz": "156 W/kg",
      "Core loss 0.5T/5kHz": "387 W/kg",
    },
  },

  // --- Somaloy 110i 1P — #200, finest particle baseline ---
  {
    id: "somaloy-110i-1p",
    name: "Somaloy 110i 1P",
    brand: "Somaloy",
    category: "Coated SMC — 1P",
    description: "Somaloy 110i with 1P treatment — finest particle size (#200) at baseline cost. Very high resistivity (7600 μΩm) for high-frequency applications.",
    benefits: ["Very high resistivity (7600 μΩm)", "Fine particle for HF", "Most economical #200", "Good for >5 kHz"],
    applications: ["EMI filters", "High-frequency inductors", "Sensors", "Current transformers"],
    industries: ["electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 28,       // μmax 220
      coreLossLow: 52,        // 14.4 W/kg @1T/100Hz
      coreLossHigh: 52,       // 153 W/kg @1T/1kHz
      saturationInduction: 48, // 1.33 T
      resistivity: 84,        // 7600 μΩm
      transverseRuptureStrength: 29, // 34 MPa
      compressibility: 75,
      densityAchievable: 68,  // 7.26 g/cm³
      thermalResistance: 60,
      costEfficiency: 80,
      sustainability: 70,
    },
    alloyComposition: "Iron powder · 1P organic insulation · 0.5% Kenolube",
    process: ["Compaction 600–800 MPa (room temp die)", "Heat treatment in air at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf",
    temperatureRange: "HT max 530°C (air)",
    typicalDensity: "7.26 g/cm³ @800 MPa",
    particleSize: "#200 mesh (fine particles)",
    specifications: {
      "Density": "7.26 g/cm³",
      "μmax": "220",
      "B@10kA/m": "1.33 T",
      "Hc": "315 A/m",
      "Resistivity": "7600 μΩm",
      "TRS": "34 MPa",
      "Tensile strength": "15 MPa",
      "Core loss 1T/100Hz": "14.4 W/kg",
      "Core loss 1T/1kHz": "153 W/kg",
      "Core loss 0.5T/5kHz": "276 W/kg",
      "Core loss 0.1T/10kHz": "27 W/kg",
    },
  },

  // =============================================
  // UNCOATED SOFT MAGNETIC POWDERS
  // =============================================

  // --- Fe6.5Si — High-frequency dust cores ---
  {
    id: "fe65si",
    name: "Fe6.5Si",
    brand: "Iron",
    category: "Uncoated — Fe-Si alloy",
    description: "High-alloyed Fe6.5Si powder for soft magnetic high-frequency dust-cores. Excellent DC bias performance, good temperature stability, high saturation flux density and low magnetostriction (low noise). Commonly used un-compacted in insulating binder.",
    benefits: ["Excellent DC bias performance", "Good temperature stability", "High Bsat", "Low magnetostriction (low noise)"],
    applications: ["Dust cores", "High-frequency inductors", "EMI suppression", "Noise-sensitive components"],
    industries: ["electronics", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 30,
      coreLossLow: 45,
      coreLossHigh: 70,
      saturationInduction: 65,
      resistivity: 80,
      transverseRuptureStrength: 15,
      compressibility: 30,     // Difficult to compact (1000–2000 MPa)
      densityAchievable: 55,
      thermalResistance: 75,
      costEfficiency: 60,
      sustainability: 65,
    },
    alloyComposition: "Fe · 6.5% Si",
    process: ["High-pressure compaction (1000–2000 MPa)", "Or: admixed in insulating binder"],
    temperatureRange: "Good temperature stability",
    specifications: {
      "Alloy": "Fe + 6.5% Si",
      "Application": "Dust cores, HF inductors",
      "DC Bias": "Excellent",
      "Magnetostriction": "Low (low noise)",
      "Compaction": "1000–2000 MPa (simple shapes)",
    },
  },

  // --- PASC (ASC 100.29 + P) — Phosphorus alloyed ---
  {
    id: "pasc-phosphorus",
    name: "PASC (ASC 100.29 + P)",
    brand: "Iron",
    category: "Uncoated — Phosphorus iron",
    description: "ASC 100.29 alloyed with ferro-phosphor for demanding sintered soft magnetic components. Phosphorus alloying increases electric resistivity and improves magnetic and machining properties. Recommended with 0.45% or 0.8% P. MPIF FY-4500 standards.",
    benefits: ["Higher electric resistivity", "Improved magnetic properties", "Good machinability", "MPIF standardized"],
    applications: ["Sintered soft magnetic components", "Stators", "Rotors", "Solenoids"],
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 40,
      coreLossLow: 42,
      coreLossHigh: 32,
      saturationInduction: 60,
      resistivity: 40,
      transverseRuptureStrength: 55,
      compressibility: 85,
      densityAchievable: 82,
      thermalResistance: 50,
      costEfficiency: 75,
      sustainability: 65,
    },
    alloyComposition: "ASC 100.29 · 0.45–0.8% Ferro-phosphor",
    process: ["Pressing & Sintering"],
    specifications: {
      "Base powder": "ASC 100.29",
      "Phosphorus": "0.45% or 0.8% P",
      "Standard": "MPIF FY-4500-20V/17X/17Y",
      "Process": "Pressing & Sintering",
    },
  },

  // --- ABC 100.29 + P — Premium phosphorus alloyed ---
  {
    id: "abc-phosphorus",
    name: "ABC 100.29 + P",
    brand: "Iron",
    category: "Uncoated — Phosphorus iron",
    description: "ABC 100.29 alloyed with ferro-phosphor for premium sintered soft magnetic components. Higher density capability than PASC for superior magnetic performance. Recommended with 0.45% P. MPIF FY-8000 standards.",
    benefits: ["Premium magnetic performance", "Higher density capability", "Improved resistivity", "MPIF FY-8000 standard"],
    applications: ["Premium sintered magnetic parts", "High-performance stators", "Precision solenoids"],
    industries: ["automotive", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 45,
      coreLossLow: 45,
      coreLossHigh: 35,
      saturationInduction: 65,
      resistivity: 42,
      transverseRuptureStrength: 60,
      compressibility: 88,
      densityAchievable: 88,
      
      thermalResistance: 50,
      costEfficiency: 68,
      sustainability: 65,
    },
    alloyComposition: "ABC 100.29 · 0.45% Ferro-phosphor",
    process: ["Pressing & Sintering"],
    specifications: {
      "Base powder": "ABC 100.29",
      "Phosphorus": "0.45% P",
      "Standard": "MPIF FY-8000-17V/15X/15Y",
      "Process": "Pressing & Sintering",
    },
  },

  // --- ASC 100.29 — Pure iron powder ---
  {
    id: "asc100-iron",
    name: "ASC 100.29",
    brand: "Iron",
    category: "Uncoated — Pure iron",
    description: "High-purity iron powder for cost-effective sintered soft magnetic components. Pure iron provides highest saturation induction among uncoated grades. MPIF FF-0000 standards.",
    benefits: ["Highest Bsat (pure iron)", "Most cost-effective", "Well-established process", "MPIF standardized"],
    applications: ["Cost-effective magnetic cores", "Solenoids", "Sensors", "General soft magnetic parts"],
    industries: ["automotive", "electronics", "industrial"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 48,
      coreLossLow: 38,
      coreLossHigh: 25,
      saturationInduction: 75,
      resistivity: 18,
      transverseRuptureStrength: 50,
      compressibility: 92,
      densityAchievable: 90,
      
      thermalResistance: 45,
      costEfficiency: 90,
      sustainability: 65,
    },
    alloyComposition: "Pure iron (ASC 100.29)",
    process: ["Pressing & Sintering"],
    specifications: {
      "Base powder": "ASC 100.29",
      "Purity": "High-purity iron",
      "Standard": "MPIF FF-0000-20U/X",
      "Process": "Pressing & Sintering",
    },
  },
];

export const propertyLabels: Record<keyof Material["properties"], { label: string; description: string; unit?: string; typicalRange?: [number, number] }> = {
  permeability: { label: "Permeability (μmax)", description: "Maximum relative magnetic permeability — higher enables stronger flux", typicalRange: [220, 950] },
  coreLossLow: { label: "Core Loss (low freq)", description: "Core loss performance at 1T/100 Hz — higher score = lower loss", unit: "W/kg", typicalRange: [6, 15] },
  coreLossHigh: { label: "Core Loss (high freq)", description: "Core loss performance at 1T/1 kHz — higher score = lower loss", unit: "W/kg", typicalRange: [90, 160] },
  saturationInduction: { label: "Saturation Induction (Bsat)", description: "Magnetic flux density at 10 000 A/m", unit: "T", typicalRange: [1.3, 1.65] },
  resistivity: { label: "Electrical Resistivity", description: "Higher resistivity reduces eddy current losses", unit: "μΩm", typicalRange: [70, 20000] },
  transverseRuptureStrength: { label: "TRS (Mech. Strength)", description: "Transverse rupture strength — critical for SMC component integrity", unit: "MPa", typicalRange: [30, 140] },
  compressibility: { label: "Compressibility", description: "How well the powder can be compacted to high density" },
  densityAchievable: { label: "Achievable Density", description: "How close to theoretical full density the material can be pressed", unit: "g/cm³", typicalRange: [7.2, 7.6] },
  thermalResistance: { label: "Thermal Resistance", description: "Max heat treatment / operating temperature", unit: "°C", typicalRange: [530, 650] },
  costEfficiency: { label: "Cost Efficiency", description: "Material and process cost relative to performance" },
  sustainability: { label: "Sustainability", description: "Environmental impact, CO₂ footprint and circularity" },
};

// ============= Motor Designer application paths =============
// Curated shortlists: only these grades are shown for each application.
export interface MotorDesignerApplication {
  id: string;
  name: string;
  description: string;
  recommendedLabels: string[]; // ranked display names (1, 2, 3)
  recommendedMaterialIds: string[]; // material ids behind the labels (flattened, curated order)
  recommendedGroups: string[][]; // ids per recommendation rank: [rank1 ids, rank2 ids, rank3 ids]
  priorityProperties: (keyof Material["properties"])[]; // prefilled in Fine-tune Requirements
}

const SOMALOY_7P_FAMILY = [
  "somaloy-700-7p-73",
  "somaloy-700-7p-74a",
  "somaloy-700-7p-74b",
  "somaloy-700-7p-75",
];

const FE_FEP_FAMILY = ["pasc-phosphorus", "abc-phosphorus", "asc100-iron"];

export const motorDesignerApplications: MotorDesignerApplication[] = [
  {
    id: "afm-traction",
    name: "AFM Traction / Propulsion Motors",
    description:
      "Axial flux traction and propulsion motors for electric vehicles — maximum torque density and efficiency in compact, flat geometries.",
    recommendedLabels: ["Somaloy 700 7P", "Somaloy 130i 5P", "Somaloy 700HR 3P"],
    recommendedMaterialIds: [...SOMALOY_7P_FAMILY, "somaloy-130i-5p", "somaloy-700hr-3p"],
    recommendedGroups: [SOMALOY_7P_FAMILY, ["somaloy-130i-5p"], ["somaloy-700hr-3p"]],
    priorityProperties: ["saturationInduction", "coreLossHigh", "permeability", "transverseRuptureStrength"],
  },
  {
    id: "light-mobility",
    name: "Light Mobility Motors (2-/3-wheelers)",
    description:
      "Traction motors for e-scooters, e-bikes, motorcycles and other light electric vehicles — compact, efficient and cost-aware designs.",
    recommendedLabels: ["Somaloy 700 7P", "Somaloy 130i 5P", "Somaloy 700HR 3P"],
    recommendedMaterialIds: [...SOMALOY_7P_FAMILY, "somaloy-130i-5p", "somaloy-700hr-3p"],
    recommendedGroups: [SOMALOY_7P_FAMILY, ["somaloy-130i-5p"], ["somaloy-700hr-3p"]],
    priorityProperties: ["saturationInduction", "coreLossHigh", "permeability", "costEfficiency"],
  },
  {
    id: "electric-pumps",
    name: "Electric Pumps (Water, Oil & Cooling)",
    description:
      "Compact pump motors for automotive and industrial cooling, oil and water circulation — high efficiency at medium-to-high frequencies.",
    recommendedLabels: ["Somaloy 700 7P", "Somaloy 700HR 5P", "Somaloy 700HR 3P"],
    recommendedMaterialIds: [...SOMALOY_7P_FAMILY, "somaloy-700hr-5p", "somaloy-700hr-3p"],
    recommendedGroups: [SOMALOY_7P_FAMILY, ["somaloy-700hr-5p"], ["somaloy-700hr-3p"]],
    priorityProperties: ["coreLossHigh", "permeability", "saturationInduction", "costEfficiency"],
  },
  {
    id: "compressors-fans-blowers",
    name: "Compressors, Fans & Blowers",
    description:
      "Motors for compressors, HVAC fans and blowers — low losses and cost-effective performance across a wide speed range.",
    recommendedLabels: ["Somaloy 700 7P", "Somaloy 700 1P", "Somaloy 700HR 3P"],
    recommendedMaterialIds: [...SOMALOY_7P_FAMILY, "somaloy-700-1p", "somaloy-700hr-3p"],
    recommendedGroups: [SOMALOY_7P_FAMILY, ["somaloy-700-1p"], ["somaloy-700hr-3p"]],
    priorityProperties: ["coreLossHigh", "coreLossLow", "costEfficiency"],
  },
  {
    id: "robotics-compact",
    name: "Robotics & Compact Motors",
    description:
      "High-precision servo and compact motors for robotics and automation — high torque density in very small envelopes.",
    recommendedLabels: ["Somaloy 700 7P", "Somaloy 700HR 5P", "Somaloy 700HR 3P"],
    recommendedMaterialIds: [...SOMALOY_7P_FAMILY, "somaloy-700hr-5p", "somaloy-700hr-3p"],
    recommendedGroups: [SOMALOY_7P_FAMILY, ["somaloy-700hr-5p"], ["somaloy-700hr-3p"]],
    priorityProperties: ["permeability", "saturationInduction", "coreLossHigh"],
  },
  {
    id: "drones",
    name: "Drones",
    description:
      "Lightweight, high-speed propulsion motors for drones and UAVs — maximum power-to-weight ratio at high frequencies.",
    recommendedLabels: ["Somaloy 700 7P", "Somaloy 700HR 5P", "Somaloy 700HR 3P"],
    recommendedMaterialIds: [...SOMALOY_7P_FAMILY, "somaloy-700hr-5p", "somaloy-700hr-3p"],
    recommendedGroups: [SOMALOY_7P_FAMILY, ["somaloy-700hr-5p"], ["somaloy-700hr-3p"]],
    priorityProperties: ["coreLossHigh", "permeability", "saturationInduction", "thermalResistance"],
  },
  {
    id: "transformers",
    name: "Transformers",
    description:
      "High-frequency power transformers for converters and power supplies — very low core losses and high resistivity at elevated frequencies.",
    recommendedLabels: ["Somaloy 110i 5P", "Somaloy 110i 1P", "Somaloy 130i 5P"],
    recommendedMaterialIds: ["somaloy-110i-5p", "somaloy-110i-1p", "somaloy-130i-5p"],
    recommendedGroups: [["somaloy-110i-5p"], ["somaloy-110i-1p"], ["somaloy-130i-5p"]],
    priorityProperties: ["coreLossHigh", "resistivity", "permeability"],
  },
  {
    id: "solenoids-actuators",
    name: "Solenoids & Actuators",
    description:
      "DC and low-frequency solenoids and actuators — high saturation induction and permeability at competitive cost.",
    recommendedLabels: ["Fe / FeP solutions (uncoated)", "Somaloy 500 1P", "Somaloy 1000 3P"],
    recommendedMaterialIds: [...FE_FEP_FAMILY, "somaloy-500-1p", "somaloy-1000-3p"],
    recommendedGroups: [FE_FEP_FAMILY, ["somaloy-500-1p"], ["somaloy-1000-3p"]],
    priorityProperties: ["saturationInduction", "permeability", "costEfficiency"],
  },
];
