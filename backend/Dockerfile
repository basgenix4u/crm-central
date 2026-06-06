FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
RUN apk add --no-cache maven
COPY pom.xml .
COPY src ./src  
RUN mvn package -DskipTests -q
EXPOSE 8080
CMD ["java", "-Xmx256m", "-jar", "target/crm-central-1.0.0.jar"]
