package com.crmcentral.controller;

import com.crmcentral.entity.Document;
import com.crmcentral.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.util.UUID;

@RestController
@RequestMapping("/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final DocumentRepository documentRepository;

    @GetMapping("/{documentId}")
    public ResponseEntity<Resource> serveFile(@PathVariable UUID documentId) {
        Document doc = documentRepository.findById(documentId).orElse(null);
        if (doc == null || doc.isDeleted()) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(doc.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = doc.getContentType() != null ? doc.getContentType() : "application/octet-stream";

        // For images and PDFs, display inline. For others, download.
        ContentDisposition disposition;
        if (contentType.startsWith("image/") || contentType.equals("application/pdf")) {
            disposition = ContentDisposition.inline()
                    .filename(doc.getOriginalName())
                    .build();
        } else {
            disposition = ContentDisposition.attachment()
                    .filename(doc.getOriginalName())
                    .build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(resource);
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID documentId) {
        Document doc = documentRepository.findById(documentId).orElse(null);
        if (doc == null || doc.isDeleted()) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(doc.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(doc.getOriginalName()).build().toString())
                .body(resource);
    }
}
