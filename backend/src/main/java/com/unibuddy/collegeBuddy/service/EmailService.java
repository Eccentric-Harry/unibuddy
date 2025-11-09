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

    public void sendVerificationEmail(String toEmail, String userName, String verificationToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setFrom(fromEmail);
            message.setSubject("EduLink - Verify Your Email");
            
            String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
            String text = String.format(
                "Hi %s,\n\n" +
                "Welcome to EduLink! Please verify your email address by clicking the link below:\n\n" +
                "%s\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create an account with College Buddy, please ignore this email.\n\n" +
                "Best regards,\n" +
                "EduLink Team",
                userName, verificationUrl
            );
            
            message.setText(text);
            mailSender.send(message);
            
            log.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email");
        }
    }

    public boolean sendOtpEmail(String toEmail, String userName, String otp) {
        try {
            log.info("Attempting to send OTP email to: {}", toEmail);
            log.debug("SMTP Configuration - Host: {}, Port: 587, From: {}", "smtp.gmail.com", fromEmail);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setFrom(fromEmail);
            message.setSubject("EduLink - Email Verification Code");
            
            String text = String.format(
                "Hi %s,\n\n" +
                "Welcome to EduLink! Please use the following verification code to complete your registration:\n\n" +
                "Verification Code: %s\n\n" +
                "This code will expire in 5 minutes.\n\n" +
                "If you didn't create an account with College Buddy, please ignore this email.\n\n" +
                "Best regards,\n" +
                "EduLink Team",
                userName, otp
            );
            
            message.setText(text);
            mailSender.send(message);
            
            log.info("OTP email sent successfully to: {}", toEmail);
            return true;
        } catch (org.springframework.mail.MailAuthenticationException e) {
            log.error("Email Authentication Failed - Please check your Gmail App Password!");
            log.error("Error details: {}", e.getMessage());
            log.error("To fix this:");
            log.error("1. Go to https://myaccount.google.com/apppasswords");
            log.error("2. Generate a new App Password");
            log.error("3. Update spring.mail.password in application.properties");
            log.warn("OTP for development: {} (VALID FOR 5 MINUTES)", otp);
            return false;
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {} - Error: {}", toEmail, e.getMessage());
            log.error("Exception type: {}", e.getClass().getName());
            if (e.getCause() != null) {
                log.error("Cause: {}", e.getCause().getMessage());
            }
            log.warn("Email service is not configured or unavailable. OTP: {} (FOR DEVELOPMENT ONLY)", otp);
            return false;
        }
    }

    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setFrom(fromEmail);
            message.setSubject("EduLink - Reset Your Password");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            String text = String.format(
                "Hi %s,\n\n" +
                "You requested to reset your password for College Buddy. Click the link below to reset it:\n\n" +
                "%s\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "EduLink Team",
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
