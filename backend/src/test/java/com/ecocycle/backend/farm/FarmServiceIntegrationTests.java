package com.ecocycle.backend.farm;

import com.ecocycle.backend.farm.dto.FarmSizeDto;
import com.ecocycle.backend.farm.dto.LocationDto;
import com.ecocycle.backend.farm.dto.request.CreateFarmRequest;
import com.ecocycle.backend.farm.dto.request.UpdateFarmRequest;
import com.ecocycle.backend.farm.exceptions.FarmAlreadyExists;
import com.ecocycle.backend.farm.exceptions.FarmNotFoundException;
import com.ecocycle.backend.farm.model.*;
import com.ecocycle.backend.farm.repository.FarmRepository;
import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import com.ecocycle.backend.infrastructure.storage.TransactionalFileDeletionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class FarmServiceIntegrationTests {

    @Autowired
    private FarmService underTest;

    @MockitoBean
    private FileStorageService fileStorageService;

    @MockitoBean
    private TransactionalFileDeletionService transactionalFileDeletionService;

    @Autowired
    private FarmRepository farmRepository;

    /* =======================
       Setup and Helpers
     ======================= */

    @BeforeEach
    void setUp() {
        // Clear database before each test
        farmRepository.deleteAll();
    }

    private CreateFarmRequest createFarm(String name) {
        List<FarmType> farmTypes = new ArrayList<>();
        farmTypes.add(FarmType.VEGETABLES);
        farmTypes.add(FarmType.FRUITS);

        return CreateFarmRequest.builder()
                .name(name)
                .description(name + " - A sustainable farm")
                .location(LocationDto.builder()
                        .latitude(14.5995)
                        .longitude(120.9842)
                        .build())
                .size(FarmSizeDto.builder()
                        .value(10.5)
                        .unit(SizeUnit.HECTARES)
                        .build())
                .establishedAt(LocalDate.of(2010, 5, 15))
                .farmTypes(farmTypes)
                .address("123 " + name + " Street, Farm City")
                .image(new MockMultipartFile(
                        "image",
                        name + ".png",
                        "image/png",
                        "fake-content".getBytes()
                ))
                .build();
    }

    private List<FarmType> createFarmTypes(FarmType... types) {
        return new ArrayList<>(List.of(types));
    }

    /* =========================================================
       ---------------- CREATE FARM -----------------------------
       ========================================================= */

    @Test
    void createFarm_shouldCreateFarmSuccessfully() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        assertThat(farm).isNotNull();
        assertThat(farm.getName()).isEqualTo("Green Valley Farm");
        assertThat(farm.getDescription()).contains("sustainable farm");
        assertThat(farm.getLocation().getLatitude()).isEqualTo(14.5995);
        assertThat(farm.getLocation().getLongitude()).isEqualTo(120.9842);
        assertThat(farm.getSize().getValue()).isEqualTo(10.5);
        assertThat(farm.getSize().getUnit()).isEqualTo(SizeUnit.HECTARES);
        assertThat(farm.getEstablishedAt()).isEqualTo(LocalDate.of(2010, 5, 15));
        assertThat(farm.getFarmTypes()).containsExactlyInAnyOrder(FarmType.VEGETABLES, FarmType.FRUITS);
        assertThat(farm.getAddress()).contains("Green Valley Farm Street");
        assertThat(farm.getImageUrl()).isEqualTo("image-key.jpg");
    }

    @Test
    void createFarm_shouldThrow_whenFarmAlreadyExists() {
        when(fileStorageService.uploadFile(any())).thenReturn("image1.jpg");

        underTest.createFarm(createFarm("Green Valley Farm"));

        assertThatThrownBy(() ->
                underTest.createFarm(createFarm("Green Valley Farm"))
        ).isInstanceOf(FarmAlreadyExists.class)
                .hasMessageContaining("already exists");
    }

    /* =========================================================
       ---------------- GET FARMS -------------------------------
       ========================================================= */

    @Test
    void getFarms_shouldReturnAllFarms() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        underTest.createFarm(createFarm("Green Valley Farm"));
        underTest.createFarm(createFarm("Sunshine Farm"));

        List<Farm> farms = underTest.getFarms();

        assertThat(farms).hasSize(2);
        assertThat(farms)
                .extracting(Farm::getName)
                .containsExactlyInAnyOrder("Green Valley Farm", "Sunshine Farm");
    }

    @Test
    void getFarms_shouldReturnEmptyList_whenNoFarms() {
        List<Farm> farms = underTest.getFarms();

        assertThat(farms).isEmpty();
    }

    /* =========================================================
       ---------------- GET FARM BY ID --------------------------
       ========================================================= */

    @Test
    void getFarmById_shouldReturnFarm() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        Farm found = underTest.getFarmById(farm.getId());

        assertThat(found.getId()).isEqualTo(farm.getId());
        assertThat(found.getName()).isEqualTo("Green Valley Farm");
        assertThat(found.getFarmTypes()).hasSize(2);
    }

    @Test
    void getFarmById_shouldThrow_whenNotFound() {
        assertThatThrownBy(() ->
                underTest.getFarmById(UUID.randomUUID())
        ).isInstanceOf(FarmNotFoundException.class)
                .hasMessageContaining("not found");
    }

    /* =========================================================
       ---------------- UPDATE FARM -----------------------------
       ========================================================= */

    @Test
    void updateFarm_shouldUpdateFieldsSuccessfully() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        List<FarmType> newTypes = createFarmTypes(FarmType.HYDROPONICS, FarmType.AQUAPONICS);

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .name("Green Valley Organic Farm")
                .description("Updated description - Now 100% organic")
                .location(LocationDto.builder()
                        .latitude(14.6000)
                        .longitude(120.9850)
                        .build())
                .size(FarmSizeDto.builder()
                        .value(15.0)
                        .unit(SizeUnit.ACRES)
                        .build())
                .establishedAt(LocalDate.of(2012, 6, 20))
                .farmTypes(newTypes)
                .address("456 Updated Street, Farm City")
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getName()).isEqualTo("Green Valley Organic Farm");
        assertThat(updated.getDescription()).contains("100% organic");
        assertThat(updated.getLocation().getLatitude()).isEqualTo(14.6000);
        assertThat(updated.getLocation().getLongitude()).isEqualTo(120.9850);
        assertThat(updated.getSize().getValue()).isEqualTo(15.0);
        assertThat(updated.getSize().getUnit()).isEqualTo(SizeUnit.ACRES);
        assertThat(updated.getEstablishedAt()).isEqualTo(LocalDate.of(2012, 6, 20));
        assertThat(updated.getFarmTypes()).containsExactlyInAnyOrder(FarmType.HYDROPONICS, FarmType.AQUAPONICS);
        assertThat(updated.getAddress()).contains("Updated Street");
    }

    @Test
    void updateFarm_shouldUpdateOnlyProvidedFields() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));
        Location originalLocation = farm.getLocation();
        FarmSize originalSize = farm.getSize();
        LocalDate originalEstablishedAt = farm.getEstablishedAt();

        // Only update name and description
        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .name("Updated Farm Name")
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getName()).isEqualTo("Updated Farm Name");
        assertThat(updated.getDescription()).isEqualTo(farm.getDescription());
        assertThat(updated.getLocation()).isEqualTo(originalLocation);
        assertThat(updated.getSize()).isEqualTo(originalSize);
        assertThat(updated.getEstablishedAt()).isEqualTo(originalEstablishedAt);
        assertThat(updated.getFarmTypes()).isEqualTo(farm.getFarmTypes());
        assertThat(updated.getAddress()).isEqualTo(farm.getAddress());
        assertThat(updated.getImageUrl()).isEqualTo(farm.getImageUrl());
    }

    @Test
    void updateFarm_shouldReplaceImage_andScheduleOldForDeletion() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("old-image.jpg")
                .thenReturn("new-image.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .image(new MockMultipartFile(
                        "image",
                        "new.png",
                        "image/png",
                        "new-content".getBytes()
                ))
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getImageUrl()).isEqualTo("new-image.jpg");

        // Verify deletion was scheduled
        verify(transactionalFileDeletionService).deleteAfterCommit("old-image.jpg");
    }

    @Test
    void updateFarm_shouldRollbackNewImageUpload_whenException() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("old-image.jpg")
                .thenReturn("new-image.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        // Simulate exception after file upload
        doThrow(new RuntimeException("Database error"))
                .when(transactionalFileDeletionService).deleteAfterCommit(any());

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .image(new MockMultipartFile(
                        "image",
                        "new.png",
                        "image/png",
                        "new-content".getBytes()
                ))
                .build();

        assertThatThrownBy(() ->
                underTest.updateFarm(farm.getId(), update)
        ).isInstanceOf(RuntimeException.class)
                .hasMessage("Database error");

        // Verify new image was deleted after rollback
        verify(fileStorageService).deleteFile("new-image.jpg");
    }

    @Test
    void updateFarm_shouldThrow_whenUpdatingToExistingName() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        underTest.createFarm(createFarm("Green Valley Farm"));
        Farm secondFarm = underTest.createFarm(createFarm("Sunshine Farm"));

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .name("Green Valley Farm")
                .build();

        assertThatThrownBy(() ->
                underTest.updateFarm(secondFarm.getId(), update)
        ).isInstanceOf(FarmAlreadyExists.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void updateFarm_shouldNotThrow_whenKeepingSameName() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .name("Green Valley Farm") // Same name
                .description("Updated description")
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getName()).isEqualTo("Green Valley Farm");
        assertThat(updated.getDescription()).isEqualTo("Updated description");
    }

    @Test
    void updateFarm_shouldThrow_whenFarmDoesNotExist() {
        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .name("Nonexistent Farm")
                .build();

        assertThatThrownBy(() ->
                underTest.updateFarm(UUID.randomUUID(), update)
        ).isInstanceOf(FarmNotFoundException.class)
                .hasMessageContaining("not found");
    }

    /* =========================================================
       ---------------- DELETE FARM -----------------------------
       ========================================================= */

    @Test
    void deleteFarm_shouldDeleteFarm_andScheduleImageDeletion() {
        when(fileStorageService.uploadFile(any())).thenReturn("delete-image.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        underTest.deleteFarm(farm.getId());

        // Verify deletion was scheduled
        verify(transactionalFileDeletionService).deleteAfterCommit("delete-image.jpg");

        assertThatThrownBy(() ->
                underTest.getFarmById(farm.getId())
        ).isInstanceOf(FarmNotFoundException.class);
    }

    @Test
    void deleteFarm_shouldThrow_whenFarmDoesNotExist() {
        assertThatThrownBy(() ->
                underTest.deleteFarm(UUID.randomUUID())
        ).isInstanceOf(FarmNotFoundException.class)
                .hasMessageContaining("not found");
    }

    /* =========================================================
       ---------------- SPECIAL CASES ---------------------------
       ========================================================= */

    @Test
    void updateFarm_withNullValues_shouldKeepExistingValues() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        // Create update request with all nulls (should keep everything)
        UpdateFarmRequest update = UpdateFarmRequest.builder().build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getName()).isEqualTo(farm.getName());
        assertThat(updated.getDescription()).isEqualTo(farm.getDescription());
        assertThat(updated.getLocation()).isEqualTo(farm.getLocation());
        assertThat(updated.getSize()).isEqualTo(farm.getSize());
        assertThat(updated.getEstablishedAt()).isEqualTo(farm.getEstablishedAt());
        assertThat(updated.getFarmTypes()).isEqualTo(farm.getFarmTypes());
        assertThat(updated.getAddress()).isEqualTo(farm.getAddress());
        assertThat(updated.getImageUrl()).isEqualTo(farm.getImageUrl());
    }

    @Test
    void updateFarm_shouldHandleEmptyFarmTypes() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .farmTypes(new ArrayList<>()) // Empty set
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getFarmTypes()).isEmpty();
    }

    @Test
    void createFarm_shouldHandleNullDescription() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        List<FarmType> farmTypes = createFarmTypes(FarmType.VEGETABLES);

        CreateFarmRequest request = CreateFarmRequest.builder()
                .name("Test Farm")
                .description(null) // Null description
                .location(LocationDto.builder()
                        .latitude(14.5)
                        .longitude(121.0)
                        .build())
                .size(FarmSizeDto.builder()
                        .value(5.0)
                        .unit(SizeUnit.SQUARE_METERS)
                        .build())
                .establishedAt(LocalDate.of(2020, 1, 1))
                .farmTypes(farmTypes)
                .address("123 Street")
                .image(new MockMultipartFile("image", "farm.png", "image/png", "content".getBytes()))
                .build();

        Farm farm = underTest.createFarm(request);

        assertThat(farm.getName()).isEqualTo("Test Farm");
        assertThat(farm.getDescription()).isNull();
    }

    @Test
    void updateFarm_shouldSetNullDescription_whenProvided() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        // Initially has a description
        assertThat(farm.getDescription()).isNotNull();

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .description(null) // Set to null
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getDescription()).isNull();
    }

    @Test
    void createFarm_shouldCreateNewLocationAndSizeObjects() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        CreateFarmRequest request = createFarm("Test Farm");
        Farm farm = underTest.createFarm(request);

        // Verify new objects were created (not same instance as request)
        assertThat(farm.getLocation()).isNotNull();
        assertThat(farm.getSize()).isNotNull();

        // Verify values match
        assertThat(farm.getLocation().getLatitude()).isEqualTo(14.5995);
        assertThat(farm.getLocation().getLongitude()).isEqualTo(120.9842);
        assertThat(farm.getSize().getValue()).isEqualTo(10.5);
        assertThat(farm.getSize().getUnit()).isEqualTo(SizeUnit.HECTARES);
    }

    /* =========================================================
       ---------------- SIZE UNIT TESTS -------------------------
       ========================================================= */

    @Test
    void createFarm_shouldHandleDifferentSizeUnits() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        List<FarmType> farmTypes = createFarmTypes(FarmType.BACKYARD_GARDEN);

        CreateFarmRequest request = CreateFarmRequest.builder()
                .name("Backyard Farm")
                .description("Small backyard farm")
                .location(LocationDto.builder()
                        .latitude(14.5)
                        .longitude(121.0)
                        .build())
                .size(FarmSizeDto.builder()
                        .value(100.0)
                        .unit(SizeUnit.SQUARE_METERS)
                        .build())
                .establishedAt(LocalDate.of(2020, 1, 1))
                .farmTypes(farmTypes)
                .address("456 Backyard Lane")
                .image(new MockMultipartFile("image", "farm.png", "image/png", "content".getBytes()))
                .build();

        Farm farm = underTest.createFarm(request);

        assertThat(farm.getSize().getValue()).isEqualTo(100.0);
        assertThat(farm.getSize().getUnit()).isEqualTo(SizeUnit.SQUARE_METERS);
    }

    @Test
    void updateFarm_shouldUpdateSizeUnit() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .size(FarmSizeDto.builder()
                        .value(5.0)
                        .unit(SizeUnit.ACRES)
                        .build())
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getSize().getValue()).isEqualTo(5.0);
        assertThat(updated.getSize().getUnit()).isEqualTo(SizeUnit.ACRES);
    }

    /* =========================================================
       ---------------- FARM TYPE TESTS -------------------------
       ========================================================= */

    @Test
    void createFarm_shouldHandleSingleFarmType() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        List<FarmType> farmTypes = createFarmTypes(FarmType.HYDROPONICS);

        CreateFarmRequest request = CreateFarmRequest.builder()
                .name("Hydroponic Farm")
                .description("High-tech hydroponic farm")
                .location(LocationDto.builder()
                        .latitude(14.5)
                        .longitude(121.0)
                        .build())
                .size(FarmSizeDto.builder()
                        .value(2.0)
                        .unit(SizeUnit.SQUARE_METERS)
                        .build())
                .establishedAt(LocalDate.of(2021, 3, 15))
                .farmTypes(farmTypes)
                .address("789 Tech Street")
                .image(new MockMultipartFile("image", "farm.png", "image/png", "content".getBytes()))
                .build();

        Farm farm = underTest.createFarm(request);

        assertThat(farm.getFarmTypes()).hasSize(1);
        assertThat(farm.getFarmTypes()).contains(FarmType.HYDROPONICS);
    }

    @Test
    void createFarm_shouldHandleMultipleFarmTypes() {
        when(fileStorageService.uploadFile(any())).thenReturn("image-key.jpg");

        List<FarmType> farmTypes = createFarmTypes(FarmType.VEGETABLES, FarmType.FRUITS, FarmType.POULTRY, FarmType.MIXED);

        CreateFarmRequest request = CreateFarmRequest.builder()
                .name("Mixed Farm")
                .description("Mixed farming operation")
                .location(LocationDto.builder()
                        .latitude(14.5)
                        .longitude(121.0)
                        .build())
                .size(FarmSizeDto.builder()
                        .value(20.0)
                        .unit(SizeUnit.HECTARES)
                        .build())
                .establishedAt(LocalDate.of(2015, 8, 1))
                .farmTypes(farmTypes)
                .address("101 Mixed Farm Road")
                .image(new MockMultipartFile("image", "farm.png", "image/png", "content".getBytes()))
                .build();

        Farm farm = underTest.createFarm(request);

        assertThat(farm.getFarmTypes()).hasSize(4);
        assertThat(farm.getFarmTypes()).containsExactlyInAnyOrder(
                FarmType.VEGETABLES,
                FarmType.FRUITS,
                FarmType.POULTRY,
                FarmType.MIXED
        );
    }

    @Test
    void updateFarm_shouldUpdateFarmTypes_completelyReplace() {
        when(fileStorageService.uploadFile(any())).thenReturn("img.jpg");

        Farm farm = underTest.createFarm(createFarm("Green Valley Farm"));

        // Initially has VEGETABLES and FRUITS
        assertThat(farm.getFarmTypes()).containsExactlyInAnyOrder(FarmType.VEGETABLES, FarmType.FRUITS);

        // Update to completely different types
        List<FarmType> newTypes = createFarmTypes(FarmType.LIVESTOCK, FarmType.POULTRY, FarmType.MIXED);

        UpdateFarmRequest update = UpdateFarmRequest.builder()
                .farmTypes(newTypes)
                .build();

        Farm updated = underTest.updateFarm(farm.getId(), update);

        assertThat(updated.getFarmTypes()).hasSize(3);
        assertThat(updated.getFarmTypes()).containsExactlyInAnyOrder(
                FarmType.LIVESTOCK,
                FarmType.POULTRY,
                FarmType.MIXED
        );
        // Verify old types are gone
        assertThat(updated.getFarmTypes()).doesNotContain(FarmType.VEGETABLES, FarmType.FRUITS);
    }
}