package com.unibuddy.collegeBuddy.dto.globalchat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SendGlobalMessageRequest {
    @NotBlank(message = "Message text cannot be empty")
    @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    private String messageText;

    private MultipartFile image;
}
