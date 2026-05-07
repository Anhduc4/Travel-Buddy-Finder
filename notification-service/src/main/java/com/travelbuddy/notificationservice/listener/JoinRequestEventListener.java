package com.travelbuddy.notificationservice.listener;

import com.travelbuddy.notificationservice.dto.JoinRequestEvent;
import com.travelbuddy.notificationservice.entity.Notification;
import com.travelbuddy.notificationservice.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class JoinRequestEventListener {

    private static final Logger log = LoggerFactory.getLogger(JoinRequestEventListener.class);
    private final NotificationRepository notificationRepository;

    public JoinRequestEventListener(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @RabbitListener(queues = "notification-queue")
    public void handleJoinRequestEvent(JoinRequestEvent event) {
        log.info("📩 Received event: {} for user {} on trip {}", event.getEventType(), event.getUserId(), event.getTripId());

        // Create notification
        Notification notification = new Notification();
        notification.setUserId(event.getUserId());
        notification.setTripId(event.getTripId());

        if ("join.approved".equals(event.getEventType())) {
            notification.setType("JOIN_APPROVED");
            notification.setMessage("Your join request for trip #" + event.getTripId() + " has been APPROVED!");
        } else {
            notification.setType("JOIN_REJECTED");
            notification.setMessage("Your join request for trip #" + event.getTripId() + " has been REJECTED.");
        }

        notificationRepository.save(notification);
        log.info("✅ Notification saved for user {}", event.getUserId());

        // Simulate email sending
        log.info("📧 [SIMULATED EMAIL] To user {}: {}", event.getUserId(), notification.getMessage());
    }
}
