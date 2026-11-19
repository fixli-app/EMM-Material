import { useState } from "react";
import { type Material } from "@/data/materials";
import { loadComparedMaterials, saveComparedMaterials } from "@/lib/materialStorage";
import ComparisonView from "@/components/ComparisonView";

const Compare = () => {
  const [compareList, setCompareList] = useState<Material[]>(loadComparedMaterials);

  const removeMaterial = (id: string) => {
    setCompareList((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveComparedMaterials(next);
      return next;
    });
  };

  return <ComparisonView materials={compareList} onRemove={removeMaterial} />;
};

export default Compare;
