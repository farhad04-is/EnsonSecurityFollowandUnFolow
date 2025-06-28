package com.example.EngLang.Controller;

import com.example.EngLang.Entity.FollowRequest;
import com.example.EngLang.Entity.User;
import com.example.EngLang.Repository.UserRepository;
import com.example.EngLang.Service.Follow.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// FollowController.java
@RestController
@RequestMapping("/api/follow")

@RequiredArgsConstructor
public class FollowController {


    private final FollowService followService;
    private final UserRepository userRepository;
    // Assuming you have a way to get the current user's ID (e.g., from session/security context)
    // For simplicity, I'm passing followerId directly for now.
    @PostMapping("/request/{followerUsername}/{followingUsername}")
    public ResponseEntity<String> sendFollowRequest(@PathVariable String followerUsername, @PathVariable String followingUsername) {
        try {
            followService.sendFollowRequest(followerUsername, followingUsername);
            return ResponseEntity.ok("Follow request sent.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/accept/{followerUsername}/{followingUsername}")
    public ResponseEntity<String> acceptFollowRequest(@PathVariable String followerUsername, @PathVariable String followingUsername) {
        try {
            followService.acceptFollowRequest(followerUsername, followingUsername);
            return ResponseEntity.ok("Follow request accepted.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unfollow/{followerUsername}/{followingUsername}")
    public ResponseEntity<String> unfollow(@PathVariable String followerUsername, @PathVariable String followingUsername) {
        try {
            followService.unfollow(followerUsername, followingUsername);
            return ResponseEntity.ok("Unfollowed successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending/{username}")
    public ResponseEntity<List<FollowRequest>> getPendingFollowRequests(@PathVariable String username) {
        List<FollowRequest> requests = followService.getPendingFollowRequests(username);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/followers/{username}")
    public ResponseEntity<List<User>> getFollowers(@PathVariable String username) {
        List<User> followers = followService.getFollowers(username);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/following/{username}")
    public ResponseEntity<List<User>> getFollowing(@PathVariable String username) {
        List<User> following = followService.getFollowing(username);
        return ResponseEntity.ok(following);
    }

    // Yeni əlavə olunan endpoint: istifadəçi axtarışı üçün
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = followService.searchUsersByUsername(query);
        return ResponseEntity.ok(users);
    }

    @PostMapping // Bu metod istifadəçi siyahısını saxlamaq üçündür, follow sistemi ilə birbaşa əlaqəsi yoxdur.
    public List<User> userList(@RequestBody List<User> users) {
        return userRepository.saveAll(users);
    }
}