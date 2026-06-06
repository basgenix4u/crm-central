package com.crmcentral.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

public final class DateUtils {
    private DateUtils() {}

    public static String formatDate(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT)) : null;
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DateTimeFormatter.ofPattern(AppConstants.DATETIME_FORMAT)) : null;
    }

    public static LocalDate parseDate(String date) {
        return date != null ? LocalDate.parse(date, DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT)) : null;
    }

    public static boolean isWithinDays(LocalDateTime dateTime, int days) {
        return dateTime != null && dateTime.isAfter(LocalDateTime.now().minusDays(days));
    }

    public static long daysBetween(LocalDate start, LocalDate end) {
        return Duration.between(start.atStartOfDay(), end.atStartOfDay()).toDays();
    }
}
