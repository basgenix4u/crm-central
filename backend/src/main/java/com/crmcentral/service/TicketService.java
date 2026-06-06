package com.crmcentral.service;

import com.crmcentral.dto.request.TicketRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.*;
import com.crmcentral.enums.TicketStatus;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public PagedResponse<Ticket> getTickets(UUID tenantId, Pageable pageable) {
        Page<Ticket> page = ticketRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<Ticket>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public Ticket getById(UUID id) { return ticketRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket","id",id)); }

    @Transactional
    public Ticket create(UUID tenantId, TicketRequest req) {
        Ticket t = Ticket.builder().subject(req.getSubject()).description(req.getDescription())
            .status(req.getStatus() != null ? req.getStatus() : TicketStatus.OPEN)
            .priority(req.getPriority()).category(req.getCategory())
            .ticketNumber("TKT-" + System.currentTimeMillis()).build();
        t.setTenantId(tenantId);
        if (req.getCustomerId() != null) t.setCustomer(customerRepository.findById(req.getCustomerId()).orElse(null));
        if (req.getAssignedTo() != null) t.setAssignedTo(userRepository.findById(req.getAssignedTo()).orElse(null));
        return ticketRepository.save(t);
    }

    @Transactional
    public Ticket update(UUID id, TicketRequest req) {
        Ticket t = getById(id);
        t.setSubject(req.getSubject()); t.setDescription(req.getDescription());
        if (req.getStatus() != null) {
            t.setStatus(req.getStatus());
            if (req.getStatus() == TicketStatus.RESOLVED) t.setResolvedAt(LocalDateTime.now());
            if (req.getStatus() == TicketStatus.CLOSED) t.setClosedAt(LocalDateTime.now());
        }
        t.setPriority(req.getPriority()); t.setCategory(req.getCategory());
        if (req.getAssignedTo() != null) t.setAssignedTo(userRepository.findById(req.getAssignedTo()).orElse(null));
        return ticketRepository.save(t);
    }

    @Transactional
    public Ticket addComment(UUID ticketId, String content, UUID authorId, boolean internal) {
        Ticket t = getById(ticketId);
        User author = userRepository.findById(authorId).orElse(null);
        TicketComment comment = TicketComment.builder().content(content).internal(internal).ticket(t).author(author).build();
        comment.setTenantId(t.getTenantId());
        t.getComments().add(comment);
        return ticketRepository.save(t);
    }

    @Transactional
    public void delete(UUID id) { Ticket t = getById(id); t.setDeleted(true); ticketRepository.save(t); }

    public PagedResponse<Ticket> getByStatus(UUID tenantId, TicketStatus status, Pageable pageable) {
        Page<Ticket> page = ticketRepository.findByTenantIdAndStatusAndDeletedFalse(tenantId, status, pageable);
        return PagedResponse.<Ticket>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }
}
