package com.project.backend.domain.auth.service;

import com.project.backend.domain.auth.entity.EmailVerification;
import com.project.backend.domain.auth.repository.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final EmailVerificationRepository verificationRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public void sendVerificationCode(String email) {
        String code = String.format("%06d", new Random().nextInt(1000000));
        
        EmailVerification verification = verificationRepository.findByEmail(email)
                .orElse(EmailVerification.builder().email(email).build());
        
        verification.setCode(code);
        verification.setExpiryDate(LocalDateTime.now().plusMinutes(5)); // 5분 유효
        verification.setVerified(false);
        
        verificationRepository.save(verification);

        // 실제 이메일 발송 (HTML 템플릿 적용)
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = 
                    new org.springframework.mail.javamail.MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(email);
            helper.setSubject("[Membership] 이메일 인증 안내");
            
            String htmlContent = "<div style=\"font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff;\">" +
                    "<h2 style=\"color: #1a1a1a; font-size: 24px; font-weight: 700; margin-bottom: 24px; text-align: center;\">이메일 인증</h2>" +
                    "<p style=\"color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 32px; text-align: center;\">안녕하세요!<br>회원가입을 진행하기 위해 아래 인증 코드를 입력해주세요.</p>" +
                    "<div style=\"background-color: #f8f9fa; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;\">" +
                    "<span style=\"color: #007bff; font-size: 32px; font-weight: 800; letter-spacing: 8px;\">" + code + "</span>" +
                    "</div>" +
                    "<p style=\"color: #999999; font-size: 14px; text-align: center; margin-bottom: 0;\">본 코드는 5분 동안 유효합니다.<br>만약 본인이 요청한 것이 아니라면 이 메일을 무시해주세요.</p>" +
                    "<div style=\"margin-top: 40px; padding-top: 24px; border-top: 1px solid #f0f0f0; text-align: center;\">" +
                    "<span style=\"color: #bbbbbb; font-size: 12px;\">&copy; 2026 Membership Project. All rights reserved.</span>" +
                    "</div>" +
                    "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("HTML Email sent to {}: Code is {}", email, code);
        } catch (Exception e) {
            log.warn("Failed to send HTML email to {}. Error: {}", email, e.getMessage());
            log.info("Fallback: Verification code for {} is {}", email, code);
        }
    }

    @Transactional
    public boolean verifyCode(String email, String code) {
        EmailVerification verification = verificationRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("인증 요청 내역이 없습니다."));

        if (verification.isExpired()) {
            throw new IllegalArgumentException("인증 코드가 만료되었습니다.");
        }

        if (!verification.getCode().equals(code)) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        verification.setVerified(true);
        verificationRepository.save(verification);
        return true;
    }

    @Transactional(readOnly = true)
    public boolean isVerified(String email) {
        return verificationRepository.findByEmail(email)
                .map(EmailVerification::isVerified)
                .orElse(false);
    }
}
