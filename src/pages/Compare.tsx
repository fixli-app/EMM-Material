import { useState } from "react";
import { type Material } from "@/data/materials";
import Header from "@/components/Header";
import ComparisonView from "@/components/ComparisonView";

const Compare = () => {
  const [compareList, setCompareList] = useState<Material[]>(() => {
    try { return JSON.parse(localStorage.getItem("hoganas-compare") || "[]"); } catch { return []; }
  });

  const removeMaterial = (id: string) => {
    setCompareList((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem("hoganas-compare", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ComparisonView materials={compareList} onRemove={removeMaterial} />
    </div>
  );
};

export default Compare;
