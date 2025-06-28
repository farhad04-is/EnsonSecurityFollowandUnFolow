package com.example.EngLang.Service.Security;


import com.example.EngLang.DTO.RegisterRequest;
import com.example.EngLang.Entity.User;
import com.example.EngLang.Enum.RoleEnum;
import com.example.EngLang.Repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {

        // ✅ 1. İstifadəçi mövcuddursa, istisna at
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }



        // ✅ 3. İstifadəçini yarat
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Şifrə hash-lənir
        user.setGmail(request.getGmail());

        userRepository.save(user);
    }
}

