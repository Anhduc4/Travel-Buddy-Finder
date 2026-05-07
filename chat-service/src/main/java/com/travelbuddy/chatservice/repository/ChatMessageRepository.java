package com.travelbuddy.chatservice.repository;

import com.travelbuddy.chatservice.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByTripIdOrderByCreatedAtAsc(Long tripId);
}
