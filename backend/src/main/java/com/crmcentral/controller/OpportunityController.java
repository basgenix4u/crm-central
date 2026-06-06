package com.crmcentral.controller;

import com.crmcentral.dto.request.OpportunityRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Opportunity;
import com.crmcentral.enums.OpportunityStage;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.OpportunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/opportunities")
@RequiredArgsConstructor
public class OpportunityController {
    private final OpportunityService opportunityService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Opportunity>>> getAll(@AuthenticationPrincipal UserPrincipal p,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(opportunityService.getOpportunities(p.getTenantId(), PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Opportunity>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(opportunityService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Opportunity>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody OpportunityRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Opportunity created", opportunityService.create(p.getTenantId(), req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Opportunity>> update(@PathVariable UUID id, @Valid @RequestBody OpportunityRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Opportunity updated", opportunityService.update(id, req)));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<ApiResponse<Opportunity>> updateStage(@PathVariable UUID id, @RequestParam OpportunityStage stage) {
        return ResponseEntity.ok(ApiResponse.success(opportunityService.updateStage(id, stage)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        opportunityService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    @GetMapping("/pipeline")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPipelineMetrics(@AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(ApiResponse.success(opportunityService.getPipelineMetrics(p.getTenantId())));
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<ApiResponse<PagedResponse<Opportunity>>> getByStage(@AuthenticationPrincipal UserPrincipal p,
            @PathVariable OpportunityStage stage, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(opportunityService.getByStage(p.getTenantId(), stage, PageRequest.of(page, size))));
    }
}
