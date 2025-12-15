package com.unibuddy.collegeBuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.unibuddy"})
@EnableScheduling
public class CollegeBuddyApplication {

	public static void main(String[] args) {
		System.out.println("This is the entry point of the application!");
		SpringApplication.run(CollegeBuddyApplication.class, args);
	}

}
