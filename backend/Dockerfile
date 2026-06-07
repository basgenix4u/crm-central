# ============================================================
# CRM Central Backend - Production Docker Build
# Multi-stage build: Maven compile → JRE runtime
# Optimized for Render.com deployment
# ============================================================

# Stage 1: Build with Maven + JDK 21
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy POM first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B 2>/dev/null || true

# Copy source and build
COPY src ./src
RUN mvn package -DskipTests -q \
    && mv target/crm-central-*.jar target/app.jar

# Stage 2: Lightweight runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built JAR
COPY --from=builder /build/target/app.jar app.jar

# Create upload directory
RUN mkdir -p /tmp/uploads && chown appuser:appgroup /tmp/uploads

USER appuser:appgroup

EXPOSE 8080

# JVM tuned for 512MB container (Render free/starter)
ENTRYPOINT ["java", \
    "-Xmx256m", \
    "-Xms128m", \
    "-XX:+UseSerialGC", \
    "-XX:MaxMetaspaceSize=128m", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
