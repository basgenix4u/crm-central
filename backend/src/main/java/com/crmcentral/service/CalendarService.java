package com.crmcentral.service;

import com.crmcentral.dto.request.CalendarEventRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.CalendarEvent;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final CalendarEventRepository eventRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public PagedResponse<CalendarEvent> getEvents(UUID tenantId, Pageable pageable) {
        Page<CalendarEvent> page = eventRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<CalendarEvent>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public CalendarEvent getById(UUID id) { return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("CalendarEvent","id",id)); }

    public List<CalendarEvent> getByUserAndDateRange(UUID tenantId, UUID userId, LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByUserAndDateRange(tenantId, userId, start, end);
    }

    @Transactional
    public CalendarEvent create(UUID tenantId, UUID organizerId, CalendarEventRequest req) {
        CalendarEvent e = CalendarEvent.builder().title(req.getTitle()).description(req.getDescription())
            .startDateTime(req.getStartDateTime()).endDateTime(req.getEndDateTime())
            .type(req.getType()).location(req.getLocation()).allDay(req.isAllDay())
            .recurrence(req.getRecurrence()).color(req.getColor())
            .reminder(req.isReminder()).reminderMinutes(req.getReminderMinutes())
            .status("Scheduled").build();
        e.setTenantId(tenantId);
        e.setOrganizer(userRepository.findById(organizerId).orElse(null));
        if (req.getCustomerId() != null) e.setCustomer(customerRepository.findById(req.getCustomerId()).orElse(null));
        return eventRepository.save(e);
    }

    @Transactional
    public CalendarEvent update(UUID id, CalendarEventRequest req) {
        CalendarEvent e = getById(id);
        e.setTitle(req.getTitle()); e.setDescription(req.getDescription());
        e.setStartDateTime(req.getStartDateTime()); e.setEndDateTime(req.getEndDateTime());
        e.setType(req.getType()); e.setLocation(req.getLocation());
        return eventRepository.save(e);
    }

    @Transactional
    public void delete(UUID id) { CalendarEvent e = getById(id); e.setDeleted(true); eventRepository.save(e); }
}
