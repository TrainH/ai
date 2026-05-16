package com.project.backend.domain.auth.service;

import com.project.backend.domain.user.entity.RefreshToken;
import com.project.backend.domain.user.entity.User;
import com.project.backend.domain.user.entity.UserAgreement;
import com.project.backend.domain.user.entity.UserRole;
import com.project.backend.domain.user.entity.UserStatus;
import com.project.backend.domain.user.repository.RefreshTokenRepository;
import com.project.backend.domain.user.repository.UserAgreementRepository;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.domain.auth.dto.AuthResponse;
import com.project.backend.domain.auth.dto.LoginRequest;
import com.project.backend.domain.auth.dto.RegisterRequest;
import com.project.backend.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserAgreementRepository userAgreementRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final com.project.backend.domain.auth.service.EmailService emailService;

    @Transactional
    public Long register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        if (!request.getTermsAgreed() || !request.getPrivacyAgreed()) {
            throw new IllegalArgumentException("필수 약관에 동의해야 합니다.");
        }
        if (!emailService.isVerified(request.getEmail())) {
            throw new IllegalArgumentException("이메일 인증이 필요합니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .termsAgreed(request.getTermsAgreed())
                .privacyAgreed(request.getPrivacyAgreed())
                .marketingAgreed(request.getMarketingAgreed())
                .loginFailedCount(0)
                .build();

        User savedUser = userRepository.save(user);

        userAgreementRepository.save(UserAgreement.builder()
                .user(savedUser)
                .agreementType("TERMS")
                .version("1.0")
                .agreed(request.getTermsAgreed())
                .build());

        userAgreementRepository.save(UserAgreement.builder()
                .user(savedUser)
                .agreementType("PRIVACY")
                .version("1.0")
                .agreed(request.getPrivacyAgreed())
                .build());

        return savedUser.getId();
    }

    @Transactional
    public void logout(String refreshTokenString) {
        // Refresh Token이 없거나 비어있으면 그냥 통과 (이미 로그아웃된 상태)
        if (refreshTokenString == null || refreshTokenString.isBlank()) {
            return;
        }

        // DB에서 해당 Refresh Token을 조회하여 폐기 처리
        refreshTokenRepository.findByTokenHash(refreshTokenString).ifPresent(token -> {
            // 이미 폐기된 토큰이 아닐 경우에만 처리
            if (token.getRevokedAt() == null) {
                token.setRevokedAt(java.time.LocalDateTime.now());
                refreshTokenRepository.save(token);
            }
        });
    }

    @Transactional
    public AuthResponse refreshAccessToken(String refreshTokenString) {
        // 1. DB에서 Refresh Token 조회
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(refreshTokenString)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 Refresh Token입니다."));

        // 2. 만료 또는 폐기 여부 확인
        if (refreshToken.getRevokedAt() != null) {
            throw new IllegalArgumentException("이미 폐기된 Refresh Token입니다.");
        }
        if (refreshToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        }

        // 3. 사용자 조회 및 상태 확인
        User user = refreshToken.getUser();
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("로그인 할 수 없는 상태입니다.");
        }

        // 4. 새 Access Token 발급
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(), "",
                        java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole().name()))
                );
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String newAccessToken = jwtTokenProvider.createAccessToken(authentication);

        // 5. Refresh Token Rotation — 새 Refresh Token 발급 및 기존 폐기
        String newRefreshTokenString = jwtTokenProvider.createRefreshToken();
        refreshToken.setRevokedAt(java.time.LocalDateTime.now()); // 기존 토큰 폐기
        refreshTokenRepository.save(refreshToken);

        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(newRefreshTokenString)
                .expiresAt(java.time.LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(newRefreshToken);

        return AuthResponse.builder()
                .success(true)
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenString)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("로그인 할 수 없는 상태입니다. 상태: " + user.getStatus());
        }

        user.setLastLoginAt(LocalDateTime.now());
        user.setLoginFailedCount(0);
        userRepository.save(user);

        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshTokenString = jwtTokenProvider.createRefreshToken();

        refreshTokenRepository.deleteByUserId(user.getId());
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(refreshTokenString) 
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .success(true)
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }
}
