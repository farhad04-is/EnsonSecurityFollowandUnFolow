package com.example.EngLang.Controller;

import com.example.EngLang.DTO.VideoListsDto;
import com.example.EngLang.Entity.VideoLists;
import com.example.EngLang.Service.Video.VideoListsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("videolist")
@RequiredArgsConstructor
@CrossOrigin
public class VideoList_Rest {
    private final VideoListsService videoListsService;

    @PostMapping("/dowloand")
    public String videolistDowland(@RequestBody List<VideoListsDto> videoListsDtos){
        videoListsService.videolistDowland(videoListsDtos);
        return "Videolar başarıyla yüklendi!";
    }

    @GetMapping
    public List<VideoLists> getAllVideoLists(){
        return videoListsService.getAllVideoLists();
    }

    @PutMapping("/{id}/like")
    public String likeVideo(@PathVariable Long id){
        videoListsService.incrementLikes(id);
        return "Video beğenildi! Beğeni sayısı artırıldı.";
    }
}