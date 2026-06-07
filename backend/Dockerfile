FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -q && mv target/crm-central-*.jar target/app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/app.jar app.jar
RUN mkdir -p /tmp/uploads
EXPOSE 8080
CMD ["java", "-Xmx180m", "-Xms80m", "-XX:+UseSerialGC", "-XX:MaxMetaspaceSize=64m", "-XX:-TieredCompilation", "-Dspring.jmx.enabled=false", "-Dlogging.level.root=WARN", "-Dlogging.level.org.springframework.boot=INFO", "-Dlogging.level.com.crmcentral=INFO", "-jar", "app.jar"]
