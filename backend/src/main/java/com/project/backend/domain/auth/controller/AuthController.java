package com.project.backend.domain.auth.controller;

import com.project.backend.domain.auth.dto.AuthResponse;
import com.project.backend.domain.auth.dto.LoginRequest;
import com.project.backend.domain.auth.dto.RegisterRequest;
import com.project.backend.domain.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.project.backend.domain.auth.service.EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Long userId = authService.register(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "회원가입이 완료되었습니다.",
                    "userId", userId
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warn("로그인 실패 - email: {}, reason: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "이메일 또는 비밀번호가 올바르지 않습니다."
            ));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Refresh Token이 필요합니다."));
            }
            AuthResponse response = authService.refreshAccessToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        // 서버 측 Refresh Token 폐기 (실패해도 클라이언트는 로그아웃 처리)
        authService.logout(request.get("refreshToken"));
        return ResponseEntity.ok(Map.of("success", true, "message", "로그아웃 되었습니다."));
    }

    @PostMapping("/email/send")
    public ResponseEntity<?> sendEmail(@RequestBody Map<String, String> request) {
        try {
            emailService.sendVerificationCode(request.get("email"));
            return ResponseEntity.ok(Map.of("success", true, "message", "인증 코드가 발송되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/email/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            emailService.verifyCode(request.get("email"), request.get("code"));
            return ResponseEntity.ok(Map.of("success", true, "message", "이메일 인증에 성공했습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
