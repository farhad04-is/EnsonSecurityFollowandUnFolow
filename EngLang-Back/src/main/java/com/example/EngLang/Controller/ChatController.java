package com.example.EngLang.Controller;


import com.example.EngLang.Entity.Mesaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;

@Controller
@CrossOrigin
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/private-send")
    public void handlePrivateMessage(@Payload Mesaje message) {
        // principal istifadə etmirik — sender frontend-dən gəlir
        System.out.println("Alındı: " + message.getSender() + " → " + message.getReceiver() + ": " + message.getMessage());

        messagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/messages",
                message
        );
    }

}
