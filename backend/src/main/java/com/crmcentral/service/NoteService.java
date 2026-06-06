package com.crmcentral.service;

import com.crmcentral.dto.request.NoteRequest;
import com.crmcentral.entity.Note;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public List<Note> getNotes(String entityType, String entityId) {
        return noteRepository.findByEntityTypeAndEntityIdAndDeletedFalse(entityType, entityId);
    }

    @Transactional
    public Note create(UUID tenantId, UUID authorId, NoteRequest req) {
        Note n = Note.builder().content(req.getContent()).entityType(req.getEntityType())
            .entityId(req.getEntityId()).pinned(req.isPinned()).build();
        n.setTenantId(tenantId);
        n.setAuthor(userRepository.findById(authorId).orElse(null));
        return noteRepository.save(n);
    }

    @Transactional
    public Note update(UUID id, NoteRequest req) {
        Note n = noteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Note","id",id));
        n.setContent(req.getContent()); n.setPinned(req.isPinned());
        return noteRepository.save(n);
    }

    @Transactional
    public void delete(UUID id) {
        Note n = noteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Note","id",id));
        n.setDeleted(true); noteRepository.save(n);
    }
}
