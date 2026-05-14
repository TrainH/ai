package com.project.backend.domain.admin.controller;

import com.project.backend.domain.user.entity.User;
import com.project.backend.domain.admin.dto.AdminUserDto;
import com.project.backend.domain.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    private Long getAdminId(Authentication auth) {
        return 1L; 
    }

    @GetMapping
    public ResponseEntity<AdminUserDto.PageResponse<AdminUserDto.Response>> getUsers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getUsers(pageable));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserDto.Response> getUserDetail(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserDetail(userId));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<?> updateUser(Authentication auth, @PathVariable Long userId, @RequestBody AdminUserDto.UpdateRequest request) {
        adminService.updateUser(getAdminId(auth), userId, request);
        return ResponseEntity.ok(Map.of("success", true, "message", "회원 정보가 수정되었습니다."));
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<?> updateStatus(Authentication auth, @PathVariable Long userId, @RequestBody AdminUserDto.UpdateStatusRequest request) {
        adminService.updateStatus(getAdminId(auth), userId, request);
        return ResponseEntity.ok(Map.of("success", true, "message", "회원 상태가 변경되었습니다."));
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<?> updateRole(Authentication auth, @PathVariable Long userId, @RequestBody AdminUserDto.UpdateRoleRequest request) {
        adminService.updateRole(getAdminId(auth), userId, request);
        return ResponseEntity.ok(Map.of("success", true, "message", "회원 권한이 변경되었습니다."));
    }
}
