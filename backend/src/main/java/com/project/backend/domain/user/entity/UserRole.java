package com.project.backend.domain.user.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    ROLE_USER("일반 회원"),
    ROLE_ADMIN("관리자");

    private final String description;

    @JsonCreator
    public static UserRole fromString(String key) {
        return key == null ? null : UserRole.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return name(); // Role은 보통 대문자 그대로 사용
    }
}
