package com.crmcentral.controller;

import com.crmcentral.dto.request.KnowledgeBaseRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.KnowledgeBaseArticle;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.KnowledgeBaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/v1/knowledge-base") @RequiredArgsConstructor
public class KnowledgeBaseController {
    private final KnowledgeBaseService kbService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<KnowledgeBaseArticle>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(kbService.getArticles(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KnowledgeBaseArticle>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(kbService.getById(id))); }
    @PostMapping
    public ResponseEntity<ApiResponse<KnowledgeBaseArticle>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody KnowledgeBaseRequest req) { return ResponseEntity.ok(ApiResponse.success(kbService.create(p.getTenantId(), p.getId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KnowledgeBaseArticle>> update(@PathVariable UUID id, @Valid @RequestBody KnowledgeBaseRequest req) { return ResponseEntity.ok(ApiResponse.success(kbService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { kbService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<KnowledgeBaseArticle>>> search(@AuthenticationPrincipal UserPrincipal p, @RequestParam String q, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(kbService.search(p.getTenantId(), q, PageRequest.of(page, size))));
    }
}
