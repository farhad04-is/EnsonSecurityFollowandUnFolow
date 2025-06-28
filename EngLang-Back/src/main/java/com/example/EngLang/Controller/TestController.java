package com.example.EngLang.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class TestController {

    @GetMapping("/admin/hello")
    public String adminHello() {
        return "Salam Admin!";
    }

    @GetMapping("/user/hello")
    public String userHello() {
        return "Salam User!";
    }
}
