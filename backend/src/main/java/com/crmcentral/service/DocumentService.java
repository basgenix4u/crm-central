package com.crmcentral.service;

import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Document;
import com.crmcentral.enums.DocumentType;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public PagedResponse<Document> getDocuments(UUID tenantId, Pageable pageable) {
        Page<Document> page = documentRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<Document>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public Document getById(UUID id) { return documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document","id",id)); }

    @Transactional
    public Document upload(UUID tenantId, UUID userId, MultipartFile file, DocumentType type, String description) throws IOException {
        String tenantDir = uploadDir + "/" + tenantId;
        Files.createDirectories(Paths.get(tenantDir));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(tenantDir, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Document doc = Document.builder().name(fileName).originalName(file.getOriginalFilename())
            .filePath(filePath.toString()).contentType(file.getContentType())
            .fileSize(file.getSize()).type(type).description(description)
            .versionNumber(1).shared(false).build();
        doc.setTenantId(tenantId);
        doc.setUploadedBy(userRepository.findById(userId).orElse(null));
        return documentRepository.save(doc);
    }

    public List<Document> getByCustomer(UUID customerId) { return documentRepository.findByCustomerIdAndDeletedFalse(customerId); }

    @Transactional
    public void delete(UUID id) { Document d = getById(id); d.setDeleted(true); documentRepository.save(d); }
}
