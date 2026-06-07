FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -q && mv target/crm-central-*.jar target/app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/app.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Xmx300m -Xms150m -XX:+UseSerialGC -XX:MaxMetaspaceSize=96m -Djava.security.egd=file:/dev/./urandom -Dspring.jmx.enabled=false"
CMD java $JAVA_OPTS -jar app.jar
