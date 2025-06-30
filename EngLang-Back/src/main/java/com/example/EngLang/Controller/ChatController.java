package com.example.EngLang.Controller;

import com.example.EngLang.Entity.Mesaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/private-send")
    public void handlePrivateMessage(@Payload Mesaje message, Principal principal) {
        System.out.println("Alındı: " + principal.getName() + " → " + message.getReceiver() + ": " + message.getMessage());

        messagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/messages",
                message
        );
    }
}
