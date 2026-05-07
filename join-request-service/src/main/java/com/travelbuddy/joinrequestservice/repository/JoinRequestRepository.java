package com.travelbuddy.joinrequestservice.repository;

import com.travelbuddy.joinrequestservice.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findByTripId(Long tripId);
    List<JoinRequest> findByUserId(Long userId);
    boolean existsByTripIdAndUserId(Long tripId, Long userId);
}
