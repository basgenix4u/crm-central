package com.crmcentral.controller;

import com.crmcentral.dto.request.TicketRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Ticket;
import com.crmcentral.enums.TicketStatus;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/v1/tickets") @RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Ticket>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTickets(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(ticketService.getById(id))); }
    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody TicketRequest req) { return ResponseEntity.ok(ApiResponse.success(ticketService.create(p.getTenantId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> update(@PathVariable UUID id, @Valid @RequestBody TicketRequest req) { return ResponseEntity.ok(ApiResponse.success(ticketService.update(id, req))); }
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<Ticket>> addComment(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal p, @RequestParam String content, @RequestParam(defaultValue = "false") boolean internal) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.addComment(id, content, p.getId(), internal)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { ticketService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<PagedResponse<Ticket>>> getByStatus(@AuthenticationPrincipal UserPrincipal p, @PathVariable TicketStatus status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getByStatus(p.getTenantId(), status, PageRequest.of(page, size))));
    }
}
