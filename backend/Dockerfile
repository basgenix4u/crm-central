FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -q && ls -la target/*.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/crm-central-1.0.0.jar app.jar
EXPOSE 10000
CMD ["java", "-Xmx200m", "-Xms100m", "-XX:+UseSerialGC", "-XX:MaxMetaspaceSize=100m", "-jar", "app.jar"]
