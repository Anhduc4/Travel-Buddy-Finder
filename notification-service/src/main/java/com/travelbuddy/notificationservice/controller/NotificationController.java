package com.travelbuddy.notificationservice.controller;

import com.travelbuddy.notificationservice.entity.Notification;
import com.travelbuddy.notificationservice.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    /**
     * SECURITY FIX: Get notifications for the AUTHENTICATED user only.
     * The userId path param is kept for backward compatibility with frontend,
     * but is IGNORED — we always use the JWT principal.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId, Authentication auth) {
        Long authenticatedUserId = (Long) auth.getPrincipal();

        // Log if someone tries to access another user's notifications
        if (!authenticatedUserId.equals(userId)) {
            log.warn("🚫 User {} attempted to access notifications of user {}",
                    authenticatedUserId, userId);
        }

        // Always return the authenticated user's own notifications
        return ResponseEntity.ok(
                repository.findByUserIdOrderByCreatedAtDesc(authenticatedUserId));
    }
}
