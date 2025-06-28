package com.example.EngLang.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.File;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Data
@Builder
public class    TxtFile {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

@CreationTimestamp
   private LocalDateTime time;

private String path;

@Column(name = "file",columnDefinition = "BYTEA")
   private byte[] fileLength;
}
