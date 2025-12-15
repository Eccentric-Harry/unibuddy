package com.unibuddy.collegeBuddy.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unibuddy.collegeBuddy.entity.JobPosting;
import com.unibuddy.collegeBuddy.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSyncService {

    private final JobPostingRepository jobPostingRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.jobs.api.key:}")
    private String apiKey;

    @Value("${app.jobs.api.host:jsearch.p.rapidapi.com}")
    private String apiHost;

    @Value("${app.jobs.sync.enabled:true}")
    private boolean syncEnabled;

    private static final String[] JOB_QUERIES = {
            "software engineer intern",
            "frontend developer",
            "backend developer",
            "full stack developer intern",
            "data science intern",
            "machine learning intern",
            "web developer part time",
            "mobile developer intern",
            "devops engineer",
            "ui ux designer intern"
    };

    // Automatic sync disabled to preserve API quota
    // Jobs will only sync when manually triggered via the /api/jobs/sync endpoint
    // @Scheduled(fixedRate = 21600000, initialDelay = 5000)
    @Transactional
    public void syncJobs() {
        if (!syncEnabled) {
            log.info("Job sync is disabled");
            return;
        }

        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Job API key not configured, using fallback data");
            createFallbackJobs();
            return;
        }

        log.info("Starting job sync process...");
        int totalSynced = 0;

        for (String query : JOB_QUERIES) {
            try {
                List<JobPosting> jobs = fetchJobsFromAPI(query);
                for (JobPosting job : jobs) {
                    saveOrUpdateJob(job);
                    totalSynced++;
                }
                // Rate limiting - wait 1 second between requests
                Thread.sleep(1000);
            } catch (Exception e) {
                log.error("Error fetching jobs for query: {}", query, e);
            }
        }

        log.info("Job sync completed. Total jobs synced: {}", totalSynced);
    }

    private List<JobPosting> fetchJobsFromAPI(String query) {
        List<JobPosting> jobs = new ArrayList<>();

        try {
            String url = "https://" + apiHost + "/search?query=" + query.replace(" ", "%20") +
                    "&page=1&num_pages=1&date_posted=month";

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", apiKey);
            headers.set("X-RapidAPI-Host", apiHost);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode data = root.get("data");

                if (data != null && data.isArray()) {
                    for (JsonNode jobNode : data) {
                        JobPosting job = parseJobFromAPI(jobNode);
                        if (job != null) {
                            jobs.add(job);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error fetching jobs from API for query: {}", query, e);
        }

        return jobs;
    }

    private JobPosting parseJobFromAPI(JsonNode jobNode) {
        try {
            String externalId = jobNode.has("job_id") ? jobNode.get("job_id").asText() : null;
            if (externalId == null) return null;

            String title = jobNode.has("job_title") ? jobNode.get("job_title").asText() : "Untitled Position";
            String companyName = jobNode.has("employer_name") ? jobNode.get("employer_name").asText() : "Unknown Company";
            String location = jobNode.has("job_city") && jobNode.has("job_state") ?
                    jobNode.get("job_city").asText() + ", " + jobNode.get("job_state").asText() :
                    (jobNode.has("job_country") ? jobNode.get("job_country").asText() : "Remote");

            String companyLogo = jobNode.has("employer_logo") ? jobNode.get("employer_logo").asText() : null;
            String companyWebsite = jobNode.has("employer_website") ? jobNode.get("employer_website").asText() : null;
            String description = jobNode.has("job_description") ? jobNode.get("job_description").asText() : "";
            String applyLink = jobNode.has("job_apply_link") ? jobNode.get("job_apply_link").asText() : null;

            // Determine job type
            JobPosting.JobType jobType = determineJobType(title, description);

            // Determine location type
            JobPosting.LocationType locationType = determineLocationType(jobNode, description);

            // Extract skills, requirements, and responsibilities
            List<String> skills = extractSkills(description);
            List<String> requirements = extractRequirements(description);
            List<String> responsibilities = extractResponsibilities(description);

            // Parse salary if available
            Integer salaryMin = null;
            Integer salaryMax = null;
            String salaryCurrency = "USD";
            JobPosting.SalaryPeriod salaryPeriod = JobPosting.SalaryPeriod.YEARLY;

            if (jobNode.has("job_min_salary") && !jobNode.get("job_min_salary").isNull()) {
                salaryMin = jobNode.get("job_min_salary").asInt();
            }
            if (jobNode.has("job_max_salary") && !jobNode.get("job_max_salary").isNull()) {
                salaryMax = jobNode.get("job_max_salary").asInt();
            }

            return JobPosting.builder()
                    .externalJobId(externalId)
                    .externalSource("jsearch")
                    .title(title)
                    .companyName(companyName)
                    .companyLogo(companyLogo)
                    .companyWebsite(companyWebsite)
                    .location(location)
                    .locationType(locationType)
                    .jobType(jobType)
                    .description(truncateDescription(description))
                    .requirements(requirements)
                    .responsibilities(responsibilities)
                    .skills(skills)
                    .salaryMin(salaryMin)
                    .salaryMax(salaryMax)
                    .salaryCurrency(salaryCurrency)
                    .salaryPeriod(salaryPeriod)
                    .applicationUrl(applyLink)
                    .status(JobPosting.JobStatus.ACTIVE)
                    .lastSyncedAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error parsing job from API", e);
            return null;
        }
    }

    private JobPosting.JobType determineJobType(String title, String description) {
        String combined = (title + " " + description).toLowerCase();

        if (combined.contains("intern")) {
            return JobPosting.JobType.INTERNSHIP;
        } else if (combined.contains("part-time") || combined.contains("part time")) {
            return JobPosting.JobType.PART_TIME;
        } else if (combined.contains("contract") || combined.contains("contractor")) {
            return JobPosting.JobType.CONTRACT;
        } else {
            return JobPosting.JobType.FULL_TIME;
        }
    }

    private JobPosting.LocationType determineLocationType(JsonNode jobNode, String description) {
        String combined = description.toLowerCase();

        boolean isRemote = jobNode.has("job_is_remote") && jobNode.get("job_is_remote").asBoolean();

        if (isRemote || combined.contains("remote") || combined.contains("work from home")) {
            if (combined.contains("hybrid")) {
                return JobPosting.LocationType.HYBRID;
            }
            return JobPosting.LocationType.REMOTE;
        } else if (combined.contains("hybrid")) {
            return JobPosting.LocationType.HYBRID;
        } else {
            return JobPosting.LocationType.ON_SITE;
        }
    }

    private List<String> extractSkills(String description) {
        List<String> skills = new ArrayList<>();
        String[] commonSkills = {
                "Java", "Python", "JavaScript", "TypeScript", "React", "Angular", "Vue",
                "Node.js", "Spring Boot", "Django", "Flask", "SQL", "MongoDB", "PostgreSQL",
                "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "CI/CD",
                "Machine Learning", "Data Science", "AI", "TensorFlow", "PyTorch",
                "C++", "C#", ".NET", "Ruby", "Go", "Rust", "Swift", "Kotlin",
                "HTML", "CSS", "Redux", "GraphQL", "REST API", "Microservices"
        };

        String descLower = description.toLowerCase();
        for (String skill : commonSkills) {
            if (descLower.contains(skill.toLowerCase())) {
                skills.add(skill);
            }
        }

        return skills.stream().distinct().limit(10).toList();
    }

    private List<String> extractRequirements(String description) {
        List<String> requirements = new ArrayList<>();

        // Look for common requirement patterns
        Pattern reqPattern = Pattern.compile("(?i)(requirements?|qualifications?|what we['']re looking for):?\\s*([\\s\\S]*?)(?=responsibilities|duties|what you['']ll do|benefits|$)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = reqPattern.matcher(description);

        if (matcher.find()) {
            String reqSection = matcher.group(2);
            String[] lines = reqSection.split("\\n");

            for (String line : lines) {
                line = line.trim();
                if (line.matches("^[•\\-*].*") || line.matches("^\\d+\\..*")) {
                    line = line.replaceAll("^[•\\-*\\d.]+\\s*", "").trim();
                    if (!line.isEmpty() && line.length() < 500) {
                        requirements.add(line);
                    }
                }
            }
        }

        // Default requirements if none found
        if (requirements.isEmpty()) {
            requirements.add("Bachelor's degree in Computer Science or related field (or equivalent experience)");
            requirements.add("Strong problem-solving and analytical skills");
            requirements.add("Excellent communication and teamwork abilities");
        }

        return requirements.stream().limit(8).toList();
    }

    private List<String> extractResponsibilities(String description) {
        List<String> responsibilities = new ArrayList<>();

        Pattern respPattern = Pattern.compile("(?i)(responsibilities|duties|what you['']ll do|you will):?\\s*([\\s\\S]*?)(?=requirements|qualifications|benefits|$)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = respPattern.matcher(description);

        if (matcher.find()) {
            String respSection = matcher.group(2);
            String[] lines = respSection.split("\\n");

            for (String line : lines) {
                line = line.trim();
                if (line.matches("^[•\\-*].*") || line.matches("^\\d+\\..*")) {
                    line = line.replaceAll("^[•\\-*\\d.]+\\s*", "").trim();
                    if (!line.isEmpty() && line.length() < 500) {
                        responsibilities.add(line);
                    }
                }
            }
        }

        if (responsibilities.isEmpty()) {
            responsibilities.add("Collaborate with cross-functional teams to deliver high-quality solutions");
            responsibilities.add("Write clean, maintainable, and efficient code");
            responsibilities.add("Participate in code reviews and contribute to team knowledge sharing");
        }

        return responsibilities.stream().limit(8).toList();
    }

    private String truncateDescription(String description) {
        if (description == null) return "";
        if (description.length() <= 4900) return description;
        return description.substring(0, 4900) + "...";
    }

    private void saveOrUpdateJob(JobPosting job) {
        Optional<JobPosting> existing = jobPostingRepository.findByExternalJobId(job.getExternalJobId());

        if (existing.isPresent()) {
            JobPosting existingJob = existing.get();
            existingJob.setTitle(job.getTitle());
            existingJob.setDescription(job.getDescription());
            existingJob.setRequirements(job.getRequirements());
            existingJob.setResponsibilities(job.getResponsibilities());
            existingJob.setSkills(job.getSkills());
            existingJob.setSalaryMin(job.getSalaryMin());
            existingJob.setSalaryMax(job.getSalaryMax());
            existingJob.setApplicationUrl(job.getApplicationUrl());
            existingJob.setLastSyncedAt(LocalDateTime.now());
            jobPostingRepository.save(existingJob);
            log.debug("Updated job: {}", job.getTitle());
        } else {
            jobPostingRepository.save(job);
            log.debug("Created new job: {}", job.getTitle());
        }
    }

    // Fallback method to create sample jobs when API is not available
    @Transactional
    public void createFallbackJobs() {
        long existingCount = jobPostingRepository.countByStatus(JobPosting.JobStatus.ACTIVE);
        if (existingCount > 0) {
            log.info("Jobs already exist in database, skipping fallback creation");
            return;
        }

        log.info("Creating fallback job postings...");

        List<JobPosting> fallbackJobs = Arrays.asList(
                createFallbackJob("Software Engineering Intern", "Google", "Mountain View, CA",
                        JobPosting.JobType.INTERNSHIP, JobPosting.LocationType.HYBRID,
                        "Join Google as a Software Engineering Intern and work on cutting-edge projects...",
                        Arrays.asList("Java", "Python", "Data Structures", "Algorithms"),
                        7000, 9000, "https://careers.google.com"),

                createFallbackJob("Frontend Developer", "Meta", "Menlo Park, CA",
                        JobPosting.JobType.FULL_TIME, JobPosting.LocationType.ON_SITE,
                        "Build the future of social technology at Meta...",
                        Arrays.asList("React", "JavaScript", "TypeScript", "CSS"),
                        120000, 180000, "https://www.metacareers.com"),

                createFallbackJob("Backend Developer Intern", "Amazon", "Seattle, WA",
                        JobPosting.JobType.INTERNSHIP, JobPosting.LocationType.HYBRID,
                        "Work on scalable backend systems at Amazon...",
                        Arrays.asList("Java", "AWS", "Microservices", "SQL"),
                        6500, 8500, "https://www.amazon.jobs"),

                createFallbackJob("Full Stack Developer", "Microsoft", "Redmond, WA",
                        JobPosting.JobType.FULL_TIME, JobPosting.LocationType.REMOTE,
                        "Join Microsoft to build innovative cloud solutions...",
                        Arrays.asList("C#", ".NET", "Azure", "React", "TypeScript"),
                        110000, 160000, "https://careers.microsoft.com"),

                createFallbackJob("Data Science Intern", "Netflix", "Los Gatos, CA",
                        JobPosting.JobType.INTERNSHIP, JobPosting.LocationType.HYBRID,
                        "Apply machine learning to improve user experience at Netflix...",
                        Arrays.asList("Python", "Machine Learning", "TensorFlow", "SQL"),
                        7500, 9500, "https://jobs.netflix.com")
        );

        jobPostingRepository.saveAll(fallbackJobs);
        log.info("Created {} fallback job postings", fallbackJobs.size());
    }

    private JobPosting createFallbackJob(String title, String company, String location,
                                         JobPosting.JobType jobType, JobPosting.LocationType locationType,
                                         String description, List<String> skills,
                                         Integer salaryMin, Integer salaryMax, String applyUrl) {
        return JobPosting.builder()
                .externalJobId("fallback-" + UUID.randomUUID())
                .externalSource("fallback")
                .title(title)
                .companyName(company)
                .companyLogo("https://logo.clearbit.com/" + company.toLowerCase().replace(" ", "") + ".com")
                .companyWebsite(applyUrl)
                .location(location)
                .locationType(locationType)
                .jobType(jobType)
                .description(description)
                .requirements(Arrays.asList(
                        "Bachelor's degree in Computer Science or related field",
                        "Strong problem-solving skills",
                        "Excellent communication abilities"
                ))
                .responsibilities(Arrays.asList(
                        "Develop and maintain software solutions",
                        "Collaborate with cross-functional teams",
                        "Participate in code reviews"
                ))
                .skills(skills)
                .salaryMin(salaryMin)
                .salaryMax(salaryMax)
                .salaryCurrency("USD")
                .salaryPeriod(jobType == JobPosting.JobType.INTERNSHIP ?
                        JobPosting.SalaryPeriod.MONTHLY : JobPosting.SalaryPeriod.YEARLY)
                .applicationUrl(applyUrl)
                .status(JobPosting.JobStatus.ACTIVE)
                .lastSyncedAt(LocalDateTime.now())
                .build();
    }
}

