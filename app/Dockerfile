FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
RUN apt-get update && apt-get install -y libfontconfig1 && apt-get clean
USER $APP_UID
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ReleaseImageGenerator.API/ReleaseImageGenerator.API.csproj", "ReleaseImageGenerator.API/"]
RUN dotnet restore "ReleaseImageGenerator.API/ReleaseImageGenerator.API.csproj"
COPY . .
WORKDIR "/src/ReleaseImageGenerator.API"
RUN dotnet build "ReleaseImageGenerator.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
COPY --from=build /src/ReleaseImageGenerator.API/fonts /app/publish/fonts
RUN dotnet publish "ReleaseImageGenerator.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReleaseImageGenerator.API.dll"]
