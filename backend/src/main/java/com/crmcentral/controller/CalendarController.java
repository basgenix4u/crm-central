package com.crmcentral.controller;

import com.crmcentral.dto.request.CalendarEventRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.CalendarEvent;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.CalendarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/v1/calendar") @RequiredArgsConstructor
public class CalendarController {
    private final CalendarService calendarService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CalendarEvent>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(calendarService.getEvents(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CalendarEvent>>> getMyEvents(@AuthenticationPrincipal UserPrincipal p,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(ApiResponse.success(calendarService.getByUserAndDateRange(p.getTenantId(), p.getId(), start, end)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CalendarEvent>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(calendarService.getById(id))); }
    @PostMapping
    public ResponseEntity<ApiResponse<CalendarEvent>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody CalendarEventRequest req) { return ResponseEntity.ok(ApiResponse.success(calendarService.create(p.getTenantId(), p.getId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CalendarEvent>> update(@PathVariable UUID id, @Valid @RequestBody CalendarEventRequest req) { return ResponseEntity.ok(ApiResponse.success(calendarService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { calendarService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
