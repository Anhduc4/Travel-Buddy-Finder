package com.travelbuddy.tripservice.repository;

import com.travelbuddy.tripservice.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByCreatorId(Long creatorId);

    @Query("SELECT t FROM Trip t WHERE " +
           "(:destination IS NULL OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:tags IS NULL OR LOWER(t.tags) LIKE LOWER(CONCAT('%', :tags, '%')))")
    List<Trip> searchTrips(@Param("destination") String destination, @Param("tags") String tags);
}
