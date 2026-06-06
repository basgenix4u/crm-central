package com.crmcentral.controller;

import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Notification;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/v1/notifications") @RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Notification>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUserNotifications(p.getId(), PageRequest.of(page, size))));
    }
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal p) { return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadCount(p.getId()))); }
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable UUID id) { notificationService.markAsRead(id); return ResponseEntity.ok(ApiResponse.success("Marked as read", null)); }
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserPrincipal p) { notificationService.markAllAsRead(p.getId()); return ResponseEntity.ok(ApiResponse.success("All marked as read", null)); }
}
