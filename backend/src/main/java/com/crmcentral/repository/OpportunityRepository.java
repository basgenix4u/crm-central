package com.crmcentral.repository;

import com.crmcentral.entity.Opportunity;
import com.crmcentral.enums.OpportunityStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, UUID>, JpaSpecificationExecutor<Opportunity> {
    Page<Opportunity> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<Opportunity> findByTenantIdAndStageAndDeletedFalse(UUID tenantId, OpportunityStage stage, Pageable pageable);
    Page<Opportunity> findByTenantIdAndAssignedToIdAndDeletedFalse(UUID tenantId, UUID userId, Pageable pageable);
    List<Opportunity> findByTenantIdAndStageNotInAndDeletedFalse(UUID tenantId, List<OpportunityStage> stages);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    @Query("SELECT o.stage, COUNT(o), COALESCE(SUM(o.amount),0) FROM Opportunity o WHERE o.tenantId = :tenantId AND o.deleted = false GROUP BY o.stage")
    List<Object[]> getPipelineMetrics(@Param("tenantId") UUID tenantId);
    @Query("SELECT COALESCE(SUM(o.amount),0) FROM Opportunity o WHERE o.tenantId = :tenantId AND o.stage = 'WON' AND o.deleted = false")
    BigDecimal getTotalWonRevenue(@Param("tenantId") UUID tenantId);
    @Query("SELECT COALESCE(AVG(o.amount),0) FROM Opportunity o WHERE o.tenantId = :tenantId AND o.stage = 'WON' AND o.deleted = false")
    BigDecimal getAverageDealSize(@Param("tenantId") UUID tenantId);
}
