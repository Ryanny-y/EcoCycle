package com.ecocycle.backend.exchangeitem.repository;

import com.ecocycle.backend.exchangeitem.model.ExchangeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExchangeItemRepository extends JpaRepository<ExchangeItem, UUID> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, UUID id);
}