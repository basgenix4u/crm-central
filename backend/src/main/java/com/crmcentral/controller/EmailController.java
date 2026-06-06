package com.crmcentral.controller;

import com.crmcentral.dto.request.EmailRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.EmailMessage;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/v1/emails") @RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<EmailMessage>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(emailService.getEmails(p.getTenantId(), PageRequest.of(page, size))));
    }
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<EmailMessage>> send(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody EmailRequest req) {
        return ResponseEntity.ok(ApiResponse.success(emailService.sendEmail(p.getTenantId(), p.getId(), req)));
    }
}
