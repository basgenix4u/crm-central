package com.crmcentral.controller;

import com.crmcentral.entity.Document;
import com.crmcentral.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final DocumentRepository documentRepository;

    @GetMapping("/{documentId}")
    public ResponseEntity<byte[]> serveFile(@PathVariable UUID documentId) {
        Document doc = documentRepository.findById(documentId).orElse(null);
        if (doc == null || doc.isDeleted() || doc.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = doc.getContentType() != null ? doc.getContentType() : "application/octet-stream";

        ContentDisposition disposition;
        if (contentType.startsWith("image/") || contentType.equals("application/pdf")) {
            disposition = ContentDisposition.inline().filename(doc.getOriginalName()).build();
        } else {
            disposition = ContentDisposition.attachment().filename(doc.getOriginalName()).build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(doc.getFileData());
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable UUID documentId) {
        Document doc = documentRepository.findById(documentId).orElse(null);
        if (doc == null || doc.isDeleted() || doc.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(doc.getOriginalName()).build().toString())
                .body(doc.getFileData());
    }
}
