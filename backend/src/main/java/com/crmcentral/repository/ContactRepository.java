package com.crmcentral.repository;

import com.crmcentral.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {
    Page<Contact> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    List<Contact> findByCustomerIdAndDeletedFalse(UUID customerId);
    @Query("SELECT c FROM Contact c WHERE c.tenantId = :tenantId AND c.deleted = false AND (LOWER(c.firstName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<Contact> searchContacts(@Param("tenantId") UUID tenantId, @Param("q") String query, Pageable pageable);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
}
