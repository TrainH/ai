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
