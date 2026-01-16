package com.ecocycle.backend.material;

import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.dto.request.UpdateMaterialRequest;
import com.ecocycle.backend.material.exceptions.MaterialAlreadyExists;
import com.ecocycle.backend.material.exceptions.MaterialNotFoundException;
import com.ecocycle.backend.material.model.Material;
import com.ecocycle.backend.material.repository.MaterialRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class MaterialServiceIntegrationTest {

    @Autowired
    private MaterialService underTest;

    @MockitoBean
    private FileStorageService fileStorageService;

    @Autowired
    private MaterialRepository materialRepository;

    /* =======================
       Helpers
     ======================= */

    private CreateMaterialRequest createMaterial(String name) {
        return CreateMaterialRequest.builder()
                .name(name)
                .description(name + " description")
                .pointsPerKg(5)
                .image(new MockMultipartFile(
                        "image",
                        name + ".png",
                        "image/png",
                        "fake-content".getBytes()
                ))
                .build();
    }

    /* =========================================================
       ---------------- CREATE MATERIAL -------------------------
       ========================================================= */

    @Test
    void createMaterial_shouldCreateMaterialSuccessfully() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        Material material = underTest.createMaterial(createMaterial("Glass"));

        assertThat(material).isNotNull();
        assertThat(material.getName()).isEqualTo("Glass");
        assertThat(material.getImageUrl()).isEqualTo("image-key.jpg");
    }

    @Test
    void createMaterial_shouldThrow_whenMaterialAlreadyExists() {
        when(fileStorageService.uploadFile(any())).thenReturn("image1.jpg");

        underTest.createMaterial(createMaterial("Glass2"));

        assertThatThrownBy(() ->
                underTest.createMaterial(createMaterial("Glass2"))
        ).isInstanceOf(MaterialAlreadyExists.class);
    }

    /* =========================================================
       ---------------- GET MATERIALS ---------------------------
       ========================================================= */

    @Test
    void getMaterials_shouldReturnAllMaterials() {
        materialRepository.deleteAll();

        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        underTest.createMaterial(createMaterial("Glass1"));
        underTest.createMaterial(createMaterial("Plastic"));

        List<Material> materials = underTest.getMaterials();

        assertThat(materials).hasSize(2);
        assertThat(materials)
                .extracting(Material::getName)
                .containsExactlyInAnyOrder("Glass1", "Plastic");
    }

    /* =========================================================
       ---------------- GET MATERIAL BY ID ----------------------
       ========================================================= */

    @Test
    void getMaterialById_shouldReturnMaterial() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Material material = underTest.createMaterial(createMaterial("Glass"));

        Material found = underTest.getMaterialById(material.getId());

        assertThat(found.getId()).isEqualTo(material.getId());
    }

    @Test
    void getMaterialById_shouldThrow_whenNotFound() {
        assertThatThrownBy(() ->
                underTest.getMaterialById(UUID.randomUUID())
        ).isInstanceOf(MaterialNotFoundException.class);
    }

    /* =========================================================
       ---------------- UPDATE MATERIAL -------------------------
       ========================================================= */

    @Test
    void updateMaterial_shouldUpdateFieldsSuccessfully() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Material material = underTest.createMaterial(createMaterial("Glass"));

        UpdateMaterialRequest update = UpdateMaterialRequest.builder()
                .name("Clear Glass")
                .description("Updated desc")
                .pointsPerKg(10)
                .build();

        Material updated = underTest.updateMaterial(material.getId(), update);

        assertThat(updated.getName()).isEqualTo("Clear Glass");
        assertThat(updated.getDescription()).isEqualTo("Updated desc");
        assertThat(updated.getPointsPerKg()).isEqualTo(10);
    }

    @Test
    void updateMaterial_shouldReplaceImage_andDeleteOldAfterCommit() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("old-image.jpg")
                .thenReturn("new-image.jpg");

        Material material = underTest.createMaterial(createMaterial("Glass"));

        UpdateMaterialRequest update = UpdateMaterialRequest.builder()
                .image(new MockMultipartFile(
                        "image",
                        "new.png",
                        "image/png",
                        "new-content".getBytes()
                ))
                .build();

        Material updated = underTest.updateMaterial(material.getId(), update);

        assertThat(updated.getImageUrl()).isEqualTo("new-image.jpg");

        TestTransaction.flagForCommit();
        TestTransaction.end();
        TestTransaction.start();

        verify(fileStorageService).deleteFile("old-image.jpg");
    }

    /* =========================================================
       ---------------- DELETE MATERIAL -------------------------
       ========================================================= */

    @Test
    void deleteMaterial_shouldDeleteMaterial_andDeleteImageAfterCommit() {
        when(fileStorageService.uploadFile(any())).thenReturn("delete-image.jpg");

        Material material = underTest.createMaterial(createMaterial("Glass3"));

        underTest.deleteMaterial(material.getId());

        TestTransaction.flagForCommit();
        TestTransaction.end();
        TestTransaction.start();

        verify(fileStorageService).deleteFile("delete-image.jpg");

        assertThatThrownBy(() ->
                underTest.getMaterialById(material.getId())
        ).isInstanceOf(MaterialNotFoundException.class);
    }

    /* =========================================================
       ---------------- EDGE CASES ------------------------------
       ========================================================= */

    @Test
    void updateMaterial_shouldThrow_whenUpdatingToExistingName() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        Material glass = underTest.createMaterial(createMaterial("Glass"));
        Material plastic = underTest.createMaterial(createMaterial("Plastic"));

        UpdateMaterialRequest update = UpdateMaterialRequest.builder()
                .name("Plastic")
                .build();

        assertThatThrownBy(() ->
                underTest.updateMaterial(glass.getId(), update)
        ).isInstanceOf(MaterialAlreadyExists.class);
    }

    @Test
    void deleteMaterial_shouldThrow_whenMaterialDoesNotExist() {
        assertThatThrownBy(() ->
                underTest.deleteMaterial(UUID.randomUUID())
        ).isInstanceOf(MaterialNotFoundException.class);
    }

    @Test
    void updateMaterial_shouldThrow_whenMaterialDoesNotExist() {
        UpdateMaterialRequest update = UpdateMaterialRequest.builder()
                .name("Nonexistent")
                .build();

        assertThatThrownBy(() ->
                underTest.updateMaterial(UUID.randomUUID(), update)
        ).isInstanceOf(MaterialNotFoundException.class);
    }
}
