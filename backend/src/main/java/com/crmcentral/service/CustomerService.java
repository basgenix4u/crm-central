package com.crmcentral.service;

import com.crmcentral.dto.request.CustomerRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Customer;
import com.crmcentral.entity.User;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.CustomerRepository;
import com.crmcentral.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<Customer> getCustomers(UUID tenantId, Pageable pageable) {
        Page<Customer> page = customerRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return toPagedResponse(page);
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(UUID id) {
        return customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
    }

    @Transactional
    public Customer createCustomer(UUID tenantId, CustomerRequest request) {
        Customer customer = Customer.builder()
            .firstName(request.getFirstName()).lastName(request.getLastName())
            .email(request.getEmail()).phone(request.getPhone())
            .company(request.getCompany()).jobTitle(request.getJobTitle())
            .industry(request.getIndustry()).website(request.getWebsite())
            .addressLine1(request.getAddressLine1()).addressLine2(request.getAddressLine2())
            .city(request.getCity()).state(request.getState())
            .country(request.getCountry()).postalCode(request.getPostalCode())
            .annualRevenue(request.getAnnualRevenue()).numberOfEmployees(request.getNumberOfEmployees())
            .status(request.getStatus() != null ? request.getStatus() : "Active")
            .type(request.getType()).source(request.getSource()).rating(request.getRating())
            .linkedinUrl(request.getLinkedinUrl()).twitterUrl(request.getTwitterUrl())
            .notes(request.getNotes()).tags(request.getTags() != null ? request.getTags() : new java.util.HashSet<>())
            .build();
        customer.setTenantId(tenantId);
        if (request.getAssignedTo() != null) {
            customer.setAssignedTo(userRepository.findById(request.getAssignedTo()).orElse(null));
        }
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(UUID id, CustomerRequest request) {
        Customer customer = getCustomerById(id);
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setCompany(request.getCompany());
        customer.setJobTitle(request.getJobTitle());
        customer.setIndustry(request.getIndustry());
        customer.setWebsite(request.getWebsite());
        customer.setAddressLine1(request.getAddressLine1());
        customer.setAddressLine2(request.getAddressLine2());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setCountry(request.getCountry());
        customer.setPostalCode(request.getPostalCode());
        customer.setAnnualRevenue(request.getAnnualRevenue());
        customer.setNumberOfEmployees(request.getNumberOfEmployees());
        if (request.getStatus() != null) customer.setStatus(request.getStatus());
        customer.setType(request.getType());
        customer.setSource(request.getSource());
        customer.setRating(request.getRating());
        customer.setNotes(request.getNotes());
        if (request.getTags() != null) customer.setTags(request.getTags());
        if (request.getAssignedTo() != null) {
            customer.setAssignedTo(userRepository.findById(request.getAssignedTo()).orElse(null));
        }
        return customerRepository.save(customer);
    }

    @Transactional
    public void deleteCustomer(UUID id) {
        Customer customer = getCustomerById(id);
        customer.setDeleted(true);
        customerRepository.save(customer);
    }

    @Transactional(readOnly = true)
    public PagedResponse<Customer> searchCustomers(UUID tenantId, String query, Pageable pageable) {
        Page<Customer> page = customerRepository.searchCustomers(tenantId, query, pageable);
        return toPagedResponse(page);
    }

    private PagedResponse<Customer> toPagedResponse(Page<Customer> page) {
        return PagedResponse.<Customer>builder()
            .content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
            .first(page.isFirst()).last(page.isLast()).build();
    }
}
