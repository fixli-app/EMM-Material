export interface MaterialProperty {
  name: string;
  value: number; // 0-100 normalized
  unit?: string;
  rawValue?: string;
}

export interface Material {
  id: string;
  name: string;
  brand: "Astaloy" | "Distaloy" | "Somaloy" | "Iron" | "Stainless" | "ToolSteel" | "FeCrAl" | "Other";
  category: string;
  description: string;
  benefits: string[];
  applications: string[];
  industries: string[];
  properties: {
    tensileStrength: number; // 0-100
    hardness: number;
    compressibility: number;
    corrosionResistance: number;
    wearResistance: number;
    machinability: number;
    costEfficiency: number;
    sustainability: number;
    thermalResistance: number;
    fatigue: number;
  };
  alloyComposition: string;
  process: string[];
  dataSheetUrl?: string;
  isRe?: boolean; // re- portfolio (sustainable)
}

export interface Application {
  id: string;
  name: string;
  icon: string;
  description: string;
  industries: string[];
  requiredProperties: (keyof Material["properties"])[];
  recommendedMaterials: string[];
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const industries: Industry[] = [
  { id: "automotive", name: "Automotive & Transportation", icon: "🚗", description: "Gears, connecting rods, valve seat inserts, and structural components for vehicles." },
  { id: "aerospace", name: "Aerospace & Turbines", icon: "✈️", description: "High-performance alloys for turbine blades, structural brackets, and heat-resistant parts." },
  { id: "construction", name: "Construction & Mining", icon: "🏗️", description: "Wear-resistant components for heavy-duty applications." },
  { id: "energy", name: "Energy & Thermal Management", icon: "⚡", description: "Soft magnetic composites for electric motors and thermal management." },
  { id: "processing", name: "Processing Industry", icon: "🏭", description: "Filtration, catalysis, and chemical processing applications." },
  { id: "additive", name: "Additive Manufacturing", icon: "🖨️", description: "3D-printed metal powders for rapid prototyping and production." },
];

export const applications: Application[] = [
  {
    id: "gears",
    name: "Sintered Gears",
    icon: "⚙️",
    description: "High-strength gears for automotive transmissions and industrial drives. Requires excellent fatigue and wear resistance.",
    industries: ["automotive", "construction"],
    requiredProperties: ["tensileStrength", "hardness", "wearResistance", "fatigue"],
    recommendedMaterials: ["astaloy-crm", "astaloy-cra", "distaloy-aq"],
  },
  {
    id: "connecting-rods",
    name: "Connecting Rods",
    icon: "🔧",
    description: "High-performance connecting rods for combustion engines. Demands high tensile strength and fatigue resistance.",
    industries: ["automotive"],
    requiredProperties: ["tensileStrength", "fatigue", "hardness"],
    recommendedMaterials: ["astaloy-mo", "astaloy-85mo", "distaloy-dh"],
  },
  {
    id: "electric-motors",
    name: "Electric Motor Components",
    icon: "🔌",
    description: "Soft magnetic composite cores for high-efficiency electric motors in EV and industrial applications.",
    industries: ["automotive", "energy"],
    requiredProperties: ["compressibility", "costEfficiency", "sustainability"],
    recommendedMaterials: ["somaloy-700"],
  },
  {
    id: "surface-coating",
    name: "Surface Coating",
    icon: "🛡️",
    description: "Thermal spray and hardfacing powders for extreme wear and corrosion environments.",
    industries: ["construction", "processing", "aerospace"],
    requiredProperties: ["wearResistance", "corrosionResistance", "thermalResistance"],
    recommendedMaterials: ["fecral-21", "ss-316l"],
  },
  {
    id: "brazing",
    name: "Brazing",
    icon: "🔥",
    description: "Brazing filler metals and pastes for joining heat exchangers and ultra-pure water systems.",
    industries: ["energy", "processing"],
    requiredProperties: ["thermalResistance", "corrosionResistance"],
    recommendedMaterials: ["braze-nickel"],
  },
  {
    id: "additive-mfg",
    name: "3D Printing / Additive",
    icon: "🖨️",
    description: "Metal powders optimized for laser and electron beam melting, binder jetting, and DED processes.",
    industries: ["additive", "aerospace"],
    requiredProperties: ["tensileStrength", "corrosionResistance", "thermalResistance"],
    recommendedMaterials: ["am-316l", "am-tool-steel"],
  },
  {
    id: "valve-seats",
    name: "Valve Seat Inserts",
    icon: "🔩",
    description: "Wear-resistant valve seat inserts for internal combustion engines, demanding high hardness and heat resistance.",
    industries: ["automotive"],
    requiredProperties: ["hardness", "wearResistance", "thermalResistance"],
    recommendedMaterials: ["tool-steel-m2"],
  },
  {
    id: "filtration",
    name: "Filtration Products",
    icon: "🧫",
    description: "Porous metal filters for industrial filtration in textile, chemical, and water treatment.",
    industries: ["processing"],
    requiredProperties: ["corrosionResistance", "costEfficiency"],
    recommendedMaterials: ["ss-316l"],
  },
];

export const materials: Material[] = [
  {
    id: "astaloy-85mo",
    name: "Astaloy 85 Mo",
    brand: "Astaloy",
    category: "Low-alloy steel",
    description: "Pre-alloyed powder with 0.85% Mo. Excellent compressibility and homogeneous microstructure after sintering. Optimal hardenability for surface-hardened parts.",
    benefits: ["Excellent compressibility", "Homogeneous microstructure", "Optimal hardenability", "High surface hardness with strong core toughness"],
    applications: ["Gears", "Structural parts", "Surface-hardened components"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 72, hardness: 70, compressibility: 85, corrosionResistance: 30, wearResistance: 68, machinability: 70, costEfficiency: 75, sustainability: 60, thermalResistance: 55, fatigue: 72 },
    alloyComposition: "Fe + 0.85% Mo",
    process: ["Pressing & Sintering", "Sinter-hardening"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/astaloy_astaloy-85-mo_1539hog.pdf",
  },
  {
    id: "re-astaloy-85mo",
    name: "re- Astaloy 85 Mo",
    brand: "Astaloy",
    category: "Low-alloy steel (Sustainable)",
    description: "Identical properties to Astaloy 85 Mo with lower product carbon footprint via biogas replacement. Same performance, less environmental impact.",
    benefits: ["Identical to Astaloy 85 Mo", "Lower CO₂ footprint", "Same process compatibility", "Sustainable without compromise"],
    applications: ["Gears", "Structural parts", "Surface-hardened components"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 72, hardness: 70, compressibility: 85, corrosionResistance: 30, wearResistance: 68, machinability: 70, costEfficiency: 72, sustainability: 95, thermalResistance: 55, fatigue: 72 },
    alloyComposition: "Fe + 0.85% Mo (biogas process)",
    process: ["Pressing & Sintering", "Sinter-hardening"],
    isRe: true,
  },
  {
    id: "astaloy-mo",
    name: "Astaloy Mo",
    brand: "Astaloy",
    category: "Low-alloy steel",
    description: "Pre-alloyed with 1.5% Mo providing high hardenability. Ideal for sinter-hardening and case-hardening of high-performance components.",
    benefits: ["High hardenability", "Sinter-hardening capability", "Versatile alloy base", "Good dimensional stability"],
    applications: ["Connecting rods", "Gears", "High-strength structural parts"],
    industries: ["automotive"],
    properties: { tensileStrength: 78, hardness: 75, compressibility: 82, corrosionResistance: 28, wearResistance: 72, machinability: 65, costEfficiency: 68, sustainability: 55, thermalResistance: 58, fatigue: 78 },
    alloyComposition: "Fe + 1.5% Mo",
    process: ["Pressing & Sintering", "Sinter-hardening", "Case-hardening"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/astaloy_astaloy-mo_1543hog.pdf",
  },
  {
    id: "astaloy-a",
    name: "Astaloy A",
    brand: "Astaloy",
    category: "Low-alloy steel",
    description: "Pre-alloyed with Ni and Mo. Good combination of strength and toughness for medium-duty structural components.",
    benefits: ["Good strength-toughness balance", "Consistent dimensional change", "Well-established alloy"],
    applications: ["Structural parts", "Medium-duty gears"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 65, hardness: 60, compressibility: 78, corrosionResistance: 32, wearResistance: 55, machinability: 72, costEfficiency: 78, sustainability: 55, thermalResistance: 50, fatigue: 62 },
    alloyComposition: "Fe + Ni + Mo",
    process: ["Pressing & Sintering"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/astaloy_astaloy-a_1540hog.pdf",
  },
  {
    id: "astaloy-cra",
    name: "Astaloy CrA",
    brand: "Astaloy",
    category: "Low-alloy steel (Cr)",
    description: "Pure pre-alloyed chromium material. Cost-effective Cr-solution with robust processing and excellent wear resistance after nitriding.",
    benefits: ["Cost-effective Cr-solution", "Robust processing", "Excellent wear resistance after nitriding", "Low sensitivity to alloy cost fluctuations"],
    applications: ["Sintered gears", "Nitrided components", "Cost-sensitive structural parts"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 68, hardness: 65, compressibility: 80, corrosionResistance: 45, wearResistance: 75, machinability: 75, costEfficiency: 85, sustainability: 60, thermalResistance: 52, fatigue: 66 },
    alloyComposition: "Fe + 1.8% Cr",
    process: ["Pressing & Sintering", "Nitriding"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/astaloy_astaloy-cra_1541hog.pdf",
  },
  {
    id: "astaloy-crm",
    name: "Astaloy CrM",
    brand: "Astaloy",
    category: "Low-alloy steel (Cr-Mo)",
    description: "Pre-alloyed Cr-Mo powder for high-performance sinter-hardened components. Excellent hardenability and mechanical properties.",
    benefits: ["Excellent hardenability", "High mechanical properties", "Good for sinter-hardening", "Lean alloy design"],
    applications: ["High-performance gears", "Sinter-hardened parts", "Structural components"],
    industries: ["automotive"],
    properties: { tensileStrength: 82, hardness: 80, compressibility: 78, corrosionResistance: 42, wearResistance: 78, machinability: 60, costEfficiency: 70, sustainability: 58, thermalResistance: 60, fatigue: 80 },
    alloyComposition: "Fe + 3% Cr + 0.5% Mo",
    process: ["Pressing & Sintering", "Sinter-hardening"],
  },
  {
    id: "astaloy-crs",
    name: "Astaloy CrS",
    brand: "Astaloy",
    category: "Low-alloy steel (Sustainable)",
    description: "Developed for sustainability demands – recycled raw materials, circularity, high material utilization and low CO₂ footprint. Same properties as Fe-Cu-C.",
    benefits: ["Sustainable/circular", "Same properties as Fe-Cu-C", "High DC stability", "Improved machining vs Fe-Cu-C"],
    applications: ["Structural parts", "Sustainable components"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 58, hardness: 55, compressibility: 82, corrosionResistance: 40, wearResistance: 50, machinability: 80, costEfficiency: 80, sustainability: 92, thermalResistance: 48, fatigue: 55 },
    alloyComposition: "Fe + Cr (recycled)",
    process: ["Pressing & Sintering"],
    isRe: true,
  },
  {
    id: "distaloy-aq",
    name: "Distaloy AQ",
    brand: "Distaloy",
    category: "Diffusion-alloyed",
    description: "Optimized for heat-treated metal powder components. Maximum compressibility and strength with good consistency. Lean alloy with high hardened strength.",
    benefits: ["Lean alloy – high hardened strength", "High compressibility", "Excellent machinability as-sintered", "Good sizing properties"],
    applications: ["Heat-treated gears", "Precision components", "Structural parts"],
    industries: ["automotive"],
    properties: { tensileStrength: 75, hardness: 72, compressibility: 88, corrosionResistance: 25, wearResistance: 65, machinability: 82, costEfficiency: 72, sustainability: 55, thermalResistance: 50, fatigue: 74 },
    alloyComposition: "Fe + Ni + Mo (diffusion-bonded)",
    process: ["Pressing & Sintering", "Heat treatment"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/distaloy_aq_1509hog.pdf",
  },
  {
    id: "distaloy-sa",
    name: "Distaloy SA",
    brand: "Distaloy",
    category: "Diffusion-alloyed",
    description: "Diffusion-alloyed powder for good balance of strength and compressibility in structural PM components.",
    benefits: ["Good strength balance", "High compressibility", "Consistent properties"],
    applications: ["Structural parts", "Medium-duty components"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 62, hardness: 58, compressibility: 85, corrosionResistance: 28, wearResistance: 55, machinability: 78, costEfficiency: 80, sustainability: 55, thermalResistance: 48, fatigue: 60 },
    alloyComposition: "Fe + Ni + Cu + Mo (diffusion-bonded)",
    process: ["Pressing & Sintering"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/distaloy_sa_1533hog.pdf",
  },
  {
    id: "distaloy-ab",
    name: "Distaloy AB",
    brand: "Distaloy",
    category: "Diffusion-alloyed",
    description: "Versatile diffusion-alloyed powder for a wide range of structural and automotive applications.",
    benefits: ["Versatile alloy", "Good mechanical properties", "Wide processing window"],
    applications: ["General structural parts", "Automotive components"],
    industries: ["automotive"],
    properties: { tensileStrength: 68, hardness: 64, compressibility: 84, corrosionResistance: 26, wearResistance: 60, machinability: 76, costEfficiency: 75, sustainability: 55, thermalResistance: 50, fatigue: 66 },
    alloyComposition: "Fe + 1.75% Ni + 1.5% Cu + 0.5% Mo",
    process: ["Pressing & Sintering"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/distaloy_ab_1534hog.pdf",
  },
  {
    id: "distaloy-ae",
    name: "Distaloy AE",
    brand: "Distaloy",
    category: "Diffusion-alloyed",
    description: "Higher-alloyed powder for applications demanding superior strength and hardness.",
    benefits: ["High strength", "Good hardenability", "Suitable for sinter-hardening"],
    applications: ["High-strength parts", "Sinter-hardened components"],
    industries: ["automotive"],
    properties: { tensileStrength: 74, hardness: 70, compressibility: 82, corrosionResistance: 27, wearResistance: 65, machinability: 70, costEfficiency: 68, sustainability: 55, thermalResistance: 52, fatigue: 72 },
    alloyComposition: "Fe + 4% Ni + 1.5% Cu + 0.5% Mo",
    process: ["Pressing & Sintering", "Sinter-hardening"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/distaloy_ae_1535hog.pdf",
  },
  {
    id: "distaloy-dc",
    name: "Distaloy DC",
    brand: "Distaloy",
    category: "Diffusion-alloyed",
    description: "Copper-diffusion alloyed powder for cost-effective components with good strength.",
    benefits: ["Cost-effective", "Good strength", "Consistent dimensions"],
    applications: ["Cost-sensitive structural parts"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 55, hardness: 52, compressibility: 86, corrosionResistance: 22, wearResistance: 48, machinability: 82, costEfficiency: 88, sustainability: 55, thermalResistance: 45, fatigue: 52 },
    alloyComposition: "Fe + 2% Cu (diffusion-bonded)",
    process: ["Pressing & Sintering"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/distaloy_dc_1536hog.pdf",
  },
  {
    id: "distaloy-dh",
    name: "Distaloy DH",
    brand: "Distaloy",
    category: "Diffusion-alloyed",
    description: "High-performance diffusion-alloyed powder for demanding applications requiring excellent fatigue and impact strength.",
    benefits: ["Excellent fatigue properties", "High impact strength", "Premium performance"],
    applications: ["Connecting rods", "High-performance structural parts"],
    industries: ["automotive"],
    properties: { tensileStrength: 80, hardness: 76, compressibility: 80, corrosionResistance: 28, wearResistance: 70, machinability: 65, costEfficiency: 60, sustainability: 55, thermalResistance: 55, fatigue: 82 },
    alloyComposition: "Fe + Ni + Mo (high-performance)",
    process: ["Pressing & Sintering", "Warm compaction"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/distaloy_dh_1537hog.pdf",
  },
  {
    id: "distaloy-hp",
    name: "Distaloy HP",
    brand: "Distaloy",
    category: "Diffusion-alloyed",
    description: "Highest-alloyed Distaloy grade for maximum mechanical performance.",
    benefits: ["Maximum mechanical properties", "Premium alloy design", "Top fatigue resistance"],
    applications: ["High-load components", "Premium automotive parts"],
    industries: ["automotive"],
    properties: { tensileStrength: 85, hardness: 80, compressibility: 78, corrosionResistance: 30, wearResistance: 75, machinability: 60, costEfficiency: 55, sustainability: 55, thermalResistance: 58, fatigue: 85 },
    alloyComposition: "Fe + Ni + Cu + Mo (high-performance)",
    process: ["Pressing & Sintering", "Heat treatment"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/distaloy_hp_1538hog.pdf",
  },
  {
    id: "somaloy-700",
    name: "Somaloy® 700",
    brand: "Somaloy",
    category: "Soft Magnetic Composite",
    description: "Soft magnetic composite for 3D magnetic flux in electric motors and inductors. Enables innovative motor designs like axial flux machines.",
    benefits: ["3D magnetic flux paths", "Low core losses", "Design freedom for electric motors", "Isotropic magnetic properties"],
    applications: ["Electric motor stators", "Inductors", "Axial flux machines", "Solenoids"],
    industries: ["automotive", "energy"],
    properties: { tensileStrength: 35, hardness: 30, compressibility: 90, corrosionResistance: 40, wearResistance: 25, machinability: 60, costEfficiency: 70, sustainability: 75, thermalResistance: 65, fatigue: 30 },
    alloyComposition: "Iron powder with insulating coating",
    process: ["Compaction", "Heat treatment"],
  },
  {
    id: "ss-316l",
    name: "316L Stainless Steel",
    brand: "Stainless",
    category: "Stainless steel",
    description: "Austenitic stainless steel powder with excellent corrosion resistance. Used in medical, food processing, and chemical industry applications.",
    benefits: ["Excellent corrosion resistance", "Biocompatible", "Good formability", "Wide application range"],
    applications: ["Filtration", "Food processing", "Medical devices", "Chemical processing"],
    industries: ["processing", "energy"],
    properties: { tensileStrength: 50, hardness: 45, compressibility: 70, corrosionResistance: 92, wearResistance: 35, machinability: 55, costEfficiency: 55, sustainability: 65, thermalResistance: 60, fatigue: 45 },
    alloyComposition: "Fe + 17% Cr + 12% Ni + 2.5% Mo",
    process: ["Pressing & Sintering", "MIM", "Additive manufacturing"],
  },
  {
    id: "am-316l",
    name: "AM 316L",
    brand: "Stainless",
    category: "Additive Manufacturing",
    description: "Gas-atomized 316L stainless steel powder optimized for laser powder bed fusion and other AM processes.",
    benefits: ["Optimized particle size for AM", "High density builds", "Excellent corrosion resistance", "Well-characterized"],
    applications: ["3D printed medical implants", "Complex geometries", "Functional prototypes"],
    industries: ["additive", "processing"],
    properties: { tensileStrength: 55, hardness: 48, compressibility: 65, corrosionResistance: 90, wearResistance: 38, machinability: 50, costEfficiency: 45, sustainability: 68, thermalResistance: 62, fatigue: 50 },
    alloyComposition: "Fe + 17% Cr + 12% Ni + 2.5% Mo (gas atomized)",
    process: ["Laser PBF", "EBM", "Binder Jetting"],
  },
  {
    id: "am-tool-steel",
    name: "AM Tool Steel",
    brand: "ToolSteel",
    category: "Additive Manufacturing",
    description: "Tool steel powders for 3D printing of dies, molds, and tooling inserts with conformal cooling channels.",
    benefits: ["High hardness", "Wear resistant", "Conformal cooling capability", "Near-full density"],
    applications: ["3D printed tooling", "Injection mold inserts", "Die casting tooling"],
    industries: ["additive", "processing"],
    properties: { tensileStrength: 75, hardness: 88, compressibility: 55, corrosionResistance: 35, wearResistance: 90, machinability: 35, costEfficiency: 40, sustainability: 60, thermalResistance: 72, fatigue: 68 },
    alloyComposition: "Tool steel (H13 / M2 type)",
    process: ["Laser PBF", "DED"],
  },
  {
    id: "tool-steel-m2",
    name: "Tool Steel M2",
    brand: "ToolSteel",
    category: "High-speed steel",
    description: "High-speed tool steel powder for valve seat inserts and other wear-critical PM applications.",
    benefits: ["Extreme hardness", "Outstanding wear resistance", "High hot hardness"],
    applications: ["Valve seat inserts", "Cutting tools", "Wear parts"],
    industries: ["automotive", "construction"],
    properties: { tensileStrength: 60, hardness: 92, compressibility: 50, corrosionResistance: 25, wearResistance: 95, machinability: 25, costEfficiency: 45, sustainability: 50, thermalResistance: 80, fatigue: 55 },
    alloyComposition: "Fe + W + Mo + Cr + V",
    process: ["Pressing & Sintering", "HIP"],
  },
  {
    id: "fecral-21",
    name: "FeCrAl 21",
    brand: "FeCrAl",
    category: "Heat-resistant alloy",
    description: "Iron-chromium-aluminium alloy for high-temperature oxidation resistance. Used in heating elements and thermal spray coatings.",
    benefits: ["Excellent oxidation resistance", "High temperature capability", "Good form factor stability"],
    applications: ["Heating elements", "Thermal spray coating", "Catalytic converters"],
    industries: ["energy", "processing", "aerospace"],
    properties: { tensileStrength: 45, hardness: 40, compressibility: 55, corrosionResistance: 80, wearResistance: 50, machinability: 40, costEfficiency: 65, sustainability: 70, thermalResistance: 95, fatigue: 40 },
    alloyComposition: "Fe + 21% Cr + 5% Al",
    process: ["Surface coating", "Thermal spray"],
  },
  {
    id: "braze-nickel",
    name: "BrazeLet® Ni",
    brand: "Other",
    category: "Brazing filler metal",
    description: "Nickel-based brazing powder for joining heat exchangers, ultra-pure water applications, and high-temperature joints.",
    benefits: ["Strong joints at high temperature", "Ultra-pure water compatibility", "Excellent flow characteristics"],
    applications: ["Heat exchangers", "Ultra-pure water systems", "Aerospace joints"],
    industries: ["energy", "aerospace", "processing"],
    properties: { tensileStrength: 42, hardness: 35, compressibility: 45, corrosionResistance: 85, wearResistance: 30, machinability: 55, costEfficiency: 50, sustainability: 60, thermalResistance: 88, fatigue: 38 },
    alloyComposition: "Ni-based brazing alloy",
    process: ["Brazing"],
  },
  {
    id: "pnc60",
    name: "PNC 60",
    brand: "Iron",
    category: "Phosphorus iron",
    description: "Phosphorus-alloyed iron powder for soft magnetic applications with high resistivity and good magnetic properties.",
    benefits: ["High resistivity", "Good magnetic properties", "Cost-effective soft magnetic solution"],
    applications: ["Solenoids", "Magnetic cores", "Sensors"],
    industries: ["automotive", "energy"],
    properties: { tensileStrength: 40, hardness: 35, compressibility: 88, corrosionResistance: 30, wearResistance: 25, machinability: 80, costEfficiency: 85, sustainability: 65, thermalResistance: 45, fatigue: 35 },
    alloyComposition: "Fe + P",
    process: ["Pressing & Sintering"],
    dataSheetUrl: "https://www.hoganas.com/globalassets/downloads/libary/pressing-and-sintering_pnc60_1583hog.pdf",
  },
];

export const propertyLabels: Record<keyof Material["properties"], { label: string; description: string }> = {
  tensileStrength: { label: "Draghållfasthet", description: "Ultimate tensile strength – motstånd mot dragbelastning" },
  hardness: { label: "Hårdhet", description: "Motståndsförmåga mot deformation (HRC / HV)" },
  compressibility: { label: "Kompressibilitet", description: "Hur väl pulvret kan komprimeras till hög densitet" },
  corrosionResistance: { label: "Korrosionsresistens", description: "Motstånd mot kemisk nedbrytning och rost" },
  wearResistance: { label: "Slitstyrka", description: "Motstånd mot mekanisk nötning och slitage" },
  machinability: { label: "Bearbetbarhet", description: "Hur enkelt materialet kan bearbetas efter sintring" },
  costEfficiency: { label: "Kostnadseffektivitet", description: "Material- och processkostnad relativt prestanda" },
  sustainability: { label: "Hållbarhet", description: "Miljöpåverkan, CO₂-avtryck och cirkuläritet" },
  thermalResistance: { label: "Värmeresistens", description: "Prestanda vid förhöjda temperaturer" },
  fatigue: { label: "Utmattningshållfasthet", description: "Motstånd mot cyklisk belastning över tid" },
};
