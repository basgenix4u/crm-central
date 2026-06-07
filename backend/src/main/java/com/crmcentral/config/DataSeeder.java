package com.crmcentral.config;

import com.crmcentral.entity.Tenant;
import com.crmcentral.entity.User;
import com.crmcentral.enums.UserRole;
import com.crmcentral.repository.TenantRepository;
import com.crmcentral.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData() {
        return args -> {
            try {
                if (userRepository.count() == 0) {
                    log.info("Seeding initial data...");

                    Tenant tenant = Tenant.builder()
                        .name("CRM Central")
                        .domain("localhost")
                        .industry("Technology")
                        .plan("ENTERPRISE")
                        .active(true)
                        .maxUsers(100)
                        .currency("USD")
                        .timezone("UTC")
                        .build();
                    tenant = tenantRepository.save(tenant);

                    User superAdmin = User.builder()
                        .firstName("Super").lastName("Admin")
                        .email("admin@crmcentral.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role(UserRole.SUPER_ADMIN)
                        .active(true).emailVerified(true)
                        .department("Administration")
                        .jobTitle("System Administrator")
                        .build();
                    superAdmin.setTenantId(tenant.getId());
                    userRepository.save(superAdmin);

                    log.info("=== Default Admin: admin@crmcentral.com / Admin@123 ===");
                }
            } catch (Exception e) {
                log.warn("Data seeding skipped: {}", e.getMessage());
            }
        };
    }
}
