package com.ecocycle.backend.transaction;

import com.ecocycle.backend.material.MaterialService;
import com.ecocycle.backend.material.model.Material;
import com.ecocycle.backend.record.RecordService;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.transaction.dto.request.EarnPointsRequest;
import com.ecocycle.backend.transaction.dto.request.MaterialInput;
import com.ecocycle.backend.transaction.dto.response.EarnPointsResponse;
import com.ecocycle.backend.transaction.model.PointTransaction;
import com.ecocycle.backend.transaction.model.TransactionMaterial;
import com.ecocycle.backend.transaction.model.TransactionType;
import com.ecocycle.backend.transaction.repository.PointTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final RecordService recordService;
    private final PointTransactionRepository transactionRepository;
    private final MaterialService materialService;

    @Override
    @Transactional
    public EarnPointsResponse earnPoints(UUID recordId, EarnPointsRequest earnPointsRequest) {
        Record record = recordService.getRecordById(recordId);

        BigDecimal totalPoints = BigDecimal.ZERO;

        PointTransaction transaction = PointTransaction.builder()
                .record(record)
                .type(TransactionType.EARN)
                .build();

        for (MaterialInput input : earnPointsRequest.getMaterials()) {
            Material material = materialService.getMaterialById(input.getId());
            BigDecimal materialPoints = input.getWeight().multiply(BigDecimal.valueOf(material.getPointsPerKg())).setScale(2, RoundingMode.HALF_UP);

            totalPoints = totalPoints.add(materialPoints);

            transaction.getMaterials().add(
                    TransactionMaterial.builder()
                            .transaction(transaction)
                            .materialId(input.getId())
                            .weight(input.getWeight())
                            .points(materialPoints)
                            .build()
            );
        }

        transaction.setPoints(totalPoints);
        record.setPoints(record.getPoints().add(totalPoints));
        transactionRepository.save(transaction);

        return EarnPointsResponse.builder()
                .pointsEarned(totalPoints)
                .totalPoints(record.getPoints())
                .build();
    }
}
