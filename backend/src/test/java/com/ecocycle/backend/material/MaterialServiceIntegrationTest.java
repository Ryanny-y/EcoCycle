package com.ecocycle.backend.material;

import com.ecocycle.backend.infrastructure.storage.TestFileStorageConfig;
import com.ecocycle.backend.material.dto.request.CreateMaterialRequest;
import com.ecocycle.backend.material.model.Material;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
@Transactional
@ContextConfiguration(classes = {
        TestFileStorageConfig.class
})
public class MaterialServiceIntegrationTest {

    private final MaterialService underTest;

    @Autowired
    public MaterialServiceIntegrationTest(MaterialService underTest) {
        this.underTest = underTest;
    }

    @Test
    void createMaterial_shouldSaveMaterialWithoutUploadingToS3() {
        CreateMaterialRequest request = CreateMaterialRequest.builder()
                .name("Glass")
                .description("Recyclable glass")
                .pointsPerKg(5)
                .image(new MockMultipartFile(
                        "image",
                        "glass.png",
                        "image/png",
                        "fake-content".getBytes()
                ))
                .build();

        Material material = underTest.createMaterial(request);

        assertThat(material).isNotNull();
        assertThat(material.getImageUrl()).isEqualTo("fake/key.png");
        assertThat(material.getName()).isEqualTo("Glass");
    }

}
