FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve -q 2>/dev/null || true
COPY src ./src
RUN mvn package -DskipTests -q -T 1C

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-XX:+UseSerialGC", "-XX:MaxMetaspaceSize=128m", "-jar", "app.jar"]
