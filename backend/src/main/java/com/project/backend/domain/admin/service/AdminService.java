package com.project.backend.domain.admin.service;

import com.project.backend.domain.admin.entity.AdminAuditLog;
import com.project.backend.domain.user.entity.User;
import com.project.backend.domain.admin.repository.AdminAuditLogRepository;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.domain.admin.dto.AdminUserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;

    @Transactional(readOnly = true)
    public AdminUserDto.PageResponse<AdminUserDto.Response> getUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);
        return new AdminUserDto.PageResponse<>(
                userPage.getContent().stream().map(this::convertToResponse).toList(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.getSize(),
                userPage.getNumber()
        );
    }

    @Transactional(readOnly = true)
    public AdminUserDto.Response getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return convertToResponse(user);
    }

    private AdminUserDto.Response convertToResponse(User user) {
        return AdminUserDto.Response.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .marketingAgreed(user.getMarketingAgreed())
                .adminMemo(user.getAdminMemo())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    @Transactional
    public void updateUser(Long adminId, Long userId, AdminUserDto.UpdateRequest req) {
        User user = findUserById(userId);

        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getStatus() != null) user.setStatus(req.getStatus());
        if (req.getRole() != null) user.setRole(req.getRole());
        if (req.getAdminMemo() != null) user.setAdminMemo(req.getAdminMemo());

        userRepository.save(user);

        logAudit(adminId, userId, "UPDATE_USER_INFO", "Info updated by admin");
    }

    @Transactional
    public void updateStatus(Long adminId, Long userId, AdminUserDto.UpdateStatusRequest req) {
        User user = findUserById(userId);
        user.setStatus(req.getStatus());
        if (req.getSuspendedUntil() != null) {
            user.setLockedUntil(req.getSuspendedUntil());
        }
        userRepository.save(user);

        logAudit(adminId, userId, "UPDATE_STATUS", "Status changed to " + req.getStatus() + " Reason: " + req.getReason());
    }

    @Transactional
    public void updateRole(Long adminId, Long userId, AdminUserDto.UpdateRoleRequest req) {
        User user = findUserById(userId);
        user.setRole(req.getRole());
        userRepository.save(user);

        logAudit(adminId, userId, "UPDATE_ROLE", "Role changed to " + req.getRole());
    }

    private void logAudit(Long adminId, Long targetUserId, String action, String data) {
        adminAuditLogRepository.save(AdminAuditLog.builder()
                .adminUserId(adminId)
                .targetUserId(targetUserId)
                .action(action)
                .afterData(data)
                .build());
    }
}
