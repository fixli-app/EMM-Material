import { useState } from "react";
import { type Material } from "@/data/materials";
import { loadComparedMaterials, saveComparedMaterials } from "@/lib/materialStorage";
import SmartSelector from "@/components/SmartSelector";

const Index = () => {
  const [compareList, setCompareList] = useState<Material[]>(loadComparedMaterials);

  const toggleCompare = (material: Material) => {
    setCompareList((prev) => {
      const exists = prev.some((m) => m.id === material.id);
      const next = exists ? prev.filter((m) => m.id !== material.id) : prev.length < 5 ? [...prev, material] : prev;
      saveComparedMaterials(next);
      return next;
    });
  };

  return <SmartSelector onCompare={toggleCompare} compareList={compareList} />;
};

export default Index;
