package com.crmcentral.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Slf4j
@Configuration
public class SchemaFix {

    @Bean
    CommandLineRunner fixSchema(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                
                // Add file_data column if it doesn't exist
                try {
                    stmt.execute("DO $$ BEGIN " +
                        "IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='documents' AND column_name='file_data') THEN " +
                        "ALTER TABLE documents ADD COLUMN file_data BYTEA; " +
                        "END IF; END $$");
                    log.info("Schema fix: file_data column ensured");
                } catch (Exception e) {
                    log.warn("Schema fix: file_data column already exists or error: {}", e.getMessage());
                }

                // Add is_primary column to contacts if it doesn't exist
                try {
                    stmt.execute("ALTER TABLE contacts ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE");
                    log.info("Schema fix: is_primary column ensured");
                } catch (Exception e) {
                    log.warn("Schema fix: {}", e.getMessage());
                }

            } catch (Exception e) {
                log.error("Schema fix failed: {}", e.getMessage());
            }
        };
    }
}
