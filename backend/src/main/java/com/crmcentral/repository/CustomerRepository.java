package com.crmcentral.repository;

import com.crmcentral.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID>, JpaSpecificationExecutor<Customer> {
    Page<Customer> findByTenantIdAndDeletedFalse(UUID tenantId, Pageable pageable);
    @Query("SELECT c FROM Customer c WHERE c.tenantId = :tenantId AND c.deleted = false AND (LOWER(c.firstName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(c.company) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<Customer> searchCustomers(@Param("tenantId") UUID tenantId, @Param("q") String query, Pageable pageable);
    List<Customer> findByTenantIdAndIndustryAndDeletedFalse(UUID tenantId, String industry);
    List<Customer> findByTenantIdAndStatusAndDeletedFalse(UUID tenantId, String status);
    long countByTenantIdAndDeletedFalse(UUID tenantId);
    @Query("SELECT c.industry, COUNT(c) FROM Customer c WHERE c.tenantId = :tenantId AND c.deleted = false GROUP BY c.industry")
    List<Object[]> countByIndustry(@Param("tenantId") UUID tenantId);
    @Query("SELECT c.status, COUNT(c) FROM Customer c WHERE c.tenantId = :tenantId AND c.deleted = false GROUP BY c.status")
    List<Object[]> countByStatus(@Param("tenantId") UUID tenantId);
}
