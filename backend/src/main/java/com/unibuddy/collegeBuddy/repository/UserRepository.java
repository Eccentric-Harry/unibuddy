package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByResetPasswordToken(String resetPasswordToken);
    boolean existsByEmail(String email);
}
