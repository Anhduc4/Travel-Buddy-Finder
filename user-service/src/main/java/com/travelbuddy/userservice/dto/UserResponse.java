package com.travelbuddy.userservice.dto;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String gender;
    private Integer age;
    private String interests;

    public UserResponse(Long id, String name, String email, String bio) {
        this(id, name, email, bio, null, null, null);
    }

    public UserResponse(Long id, String name, String email, String bio, String gender, Integer age, String interests) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.gender = gender;
        this.age = age;
        this.interests = interests;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getBio() { return bio; }
    public String getGender() { return gender; }
    public Integer getAge() { return age; }
    public String getInterests() { return interests; }
}
