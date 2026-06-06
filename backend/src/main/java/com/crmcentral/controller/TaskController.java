package com.crmcentral.controller;

import com.crmcentral.dto.request.TaskRequest;
import com.crmcentral.dto.response.*;
import com.crmcentral.entity.Task;
import com.crmcentral.security.UserPrincipal;
import com.crmcentral.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/v1/tasks") @RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Task>>> getAll(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasks(p.getTenantId(), PageRequest.of(page, size))));
    }
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<Task>>> getMyTasks(@AuthenticationPrincipal UserPrincipal p, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getMyTasks(p.getTenantId(), p.getId(), PageRequest.of(page, size))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getById(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(taskService.getById(id))); }
    @PostMapping
    public ResponseEntity<ApiResponse<Task>> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody TaskRequest req) { return ResponseEntity.ok(ApiResponse.success(taskService.create(p.getTenantId(), req))); }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> update(@PathVariable UUID id, @Valid @RequestBody TaskRequest req) { return ResponseEntity.ok(ApiResponse.success(taskService.update(id, req))); }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { taskService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
