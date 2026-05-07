package com.travelbuddy.tripservice.service;

import com.travelbuddy.tripservice.dto.*;
import com.travelbuddy.tripservice.entity.Trip;
import com.travelbuddy.tripservice.repository.TripRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public TripResponse createTrip(TripRequest request, Long creatorId) {
        Trip trip = new Trip();
        trip.setCreatorId(creatorId);
        trip.setDestination(request.getDestination());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setMaxPeople(request.getMaxPeople());
        trip.setTags(request.getTags());
        trip = tripRepository.save(trip);
        return toResponse(trip);
    }

    public List<TripResponse> getAllTrips() {
        return tripRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        return toResponse(trip);
    }

    public TripResponse updateTrip(Long id, TripRequest request, Long userId) {
        Trip trip = tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        if (!trip.getCreatorId().equals(userId)) throw new RuntimeException("Not authorized");
        trip.setDestination(request.getDestination());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setMaxPeople(request.getMaxPeople());
        trip.setTags(request.getTags());
        trip = tripRepository.save(trip);
        return toResponse(trip);
    }

    public void deleteTrip(Long id, Long userId) {
        Trip trip = tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        if (!trip.getCreatorId().equals(userId)) throw new RuntimeException("Not authorized");
        tripRepository.delete(trip);
    }

    public List<TripResponse> searchTrips(String destination, String tags) {
        return tripRepository.searchTrips(destination, tags).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private TripResponse toResponse(Trip t) {
        return new TripResponse(t.getId(), t.getCreatorId(), t.getDestination(), t.getDescription(),
                t.getStartDate(), t.getEndDate(), t.getMaxPeople(), t.getTags(), t.getCreatedAt());
    }
}
