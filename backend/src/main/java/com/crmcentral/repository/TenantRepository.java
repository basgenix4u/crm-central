package com.crmcentral.repository;

import com.crmcentral.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findByName(String name);
    Optional<Tenant> findByDomain(String domain);
    boolean existsByName(String name);
    boolean existsByDomain(String domain);
}
