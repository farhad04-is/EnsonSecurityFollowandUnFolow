package com.example.EngLang.Service.Video;

import com.example.EngLang.DTO.VideoListsDto;
import com.example.EngLang.Entity.VideoLists;
import com.example.EngLang.Repository.VideoListsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoListsService {

    private final VideoListsRepository videoListsRepository;

    public void videolistDowland(List<VideoListsDto> videoListsDtos){
        if (videoListsDtos != null && !videoListsDtos.isEmpty()) {
            List<VideoLists> videos = videoListsDtos.stream()
                    .map(dto -> VideoLists.builder()
                            .link(dto.getLink())
                            .videoname(dto.getVideoname())
                            .likes(dto.getLikes())
                            .build())
                    .collect(Collectors.toList());

            videoListsRepository.saveAll(videos);
        } else {
            System.out.println("VideoListsDto listesi null veya boş geldi!");
        }
    }

    public List<VideoLists> getAllVideoLists() {
       return videoListsRepository.findAll();
    }

    @Transactional // Ensures the operation is atomic
    public void incrementLikes(Long videoId) {
        // Find the video by ID
        VideoLists video = videoListsRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video bulunamadı! ID: " + videoId));

        // Increment the likes count
        video.setLikes(video.getLikes() + 1);

        // Save the updated video back to the database
        videoListsRepository.save(video);
    }
}