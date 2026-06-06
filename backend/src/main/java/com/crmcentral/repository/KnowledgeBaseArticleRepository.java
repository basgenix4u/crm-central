package com.crmcentral.repository;

import com.crmcentral.entity.KnowledgeBaseArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface KnowledgeBaseArticleRepository extends JpaRepository<KnowledgeBaseArticle, UUID> {
    Page<KnowledgeBaseArticle> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<KnowledgeBaseArticle> findByTenantIdAndStatusAndDeletedFalse(UUID tenantId, String status, Pageable pageable);
    Page<KnowledgeBaseArticle> findByTenantIdAndCategoryAndDeletedFalse(UUID tenantId, String category, Pageable pageable);
    Optional<KnowledgeBaseArticle> findBySlugAndTenantId(String slug, UUID tenantId);
    @Query("SELECT a FROM KnowledgeBaseArticle a WHERE a.tenantId = :tenantId AND a.deleted = false AND (LOWER(a.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(a.content) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<KnowledgeBaseArticle> search(@Param("tenantId") UUID tenantId, @Param("q") String query, Pageable pageable);
}
