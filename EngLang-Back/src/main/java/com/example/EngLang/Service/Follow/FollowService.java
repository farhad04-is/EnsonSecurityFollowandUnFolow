package com.example.EngLang.Service.Follow;

import com.example.EngLang.Entity.FollowRequest;
import com.example.EngLang.Entity.User;
import com.example.EngLang.Repository.FollowRequestRepository;
import com.example.EngLang.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// FollowService.java
@Service
public class FollowService {

    @Autowired
    private FollowRequestRepository followRequestRepository;
    @Autowired
    private UserRepository userRepository;

    public void sendFollowRequest(String followUsername, String followingUsername) {
        User follower = userRepository.findByUsername(followUsername).orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findByUsername(followingUsername).orElseThrow(() -> new RuntimeException("Following user not found"));

        // Check if a request already exists
        if (followRequestRepository.findByFollowerAndFollowing(follower, following).isPresent()) {
            throw new RuntimeException("Follow request already sent or relationship already exists.");
        }

        FollowRequest request = new FollowRequest();
        request.setFollower(follower);
        request.setFollowing(following);
        request.setAccepted(false); // Initially not accepted
        followRequestRepository.save(request);
    }

    public void acceptFollowRequest(String followerUsername, String followingUsername) {
        User follower = userRepository.findByUsername(followerUsername).orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findByUsername(followingUsername).orElseThrow(() -> new RuntimeException("Following user not found"));

        FollowRequest request = followRequestRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new RuntimeException("No pending follow request found from " + followerUsername + " to " + followingUsername + "."));
        if (request.isAccepted()) {
            throw new RuntimeException("Follow request already accepted.");
        }
        request.setAccepted(true);
        followRequestRepository.save(request);
    }

    public void unfollow(String followerUsername, String followingUsername) {
        User follower = userRepository.findByUsername(followerUsername).orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findByUsername(followingUsername).orElseThrow(() -> new RuntimeException("Following user not found"));

        FollowRequest request = followRequestRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new RuntimeException("No follow relationship found."));

        followRequestRepository.delete(request);
    }

    public List<FollowRequest> getPendingFollowRequests(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return followRequestRepository.findByFollowingAndAcceptedFalse(user);
    }

    public List<User> getFollowers(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return followRequestRepository.findByFollowingAndAcceptedTrue(user)
                .stream()
                .map(FollowRequest::getFollower)
                .collect(Collectors.toList());
    }

    public List<User> getFollowing(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return followRequestRepository.findByFollowerAndAcceptedTrue(user)
                .stream()
                .map(FollowRequest::getFollowing)
                .collect(Collectors.toList());
    }

    // Yeni əlavə olunan metod: username-ə görə istifadəçiləri axtarmaq üçün
    public List<User> searchUsersByUsername(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return userRepository.findTop10ByUsernameStartingWithIgnoreCaseOrderByUsernameAsc(query);
    }

}