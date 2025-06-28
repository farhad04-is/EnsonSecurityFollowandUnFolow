package com.example.EngLang.Service.YeniTelegram;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Configuration
@Slf4j
public class BotConfiguration {

    @Bean
    public TelegramBot telegramBot(
            @Value("${bot.name}") String botName,
            @Value("${bot.token}") String botToken,
            SearchService searchService) { // SearchService bean olarak enjekte edildi

        TelegramBot telegramBot = new TelegramBot(botName, botToken, searchService); // Constructor güncellendi

        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(telegramBot);
            log.info("Bot successfully registered.");
        } catch (TelegramApiException e) {
            log.error("Error registering bot: ", e);
        }

        return telegramBot;
    }
}