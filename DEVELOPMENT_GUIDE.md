# 📖 Travel Buddy Finder – Hướng Dẫn Phát Triển Nhóm

> **Repo:** `https://github.com/Anhduc4/Travel-Buddy-Finder.git`  
> **Nhóm:** 5 thành viên | **DevOps Lead:** TV5  
> **Tech Stack:** Java 17, Spring Boot 3, React 18, PostgreSQL, RabbitMQ, Docker

---

## Mục lục

1. [Yêu cầu cài đặt](#1--yêu-cầu-cài-đặt)
2. [Clone và chạy project lần đầu](#2--clone-và-chạy-project-lần-đầu)
3. [Chạy từng service riêng lẻ (Development)](#3--chạy-từng-service-riêng-lẻ-development)
4. [Git Workflow – Quy trình làm việc nhóm](#4--git-workflow--quy-trình-làm-việc-nhóm)
5. [DevOps – Quản lý & Vận hành](#5--devops--quản-lý--vận-hành)
6. [Docker – Hướng dẫn chi tiết](#6--docker--hướng-dẫn-chi-tiết)
7. [CI/CD Pipeline](#7--cicd-pipeline)
8. [Bảng port & URL truy cập](#8--bảng-port--url-truy-cập)
9. [Xử lý lỗi thường gặp](#9--xử-lý-lỗi-thường-gặp)

---

## 1. 🛠 Yêu cầu cài đặt

Mỗi thành viên cần cài đặt trên máy **trước khi bắt đầu**:

| Phần mềm | Version tối thiểu | Link tải | Ghi chú |
|---|---|---|---|
| **Git** | 2.40+ | https://git-scm.com | Bắt buộc |
| **Docker Desktop** | 4.25+ | https://docker.com/products/docker-desktop | Bắt buộc — bao gồm Docker Compose |
| **Java JDK** | 17 | https://adoptium.net | Cần nếu chạy backend ngoài Docker |
| **Maven** | 3.9+ | https://maven.apache.org | Cần nếu chạy backend ngoài Docker (hoặc dùng `mvnw` có sẵn) |
| **Node.js** | 20+ | https://nodejs.org | Cần nếu chạy frontend ngoài Docker |
| **IDE** | - | IntelliJ IDEA / VS Code | Khuyên dùng |

> ⚠️ **Quan trọng:** Hãy đảm bảo Docker Desktop **đang chạy** (icon Docker trên taskbar/system tray có màu xanh) trước khi chạy bất kỳ lệnh Docker nào.

---

## 2. 🚀 Clone và chạy project lần đầu

### Bước 1: Clone repo

```bash
git clone https://github.com/Anhduc4/Travel-Buddy-Finder.git
cd Travel-Buddy-Finder
```

### Bước 2: Tạo file cấu hình môi trường

```bash
cp .env.example .env
```

> File `.env` chứa các biến môi trường (database password, JWT secret, ...). File này **KHÔNG được push lên GitHub** (đã có trong `.gitignore`).

### Bước 3: Khởi động toàn bộ hệ thống bằng Docker Compose

```bash
docker-compose up -d --build
```

**Giải thích:**
- `up`: Tạo và khởi động containers
- `-d`: Chạy nền (detached mode)
- `--build`: Build lại images từ source code

**⏱ Thời gian lần đầu:** ~5-10 phút (tải dependencies Maven + npm)

### Bước 4: Kiểm tra tất cả đang chạy

```bash
docker-compose ps
```

Kết quả mong đợi — tất cả services ở trạng thái `Up`:

```
NAME                    STATUS
travel-buddy-postgres   Up (healthy)
travel-buddy-rabbitmq   Up (healthy)
service-registry        Up
api-gateway             Up
user-service            Up
trip-service            Up
join-request-service    Up
notification-service    Up
chat-service            Up
review-service          Up
travel-buddy-frontend   Up
```

### Bước 5: Truy cập ứng dụng

Mở trình duyệt:
- **Frontend:** http://localhost:3000
- **Eureka Dashboard:** http://localhost:8761

🎉 **Xong! Hệ thống đã sẵn sàng.**

---

## 3. 🔧 Chạy từng service riêng lẻ (Development)

Khi phát triển, bạn **KHÔNG CẦN** chạy toàn bộ bằng Docker. Chỉ cần Docker cho infrastructure (PostgreSQL + RabbitMQ), còn service của bạn chạy trực tiếp để có **hot-reload**.

### 3.1. Chạy Infrastructure (bắt buộc)

```bash
docker-compose up -d postgres rabbitmq
```

Đợi ~30 giây để cả hai healthy.

### 3.2. Chạy Service Registry (bắt buộc — chạy trước các service khác)

```bash
cd service-registry
./mvnw spring-boot:run        # macOS/Linux
mvnw.cmd spring-boot:run      # Windows
```

Đợi thấy log `Started ServiceRegistryApplication` → http://localhost:8761

### 3.3. Chạy service mà bạn phụ trách

Mỗi thành viên mở terminal riêng, chạy service của mình:

| Thành viên | Lệnh chạy | Port |
|---|---|---|
| **TV1** (User Service) | `cd user-service && mvnw.cmd spring-boot:run` | 8081 |
| **TV1** (API Gateway) | `cd api-gateway && mvnw.cmd spring-boot:run` | 8080 |
| **TV2** (Trip Service) | `cd trip-service && mvnw.cmd spring-boot:run` | 8082 |
| **TV2** (Join Request) | `cd join-request-service && mvnw.cmd spring-boot:run` | 8083 |
| **TV3** (Notification) | `cd notification-service && mvnw.cmd spring-boot:run` | 8084 |
| **TV3** (Chat Service) | `cd chat-service && mvnw.cmd spring-boot:run` | 8085 |
| **TV1** (Review Service) | `cd review-service && mvnw.cmd spring-boot:run` | 8086 |

### 3.4. Chạy Frontend (TV4)

```bash
cd frontend
npm install       # chỉ cần lần đầu
npm run dev
```

Frontend chạy tại http://localhost:3000 với **hot-reload** — sửa code tự cập nhật ngay trên trình duyệt.

> 💡 **Tip:** `vite.config.js` đã cấu hình proxy: request `/api/*` → `localhost:8080` (Gateway), `/ws/*` → `localhost:8085` (Chat). Không cần config thêm gì.

### 3.5. Thứ tự khởi động bắt buộc

```
PostgreSQL + RabbitMQ  →  Service Registry  →  API Gateway  →  Microservices  →  Frontend
         (1)                   (2)                 (3)             (4)            (5)
```

---

## 4. 🌿 Git Workflow – Quy trình làm việc nhóm

### Quy tắc vàng

> 🔴 **KHÔNG PUSH TRỰC TIẾP LÊN `main`!**  
> Mọi thay đổi phải qua **feature branch → Pull Request → Review → Merge**.

### 4.1. Quy trình chuẩn cho mỗi task

```bash
# 1. Cập nhật main mới nhất
git checkout main
git pull origin main

# 2. Tạo branch mới (đặt tên theo quy tắc bên dưới)
git checkout -b feature/ten-tinh-nang

# 3. Code xong → commit
git add .
git commit -m "feat: mô tả ngắn gọn"

# 4. Push branch lên GitHub
git push origin feature/ten-tinh-nang

# 5. Vào GitHub → tạo Pull Request → chờ review → merge
```

### 4.2. Quy tắc đặt tên branch

```
feature/ten-tinh-nang     ← Tính năng mới
fix/ten-bug               ← Sửa bug
hotfix/ten-loi-gap        ← Sửa lỗi khẩn trên main
docs/noi-dung             ← Cập nhật tài liệu
```

**Ví dụ thực tế:**
| Thành viên | Branch |
|---|---|
| TV1 | `feature/user-auth-jwt`, `feature/api-gateway-routing` |
| TV2 | `feature/trip-crud`, `feature/join-request-flow` |
| TV3 | `feature/notification-rabbitmq`, `feature/chat-websocket` |
| TV4 | `feature/frontend-login-page`, `feature/trip-feed-ui` |
| TV5 | `feature/docker-compose`, `fix/ci-pipeline` |

### 4.3. Commit message convention

```
feat: thêm chức năng đăng nhập JWT
fix: sửa lỗi không validate token ở gateway
docs: cập nhật API documentation
refactor: tách JwtUtil thành class riêng
test: thêm unit test cho TripService
chore: cập nhật docker-compose.yml
```

### 4.4. Xử lý conflict

Khi tạo PR mà có conflict:

```bash
# Cập nhật main mới nhất
git checkout main
git pull origin main

# Quay lại branch của mình và merge main vào
git checkout feature/ten-branch
git merge main

# Giải quyết conflict trong IDE → commit → push lại
git add .
git commit -m "merge: resolve conflict with main"
git push origin feature/ten-branch
```

---

## 5. 👨‍💻 DevOps – Quản lý & Vận hành (TV5)

### 5.1. Vai trò của DevOps trong nhóm

Là **TV5 – DevOps**, bạn chịu trách nhiệm:

| Mảng | Công việc cụ thể |
|---|---|
| **Infrastructure** | Quản lý Docker, Docker Compose, đảm bảo mọi người chạy được |
| **CI/CD** | Duy trì GitHub Actions pipeline, đảm bảo build pass |
| **Environment** | Quản lý `.env.example`, biến môi trường, secrets |
| **Quality Gate** | Review Pull Request trước khi merge vào `main` |
| **Monitoring** | Theo dõi logs, service health, RabbitMQ queue |
| **Deploy** | Deploy lên server/cloud khi cần |

### 5.2. Checklist hàng ngày của DevOps

```
☐ Kiểm tra GitHub Actions CI — có build nào fail không?
☐ Review các Pull Request đang pending
☐ Đảm bảo branch main luôn "green" (build pass)
☐ Hỗ trợ thành viên gặp lỗi Docker/environment
☐ Cập nhật docker-compose.yml nếu có service mới/thay đổi config
```

### 5.3. Protect branch `main`

Vào **GitHub → Settings → Branches → Add branch protection rule:**

| Cài đặt | Giá trị |
|---|---|
| Branch name pattern | `main` |
| Require pull request before merging | ✅ Bật |
| Require approvals | 1 (ít nhất 1 người review) |
| Require status checks to pass | ✅ Bật (chọn `build-backend`, `build-frontend`) |
| Include administrators | ✅ (kể cả bạn cũng phải qua PR) |

### 5.4. Quản lý Secrets trên GitHub

Vào **GitHub → Settings → Secrets and variables → Actions**, thêm:

| Secret name | Giá trị |
|---|---|
| `POSTGRES_PASSWORD` | `postgres123` |
| `JWT_SECRET` | `TravelBuddyFinderSecretKeyForJWT2024MustBe256BitsLong!!` |

> Dùng cho CI/CD pipeline và deploy, **KHÔNG hardcode** trong code.

### 5.5. Cấp quyền collaborator cho thành viên

Vào **GitHub → Settings → Collaborators → Add people**, thêm GitHub username của 4 thành viên còn lại với quyền **Write**.

---

## 6. 🐳 Docker – Hướng dẫn chi tiết

### 6.1. Kiến trúc Docker của project

```
docker-compose.yml
├── postgres          (image: postgres:15-alpine)     ← Shared DB server
│   └── init-db/init.sql tạo 6 databases
├── rabbitmq          (image: rabbitmq:3-management)  ← Message broker
├── service-registry  (build: ./service-registry)     ← Eureka
├── api-gateway       (build: ./api-gateway)          ← Spring Cloud Gateway
├── user-service      (build: ./user-service)         ← Port 8081
├── trip-service      (build: ./trip-service)         ← Port 8082
├── join-request-svc  (build: ./join-request-service) ← Port 8083
├── notification-svc  (build: ./notification-service) ← Port 8084
├── chat-service      (build: ./chat-service)         ← Port 8085
├── review-service    (build: ./review-service)       ← Port 8086
└── frontend          (build: ./frontend)             ← Nginx serve React, Port 3000
```

### 6.2. Các lệnh Docker quan trọng

```bash
# ===== KHỞI ĐỘNG =====
docker-compose up -d --build         # Build + khởi động tất cả
docker-compose up -d                 # Khởi động (không build lại)
docker-compose up -d --build frontend  # Chỉ build lại frontend

# ===== THEO DÕI =====
docker-compose ps                    # Xem trạng thái containers
docker-compose logs -f               # Xem logs tất cả (realtime)
docker-compose logs -f user-service  # Xem logs 1 service cụ thể
docker-compose logs --tail=50 api-gateway  # 50 dòng log gần nhất

# ===== DỪNG =====
docker-compose stop                  # Dừng tất cả (giữ containers)
docker-compose down                  # Dừng + xoá containers (giữ data)
docker-compose down -v               # Dừng + xoá containers + xoá data DB

# ===== KHÁC =====
docker-compose restart user-service  # Restart 1 service
docker-compose exec postgres psql -U postgres  # Truy cập PostgreSQL CLI
docker system prune -a               # Dọn dẹp images/containers cũ (giải phóng ổ cứng)
```

### 6.3. Khi nào cần build lại?

| Tình huống | Lệnh |
|---|---|
| Sửa code **backend** (Java) | `docker-compose up -d --build ten-service` |
| Sửa code **frontend** (React) | `docker-compose up -d --build frontend` |
| Sửa `docker-compose.yml` | `docker-compose up -d` |
| Sửa `pom.xml` (thêm dependency) | `docker-compose up -d --build ten-service` |
| Sửa `package.json` (thêm npm package) | `docker-compose up -d --build frontend` |
| Sửa `.env` | `docker-compose up -d` (tự đọc lại .env) |
| Thêm service mới | `docker-compose up -d --build` |

### 6.4. Kết nối các service trong Docker

Trong Docker Compose, các service kết nối với nhau **qua tên service** (không dùng `localhost`):

```
# Từ user-service muốn kết nối PostgreSQL:
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/userdb
                                        ^^^^^^^^
                                        Tên service trong docker-compose.yml

# Từ join-request-service muốn kết nối RabbitMQ:
SPRING_RABBITMQ_HOST=rabbitmq
                     ^^^^^^^^
                     Tên service trong docker-compose.yml

# Từ mọi service đăng ký với Eureka:
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-registry:8761/eureka/
                                          ^^^^^^^^^^^^^^^^
                                          Tên service trong docker-compose.yml
```

> ⚠️ **Quan trọng:** Khi chạy **ngoài Docker** (trực tiếp trên máy), dùng `localhost` thay vì tên service. Các file `application.yml` của từng service đã cấu hình mặc định dùng `localhost`. Docker Compose override bằng biến environment.

### 6.5. Truy cập Database trong Docker

```bash
# Kết nối PostgreSQL CLI
docker-compose exec postgres psql -U postgres

# Các lệnh SQL hữu ích:
\l                          # Liệt kê databases
\c userdb                   # Chuyển sang userdb
\dt                         # Liệt kê tables
SELECT * FROM users;        # Query data
\q                          # Thoát
```

Hoặc dùng **pgAdmin / DBeaver** kết nối:
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres123`

### 6.6. Truy cập RabbitMQ Dashboard

- URL: http://localhost:15672
- Username: `guest`
- Password: `guest`

Tại đây bạn có thể:
- Xem **Queues** — message đang chờ xử lý
- Xem **Exchanges** — nơi publish event
- Xem **Connections** — services nào đang kết nối

---

## 7. ⚙️ CI/CD Pipeline

### Pipeline hiện tại (`.github/workflows/ci.yml`)

Pipeline tự động chạy khi:
- **Push** vào branch `main` hoặc `develop`
- **Tạo Pull Request** vào `main`

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  build-backend   │    │  build-frontend  │    │   docker-build   │
│                  │    │                  │    │                  │
│ Build & test     │    │ npm install      │    │ docker compose   │
│ 8 services       │───▶│ npm run build    │───▶│ build            │
│ (matrix)         │    │                  │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
     (song song)            (song song)           (sau khi cả 2 pass)
```

### Khi CI fail

1. Vào **GitHub → Actions** → xem job nào fail
2. Click vào job → đọc log lỗi
3. Fix lỗi ở local → push lại → CI tự chạy lại

---

## 8. 📋 Bảng Port & URL truy cập

| Service | Port | URL | Ghi chú |
|---|---|---|---|
| **Frontend** | 3000 | http://localhost:3000 | Giao diện người dùng |
| **API Gateway** | 8080 | http://localhost:8080 | Entry point cho tất cả API |
| **Service Registry** | 8761 | http://localhost:8761 | Eureka Dashboard |
| **RabbitMQ** | 15672 | http://localhost:15672 | Management UI (guest/guest) |
| **PostgreSQL** | 5432 | - | Kết nối qua CLI hoặc IDE |
| User Service | 8081 | http://localhost:8081 | Gọi trực tiếp (bypass gateway) |
| Trip Service | 8082 | http://localhost:8082 | Gọi trực tiếp (bypass gateway) |
| Join Request | 8083 | http://localhost:8083 | Gọi trực tiếp (bypass gateway) |
| Notification | 8084 | http://localhost:8084 | Gọi trực tiếp (bypass gateway) |
| Chat Service | 8085 | http://localhost:8085 | WebSocket endpoint |
| Review Service | 8086 | http://localhost:8086 | Gọi trực tiếp (bypass gateway) |

> 💡 Trong production, chỉ expose **API Gateway (8080)** và **Frontend (3000)**. Các service khác chỉ truy cập nội bộ.

---

## 9. 🔥 Xử lý lỗi thường gặp

### Docker

| Lỗi | Nguyên nhân | Cách fix |
|---|---|---|
| `port is already allocated` | Port đã bị chiếm | Windows: `netstat -ano \| findstr :PORT` → `taskkill /PID <pid> /F` |
| `docker-compose: command not found` | Chưa cài Docker Desktop | Cài Docker Desktop, restart máy |
| Container restart liên tục | Service lỗi (xem logs) | `docker-compose logs ten-service` để xem chi tiết |
| `no space left on device` | Ổ cứng đầy | `docker system prune -a` để dọn dẹp |
| Build quá chậm | Cache Docker cũ | `docker-compose build --no-cache ten-service` |

### Git

| Lỗi | Cách fix |
|---|---|
| `fatal: not a git repository` | Bạn đang ở sai thư mục, `cd` vào thư mục project |
| `CONFLICT (content): Merge conflict` | Mở file conflict trong IDE, giải quyết, rồi `git add . && git commit` |
| Push bị reject | `git pull origin main --rebase` rồi push lại |
| Lỡ commit lên main | `git reset HEAD~1` → tạo branch mới → commit lại |

### Backend (Java/Spring Boot)

| Lỗi | Cách fix |
|---|---|
| `Connection refused: postgres:5432` | PostgreSQL chưa ready, đợi 30s hoặc restart |
| `Table not found` | Spring Boot auto-create tables, kiểm tra `spring.jpa.hibernate.ddl-auto=update` |
| `JWT signature does not match` | Kiểm tra `JWT_SECRET` trong `.env` giống nhau ở mọi service |
| `Service not registered in Eureka` | Service Registry phải chạy trước |

### Frontend (React/Vite)

| Lỗi | Cách fix |
|---|---|
| `npm install` fail | Xoá `node_modules` + `package-lock.json`, chạy lại `npm install` |
| API call trả về 404 | Kiểm tra API Gateway + service tương ứng đang chạy |
| CORS error | Đảm bảo gọi qua `/api/...` (proxy) chứ không gọi thẳng `localhost:8081` |

---

## 📌 Tóm tắt nhanh cho thành viên mới

```bash
# 1. Clone
git clone https://github.com/Anhduc4/Travel-Buddy-Finder.git
cd Travel-Buddy-Finder

# 2. Cấu hình
cp .env.example .env

# 3. Chạy tất cả
docker-compose up -d --build

# 4. Mở trình duyệt
# http://localhost:3000

# 5. Bắt đầu code
git checkout -b feature/ten-tinh-nang
# ... code ...
git add .
git commit -m "feat: mô tả"
git push origin feature/ten-tinh-nang
# → Tạo Pull Request trên GitHub
```

---

> 📝 **Cập nhật lần cuối:** 2026-05-07 | **Người viết:** TV5 – DevOps Lead
