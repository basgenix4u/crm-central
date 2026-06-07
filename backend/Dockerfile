FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -q && mv target/crm-central-*.jar target/app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /build/target/app.jar app.jar
RUN mkdir -p /tmp/uploads && chown app:app /tmp/uploads
USER app:app
EXPOSE 8080
CMD ["java", "-Xmx200m", "-Xms100m", "-XX:+UseSerialGC", "-XX:MaxMetaspaceSize=80m", "-XX:ReservedCodeCacheSize=32m", "-XX:-TieredCompilation", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
