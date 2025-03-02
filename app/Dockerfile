FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ReleaseImageGenerator/ReleaseImageGenerator.csproj", "ReleaseImageGenerator/"]
RUN dotnet restore "ReleaseImageGenerator/ReleaseImageGenerator.csproj"
COPY . .
WORKDIR "/src/ReleaseImageGenerator"
RUN dotnet build "ReleaseImageGenerator.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ReleaseImageGenerator.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReleaseImageGenerator.dll"]
