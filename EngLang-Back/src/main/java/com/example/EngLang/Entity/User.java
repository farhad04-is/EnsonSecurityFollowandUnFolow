package com.example.EngLang.Entity;

import com.example.EngLang.Enum.RoleEnum;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

    @Entity
    @Table(name = "users")
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String username;

        @Column(nullable = false)
        private String password;

        @Column(nullable = false, unique = true) // Gmail benzersiz olmalı
        private String gmail;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        @Builder.Default
        private RoleEnum roleEnum=RoleEnum.USER;
        @Builder.Default
        @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
        private List<WordList> wordLists = new ArrayList<>();
    }