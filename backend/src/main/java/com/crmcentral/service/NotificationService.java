package com.crmcentral.service;

import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Notification;
import com.crmcentral.entity.User;
import com.crmcentral.enums.NotificationType;
import com.crmcentral.repository.NotificationRepository;
import com.crmcentral.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public PagedResponse<Notification> getUserNotifications(UUID userId, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.<Notification>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public long getUnreadCount(UUID userId) { return notificationRepository.countByUserIdAndReadAndDeletedFalse(userId, false); }

    @Transactional
    public void markAsRead(UUID notificationId) {
        Notification n = notificationRepository.findById(notificationId).orElse(null);
        if (n != null) { n.setRead(true); notificationRepository.save(n); }
    }

    @Transactional
    public void markAllAsRead(UUID userId) { notificationRepository.markAllAsRead(userId); }

    @Transactional
    public Notification createNotification(UUID userId, String title, String message, NotificationType type, String actionUrl) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;
        Notification n = Notification.builder().title(title).message(message).type(type).actionUrl(actionUrl).user(user).build();
        n.setTenantId(user.getTenantId());
        return notificationRepository.save(n);
    }
}
