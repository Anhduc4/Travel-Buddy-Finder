package com.travelbuddy.chatservice.controller;

import com.travelbuddy.chatservice.entity.ChatMessage;
import com.travelbuddy.chatservice.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    public ChatController(ChatService chatService) { this.chatService = chatService; }

    @GetMapping("/trips/{tripId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long tripId,
                                                         @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(chatService.getMessagesByTripId(tripId, userId));
    }
}
