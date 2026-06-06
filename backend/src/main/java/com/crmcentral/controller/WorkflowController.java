package com.crmcentral.controller;

import com.crmcentral.dto.request.WorkflowRuleRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.WorkflowRule;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.WorkflowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/v1/workflows") @RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_MANAGER')")
public class WorkflowController {
    private final WorkflowService workflowService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkflowRule>>> getAll(@AuthenticationPrincipal UserPrincipal p) { return ResponseEntity.ok(ApiResponse.success(workflowService.getRules(p.getTenantId()))); }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkflowRule>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(workflowService.getById(id))); }
    @PostMapping
    public ResponseEntity<ApiResponse<WorkflowRule>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody WorkflowRuleRequest req) { return ResponseEntity.ok(ApiResponse.success(workflowService.create(p.getTenantId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkflowRule>> update(@PathVariable UUID id, @Valid @RequestBody WorkflowRuleRequest req) { return ResponseEntity.ok(ApiResponse.success(workflowService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { workflowService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
