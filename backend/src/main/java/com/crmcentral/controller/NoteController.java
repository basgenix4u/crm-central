package com.crmcentral.controller;

import com.crmcentral.dto.request.NoteRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Note;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/v1/notes") @RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Note>>> getNotes(@RequestParam String entityType, @RequestParam String entityId) {
        return ResponseEntity.ok(ApiResponse.success(noteService.getNotes(entityType, entityId)));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Note>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody NoteRequest req) { return ResponseEntity.ok(ApiResponse.success(noteService.create(p.getTenantId(), p.getId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Note>> update(@PathVariable UUID id, @Valid @RequestBody NoteRequest req) { return ResponseEntity.ok(ApiResponse.success(noteService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { noteService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
