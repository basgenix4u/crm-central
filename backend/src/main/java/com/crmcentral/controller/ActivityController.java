package com.crmcentral.controller;

import com.crmcentral.dto.request.ActivityRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Activity;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/v1/activities") @RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Activity>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(activityService.getActivities(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Activity>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(activityService.getById(id))); }
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Activity>>> getByCustomer(@PathVariable UUID customerId) { return ResponseEntity.ok(ApiResponse.success(activityService.getByCustomer(customerId))); }
    @GetMapping("/lead/{leadId}")
    public ResponseEntity<ApiResponse<List<Activity>>> getByLead(@PathVariable UUID leadId) { return ResponseEntity.ok(ApiResponse.success(activityService.getByLead(leadId))); }
    @PostMapping
    public ResponseEntity<ApiResponse<Activity>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody ActivityRequest req) { return ResponseEntity.ok(ApiResponse.success(activityService.create(p.getTenantId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Activity>> update(@PathVariable UUID id, @Valid @RequestBody ActivityRequest req) { return ResponseEntity.ok(ApiResponse.success(activityService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { activityService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
