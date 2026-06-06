package com.crmcentral.service;

import com.crmcentral.dto.request.TaskRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Task;
import com.crmcentral.enums.TaskStatus;
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
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public PagedResponse<Task> getTasks(UUID tenantId, Pageable pageable) {
        Page<Task> page = taskRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<Task>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public Task getById(UUID id) { return taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task","id",id)); }

    public PagedResponse<Task> getMyTasks(UUID tenantId, UUID userId, Pageable pageable) {
        Page<Task> page = taskRepository.findByTenantIdAndAssignedToIdAndDeletedFalse(tenantId, userId, pageable);
        return PagedResponse.<Task>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    @Transactional
    public Task create(UUID tenantId, TaskRequest req) {
        Task t = Task.builder().title(req.getTitle()).description(req.getDescription())
            .status(req.getStatus() != null ? req.getStatus() : TaskStatus.TODO)
            .priority(req.getPriority()).dueDate(req.getDueDate())
            .category(req.getCategory()).reminder(req.isReminder())
            .reminderDate(req.getReminderDate()).estimatedMinutes(req.getEstimatedMinutes()).build();
        t.setTenantId(tenantId);
        if (req.getAssignedTo() != null) t.setAssignedTo(userRepository.findById(req.getAssignedTo()).orElse(null));
        if (req.getCustomerId() != null) t.setCustomer(customerRepository.findById(req.getCustomerId()).orElse(null));
        return taskRepository.save(t);
    }

    @Transactional
    public Task update(UUID id, TaskRequest req) {
        Task t = getById(id);
        t.setTitle(req.getTitle()); t.setDescription(req.getDescription());
        if (req.getStatus() != null) {
            t.setStatus(req.getStatus());
            if (req.getStatus() == TaskStatus.COMPLETED) t.setCompletedAt(LocalDateTime.now());
        }
        t.setPriority(req.getPriority()); t.setDueDate(req.getDueDate());
        return taskRepository.save(t);
    }

    @Transactional
    public void delete(UUID id) { Task t = getById(id); t.setDeleted(true); taskRepository.save(t); }
}
