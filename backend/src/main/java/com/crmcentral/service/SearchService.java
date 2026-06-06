package com.crmcentral.service;

import com.crmcentral.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;

    public Map<String, Object> globalSearch(UUID tenantId, String query) {
        Map<String, Object> results = new HashMap<>();
        var pageable = PageRequest.of(0, 10);
        results.put("customers", customerRepository.searchCustomers(tenantId, query, pageable).getContent());
        results.put("leads", leadRepository.searchLeads(tenantId, query, pageable).getContent());
        results.put("contacts", contactRepository.searchContacts(tenantId, query, pageable).getContent());
        return results;
    }
}
