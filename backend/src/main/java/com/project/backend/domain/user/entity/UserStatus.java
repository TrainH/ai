package com.project.backend.domain.user.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {
    ACTIVE("정상"),
    SUSPENDED("정지"),
    DELETED("탈퇴");

    private final String description;

    @JsonCreator
    public static UserStatus fromString(String key) {
        return key == null ? null : UserStatus.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }
}
