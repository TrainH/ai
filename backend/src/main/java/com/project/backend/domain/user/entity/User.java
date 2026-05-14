package com.project.backend.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 30)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserRole role; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserStatus status; 

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified;

    @Column(name = "marketing_agreed", nullable = false)
    private Boolean marketingAgreed;

    @Column(name = "terms_agreed", nullable = false)
    private Boolean termsAgreed;

    @Column(name = "privacy_agreed", nullable = false)
    private Boolean privacyAgreed;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "login_failed_count", nullable = false)
    private Integer loginFailedCount;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "admin_memo", columnDefinition = "TEXT")
    private String adminMemo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
