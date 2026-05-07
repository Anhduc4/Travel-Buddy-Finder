package com.travelbuddy.userservice.dto;

public class UserUpdateRequest {
    private String name;
    private String bio;
    private String gender;
    private Integer age;
    private String interests;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
}
