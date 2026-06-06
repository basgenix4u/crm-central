package com.crmcentral.repository;

import com.crmcentral.entity.CalendarEvent;
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
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {
    Page<CalendarEvent> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    @Query("SELECT e FROM CalendarEvent e WHERE e.tenantId = :tenantId AND e.deleted = false AND e.organizer.id = :userId AND e.startDateTime BETWEEN :start AND :end")
    List<CalendarEvent> findByUserAndDateRange(@Param("tenantId") UUID tenantId, @Param("userId") UUID userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    List<CalendarEvent> findByTenantIdAndStartDateTimeBetweenAndDeletedFalse(UUID tenantId, LocalDateTime start, LocalDateTime end);
}
