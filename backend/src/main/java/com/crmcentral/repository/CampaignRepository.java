package com.crmcentral.repository;

import com.crmcentral.entity.Campaign;
import com.crmcentral.enums.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {
    Page<Campaign> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<Campaign> findByTenantIdAndStatusAndDeletedFalse(UUID tenantId, CampaignStatus status, Pageable pageable);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    @Query("SELECT COALESCE(SUM(c.revenueGenerated),0) FROM Campaign c WHERE c.tenantId = :tenantId AND c.deleted = false")
    BigDecimal getTotalRevenue(@Param("tenantId") UUID tenantId);
    @Query("SELECT COALESCE(SUM(c.leadsGenerated),0) FROM Campaign c WHERE c.tenantId = :tenantId AND c.deleted = false")
    long getTotalLeadsGenerated(@Param("tenantId") UUID tenantId);
}
