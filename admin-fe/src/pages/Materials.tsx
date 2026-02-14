import PageHeader from "@/components/shared/PageHeader";
import MaterialsHeader from "./materials/MaterialsHeader";
import { useState } from "react";
import type { Material } from "@/types/dto";

const Materials = () => {
  const [materialsLayout, setMaterialsLayout] = useState<"GRID" | "TABLE">(
    () => {
      const stored = localStorage.getItem("materialsLayout");
      return stored ? JSON.parse(stored) : "GRID";
    },
  );

  const handleSetLayout = (value: "GRID" | "TABLE") => {
    setMaterialsLayout(value);
    localStorage.setItem("materialsLayout", JSON.stringify(value));
  };

  // modals
    const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
    const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
    const [isDeleteMaterialOpen, setIsDeleteMaterialOpen] = useState(false);
  
    const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null);
    const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  
    const openEditMaterial = (material: Material) => {
      setIsEditMaterialOpen(true);
      setMaterialToEdit(material);
    };
  
    const openDeleteMaterial = (material: Material) => {
      setIsDeleteMaterialOpen(true);
      setMaterialToDelete(material);
    };
  

  return (
    <div id="reward_items" className="space-y-6">
      <PageHeader
        title="Materials"
        description="Manage materials for earning points"
      />

      <MaterialsHeader
        materialsLayout={materialsLayout}
        handleSetLayout={handleSetLayout}
        setIsAddMaterialModalOpen={setIsAddMaterialModalOpen}
      />
    </div>
  );
};

export default Materials;
