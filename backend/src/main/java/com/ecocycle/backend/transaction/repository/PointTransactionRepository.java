package com.ecocycle.backend.transaction.repository;

import com.ecocycle.backend.transaction.model.PointTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PointTransactionRepository extends JpaRepository<PointTransaction, UUID> {
}
