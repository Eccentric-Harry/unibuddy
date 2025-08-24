package com.unibuddy.collegeBuddy.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SendMessageRequest {
    @NotBlank(message = "Message text is required")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String messageText;

    private MultipartFile image;
}
