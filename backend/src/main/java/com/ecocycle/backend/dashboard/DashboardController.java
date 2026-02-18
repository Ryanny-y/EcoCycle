package com.ecocycle.backend.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecocycle.backend.dashboard.dto.response.DashboardDataResponse;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDataResponse> getDashboardData(Pageable pageable) {
        DashboardDataResponse response = dashboardService.getDashboardData(pageable);
        return ResponseEntity.ok(response);
    }
}
