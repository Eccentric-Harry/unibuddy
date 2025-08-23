package com.unibuddy.collegeBuddy.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;



    public void sendVerificationEmailWithTOTP(String toEmail, String userName, String totpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setFrom(fromEmail);
            message.setSubject("College Buddy - Email Verification Code");
            
            String text = String.format(
                "Hi %s,\n\n" +
                "Welcome to College Buddy! Please verify your email address using the code below:\n\n" +
                "Verification Code: %s\n\n" +
                "This code will expire in 5 minutes for security reasons.\n\n" +
                "Enter this code on the verification page to complete your registration.\n\n" +
                "If you didn't create an account with College Buddy, please ignore this email.\n\n" +
                "Best regards,\n" +
                "College Buddy Team",
                userName, totpCode
            );
            
            message.setText(text);
            mailSender.send(message);
            
            log.info("TOTP verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send TOTP verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email");
        }
    }

    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setFrom(fromEmail);
            message.setSubject("College Buddy - Reset Your Password");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            String text = String.format(
                "Hi %s,\n\n" +
                "You requested to reset your password for College Buddy. Click the link below to reset it:\n\n" +
                "%s\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "College Buddy Team",
                userName, resetUrl
            );
            
            message.setText(text);
            mailSender.send(message);
            
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email");
        }
    }
}
