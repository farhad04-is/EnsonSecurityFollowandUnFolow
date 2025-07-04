package com.example.EngLang.Configration; // Make sure this matches your project's package structure

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Marks this class as a Spring configuration source
public class MinioConfig {

    // These @Value annotations inject properties from your application.properties (or .yml) file
    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.access-key}")
    private String accessKey; // Using 'accessKey' for better readability

    @Value("${minio.secret-key}")
    private String secretKey; // Using 'secretKey' for better readability

    @Value("${minio.bucket-name}")
    private String bucketName; // Using 'bucketName' for better readability

    /**
     * Configures and provides a MinioClient bean to the Spring application context.
     * This client can then be injected into services or components that need to interact with MinIO.
     *
     * @return A fully configured MinioClient instance.
     */
    @Bean // Marks this method's return value as a Spring-managed bean
    public MinioClient minioClient(){
        return MinioClient.builder()
                .endpoint(minioUrl)       // Set the MinIO server URL
                .credentials(accessKey, secretKey) // Set the access and secret keys for authentication
                .build();                 // Build the MinioClient instancez
    }

    // You might also want a getter for bucketName if other services need it without re-injecting
    public String getBucketName() {
        return bucketName;
    }
}