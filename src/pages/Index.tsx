import { useState } from "react";
import { type Material } from "@/data/materials";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartSelector from "@/components/SmartSelector";

const Index = () => {
  const [compareList, setCompareList] = useState<Material[]>(() => {
    try {
      const stored = localStorage.getItem("hoganas-compare");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const toggleCompare = (material: Material) => {
    setCompareList((prev) => {
      const exists = prev.some((m) => m.id === material.id);
      const next = exists ? prev.filter((m) => m.id !== material.id) : prev.length < 5 ? [...prev, material] : prev;
      localStorage.setItem("hoganas-compare", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <SmartSelector onCompare={toggleCompare} compareList={compareList} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
