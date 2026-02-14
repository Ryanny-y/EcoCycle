package com.ecocycle.backend.exchangeitem.repository;

import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import com.ecocycle.backend.exchangeitem.model.ItemType;
import com.ecocycle.backend.exchangeitem.model.MainCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExchangeItemRepository extends JpaRepository<ExchangeItem, UUID> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, UUID id);

    @Query("""
            SELECT e FROM ExchangeItem e
            WHERE (:search IS NULL OR e.name ILIKE %:search%)
              AND (:mainCategory IS NULL OR e.mainCategory = :mainCategory)
              AND (:itemType IS NULL OR e.itemType = :itemType)
            ORDER BY e.createdAt DESC
            """)
    List<ExchangeItem> findAllBySearchMainCategoryItemType(
      @Param("search") String search,
      @Param("mainCategory") MainCategory mainCategory,
      @Param("itemType") ItemType itemType
    );
}