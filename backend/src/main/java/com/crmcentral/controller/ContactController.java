package com.crmcentral.controller;

import com.crmcentral.dto.request.ContactRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Contact;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/v1/contacts") @RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Contact>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(contactService.getContacts(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(contactService.getById(id))); }
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Contact>>> getByCustomer(@PathVariable UUID customerId) { return ResponseEntity.ok(ApiResponse.success(contactService.getByCustomer(customerId))); }
    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody ContactRequest req) { return ResponseEntity.ok(ApiResponse.success(contactService.create(p.getTenantId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> update(@PathVariable UUID id, @Valid @RequestBody ContactRequest req) { return ResponseEntity.ok(ApiResponse.success(contactService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { contactService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<Contact>>> search(@AuthenticationPrincipal UserPrincipal p, @RequestParam String q, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(contactService.search(p.getTenantId(), q, PageRequest.of(page, size))));
    }
}
