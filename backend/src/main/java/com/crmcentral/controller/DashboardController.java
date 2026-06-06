package com.crmcentral.controller;

import com.crmcentral.dto.response.*;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/v1/dashboard") @RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(@AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboard(p.getTenantId())));
    }
}
