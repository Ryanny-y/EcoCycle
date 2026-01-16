package com.ecocycle.backend.material.repository;

import com.ecocycle.backend.material.model.Material;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class MaterialRepositoryIntegrationTests {

    @Autowired
    private MaterialRepository underTest;

    /* =========================================================
       ---------------- existsByName -----------------------------
       ========================================================= */

    @Test
    public void existsByName_shouldReturnFalse() {
        boolean exists = underTest.existsByName("glass");
        assertThat(exists).isFalse();
    }

    @Test
    public void existsByName_shouldReturnTrue() {
        Material material = Material.builder()
                .name("glass")
                .description("Some glass")
                .imageUrl("fake-img.png")
                .build();

        underTest.save(material);

        boolean exists = underTest.existsByName("glass");
        assertThat(exists).isTrue();
    }

    /* =========================================================
       ---------------- existsByNameAndIdNot ---------------------
       ========================================================= */

    @Test
    public void existsByNameAndIdNot_shouldReturnTrue() {
        Material material1 = Material.builder()
                .name("glass")
                .description("Some glass")
                .imageUrl("fake-img.png")
                .build();

        Material material2 = Material.builder()
                .name("Paper")
                .description("Some Paper")
                .imageUrl("fake-img.png")
                .build();

        underTest.saveAll(List.of(material1, material2));

        boolean exists = underTest.existsByNameAndIdNot(
                "Paper",
                material1.getId()
        );

        assertThat(exists).isTrue();
    }

    @Test
    public void existsByNameAndIdNot_shouldReturnFalse() {
        Material material1 = Material.builder()
                .name("glass")
                .description("Some glass")
                .imageUrl("fake-img.png")
                .build();

        Material material2 = Material.builder()
                .name("Paper")
                .description("Some glass")
                .imageUrl("fake-img.png")
                .build();

        underTest.saveAll(List.of(material1, material2));

        boolean exists = underTest.existsByNameAndIdNot(
                "Bottle",
                material1.getId()
        );

        assertThat(exists).isFalse();
    }
}
