package com.travelbuddy.joinrequestservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class JoinRequestServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(JoinRequestServiceApplication.class, args);
    }
}
