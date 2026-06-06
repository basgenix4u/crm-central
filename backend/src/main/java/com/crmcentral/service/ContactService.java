package com.crmcentral.service;

import com.crmcentral.dto.request.ContactRequest;
import com.crmcentral.dto.response.PagedResponse;
import com.crmcentral.entity.Contact;
import com.crmcentral.exception.ResourceNotFoundException;
import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public PagedResponse<Contact> getContacts(UUID tenantId, Pageable pageable) {
        Page<Contact> page = contactRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        return PagedResponse.<Contact>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }

    public Contact getById(UUID id) { return contactRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact","id",id)); }

    public List<Contact> getByCustomer(UUID customerId) { return contactRepository.findByCustomerIdAndDeletedFalse(customerId); }

    @Transactional
    public Contact create(UUID tenantId, ContactRequest req) {
        Contact c = Contact.builder().firstName(req.getFirstName()).lastName(req.getLastName())
            .email(req.getEmail()).phone(req.getPhone()).mobilePhone(req.getMobilePhone())
            .jobTitle(req.getJobTitle()).department(req.getDepartment()).company(req.getCompany())
            .addressLine1(req.getAddressLine1()).addressLine2(req.getAddressLine2())
            .city(req.getCity()).state(req.getState()).country(req.getCountry()).postalCode(req.getPostalCode())
            .linkedinUrl(req.getLinkedinUrl()).twitterUrl(req.getTwitterUrl()).notes(req.getNotes())
            .category(req.getCategory()).primary(req.isPrimary()).build();
        c.setTenantId(tenantId);
        if (req.getCustomerId() != null) c.setCustomer(customerRepository.findById(req.getCustomerId()).orElse(null));
        if (req.getAssignedTo() != null) c.setAssignedTo(userRepository.findById(req.getAssignedTo()).orElse(null));
        return contactRepository.save(c);
    }

    @Transactional
    public Contact update(UUID id, ContactRequest req) {
        Contact c = getById(id);
        c.setFirstName(req.getFirstName()); c.setLastName(req.getLastName());
        c.setEmail(req.getEmail()); c.setPhone(req.getPhone());
        c.setJobTitle(req.getJobTitle()); c.setDepartment(req.getDepartment());
        c.setNotes(req.getNotes()); c.setCategory(req.getCategory());
        return contactRepository.save(c);
    }

    @Transactional
    public void delete(UUID id) { Contact c = getById(id); c.setDeleted(true); contactRepository.save(c); }

    public PagedResponse<Contact> search(UUID tenantId, String q, Pageable pageable) {
        Page<Contact> page = contactRepository.searchContacts(tenantId, q, pageable);
        return PagedResponse.<Contact>builder().content(page.getContent()).page(page.getNumber()).size(page.getSize())
            .totalElements(page.getTotalElements()).totalPages(page.getTotalPages()).first(page.isFirst()).last(page.isLast()).build();
    }
}
