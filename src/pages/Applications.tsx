import { useState } from "react";
import { type Material } from "@/data/materials";
import { loadComparedMaterials, saveComparedMaterials } from "@/lib/materialStorage";
import Header from "@/components/Header";
import ApplicationGuide from "@/components/ApplicationGuide";

const Applications = () => {
  const [compareList, setCompareList] = useState<Material[]>(loadComparedMaterials);

  const toggleCompare = (material: Material) => {
    setCompareList((prev) => {
      const exists = prev.some((m) => m.id === material.id);
      const next = exists ? prev.filter((m) => m.id !== material.id) : prev.length < 5 ? [...prev, material] : prev;
      saveComparedMaterials(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <ApplicationGuide onCompare={toggleCompare} compareList={compareList} />
      </main>
    </div>
  );
};

export default Applications;
