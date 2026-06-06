package com.crmcentral.service;

import com.crmcentral.dto.request.EmailRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.EmailMessage;
import com.crmcentral.entity.EmailTemplate;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final EmailMessageRepository emailRepository;
    private final EmailTemplateRepository templateRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public PagedResponse<EmailMessage> getEmails(UUID tenantId, Pageable pageable) {
        Page<EmailMessage> page = emailRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<EmailMessage>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    @Transactional
    public EmailMessage sendEmail(UUID tenantId, UUID userId, EmailRequest req) {
        EmailMessage email = EmailMessage.builder().subject(req.getSubject()).body(req.getBody())
            .toEmail(req.getToEmail()).ccEmail(req.getCcEmail()).bccEmail(req.getBccEmail())
            .status("Sent").direction("Outbound").sentAt(LocalDateTime.now())
            .openCount(0).clickCount(0).build();
        email.setTenantId(tenantId);
        email.setUser(userRepository.findById(userId).orElse(null));
        if (req.getCustomerId() != null) email.setCustomer(customerRepository.findById(req.getCustomerId()).orElse(null));
        if (req.getLeadId() != null) email.setLead(leadRepository.findById(req.getLeadId()).orElse(null));

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(req.getToEmail());
            message.setSubject(req.getSubject());
            message.setText(req.getBody());
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send email: {}", e.getMessage());
            email.setStatus("Failed");
        }
        return emailRepository.save(email);
    }

    public PagedResponse<EmailTemplate> getTemplates(UUID tenantId, Pageable pageable) {
        Page<EmailTemplate> page = templateRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<EmailTemplate>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }
}
