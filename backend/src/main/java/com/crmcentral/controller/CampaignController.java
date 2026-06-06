package com.crmcentral.controller;

import com.crmcentral.dto.request.CampaignRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Campaign;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/v1/campaigns") @RequiredArgsConstructor
public class CampaignController {
    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Campaign>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(campaignService.getCampaigns(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Campaign>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(campaignService.getById(id))); }
    @PostMapping
    public ResponseEntity<ApiResponse<Campaign>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody CampaignRequest req) { return ResponseEntity.ok(ApiResponse.success(campaignService.create(p.getTenantId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Campaign>> update(@PathVariable UUID id, @Valid @RequestBody CampaignRequest req) { return ResponseEntity.ok(ApiResponse.success(campaignService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { campaignService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
