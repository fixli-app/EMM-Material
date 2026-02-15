import { useState } from "react";
import { type Material } from "@/data/materials";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";

const Contact = () => {
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
      <ContactForm selectedMaterials={compareList} onRemoveMaterial={removeMaterial} />
    </div>
  );
};

export default Contact;
