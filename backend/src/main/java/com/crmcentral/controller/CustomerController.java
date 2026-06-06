package com.crmcentral.controller;

import com.crmcentral.dto.request.CustomerRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Customer;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Customer>>> getCustomers(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomers(principal.getTenantId(), PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomer(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomerById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Customer created", customerService.createCustomer(principal.getTenantId(), request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable UUID id, @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Customer updated", customerService.updateCustomer(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable UUID id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<Customer>>> searchCustomers(
            @AuthenticationPrincipal UserPrincipal principal, @RequestParam String q,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(customerService.searchCustomers(principal.getTenantId(), q, PageRequest.of(page, size))));
    }
}
