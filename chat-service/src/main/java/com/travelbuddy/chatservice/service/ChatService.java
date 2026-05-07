package com.travelbuddy.chatservice.service;

import com.travelbuddy.chatservice.client.JoinRequestServiceClient;
import com.travelbuddy.chatservice.client.TripServiceClient;
import com.travelbuddy.chatservice.dto.ChatMessageDTO;
import com.travelbuddy.chatservice.entity.ChatMessage;
import com.travelbuddy.chatservice.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository repository;
    private final TripServiceClient tripServiceClient;
    private final JoinRequestServiceClient joinRequestServiceClient;

    public ChatService(ChatMessageRepository repository,
                       TripServiceClient tripServiceClient,
                       JoinRequestServiceClient joinRequestServiceClient) {
        this.repository = repository;
        this.tripServiceClient = tripServiceClient;
        this.joinRequestServiceClient = joinRequestServiceClient;
    }

    public ChatMessage saveMessage(ChatMessageDTO dto, Long authenticatedUserId) {
        verifyChatAccess(dto.getTripId(), authenticatedUserId);
        ChatMessage msg = new ChatMessage();
        msg.setTripId(dto.getTripId());
        msg.setSenderId(authenticatedUserId);
        msg.setSenderName(dto.getSenderName());
        msg.setContent(dto.getContent());
        return repository.save(msg);
    }

    public List<ChatMessage> getMessagesByTripId(Long tripId, Long authenticatedUserId) {
        verifyChatAccess(tripId, authenticatedUserId);
        return repository.findByTripIdOrderByCreatedAtAsc(tripId);
    }

    private void verifyChatAccess(Long tripId, Long userId) {
        if (userId == null) {
            throw new IllegalStateException("Login is required to open chat");
        }
        Long creatorId = tripServiceClient.getCreatorId(tripId);
        if (userId.equals(creatorId)) return;
        if (!joinRequestServiceClient.isApprovedParticipant(tripId, userId)) {
            throw new IllegalStateException("You must be approved for this trip before joining chat");
        }
    }
}
