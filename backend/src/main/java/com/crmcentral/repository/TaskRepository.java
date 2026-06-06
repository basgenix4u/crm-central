package com.crmcentral.repository;

import com.crmcentral.entity.Task;
import com.crmcentral.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    Page<Task> findByTenantIdAndAssignedToIdAndDeletedFalse(UUID tenantId, UUID userId, Pageable pageable);
    Page<Task> findByTenantIdAndStatusAndDeletedFalse(UUID tenantId, TaskStatus status, Pageable pageable);
    List<Task> findByTenantIdAndDueDateBeforeAndStatusNotAndDeletedFalse(UUID tenantId, LocalDateTime date, TaskStatus status);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    long countByTenantIdAndStatusAndDeletedFalse(UUID tenantId, TaskStatus status);
    @Query("SELECT t.status, COUNT(t) FROM Task t WHERE t.tenantId = :tenantId AND t.deleted = false GROUP BY t.status")
    List<Object[]> countByStatus(@Param("tenantId") UUID tenantId);
}
