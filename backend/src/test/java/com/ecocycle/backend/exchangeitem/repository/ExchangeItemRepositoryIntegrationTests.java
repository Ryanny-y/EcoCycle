package com.ecocycle.backend.exchangeitem.repository;

import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import com.ecocycle.backend.exchangeitem.model.Unit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class ExchangeItemRepositoryIntegrationTests {

    @Autowired
    private ExchangeItemRepository underTest;

    /* =========================================================
       ---------------- existsByName -----------------------------
       ========================================================= */

    @Test
    void existsByName_shouldReturnFalse() {
        boolean exists = underTest.existsByName("Plastic Bottle");
        assertThat(exists).isFalse();
    }

    @Test
    void existsByName_shouldReturnTrue() {
        ExchangeItem item = createExchangeItem("Plastic Bottle");

        underTest.save(item);

        boolean exists = underTest.existsByName("Plastic Bottle");
        assertThat(exists).isTrue();
    }

    /* =========================================================
       ---------------- existsByNameAndIdNot ---------------------
       ========================================================= */

    @Test
    void existsByNameAndIdNot_shouldReturnTrue() {
        ExchangeItem item1 = createExchangeItem("Plastic Bottle");
        ExchangeItem item2 = createExchangeItem("Glass Jar");

        underTest.saveAll(List.of(item1, item2));

        boolean exists = underTest.existsByNameAndIdNot(
                "Glass Jar",
                item1.getId()
        );

        assertThat(exists).isTrue();
    }

    @Test
    void existsByNameAndIdNot_shouldReturnFalse() {
        ExchangeItem item1 = createExchangeItem("Plastic Bottle");
        ExchangeItem item2 = createExchangeItem("Glass Jar");

        underTest.saveAll(List.of(item1, item2));

        boolean exists = underTest.existsByNameAndIdNot(
                "Metal Can",
                item1.getId()
        );

        assertThat(exists).isFalse();
    }

    /* =========================================================
       ---------------- helper method ---------------------------
       ========================================================= */

    private ExchangeItem createExchangeItem(String name) {
        return ExchangeItem.builder()
                .name(name)
                .description("Test description")
                .itemType(ItemType.PRODUCT)
                .mainCategory(MainCategory.AGRICULTURAL)
                .subCategory("Plastic")
                .stocks(10)
                .requiredPoints(5)
                .unit(Unit.PIECES)
                .farmOrigin("Local Farm")
                .imageUrl("fake-img.png")
                .build();
    }
}
