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
    // Mechanical
    tensileStrength: number;
    hardness: number;
    compressibility: number;
    wearResistance: number;
    machinability: number;
    fatigue: number;
    densityAchievable: number;
    // Environmental
    corrosionResistance: number;
    thermalResistance: number;
    // Magnetic (SMC-specific)
    permeability: number;
    coreLossLow: number;
    coreLossHigh: number;
    saturationInduction: number;
    resistivity: number;
    transverseRuptureStrength: number;
    // General
    costEfficiency: number;
    sustainability: number;
    // Brazing-specific (kept for interface compat)
    jointStrength: number;
    flowability: number;
    wettability: number;
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
    relevantProperties: ["permeability", "coreLossLow", "coreLossHigh", "saturationInduction", "resistivity", "transverseRuptureStrength", "compressibility", "densityAchievable", "thermalResistance", "costEfficiency"],
  },
];

export const industries: Industry[] = [
  { id: "automotive", name: "Automotive & EV", description: "Traction motors, axial flux machines and power electronics for electric vehicles." },
  { id: "energy", name: "Energy & Renewables", description: "Generators, wind power and energy conversion systems." },
  { id: "electronics", name: "Electronics & Power", description: "Inductors, EMI filters, DC/DC converters and power supplies." },
  { id: "consumer", name: "Consumer & Appliances", description: "Household motors, actuators and solenoids." },
];

export const applications: Application[] = [
  {
    id: "electric-motors",
    name: "Electric Motor Components",
    description: "SMC cores for high-efficiency electric motors — axial and radial flux designs.",
    industries: ["automotive", "energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "coreLossLow", "coreLossHigh", "saturationInduction", "transverseRuptureStrength"],
    recommendedMaterials: ["somaloy-700-5p", "somaloy-700-3p", "somaloy-500-5p", "somaloy-130i-5p", "somaloy-3p"],
    challengeScenarios: [
      { id: "axial-flux", name: "Axial flux", description: "3D magnetic design for compact motors", propertyBoosts: { permeability: 15, saturationInduction: 20, densityAchievable: 10 } },
      { id: "high-frequency", name: "High frequency (>1 kHz)", description: "Minimal core losses at high switching frequency", propertyBoosts: { coreLossHigh: 25, resistivity: 15 } },
      { id: "high-torque", name: "High torque density", description: "Maximum flux for compact motor design", propertyBoosts: { saturationInduction: 20, densityAchievable: 15 } },
    ],
  },
  {
    id: "inductors",
    name: "Inductors & Transformers",
    description: "SMC materials for power inductors with high energy density and low losses.",
    industries: ["energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "coreLossHigh", "saturationInduction", "resistivity"],
    recommendedMaterials: ["somaloy-500-5p", "somaloy-110i-5p", "somaloy-700-5p", "pnc60"],
    challengeScenarios: [
      { id: "dc-bias", name: "High DC bias", description: "Maintain permeability under DC pre-magnetization", propertyBoosts: { permeability: 20, saturationInduction: 15 } },
      { id: "emi-filter", name: "EMI filtering", description: "Broad frequency suppression", propertyBoosts: { coreLossHigh: 20, resistivity: 15 } },
    ],
  },
  {
    id: "sensors-solenoids",
    name: "Sensors & Solenoids",
    description: "SMC components for magnetic sensors, solenoids and actuators with 3D flux capability.",
    industries: ["automotive", "electronics", "consumer"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "saturationInduction", "costEfficiency"],
    recommendedMaterials: ["somaloy-130i-1p", "somaloy-700-1p", "pnc60"],
    challengeScenarios: [
      { id: "fast-response", name: "Fast response", description: "Quick magnetic switching for actuators", propertyBoosts: { resistivity: 20, coreLossHigh: 15 } },
    ],
  },
  {
    id: "generators",
    name: "Generators & Wind Power",
    description: "SMC stator and rotor cores for compact generators in renewable energy applications.",
    industries: ["energy"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["permeability", "coreLossLow", "saturationInduction", "transverseRuptureStrength"],
    recommendedMaterials: ["somaloy-700-5p", "somaloy-700-3p", "somaloy-130i-5p"],
    challengeScenarios: [
      { id: "compact-design", name: "Compact design", description: "Maximize power density in limited space", propertyBoosts: { saturationInduction: 25, densityAchievable: 15 } },
    ],
  },
  {
    id: "ev-traction",
    name: "EV Traction Motors",
    description: "High-performance SMC cores for electric vehicle traction motors — maximum torque density and efficiency.",
    industries: ["automotive"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["saturationInduction", "coreLossLow", "coreLossHigh", "permeability", "transverseRuptureStrength"],
    recommendedMaterials: ["somaloy-130i-5p", "somaloy-700-5p", "somaloy-700-3p", "re-somaloy-700-5p"],
    challengeScenarios: [
      { id: "axial-flux-ev", name: "Axial flux EV motor", description: "Compact, high power density for EVs", propertyBoosts: { saturationInduction: 20, permeability: 15, densityAchievable: 10 } },
      { id: "thermal-challenge", name: "High thermal load", description: "Sustained high-power operation", propertyBoosts: { thermalResistance: 20, transverseRuptureStrength: 15 } },
    ],
  },
  {
    id: "power-electronics",
    name: "Power Electronics",
    description: "Magnetic components for DC/DC converters, inverters and power factor correction circuits.",
    industries: ["electronics", "energy", "automotive"],
    technologyAreas: ["soft-magnetics"],
    requiredProperties: ["coreLossHigh", "resistivity", "permeability"],
    recommendedMaterials: ["somaloy-500-5p", "somaloy-500-3p", "somaloy-110i-5p", "somaloy-500-1p"],
    challengeScenarios: [
      { id: "high-switching", name: "High switching frequency", description: "Operation above 10 kHz", propertyBoosts: { coreLossHigh: 30, resistivity: 20 } },
    ],
  },
];

// Helper: default zero properties
const defaultProps = (): Material["properties"] => ({
  tensileStrength: 0, hardness: 0, compressibility: 0, wearResistance: 0,
  machinability: 0, fatigue: 0, densityAchievable: 0, corrosionResistance: 0,
  thermalResistance: 0, permeability: 0, coreLossLow: 0, coreLossHigh: 0,
  saturationInduction: 0, resistivity: 0, transverseRuptureStrength: 0,
  costEfficiency: 0, sustainability: 0, jointStrength: 0, flowability: 0, wettability: 0,
});

// ============ MATERIALS ============

export const materials: Material[] = [
  // ---- SOMALOY 700 RANGE — flagship, -40 mesh (high Bsat, good for motors) ----
  {
    id: "somaloy-700-5p",
    name: "Somaloy 700 5P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 700 with 5P treatment – lowest core losses in the 700 series. Inert atmosphere HT at max 650°C. Ideal for high-efficiency motors and inductors.",
    benefits: ["Lowest core losses in 700 range", "High density achievable", "3D magnetic flux paths", "Isotropic magnetic properties"],
    applications: ["High-efficiency motors", "Axial flux machines", "Inductors", "Generators"],
    industries: ["automotive", "energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 78,
      coreLossLow: 88,
      coreLossHigh: 82,
      saturationInduction: 82,
      resistivity: 75,
      transverseRuptureStrength: 55,
      compressibility: 88,
      densityAchievable: 90,
      thermalResistance: 78,
      costEfficiency: 65,
      sustainability: 75,
    },
    alloyComposition: "Iron powder with 5P insulating coating",
    process: ["Compaction 600–800 MPa", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf&mode=brochure&title=Somaloy%205P_Material%20Data_2274HOG.pdf#page=1",
    temperatureRange: "HT max 650°C (N₂ atmosphere)",
    typicalDensity: "7.35–7.55 g/cm³",
    particleSize: "-40 mesh (~425 µm)",
    specifications: {
      "μmax (7.5 g/cm³)": "~600",
      "Bsat (7.5 g/cm³)": "~1.6 T",
      "Core loss 1T/400Hz": "~32 W/kg",
      "Core loss 1T/1kHz": "~105 W/kg",
      "Resistivity": "~200 μΩm",
      "TRS": "~50 MPa",
    },
  },
  {
    id: "somaloy-700-3p",
    name: "Somaloy 700 3P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 700 with 3P treatment – highest mechanical strength in the 700 series. Steam treatment enables excellent TRS for structural integrity.",
    benefits: ["Highest mechanical strength", "Good magnetic performance", "Steam treatment compatible", "Robust components"],
    applications: ["Motor stators requiring strength", "Structural magnetic parts", "EV traction motors"],
    industries: ["automotive", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 72,
      coreLossLow: 70,
      coreLossHigh: 65,
      saturationInduction: 80,
      resistivity: 60,
      transverseRuptureStrength: 90,
      compressibility: 88,
      densityAchievable: 90,
      thermalResistance: 65,
      costEfficiency: 68,
      sustainability: 74,
    },
    alloyComposition: "Iron powder with 3P insulating coating",
    process: ["Compaction 600–800 MPa", "Heat treatment in air+steam at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-3p-material-data_2273hog.pdf&mode=brochure&title=Somaloy%203P_Material%20Data_2273HOG.pdf#page=1",
    temperatureRange: "HT max 530°C (air+steam)",
    typicalDensity: "7.35–7.55 g/cm³",
    particleSize: "-40 mesh",
    specifications: {
      "μmax (7.5 g/cm³)": "~500",
      "Bsat (7.5 g/cm³)": "~1.55 T",
      "Core loss 1T/400Hz": "~45 W/kg",
      "Core loss 1T/1kHz": "~145 W/kg",
      "TRS": "~100 MPa",
      "Resistivity": "~70 μΩm",
    },
  },
  {
    id: "somaloy-700-1p",
    name: "Somaloy 700 1P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 700 with 1P treatment – most economical baseline grade. Air atmosphere HT at max 530°C. Good for cost-sensitive applications.",
    benefits: ["Most economical", "Simple air atmosphere HT", "Good baseline performance", "Low entry cost"],
    applications: ["Solenoids", "Sensors", "Cost-sensitive motors", "Actuators"],
    industries: ["automotive", "electronics", "consumer"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 65,
      coreLossLow: 58,
      coreLossHigh: 50,
      saturationInduction: 78,
      resistivity: 50,
      transverseRuptureStrength: 70,
      compressibility: 88,
      densityAchievable: 90,
      thermalResistance: 60,
      costEfficiency: 82,
      sustainability: 72,
    },
    alloyComposition: "Iron powder with 1P insulating coating + Kenolube P11",
    process: ["Compaction 600–800 MPa", "Heat treatment in air at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf&mode=brochure&title=Somaloy%201P_Material%20Data_2272HOG.pdf#page=1",
    temperatureRange: "HT max 530°C (air)",
    typicalDensity: "7.30–7.50 g/cm³",
    particleSize: "-40 mesh, -100 mesh, -200 mesh",
    specifications: {
      "μmax (7.4 g/cm³)": "~430",
      "Bsat (7.4 g/cm³)": "~1.5 T",
      "Core loss 1T/400Hz": "~55 W/kg",
      "Core loss 1T/1kHz": "~170 W/kg",
      "TRS": "~70 MPa",
      "Resistivity": "~50 μΩm",
    },
  },
  // ---- SOMALOY 500 RANGE — optimized for higher frequency ----
  {
    id: "somaloy-500-5p",
    name: "Somaloy 500 5P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 500 with 5P treatment – optimized for high-frequency applications (>1 kHz). -100 mesh powder for lower eddy current losses.",
    benefits: ["Lowest losses at high frequency", "Optimal for >1 kHz", "Excellent for inductors", "Compact designs"],
    applications: ["High-frequency inductors", "DC/DC converters", "Compact motors", "Power electronics"],
    industries: ["energy", "electronics", "automotive"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 72,
      coreLossLow: 75,
      coreLossHigh: 92,
      saturationInduction: 72,
      resistivity: 88,
      transverseRuptureStrength: 50,
      compressibility: 82,
      densityAchievable: 82,
      thermalResistance: 78,
      costEfficiency: 60,
      sustainability: 72,
    },
    alloyComposition: "Iron powder with 5P insulating coating (-100 mesh)",
    process: ["Compaction 600–800 MPa", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf&mode=brochure&title=Somaloy%205P_Material%20Data_2274HOG.pdf#page=1",
    temperatureRange: "HT max 650°C (N₂ atmosphere)",
    typicalDensity: "7.15–7.35 g/cm³",
    particleSize: "-100 mesh (~150 µm)",
    specifications: {
      "μmax (7.3 g/cm³)": "~450",
      "Bsat (7.3 g/cm³)": "~1.45 T",
      "Core loss 1T/1kHz": "~70 W/kg",
      "Core loss 1T/5kHz": "~400 W/kg",
      "Resistivity": "~800 μΩm",
      "TRS": "~45 MPa",
    },
  },
  {
    id: "somaloy-500-3p",
    name: "Somaloy 500 3P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 500 with 3P treatment – high-frequency applications where mechanical strength is also required.",
    benefits: ["Good high-frequency performance", "Higher TRS than 5P", "Steam treatment compatible"],
    applications: ["Inductors", "Power transformers", "Small motors"],
    industries: ["energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 68,
      coreLossLow: 62,
      coreLossHigh: 78,
      saturationInduction: 70,
      resistivity: 72,
      transverseRuptureStrength: 80,
      compressibility: 82,
      densityAchievable: 82,
      thermalResistance: 65,
      costEfficiency: 62,
      sustainability: 72,
    },
    alloyComposition: "Iron powder with 3P insulating coating (-100 mesh)",
    process: ["Compaction 600–800 MPa", "Heat treatment in air+steam at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-3p-material-data_2273hog.pdf&mode=brochure&title=Somaloy%203P_Material%20Data_2273HOG.pdf#page=1",
    temperatureRange: "HT max 530°C (air+steam)",
    typicalDensity: "7.15–7.35 g/cm³",
    particleSize: "-100 mesh",
    specifications: {
      "μmax (7.3 g/cm³)": "~380",
      "Bsat (7.3 g/cm³)": "~1.4 T",
      "Core loss 1T/1kHz": "~95 W/kg",
      "TRS": "~80 MPa",
      "Resistivity": "~280 μΩm",
    },
  },
  {
    id: "somaloy-500-1p",
    name: "Somaloy 500 1P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 500 with 1P treatment – economical high-frequency option for cost-sensitive applications. Air atmosphere HT.",
    benefits: ["Most economical 500 series", "Simple air HT", "Good high-frequency performance", "Cost-sensitive solution"],
    applications: ["Small inductors", "EMI filters", "Sensors"],
    industries: ["electronics", "consumer"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 58,
      coreLossLow: 52,
      coreLossHigh: 68,
      saturationInduction: 65,
      resistivity: 65,
      transverseRuptureStrength: 65,
      compressibility: 82,
      densityAchievable: 82,
      thermalResistance: 58,
      costEfficiency: 78,
      sustainability: 70,
    },
    alloyComposition: "Iron powder with 1P insulating coating (-100 mesh)",
    process: ["Compaction 600–800 MPa", "Heat treatment in air at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf&mode=brochure&title=Somaloy%201P_Material%20Data_2272HOG.pdf#page=1",
    temperatureRange: "HT max 530°C (air)",
    typicalDensity: "7.10–7.30 g/cm³",
    particleSize: "-100 mesh",
    specifications: {
      "μmax (7.2 g/cm³)": "~360",
      "Bsat (7.2 g/cm³)": "~1.35 T",
      "Core loss 1T/1kHz": "~140 W/kg",
      "TRS": "~60 MPa",
      "Resistivity": "~120 μΩm",
    },
  },
  // ---- SOMALOY 130i — high Bsat, organic insulation ----
  {
    id: "somaloy-130i-5p",
    name: "Somaloy 130i 5P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 130i with 5P treatment – highest saturation induction in the Somaloy range. For traction motors requiring maximum torque density.",
    benefits: ["Highest Bsat in Somaloy range", "Maximum torque density", "Good pressability", "Excellent for EV traction"],
    applications: ["EV traction motors", "Industrial servo motors", "Generators", "High-torque applications"],
    industries: ["automotive", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 80,
      coreLossLow: 72,
      coreLossHigh: 62,
      saturationInduction: 92,
      resistivity: 55,
      transverseRuptureStrength: 48,
      compressibility: 92,
      densityAchievable: 94,
      thermalResistance: 78,
      costEfficiency: 68,
      sustainability: 70,
    },
    alloyComposition: "Iron powder with 5P organic insulation",
    process: ["Compaction 600–800 MPa", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf&mode=brochure&title=Somaloy%205P_Material%20Data_2274HOG.pdf#page=1",
    temperatureRange: "HT max 650°C",
    typicalDensity: "7.50–7.65 g/cm³",
    particleSize: "-40 mesh",
    specifications: {
      "μmax (7.6 g/cm³)": "~700",
      "Bsat (7.6 g/cm³)": "~1.7 T",
      "Core loss 1T/400Hz": "~38 W/kg",
      "Core loss 1T/1kHz": "~130 W/kg",
      "TRS": "~45 MPa",
      "Resistivity": "~150 μΩm",
    },
  },
  {
    id: "somaloy-130i-1p",
    name: "Somaloy 130i 1P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 130i with 1P treatment – cost-effective high-Bsat option for solenoids and actuators.",
    benefits: ["High Bsat at low cost", "Simple processing", "Good for actuators", "Air atmosphere HT"],
    applications: ["Solenoids", "Actuators", "Sensors", "Cost-sensitive magnetic parts"],
    industries: ["automotive", "electronics", "consumer"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 72,
      coreLossLow: 55,
      coreLossHigh: 42,
      saturationInduction: 88,
      resistivity: 40,
      transverseRuptureStrength: 65,
      compressibility: 92,
      densityAchievable: 94,
      thermalResistance: 55,
      costEfficiency: 80,
      sustainability: 70,
    },
    alloyComposition: "Iron powder with 1P organic insulation + Kenolube P11",
    process: ["Compaction 600–800 MPa", "Heat treatment in air at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-1p-material-data_2272hog.pdf&mode=brochure&title=Somaloy%201P_Material%20Data_2272HOG.pdf#page=1",
    temperatureRange: "HT max 530°C (air)",
    typicalDensity: "7.45–7.65 g/cm³",
    particleSize: "-40 mesh",
    specifications: {
      "μmax (7.6 g/cm³)": "~550",
      "Bsat (7.6 g/cm³)": "~1.65 T",
      "Core loss 1T/400Hz": "~60 W/kg",
      "TRS": "~60 MPa",
    },
  },
  // ---- SOMALOY 110i — for inductors ----
  {
    id: "somaloy-110i-5p",
    name: "Somaloy 110i 5P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Somaloy 110i with 5P treatment – optimized for inductors and EMI filters. High permeability with stable DC bias characteristics.",
    benefits: ["High permeability", "Stable under DC bias", "Ideal for power inductors", "Good thermal performance"],
    applications: ["Power inductors", "EMI filters", "Current transformers", "DC/DC converters"],
    industries: ["electronics", "energy"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 85,
      coreLossLow: 70,
      coreLossHigh: 72,
      saturationInduction: 68,
      resistivity: 80,
      transverseRuptureStrength: 45,
      compressibility: 85,
      densityAchievable: 88,
      thermalResistance: 72,
      costEfficiency: 62,
      sustainability: 72,
    },
    alloyComposition: "Iron powder with 5P thin-film insulation",
    process: ["Compaction 600–800 MPa", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf&mode=brochure&title=Somaloy%205P_Material%20Data_2274HOG.pdf#page=1",
    temperatureRange: "HT max 650°C",
    typicalDensity: "7.30–7.50 g/cm³",
    particleSize: "-100 mesh",
    specifications: {
      "μmax": "~900",
      "Bsat": "~1.45 T",
      "Core loss 1T/1kHz": "~85 W/kg",
      "DC bias stability": "Excellent",
      "Resistivity": "~500 μΩm",
    },
  },
  // ---- SOMALOY GENERAL PURPOSE ----
  {
    id: "somaloy-3p",
    name: "Somaloy 3P",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "General-purpose Somaloy with 3P treatment – good balance of magnetic and mechanical properties. Steam treatment for highest TRS.",
    benefits: ["Good all-round performance", "High mechanical strength", "Versatile grade", "Cost-effective SMC"],
    applications: ["General SMC components", "Stators", "Sensor housings"],
    industries: ["automotive", "energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 70,
      coreLossLow: 65,
      coreLossHigh: 60,
      saturationInduction: 78,
      resistivity: 58,
      transverseRuptureStrength: 85,
      compressibility: 86,
      densityAchievable: 88,
      thermalResistance: 62,
      costEfficiency: 70,
      sustainability: 72,
    },
    alloyComposition: "Iron powder with 3P insulating coating",
    process: ["Compaction 600–800 MPa", "Heat treatment in air+steam at max 530°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-3p-material-data_2273hog.pdf&mode=brochure&title=Somaloy%203P_Material%20Data_2273HOG.pdf#page=1",
    temperatureRange: "HT max 530°C (air+steam)",
    typicalDensity: "7.30–7.50 g/cm³",
    specifications: {
      "μmax": "~480",
      "Bsat": "~1.5 T",
      "Core loss 1T/400Hz": "~48 W/kg",
      "TRS": "~90 MPa",
      "Resistivity": "~80 μΩm",
    },
  },
  // ---- SOMALOY PROTOTYPING ----
  {
    id: "somaloy-prototyping",
    name: "Somaloy Prototyping",
    brand: "Somaloy",
    category: "SMC Prototyping",
    description: "SMC material designed for rapid prototyping and small series production. Same electromagnetic properties as production grades but with simplified processing.",
    benefits: ["Rapid prototyping", "Small series production", "Same EM properties", "Simplified processing"],
    applications: ["Motor prototypes", "Concept validation", "Small series inductors"],
    industries: ["automotive", "energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 68,
      coreLossLow: 60,
      coreLossHigh: 55,
      saturationInduction: 75,
      resistivity: 55,
      transverseRuptureStrength: 60,
      compressibility: 85,
      densityAchievable: 85,
      thermalResistance: 60,
      costEfficiency: 75,
      sustainability: 72,
    },
    alloyComposition: "Iron powder with insulating coating (prototyping grade)",
    process: ["Compaction", "Simple heat treatment"],
    temperatureRange: "HT max 530°C",
    typicalDensity: "7.20–7.45 g/cm³",
    specifications: {
      "μmax": "~450",
      "Bsat": "~1.5 T",
      "Core loss 1T/400Hz": "~50 W/kg",
      "TRS": "~65 MPa",
    },
  },
  // ---- RE- SOMALOY (SUSTAINABLE) ----
  {
    id: "re-somaloy-700-5p",
    name: "re- Somaloy 700 5P",
    brand: "Somaloy",
    category: "SMC (Sustainable)",
    description: "Sustainable version of Somaloy 700 5P with reduced carbon footprint. Identical electromagnetic and mechanical properties for high-efficiency motors.",
    benefits: ["Identical to Somaloy 700 5P", "Lower CO2 footprint", "Same magnetic performance", "Drop-in replacement"],
    applications: ["High-efficiency motors", "Axial flux machines", "Inductors"],
    industries: ["automotive", "energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      permeability: 78,
      coreLossLow: 88,
      coreLossHigh: 82,
      saturationInduction: 82,
      resistivity: 75,
      transverseRuptureStrength: 55,
      compressibility: 88,
      densityAchievable: 90,
      thermalResistance: 78,
      costEfficiency: 62,
      sustainability: 95,
    },
    alloyComposition: "Iron powder with 5P insulating coating (sustainable process)",
    process: ["Compaction 600–800 MPa", "Heat treatment in N₂ at max 650°C"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/somaloy_somaloy-5p-material-data_2274hog.pdf&mode=brochure&title=Somaloy%205P_Material%20Data_2274HOG.pdf#page=1",
    isRe: true,
    temperatureRange: "HT max 650°C (N₂ atmosphere)",
    typicalDensity: "7.35–7.55 g/cm³",
    particleSize: "-40 mesh",
    specifications: {
      "μmax (7.5 g/cm³)": "~600",
      "Bsat (7.5 g/cm³)": "~1.6 T",
      "Core loss 1T/400Hz": "~32 W/kg",
      "TRS": "~50 MPa",
    },
  },
  // ---- PNC 60 — Phosphorus iron for soft magnetic ----
  {
    id: "pnc60",
    name: "PNC 60",
    brand: "Iron",
    category: "Phosphorus iron (Soft Magnetic)",
    description: "Phosphorus-alloyed iron powder for soft magnetic applications with high resistivity. Cost-effective alternative for less demanding SMC applications.",
    benefits: ["High resistivity", "Good magnetic properties", "Cost-effective soft magnetic solution"],
    applications: ["Solenoids", "Magnetic cores", "Sensors"],
    industries: ["automotive", "energy", "electronics"],
    technologyAreas: ["soft-magnetics"],
    properties: {
      ...defaultProps(),
      tensileStrength: 40, hardness: 35, compressibility: 88, corrosionResistance: 30, wearResistance: 25,
      machinability: 80, costEfficiency: 85, sustainability: 65, thermalResistance: 45, fatigue: 35,
      densityAchievable: 85,
      permeability: 45, coreLossLow: 40, coreLossHigh: 30, saturationInduction: 55, resistivity: 35, transverseRuptureStrength: 60,
    },
    alloyComposition: "Fe + P",
    process: ["Pressing & Sintering"],
    dataSheetUrl: "https://www.hoganas.com/api/Brochure/?pdf=/globalassets/downloads/libary/pressing-and-sintering_pnc60_1583hog.pdf&mode=brochure&title=PNC%2060_1583HOG.pdf#page=1",
    typicalDensity: "7.0–7.4 g/cm³",
  },
];

export const propertyLabels: Record<keyof Material["properties"], { label: string; description: string; unit?: string; typicalRange?: [number, number] }> = {
  tensileStrength: { label: "Tensile Strength", description: "Ultimate tensile strength – resistance to tensile loading", unit: "MPa", typicalRange: [200, 1200] },
  hardness: { label: "Hardness", description: "Resistance to deformation (HRC / HV)", unit: "HV", typicalRange: [80, 800] },
  compressibility: { label: "Compressibility", description: "How well the powder can be compacted to high density" },
  corrosionResistance: { label: "Corrosion Resistance", description: "Resistance to chemical degradation and rust" },
  wearResistance: { label: "Wear Resistance", description: "Resistance to mechanical abrasion and wear" },
  machinability: { label: "Machinability", description: "How easily the material can be machined after sintering" },
  costEfficiency: { label: "Cost Efficiency", description: "Material and process cost relative to performance" },
  sustainability: { label: "Sustainability", description: "Environmental impact, CO₂ footprint and circularity" },
  thermalResistance: { label: "Thermal Resistance", description: "Performance at elevated temperatures", unit: "°C", typicalRange: [200, 1400] },
  fatigue: { label: "Fatigue Strength", description: "Resistance to cyclic loading over time", unit: "MPa", typicalRange: [100, 600] },
  densityAchievable: { label: "Achievable Density", description: "How close to theoretical full density the material can be pressed", unit: "g/cm³", typicalRange: [6.5, 7.95] },
  // SMC-specific
  permeability: { label: "Permeability (μmax)", description: "Maximum relative magnetic permeability – higher enables stronger flux", typicalRange: [100, 900] },
  coreLossLow: { label: "Core Loss (low freq)", description: "Core loss performance at 50–400 Hz – higher score = lower loss", unit: "W/kg", typicalRange: [25, 80] },
  coreLossHigh: { label: "Core Loss (high freq)", description: "Core loss performance at 1–10 kHz – higher score = lower loss", unit: "W/kg", typicalRange: [50, 200] },
  saturationInduction: { label: "Saturation Induction (Bsat)", description: "Maximum magnetic flux density before saturation", unit: "T", typicalRange: [1.2, 1.75] },
  resistivity: { label: "Electrical Resistivity", description: "Higher resistivity reduces eddy current losses", unit: "μΩm", typicalRange: [50, 800] },
  transverseRuptureStrength: { label: "TRS (Mech. Strength)", description: "Transverse rupture strength – critical for SMC component integrity", unit: "MPa", typicalRange: [30, 120] },
  // Brazing (unused but kept for interface compat)
  jointStrength: { label: "Joint Strength", description: "Shear strength of the brazed joint", unit: "MPa", typicalRange: [80, 350] },
  flowability: { label: "Flowability", description: "How well the filler flows into the joint gap" },
  wettability: { label: "Wettability", description: "How well the filler wets the base material surface" },
};
