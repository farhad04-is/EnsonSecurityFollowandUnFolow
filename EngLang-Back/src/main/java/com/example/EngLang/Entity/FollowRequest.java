package com.example.EngLang.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class FollowRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower; // User who sent the follow request

    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following; // User who is being followed

    private boolean accepted; // True if the request has been accepted
}