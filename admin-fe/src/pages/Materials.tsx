import PageHeader from "@/components/shared/PageHeader";
import MaterialsHeader from "./materials/MaterialsHeader";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MaterialsGrid from "./materials/MaterialsGrid";
import useMaterials from "@/contexts/MaterialsContext";
import AddMaterialModal from "./materials/AddMaterialModal";
import MaterialsTable from "./materials/MaterialsTable";
import EditMaterialModal from "./materials/EditMaterialModal";
import DeleteMaterialModal from "./materials/DeleteMaterialModal";
import type { IMaterial } from "@/types/material.types";

const Materials = () => {
  const [materialsLayout, setMaterialsLayout] = useState<"GRID" | "TABLE">(
    () => {
      const stored = localStorage.getItem("materialsLayout");
      return stored ? JSON.parse(stored) : "GRID";
    },
  );

  const { data, loading, error, refetchData } = useMaterials();

  const handleSetLayout = (value: "GRID" | "TABLE") => {
    setMaterialsLayout(value);
    localStorage.setItem("materialsLayout", JSON.stringify(value));
  };

  // modals
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [isDeleteMaterialOpen, setIsDeleteMaterialOpen] = useState(false);

  const [materialToEdit, setMaterialToEdit] = useState<IMaterial | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<IMaterial | null>(
    null,
  );

  const openEditMaterial = (material: IMaterial) => {
    setIsEditMaterialOpen(true);
    setMaterialToEdit(material);
  };

  const openDeleteMaterial = (material: IMaterial) => {
    setIsDeleteMaterialOpen(true);
    setMaterialToDelete(material);
  };

  return (
    <div id="reward_items" className="space-y-6">
      <PageHeader
        title="Materials"
        description="Manage materials for earning points"
      />

      {/* Search & Filters */}
      <MaterialsHeader
        materialsLayout={materialsLayout}
        handleSetLayout={handleSetLayout}
        setIsAddMaterialModalOpen={setIsAddMaterialModalOpen}
      />

      {/* DISPLAY MATERIALS */}
      {materialsLayout === "GRID" ? (
        <MaterialsGrid
          materialsData={{
            materials: data?.data,
            loading,
            error,
            refetchData,
          }}
          openEditMaterial={openEditMaterial}
          openDeleteMaterial={openDeleteMaterial}
        />
      ) : (
        <Card>
          <CardContent>
            <MaterialsTable
              materialsData={{
                materials: data?.data,
                loading,
                error,
                refetchData,
              }}
              openEditMaterial={openEditMaterial}
              openDeleteMaterial={openDeleteMaterial}
            />
          </CardContent>
        </Card>
      )}

      {/* MODALS */}
      {isAddMaterialModalOpen && (
        <AddMaterialModal
          isAddMaterialModalOpen={isAddMaterialModalOpen}
          setIsAddMaterialModalOpen={setIsAddMaterialModalOpen}
          refetchData={refetchData}
        />
      )}

      {isEditMaterialOpen && (
        <EditMaterialModal
          isEditMaterialOpen={isEditMaterialOpen}
          setIsEditMaterialOpen={setIsEditMaterialOpen}
          materialToEdit={materialToEdit}
          setMaterialToEdit={setMaterialToEdit}
          refetchData={refetchData}
        />
      )}

      {isDeleteMaterialOpen && materialToDelete && (
        <DeleteMaterialModal
          isDeleteMaterialOpen={isDeleteMaterialOpen}
          setIsDeleteMaterialOpen={setIsDeleteMaterialOpen}
          materialToDelete={materialToDelete}
          setMaterialToDelete={setMaterialToDelete}
          refetchData={refetchData}
        />
      )}
    </div>
  );
};

export default Materials;
