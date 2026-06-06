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
            if (userRepository.count() == 0) {
                log.info("Seeding initial data...");

                // Create default tenant
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

                // Create super admin
                User superAdmin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin@crmcentral.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(UserRole.SUPER_ADMIN)
                    .active(true)
                    .emailVerified(true)
                    .department("Administration")
                    .jobTitle("System Administrator")
                    .build();
                superAdmin.setTenantId(tenant.getId());
                userRepository.save(superAdmin);

                // Create sales manager
                User salesManager = User.builder()
                    .firstName("John")
                    .lastName("Smith")
                    .email("john.smith@crmcentral.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .role(UserRole.SALES_MANAGER)
                    .active(true)
                    .emailVerified(true)
                    .department("Sales")
                    .jobTitle("Sales Manager")
                    .build();
                salesManager.setTenantId(tenant.getId());
                userRepository.save(salesManager);

                // Create sales rep
                User salesRep = User.builder()
                    .firstName("Sarah")
                    .lastName("Johnson")
                    .email("sarah.johnson@crmcentral.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .role(UserRole.SALES_REPRESENTATIVE)
                    .active(true)
                    .emailVerified(true)
                    .department("Sales")
                    .jobTitle("Sales Representative")
                    .build();
                salesRep.setTenantId(tenant.getId());
                userRepository.save(salesRep);

                // Create support agent
                User supportAgent = User.builder()
                    .firstName("Mike")
                    .lastName("Wilson")
                    .email("mike.wilson@crmcentral.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .role(UserRole.SUPPORT_AGENT)
                    .active(true)
                    .emailVerified(true)
                    .department("Support")
                    .jobTitle("Support Agent")
                    .build();
                supportAgent.setTenantId(tenant.getId());
                userRepository.save(supportAgent);

                // Create marketing manager
                User marketingManager = User.builder()
                    .firstName("Emily")
                    .lastName("Davis")
                    .email("emily.davis@crmcentral.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .role(UserRole.MARKETING_MANAGER)
                    .active(true)
                    .emailVerified(true)
                    .department("Marketing")
                    .jobTitle("Marketing Manager")
                    .build();
                marketingManager.setTenantId(tenant.getId());
                userRepository.save(marketingManager);

                log.info("Initial data seeded successfully!");
                log.info("==============================================");
                log.info("Default Admin Credentials:");
                log.info("Email: admin@crmcentral.com");
                log.info("Password: Admin@123");
                log.info("==============================================");
            }
        };
    }
}
