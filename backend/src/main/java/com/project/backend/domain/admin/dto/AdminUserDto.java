package com.project.backend.domain.admin.dto;

import com.project.backend.domain.user.entity.UserRole;
import com.project.backend.domain.user.entity.UserStatus;
import lombok.*;

public class AdminUserDto {

    @Getter
    @Setter
    public static class UpdateRequest {
        private String name;
        private String phone;
        private UserStatus status;
        private UserRole role;
        private String adminMemo;
    }

    @Getter
    @Setter
    public static class UpdateStatusRequest {
        private UserStatus status;
        private String reason;
        private java.time.LocalDateTime suspendedUntil;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String email;
        private String name;
        private String phone;
        private UserRole role;
        private UserStatus status;
        private Boolean marketingAgreed;
        private String adminMemo;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime lastLoginAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageResponse<T> {
        private java.util.List<T> content;
        private long totalElements;
        private int totalPages;
        private int size;
        private int number;
    }

    @Getter
    @Setter
    public static class UpdateRoleRequest {
        private UserRole role;
    }
}
