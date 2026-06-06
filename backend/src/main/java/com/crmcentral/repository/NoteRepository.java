package com.crmcentral.repository;

import com.crmcentral.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {
    Page<Note> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    List<Note> findByEntityTypeAndEntityIdAndDeletedFalse(String entityType, String entityId);
}
