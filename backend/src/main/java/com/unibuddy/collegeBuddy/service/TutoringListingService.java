package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.dto.CreateTutoringListingRequest;
import com.unibuddy.collegeBuddy.dto.TutoringListingDTO;
import com.unibuddy.collegeBuddy.entity.TutoringListing;
import com.unibuddy.collegeBuddy.entity.User;
import com.unibuddy.collegeBuddy.repository.TutoringListingRepository;
import com.unibuddy.collegeBuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TutoringListingService {

    private final TutoringListingRepository tutoringListingRepository;
    private final UserRepository userRepository;

    @Transactional
    public TutoringListingDTO createListing(UUID tutorId, CreateTutoringListingRequest request) {
        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!tutor.getEmailVerified()) {
            throw new RuntimeException("Email must be verified to create tutoring listings");
        }

        // Convert subject names to Subject objects with generated IDs and default icons
        List<TutoringListing.Subject> subjects = request.getSubjects().stream()
                .map(name -> {
                    TutoringListing.Subject subject = new TutoringListing.Subject();
                    subject.setId(name.toLowerCase().replaceAll("\\s+", "-"));
                    subject.setName(name);
                    subject.setIconUrl(getDefaultIconForSubject(name));
                    return subject;
                })
                .collect(Collectors.toList());

        TutoringListing listing = TutoringListing.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .hourlyRate(request.getHourlyRate())
                .subjects(subjects)
                .syllabus(request.getSyllabus())
                .availability(request.getAvailability())
                .status(TutoringListing.Status.ACTIVE)
                .tutor(tutor)
                .build();

        TutoringListing savedListing = tutoringListingRepository.save(listing);
        return mapToDTO(savedListing);
    }

    @Transactional(readOnly = true)
    public Page<TutoringListingDTO> getListings(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String subject,
            String query,
            String status,
            int page,
            int size,
            String sortBy
    ) {
        Sort sort = parseSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TutoringListing> listings = tutoringListingRepository.findWithFilters(
                minPrice, maxPrice, subject, query, status, pageable
        );

        return listings.map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public TutoringListingDTO getListingById(UUID id) {
        TutoringListing listing = tutoringListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutoring listing not found"));
        return mapToDTO(listing);
    }

    @Transactional(readOnly = true)
    public List<TutoringListingDTO> getMyListings(UUID tutorId) {
        List<TutoringListing> listings = tutoringListingRepository.findByTutorId(tutorId);
        return listings.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TutoringListingDTO updateListing(UUID id, UUID tutorId, CreateTutoringListingRequest request) {
        TutoringListing listing = tutoringListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutoring listing not found"));

        if (!listing.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("You can only update your own listings");
        }

        // Convert subject names to Subject objects
        List<TutoringListing.Subject> subjects = request.getSubjects().stream()
                .map(name -> {
                    TutoringListing.Subject subject = new TutoringListing.Subject();
                    subject.setId(name.toLowerCase().replaceAll("\\s+", "-"));
                    subject.setName(name);
                    subject.setIconUrl(getDefaultIconForSubject(name));
                    return subject;
                })
                .collect(Collectors.toList());

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setHourlyRate(request.getHourlyRate());
        listing.setSubjects(subjects);
        listing.setSyllabus(request.getSyllabus());
        listing.setAvailability(request.getAvailability());

        TutoringListing updatedListing = tutoringListingRepository.save(listing);
        return mapToDTO(updatedListing);
    }

    @Transactional
    public void deleteListing(UUID id, UUID tutorId) {
        TutoringListing listing = tutoringListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutoring listing not found"));

        if (!listing.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("You can only delete your own listings");
        }

        tutoringListingRepository.delete(listing);
    }

    @Transactional
    public TutoringListingDTO updateStatus(UUID id, UUID tutorId, TutoringListing.Status status) {
        TutoringListing listing = tutoringListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutoring listing not found"));

        if (!listing.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("You can only update your own listings");
        }

        listing.setStatus(status);
        TutoringListing updatedListing = tutoringListingRepository.save(listing);
        return mapToDTO(updatedListing);
    }

    private TutoringListingDTO mapToDTO(TutoringListing listing) {
        User tutor = listing.getTutor();

        TutoringListingDTO.TutorInfoDTO tutorInfo = TutoringListingDTO.TutorInfoDTO.builder()
                .id(tutor.getId())
                .name(tutor.getName())
                .avatarUrl(tutor.getAvatarUrl())
                .year(tutor.getYear() != null ? tutor.getYear().intValue() : null)
                .collegeName(tutor.getCollege() != null ? tutor.getCollege().getName() : null)
                .major(tutor.getBio()) // Using bio as major for now
                .rating(4.5) // Default rating, can be calculated from reviews later
                .totalReviews(0) // Can be calculated from reviews later
                .build();

        List<TutoringListingDTO.SubjectDTO> subjectDTOs = listing.getSubjects().stream()
                .map(subject -> TutoringListingDTO.SubjectDTO.builder()
                        .id(subject.getId())
                        .name(subject.getName())
                        .iconUrl(subject.getIconUrl())
                        .build())
                .collect(Collectors.toList());

        return TutoringListingDTO.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .hourlyRate(listing.getHourlyRate())
                .subjects(subjectDTOs)
                .syllabus(listing.getSyllabus())
                .availability(listing.getAvailability())
                .status(listing.getStatus().name())
                .tutor(tutorInfo)
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }

    private Sort parseSort(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "created_at");
        }

        String[] parts = sortBy.split(",");
        String field = parts[0];
        Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        // Convert camelCase to snake_case for native queries
        String snakeCaseField = camelToSnakeCase(field);
        return Sort.by(direction, snakeCaseField);
    }

    private String camelToSnakeCase(String str) {
        // Convert camelCase to snake_case
        return str.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase();
    }

    private String getDefaultIconForSubject(String subjectName) {
        String lowerName = subjectName.toLowerCase();

        // Map common subjects to icons
        if (lowerName.contains("python")) {
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg";
        } else if (lowerName.contains("java")) {
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg";
        } else if (lowerName.contains("javascript") || lowerName.contains("js")) {
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
        } else if (lowerName.contains("react")) {
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";
        } else if (lowerName.contains("node")) {
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg";
        } else if (lowerName.contains("math") || lowerName.contains("calculus") || lowerName.contains("algebra")) {
            return "https://cdn-icons-png.flaticon.com/512/5968/5968282.png";
        } else if (lowerName.contains("chemistry")) {
            return "https://cdn-icons-png.flaticon.com/512/1048/1048888.png";
        } else if (lowerName.contains("physics")) {
            return "https://cdn-icons-png.flaticon.com/512/2103/2103658.png";
        } else if (lowerName.contains("biology")) {
            return "https://cdn-icons-png.flaticon.com/512/2103/2103633.png";
        } else if (lowerName.contains("data")) {
            return "https://cdn-icons-png.flaticon.com/512/2103/2103633.png";
        }

        // Default icon for unknown subjects
        return "https://cdn-icons-png.flaticon.com/512/1048/1048953.png";
    }
}

