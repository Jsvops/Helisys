FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY build/libs/Helisys-0.0.1-SNAPSHOT.jar /app/app.jar

ENV SPRING_PROFILES_ACTIVE=prod SERVER_PORT=8080

EXPOSE 8080

ENTRYPOINT ["sh","-c","java -jar /app/app.jar --server.port=${PORT:-$SERVER_PORT}"]
