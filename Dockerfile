FROM gradle:jdk17-jammy AS build
WORKDIR /src
COPY . .
RUN gradle clean bootJar --no-daemon


FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /src/build/libs/Helisys-0.0.1-SNAPSHOT.jar app.jar
ENV PORT=8080
EXPOSE 8080
CMD ["sh","-c","java -Dserver.port=$PORT -jar app.jar"]
