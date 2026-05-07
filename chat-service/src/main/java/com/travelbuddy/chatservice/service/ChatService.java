package com.travelbuddy.chatservice.service;

import com.travelbuddy.chatservice.dto.ChatMessageDTO;
import com.travelbuddy.chatservice.entity.ChatMessage;
import com.travelbuddy.chatservice.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository repository;
    public ChatService(ChatMessageRepository repository) { this.repository = repository; }

    public ChatMessage saveMessage(ChatMessageDTO dto) {
        ChatMessage msg = new ChatMessage();
        msg.setTripId(dto.getTripId());
        msg.setSenderId(dto.getSenderId());
        msg.setSenderName(dto.getSenderName());
        msg.setContent(dto.getContent());
        return repository.save(msg);
    }

    public List<ChatMessage> getMessagesByTripId(Long tripId) {
        return repository.findByTripIdOrderByCreatedAtAsc(tripId);
    }
}
