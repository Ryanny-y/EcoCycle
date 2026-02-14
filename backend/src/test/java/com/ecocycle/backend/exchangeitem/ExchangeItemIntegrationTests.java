package com.ecocycle.backend.exchangeitem;

import com.ecocycle.backend.exchangeitem.dto.request.CreateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.dto.request.UpdateExchangeItemRequest;
import com.ecocycle.backend.exchangeitem.exceptions.ExchangeItemAlreadyExists;
import com.ecocycle.backend.exchangeitem.exceptions.ExchangeItemNotFoundException;
import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import com.ecocycle.backend.exchangeitem.model.Unit;
import com.ecocycle.backend.exchangeitem.repository.ExchangeItemRepository;
import com.ecocycle.backend.infrastructure.storage.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
public class ExchangeItemIntegrationTests {

    @Autowired
    private ExchangeItemService underTest;

    @MockitoBean
    private FileStorageService fileStorageService;

    @Autowired
    private ExchangeItemRepository exchangeItemRepository;

    /* =======================
       Setup and Helpers
     ======================= */
    @BeforeEach
    void setUp() {
        exchangeItemRepository.deleteAll();
    }

    private CreateExchangeItemRequest createExchangeItem(String name) {
        return CreateExchangeItemRequest.builder()
                .name(name)
                .description(name + " description")
                .itemType(ItemType.PRODUCT)
                .mainCategory(MainCategory.NON_AGRICULTURAL)
                .subCategory("Fertilizer")
                .stocks(10)
                .requiredPoints(1)
                .unit(Unit.KG)
                .farmOrigin(name + " Farm Origin")
                .image(new MockMultipartFile(
                        "image",
                        name + ".png",
                        "image/png",
                        "fake-content".getBytes()
                ))
                .build();
    }

    /* =========================================================
       ---------------- CREATE ExchangeItem --------------------
       ========================================================= */

    @Test
    void createExchangeItem_shouldCreateItemSuccessfully() {
        when(fileStorageService.uploadFile(any())).thenReturn("fake-img.png");

        ExchangeItem exchangeItem = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        assertThat(exchangeItem).isNotNull();
        assertThat(exchangeItem.getName()).isEqualTo("Liquid Fertilizer");
        assertThat(exchangeItem.getDescription()).isEqualTo("Liquid Fertilizer description");
        assertThat(exchangeItem.getFarmOrigin()).isEqualTo("Liquid Fertilizer Farm Origin");

        verify(fileStorageService, times(1)).uploadFile(any());
    }

    @Test
    void createExchangeItem_shouldThrow_whenExchangeItemAlreadyExists() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png")
                .thenReturn("fake-img.png1");

        underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        assertThatThrownBy(() ->
                underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"))
        ).isInstanceOf(ExchangeItemAlreadyExists.class)
                .hasMessageContaining("already exists");

        verify(fileStorageService, times(1)).uploadFile(any());
    }

    @Test
    void createExchangeItem_shouldReturnLastRestockedNull_inFirstCreeeatee() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        assertThat(item.getLastRestocked()).isNull();
        verify(fileStorageService, times(1)).uploadFile(any());
    }

    /* =========================================================
       ---------------- GET ExchangeItem ----------------------
       ========================================================= */
    @Test
    void getExchangeItems_shouldReturnAllExchangeItems() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png")
                .thenReturn("fake-img.png1");

        underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));
        underTest.createExchangeItem(createExchangeItem("Fertilizer"));

        List<ExchangeItem> exchangeItems = underTest.getExchangeItems(null, null, null);
        assertThat(exchangeItems).hasSize(2);
        assertThat(exchangeItems)
                .extracting(ExchangeItem::getName)
                .containsExactlyInAnyOrder("Liquid Fertilizer", "Fertilizer");

        verify(fileStorageService, times(2)).uploadFile(any());
    }

    @Test
    void getExchangeItems_shouldReturnEmptyList_whenNoExchangeItem() {
        List<ExchangeItem> exchangeItems = underTest.getExchangeItems(null, null, null);
        assertThat(exchangeItems).isEmpty();
    }
    
    /* =========================================================
       ---------------- GET ExchangeItem BY ID -----------------
       ========================================================= */
    
    @Test
    void getExchangeItemById_shouldReturnExchangeItem() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png");
        
        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));
        
        ExchangeItem found = underTest.getExchangeItemById(item.getId());
        
        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(item.getId());
        assertThat(found.getName()).isEqualTo(item.getName());
        
        verify(fileStorageService, times(1)).uploadFile(any());
    }

    @Test
    void getExchangeItemById_shouldThrow_whenNotFound() {
        assertThatThrownBy(() ->
                underTest.getExchangeItemById(UUID.randomUUID())
        ).isInstanceOf(ExchangeItemNotFoundException.class)
                .hasMessageContaining("not found");
    }
    
    /* =========================================================
       ---------------- Update ExchangeItem --------------------
       ========================================================= */

    @Test
    void updateExchangeItem_shouldUpdateFieldsSuccessfully() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .name("Updated name")
                .description("Updated description")
                .itemType(ItemType.FARM)
                .mainCategory(MainCategory.AGRICULTURAL)
                .subCategory("Updated sub category")
                .stocks(20)
                .requiredPoints(2)
                .unit(Unit.PIECE)
                .farmOrigin("Updated Farm origin")
                .build();

        ExchangeItem updated = underTest.updateExchangeItem(item.getId(), update);

        assertThat(updated.getName()).isEqualTo("Updated name");
        assertThat(updated.getDescription()).isEqualTo("Updated description");
        assertThat(updated.getItemType()).isEqualTo(ItemType.FARM);
        assertThat(updated.getMainCategory()).isEqualTo(MainCategory.AGRICULTURAL);
        assertThat(updated.getSubCategory()).isEqualTo("Updated sub category");
        assertThat(updated.getStocks()).isEqualTo(20);
        assertThat(updated.getRequiredPoints()).isEqualTo(2);
        assertThat(updated.getUnit()).isEqualTo(Unit.PIECE);
        assertThat(updated.getFarmOrigin()).isEqualTo("Updated Farm origin");
    }

    @Test
    void updateExchangeItem_shouldUpdateOnlyProvidedFields() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .name("Updated name")
                .build();

        ExchangeItem updated = underTest.updateExchangeItem(item.getId(), update);

        assertThat(updated.getName()).isEqualTo("Updated name");
        assertThat(updated.getDescription()).isEqualTo(item.getDescription());
        assertThat(updated.getItemType()).isEqualTo(item.getItemType());
        assertThat(updated.getMainCategory()).isEqualTo(item.getMainCategory());
        assertThat(updated.getSubCategory()).isEqualTo(item.getSubCategory());
        assertThat(updated.getStocks()).isEqualTo(item.getStocks());
        assertThat(updated.getRequiredPoints()).isEqualTo(item.getRequiredPoints());
        assertThat(updated.getUnit()).isEqualTo(item.getUnit());
        assertThat(updated.getFarmOrigin()).isEqualTo(item.getFarmOrigin());
    }

    @Test
    void updateExchangeItem_shouldReplaceImage_andDeleteOldAfterCommit() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("old-image.png")
                .thenReturn("new-image.png");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .image(new MockMultipartFile(
                        "image",
                        "new.png",
                        "image/png",
                        "new-Content".getBytes()
                ))
                .build();

        ExchangeItem updated = underTest.updateExchangeItem(item.getId(), update);

        assertThat(updated.getImageUrl()).isEqualTo("new-image.png");

        TestTransaction.flagForCommit();
        TestTransaction.end();

        verify(fileStorageService).deleteFile("old-image.png");
        verify(fileStorageService, times(2)).uploadFile(any());
    }

    @Test
    void updateExchangeItem_shouldNotUpdateImage_whenNoImageProvided() {
        when(fileStorageService.uploadFile(any())).thenReturn("original-image.jpg");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .name("Updated Title")
                .build();

        ExchangeItem updated = underTest.updateExchangeItem(item.getId(), update);

        assertThat(updated.getName()).isEqualTo("Updated Title");
        assertThat(updated.getImageUrl()).isEqualTo("original-image.jpg");
        verify(fileStorageService, times(1)).uploadFile(any());
    }

    @Test
    void updateExchangeItem_shouldUpdateLastRestocked_whenStockIncreases() {
        when(fileStorageService.uploadFile(any())).thenReturn("original-image.jpg");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        LocalDateTime previousLastRestocked =
                exchangeItemRepository.findById(item.getId())
                        .orElseThrow()
                        .getLastRestocked();

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .stocks(item.getStocks() + 10)
                .build();

        ExchangeItem updated = underTest.updateExchangeItem(item.getId(), update);

        assertThat(updated.getStocks()).isEqualTo(20);
        assertThat(updated.getLastRestocked()).isNotNull();

        if (previousLastRestocked != null) {
            assertThat(updated.getLastRestocked()).isAfter(previousLastRestocked);
        }
    }

    @Test
    void updateExchangeItem_shouldNotUpdateLastRestocked_whenStockIsLowerThanPreviousStock() {
        when(fileStorageService.uploadFile(any())).thenReturn("original-image.jpg");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        underTest.updateExchangeItem(
                item.getId(),
                UpdateExchangeItemRequest.builder()
                        .stocks(item.getStocks() + 10)
                        .build()
        );

        LocalDateTime previousLastRestocked =
                exchangeItemRepository.findById(item.getId())
                        .orElseThrow()
                        .getLastRestocked();

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .stocks(item.getStocks() - 10)
                .build();

        ExchangeItem updated = underTest.updateExchangeItem(item.getId(), update);

        assertThat(updated.getStocks()).isEqualTo(10);
        assertThat(updated.getLastRestocked()).isEqualTo(previousLastRestocked);
    }

    /* =========================================================
       ---------------- Delete ExchangeItem --------------------
       ========================================================= */
    @Test
    void deleteExchangeItem_shouldDeleteExchangeItem_andDeleteImageAfterCommit() {
        when(fileStorageService.uploadFile(any())).thenReturn("fake-img.png");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));

        underTest.deleteExchangeItem(item.getId());

        TestTransaction.flagForCommit();;
        TestTransaction.end();

        verify(fileStorageService).deleteFile("fake-img.png");

        assertThatThrownBy(() ->
                underTest.getExchangeItemById(item.getId())
        ).isInstanceOf(ExchangeItemNotFoundException.class);
    }

    /* =========================================================
       ---------------- EDGE CASES -----------------------------
       ========================================================= */

    @Test
    void updateExchangeItem_shouldThrow_whenUpdatingToExistingName() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png")
                .thenReturn("fake-img2.png");

        underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));
        ExchangeItem item2 = underTest.createExchangeItem(createExchangeItem("Fertilizer"));

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .name("Liquid Fertilizer")
                .build();

        assertThatThrownBy(() -> underTest.updateExchangeItem(item2.getId(), update))
                .isInstanceOf(ExchangeItemAlreadyExists.class)
                .hasMessageContaining("already exists");

        verify(fileStorageService, times(2)).uploadFile(any());
    }

    @Test
    void updateExchangeItem_shouldNotThrow_whenKeepingTheSameName() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("fake-img.png")
                .thenReturn("fake-img2.png");

        ExchangeItem item = underTest.createExchangeItem(createExchangeItem("Fertilizer"));

        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .name("Fertilizer")
                .description("Updated Description")
                .build();

        ExchangeItem updated = underTest.updateExchangeItem(item.getId(), update);

        assertThat(updated.getName()).isEqualTo("Fertilizer");
        assertThat(updated.getDescription()).isEqualTo("Updated Description");
    }

    @Test
    void deleteExchangeItem_shouldThrow_whenExchangeItemNotFound() {
        assertThatThrownBy(() -> underTest.deleteExchangeItem(UUID.randomUUID()))
                .isInstanceOf(ExchangeItemNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void createExchangeItem_shouldFailBeforeUpload_whenNameAlreadyExists() {
        when(fileStorageService.uploadFile(any())).thenReturn("fake-image.png");
        underTest.createExchangeItem(createExchangeItem("Fertilizer"));

        assertThatThrownBy(() -> underTest.createExchangeItem(createExchangeItem("Fertilizer")))
                .isInstanceOf(ExchangeItemAlreadyExists.class)
                .hasMessageContaining("already exists");

        verify(fileStorageService, times(1)).uploadFile(any());
        verify(fileStorageService, never()).deleteFile(any());
    }

    @Test
    void updateExchangeItem_shouldNotUploadFile_whenTitleAlreadyExists() {
        when(fileStorageService.uploadFile(any()))
                .thenReturn("img1.jpg")
                .thenReturn("img2.jpg");

        underTest.createExchangeItem(createExchangeItem("Liquid Fertilizer"));
        ExchangeItem secondExchangeItem = underTest.createExchangeItem(createExchangeItem("Recycling Hero"));

        // Try to update second exchange item with first exchange item's title (will fail)
        UpdateExchangeItemRequest update = UpdateExchangeItemRequest.builder()
                .name("Liquid Fertilizer") // Already exists
                .image(new MockMultipartFile("new-image", "new.png", "image/png", "content".getBytes()))
                .build();

        assertThatThrownBy(() ->
                underTest.updateExchangeItem(secondExchangeItem.getId(), update)
        ).isInstanceOf(ExchangeItemAlreadyExists.class);

        // Verify the uploaded file was deleted after rollback
        verify(fileStorageService, times(2)).uploadFile(any());
        verify(fileStorageService, never()).deleteFile(any());
    }

}
