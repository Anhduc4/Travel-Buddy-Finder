package com.travelbuddy.chatservice.controller;

import com.travelbuddy.chatservice.dto.ChatMessageDTO;
import com.travelbuddy.chatservice.entity.ChatMessage;
import com.travelbuddy.chatservice.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketController.class);
    private final ChatService chatService;

    public ChatWebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat/{tripId}")
    @SendTo("/topic/chat/{tripId}")
    public ChatMessage sendMessage(@DestinationVariable Long tripId,
                                   ChatMessageDTO dto,
                                   Principal principal) {
        if (principal == null) {
            log.warn("Unauthenticated chat message attempt in trip {}", tripId);
            throw new IllegalStateException("Login is required to send chat messages");
        }

        Long authenticatedUserId = (Long) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        dto.setTripId(tripId);
        log.debug("Chat message from authenticated user {} in trip {}", authenticatedUserId, tripId);
        return chatService.saveMessage(dto, authenticatedUserId);
    }
}
