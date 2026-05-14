package com.project.backend.domain.user.controller;

import com.project.backend.domain.user.dto.UserDto;
import com.project.backend.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        UserDto.MeResponse response = userService.getMyInfo(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(Authentication authentication, @RequestBody UserDto.UpdateRequest request) {
        userService.updateMyInfo(authentication.getName(), request);
        return ResponseEntity.ok(Map.of("success", true, "message", "정보가 수정되었습니다."));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<?> changePassword(Authentication authentication, @Valid @RequestBody UserDto.ChangePasswordRequest request) {
        try {
            userService.changePassword(authentication.getName(), request);
            return ResponseEntity.ok(Map.of("success", true, "message", "비밀번호가 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> withdraw(Authentication authentication) {
        userService.withdraw(authentication.getName());
        return ResponseEntity.ok(Map.of("success", true, "message", "회원 탈퇴가 처리되었습니다."));
    }
}
