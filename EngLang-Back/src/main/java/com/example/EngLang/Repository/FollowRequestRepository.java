package com.example.EngLang.Repository;

import com.example.EngLang.Entity.FollowRequest;
import com.example.EngLang.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRequestRepository extends JpaRepository<FollowRequest, Long> {
    Optional<FollowRequest> findByFollowerAndFollowing(User follower, User following);
    List<FollowRequest> findByFollowingAndAcceptedFalse(User following); // Pending requests for a user
    List<FollowRequest> findByFollowerAndAcceptedTrue(User follower); // Users I'm following (accepted)
    List<FollowRequest> findByFollowingAndAcceptedTrue(User following); // My followers (accepted)

}