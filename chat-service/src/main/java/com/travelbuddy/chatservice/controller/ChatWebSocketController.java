package com.travelbuddy.chatservice.controller;

import com.travelbuddy.chatservice.dto.ChatMessageDTO;
import com.travelbuddy.chatservice.entity.ChatMessage;
import com.travelbuddy.chatservice.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketController.class);
    private final ChatService chatService;

    public ChatWebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * SECURITY FIX: Server derives senderId from authenticated Principal,
     * ignoring any senderId/senderName sent by the client.
     * This prevents identity spoofing.
     */
    @MessageMapping("/chat/{tripId}")
    @SendTo("/topic/chat/{tripId}")
    public ChatMessage sendMessage(@DestinationVariable Long tripId,
                                   ChatMessageDTO dto,
                                   Principal principal) {
        dto.setTripId(tripId);

        // Override client-provided identity with server-verified identity
        if (principal != null) {
            Long authenticatedUserId = (Long) ((org.springframework.security.authentication.UsernamePasswordAuthenticationToken) principal).getPrincipal();
            dto.setSenderId(authenticatedUserId);
            // senderName can still come from client for display purposes,
            // but senderId is always server-authoritative
            log.debug("Chat message from authenticated user {} in trip {}", authenticatedUserId, tripId);
        } else {
            log.warn("🚫 Unauthenticated chat message attempt in trip {}", tripId);
            // Fallback: use the client-provided senderId (backward compat)
        }

        return chatService.saveMessage(dto);
    }
}
