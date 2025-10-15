# Imagen de runtime (Java 17)
FROM eclipse-temurin:17-jre-alpine

# Carpeta de trabajo
WORKDIR /app

# JAR
ARG JAR_FILE=build/libs/Helisys-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Usuario no-root por seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Puerto de la app
EXPOSE 8080

# Ajustes de JVM para contenedores
ENV JAVA_OPTS="-XX:InitialRAMPercentage=10 -XX:MaxRAMPercentage=75 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

# Arranque
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
