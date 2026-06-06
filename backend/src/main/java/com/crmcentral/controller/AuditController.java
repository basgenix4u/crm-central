package com.crmcentral.controller;

import com.crmcentral.dto.response.*;
import com.crmcentral.entity.AuditLog;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/v1/audit-logs") @RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class AuditController {
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(auditService.getAuditLogs(p.getTenantId(), PageRequest.of(page, size))));
    }
}
