package com.crmcentral.repository;

import com.crmcentral.entity.Ticket;
import com.crmcentral.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    Page<Ticket> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<Ticket> findByTenantIdAndStatusAndDeletedFalse(UUID tenantId, TicketStatus status, Pageable pageable);
    Page<Ticket> findByTenantIdAndAssignedToIdAndDeletedFalse(UUID tenantId, UUID userId, Pageable pageable);
    Page<Ticket> findByCustomerIdAndDeletedFalse(UUID customerId, Pageable pageable);
    Optional<Ticket> findByTicketNumberAndTenantId(String ticketNumber, UUID tenantId);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    long countByTenantIdAndStatusAndDeletedFalse(UUID tenantId, TicketStatus status);
    @Query("SELECT t.status, COUNT(t) FROM Ticket t WHERE t.tenantId = :tenantId AND t.deleted = false GROUP BY t.status")
    List<Object[]> countByStatus(@Param("tenantId") UUID tenantId);
    @Query("SELECT t.category, COUNT(t) FROM Ticket t WHERE t.tenantId = :tenantId AND t.deleted = false GROUP BY t.category")
    List<Object[]> countByCategory(@Param("tenantId") UUID tenantId);
}
