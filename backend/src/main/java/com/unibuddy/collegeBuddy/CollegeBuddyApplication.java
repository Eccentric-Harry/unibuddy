package com.unibuddy.collegeBuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.unibuddy"})
@EnableScheduling
public class CollegeBuddyApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollegeBuddyApplication.class, args);
	}

}
