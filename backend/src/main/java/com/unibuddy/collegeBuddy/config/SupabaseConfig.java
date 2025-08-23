package com.unibuddy.collegeBuddy.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@Slf4j
public class SupabaseConfig {

    @Value("${supabase.project-id}")
    private String projectId;

    @Value("${supabase.anon-key:}")
    private String anonKey;

    @Value("${supabase.service-role-key:}")
    private String serviceRoleKey;

    @Bean
    public WebClient supabaseWebClient() {
        String supabaseUrl = "https://" + projectId + ".supabase.co";
        
        // Use service role key if available, otherwise anon key
        String apiKey = serviceRoleKey != null && !serviceRoleKey.isEmpty() 
            ? serviceRoleKey 
            : anonKey;
        
        WebClient.Builder builder = WebClient.builder()
            .baseUrl(supabaseUrl + "/rest/v1");
        
        if (apiKey != null && !apiKey.isEmpty()) {
            builder.defaultHeader("Authorization", "Bearer " + apiKey)
                   .defaultHeader("apikey", apiKey);
        }
        
        log.info("Initialized Supabase WebClient for project: {}", projectId);
        return builder.build();
    }

    @Bean
    public String supabaseUrl() {
        return "https://" + projectId + ".supabase.co";
    }
}
