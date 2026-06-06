package com.crmcentral.service;

import com.crmcentral.dto.request.KnowledgeBaseRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.KnowledgeBaseArticle;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KnowledgeBaseService {
    private final KnowledgeBaseArticleRepository articleRepository;
    private final UserRepository userRepository;

    public PagedResponse<KnowledgeBaseArticle> getArticles(UUID tenantId, Pageable pageable) {
        Page<KnowledgeBaseArticle> page = articleRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<KnowledgeBaseArticle>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public KnowledgeBaseArticle getById(UUID id) { return articleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Article","id",id)); }

    @Transactional
    public KnowledgeBaseArticle create(UUID tenantId, UUID authorId, KnowledgeBaseRequest req) {
        KnowledgeBaseArticle a = KnowledgeBaseArticle.builder().title(req.getTitle()).content(req.getContent())
            .category(req.getCategory()).status(req.getStatus() != null ? req.getStatus() : "Draft")
            .slug(req.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"))
            .viewCount(0).helpfulCount(0).notHelpfulCount(0)
            .tags(req.getTags() != null ? req.getTags() : new HashSet<>()).build();
        a.setTenantId(tenantId);
        a.setAuthor(userRepository.findById(authorId).orElse(null));
        return articleRepository.save(a);
    }

    @Transactional
    public KnowledgeBaseArticle update(UUID id, KnowledgeBaseRequest req) {
        KnowledgeBaseArticle a = getById(id);
        a.setTitle(req.getTitle()); a.setContent(req.getContent());
        a.setCategory(req.getCategory()); if (req.getStatus() != null) a.setStatus(req.getStatus());
        if (req.getTags() != null) a.setTags(req.getTags());
        return articleRepository.save(a);
    }

    @Transactional
    public void delete(UUID id) { KnowledgeBaseArticle a = getById(id); a.setDeleted(true); articleRepository.save(a); }

    public PagedResponse<KnowledgeBaseArticle> search(UUID tenantId, String query, Pageable pageable) {
        Page<KnowledgeBaseArticle> page = articleRepository.search(tenantId, query, pageable);
        return PagedResponse.<KnowledgeBaseArticle>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }
}
