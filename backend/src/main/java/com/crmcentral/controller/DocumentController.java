package com.crmcentral.controller;

import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Document;
import com.crmcentral.enums.DocumentType;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@RestController @RequestMapping("/v1/documents") @RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Document>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getDocuments(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Document>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(documentService.getById(id))); }
    @PostMapping
    public ResponseEntity<ApiResponse<Document>> upload(@AuthenticationPrincipal UserPrincipal p, @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) DocumentType type, @RequestParam(required = false) String description) throws IOException {
        return ResponseEntity.ok(ApiResponse.success(documentService.upload(p.getTenantId(), p.getId(), file, type, description)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { documentService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
