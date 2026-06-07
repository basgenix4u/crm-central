package com.crmcentral;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
    RedisAutoConfiguration.class,
    RedisRepositoriesAutoConfiguration.class,
    MailSenderAutoConfiguration.class
})
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
public class CrmCentralApplication {
    public static void main(String[] args) {
        SpringApplication.run(CrmCentralApplication.class, args);
    }
}
