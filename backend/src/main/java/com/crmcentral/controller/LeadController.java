package com.crmcentral.controller;

import com.crmcentral.dto.request.LeadRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.*;
import com.crmcentral.enums.LeadStatus;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/leads")
@RequiredArgsConstructor
public class LeadController {
    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Lead>>> getLeads(@AuthenticationPrincipal UserPrincipal p,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeads(p.getTenantId(), PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> getLead(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Lead>> createLead(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lead created", leadService.createLead(p.getTenantId(), request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> updateLead(@PathVariable UUID id, @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lead updated", leadService.updateLead(id, request)));
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<ApiResponse<Customer>> convertLead(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lead converted to customer", leadService.convertLeadToCustomer(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable UUID id) {
        leadService.deleteLead(id); return ResponseEntity.ok(ApiResponse.success("Lead deleted", null));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<PagedResponse<Lead>>> getByStatus(@AuthenticationPrincipal UserPrincipal p,
            @PathVariable LeadStatus status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadsByStatus(p.getTenantId(), status, PageRequest.of(page, size))));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<Lead>>> searchLeads(@AuthenticationPrincipal UserPrincipal p,
            @RequestParam String q, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(leadService.searchLeads(p.getTenantId(), q, PageRequest.of(page, size))));
    }
}
