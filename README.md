# 🧳 Travel Buddy Finder

A microservices-based travel companion finding platform built with Spring Boot, React, and Docker.

## Architecture

```
Frontend (React) → API Gateway → Microservices → PostgreSQL
                                      ↕
                                   RabbitMQ
                                      ↕
                              Notification Service
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Service Registry | 8761 | Eureka Server |
| API Gateway | 8080 | Centralized routing + JWT |
| User Service | 8081 | Auth & profiles |
| Trip Service | 8082 | Trip CRUD |
| Join Request Service | 8083 | Join flow + RabbitMQ |
| Notification Service | 8084 | Event consumer |
| Chat Service | 8085 | WebSocket chat |
| Review Service | 8086 | Ratings |
| Frontend | 3000 | React UI |

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start everything
docker-compose up -d

# 3. Access
# Frontend: http://localhost:3000
# Eureka: http://localhost:8761
# RabbitMQ: http://localhost:15672 (guest/guest)
# API Gateway: http://localhost:8080
```

## Tech Stack

**Backend:** Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, PostgreSQL, RabbitMQ, WebSocket STOMP

**Frontend:** React 18, Vite, TailwindCSS, Axios, SockJS, StompJS

**DevOps:** Docker, Docker Compose, GitHub Actions
