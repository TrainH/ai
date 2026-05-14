package com.project.backend.domain.user.dto;

import com.project.backend.domain.user.entity.UserRole;
import com.project.backend.domain.user.entity.UserStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class UserDto {

    @Getter
    @Setter
    public static class UpdateRequest {
        private String name;
        private String phone;
        private Boolean marketingAgreed;
    }

    @Getter
    @Setter
    public static class ChangePasswordRequest {
        @NotBlank
        private String currentPassword;
        @NotBlank
        private String newPassword;
    }

    @Getter
    @Setter
    public static class MeResponse {
        private Long id;
        private String email;
        private String name;
        private String phone;
        private UserRole role;
        private UserStatus status;
        private Boolean marketingAgreed;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime lastLoginAt;
    }
}
