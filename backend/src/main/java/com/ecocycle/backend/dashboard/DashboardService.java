package com.ecocycle.backend.dashboard;

import com.ecocycle.backend.dashboard.dto.response.DashboardDataResponse;
import org.springframework.data.domain.Pageable;


public interface DashboardService {

    DashboardDataResponse getDashboardData(Pageable pageable);

}
