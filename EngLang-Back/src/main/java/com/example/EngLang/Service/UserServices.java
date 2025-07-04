package com.example.EngLang.Service;

import com.example.EngLang.Entity.User;
import com.example.EngLang.Enum.RoleEnum;
import com.example.EngLang.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServices {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setGmail(updatedUser.getGmail());
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setRoleEnum(updatedUser.getRoleEnum());
        return userRepository.save(existingUser);
    }

    public User changeRole(Long id, RoleEnum newRole) {
        User user = getUserById(id);
        user.setRoleEnum(newRole);
        return userRepository.save(user);
    }
}
