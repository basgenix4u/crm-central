package com.crmcentral.controller;

import com.crmcentral.dto.response.*;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/v1/search") @RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> globalSearch(@AuthenticationPrincipal UserPrincipal p, @RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(searchService.globalSearch(p.getTenantId(), q)));
    }
}
