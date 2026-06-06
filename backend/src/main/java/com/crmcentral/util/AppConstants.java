package com.crmcentral.util;

public final class AppConstants {
    private AppConstants() {}

    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "20";
    public static final int MAX_PAGE_SIZE = 100;

    public static final String ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_SALES_MANAGER = "ROLE_SALES_MANAGER";
    public static final String ROLE_SALES_REPRESENTATIVE = "ROLE_SALES_REPRESENTATIVE";
    public static final String ROLE_SUPPORT_AGENT = "ROLE_SUPPORT_AGENT";
    public static final String ROLE_MARKETING_MANAGER = "ROLE_MARKETING_MANAGER";
    public static final String ROLE_CUSTOMER = "ROLE_CUSTOMER";

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    // Cache Keys
    public static final String CACHE_CUSTOMERS = "customers";
    public static final String CACHE_LEADS = "leads";
    public static final String CACHE_OPPORTUNITIES = "opportunities";
    public static final String CACHE_DASHBOARD = "dashboard";

    // Ticket Number Prefix
    public static final String TICKET_PREFIX = "TKT-";

    // File Upload
    public static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    public static final String[] ALLOWED_FILE_TYPES = {
        "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg", "image/png", "image/gif", "text/plain", "text/csv"
    };
}
