package com.unibuddy.collegeBuddy.repository;

import com.unibuddy.collegeBuddy.entity.GlobalChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GlobalChatRepository extends JpaRepository<GlobalChat, UUID> {
    List<GlobalChat> findByCollegeIdAndIsActiveTrue(Long collegeId);
    List<GlobalChat> findByCollegeIdOrderByCreatedAtAsc(Long collegeId);
}
