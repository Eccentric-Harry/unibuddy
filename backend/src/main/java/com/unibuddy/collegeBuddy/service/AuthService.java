package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.auth.*;
import com.unibuddy.collegeBuddy.entity.College;
import com.unibuddy.collegeBuddy.entity.RefreshToken;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.exception.BadRequestException;
import com.unibuddy.collegeBuddy.exception.NotFoundException;
import com.unibuddy.collegeBuddy.exception.UnauthorizedException;
import com.unibuddy.collegeBuddy.repository.CollegeRepository;
import com.unibuddy.collegeBuddy.repository.RefreshTokenRepository;
import com.unibuddy.collegeBuddy.repository.UserRepository;
import com.unibuddy.collegeBuddy.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Extract college domain from email
        String emailDomain = extractDomainFromEmail(request.getEmail());
        
        // Find existing college - don't create new ones
        College college = collegeRepository.findByDomain(emailDomain)
                .orElseThrow(() -> new BadRequestException(
                    "Email domain '" + emailDomain + "' is not from a recognized educational institution. " +
                    "Please use your official college/university email address."));

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCollege(college);
        user.setYear(request.getYear());
        user.setRole(User.Role.STUDENT);
        
        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusDays(1)); // 24 hours expiry
        
        user = userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationToken);

        // Generate tokens
        String accessToken = jwtUtils.generateToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return createAuthResponse(user, accessToken, refreshToken.getToken());
    }

    public AuthResponse login(LoginRequest request) {
        log.debug("Login attempt for email: {}", request.getEmail());
        
        try {
            // First, let's check if the user exists and get their details
            User existingUser = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
            
            log.debug("User found: {}, emailVerified: {}, enabled: {}", 
                    existingUser.getEmail(), existingUser.getEmailVerified(), existingUser.isEnabled());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = (User) authentication.getPrincipal();
            log.debug("Authentication successful for user: {}", user.getEmail());
            
            // Generate tokens
            String accessToken = jwtUtils.generateToken(user);
            RefreshToken refreshToken = createRefreshToken(user);

            return createAuthResponse(user, accessToken, refreshToken.getToken());
            
        } catch (DisabledException e) {
            log.warn("Account disabled for email: {}", request.getEmail());
            throw new UnauthorizedException("Your account is not activated. Please verify your email address.");
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for email: {} - {}", request.getEmail(), e.getMessage());
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Refresh token not found"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token is expired");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtils.generateToken(user);
        
        // Optionally generate new refresh token
        RefreshToken newRefreshToken = createRefreshToken(user);

        return createAuthResponse(user, newAccessToken, newRefreshToken.getToken());
    }

    public void verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByVerificationToken(request.getToken())
                .orElseThrow(() -> new NotFoundException("Invalid verification token"));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));

        if (user.getEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        // Generate new verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusDays(1));
        
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationToken);
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    private RefreshToken createRefreshToken(User user) {
        // Find existing refresh token for user
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepository.findByUser(user);
        
        RefreshToken refreshToken;
        if (existingTokenOpt.isPresent()) {
            // Update existing token
            refreshToken = existingTokenOpt.get();
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7)); // 7 days expiry
        } else {
            // Create new token
            refreshToken = new RefreshToken();
            refreshToken.setUser(user);
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7)); // 7 days expiry
        }
        
        return refreshTokenRepository.save(refreshToken);
    }

    private AuthResponse createAuthResponse(User user, String accessToken, String refreshToken) {
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setName(user.getName());
        userInfo.setEmail(user.getEmail());
        userInfo.setCollegeId(user.getCollege() != null ? user.getCollege().getId() : null);
        userInfo.setCollegeName(user.getCollege() != null ? user.getCollege().getName() : null);
        userInfo.setYear(user.getYear());
        userInfo.setRole(user.getRole().name());
        userInfo.setAvatarUrl(user.getAvatarUrl());
        userInfo.setEmailVerified(user.getEmailVerified());

        return new AuthResponse(accessToken, refreshToken, "Bearer", userInfo);
    }

    private String extractDomainFromEmail(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex == -1) {
            throw new BadRequestException("Invalid email format");
        }
        return email.substring(atIndex + 1);
    }
}
