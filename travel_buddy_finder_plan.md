# 🧳 Travel Buddy Finder – Kế hoạch Phân công Đồ án SOA

> **Môn học:** Phát triển Phần mềm Hướng Dịch vụ (SOA)  
> **Nhóm:** 5 thành viên | **Kiến trúc:** Microservices  
> **Project:** Travel Buddy Finder – Tìm bạn du lịch

---

## 1. 👥 Bảng Phân Công Chi Tiết Theo Sprint

| Thành viên | Vai trò chính | Sprint 1 (Tuần 1–3) | Sprint 2 (Tuần 4–6) | Sprint 3 (Tuần 7–9) | Deliverable cuối |
|---|---|---|---|---|---|
| **TV1** – Backend Lead | User Service + API Gateway | ⚡ **Tuần 1:** Viết `docs/api-contract.yaml` (OpenAPI) cho **toàn bộ** services trước khi nhóm code. Setup repo. User Service (register/login/JWT) | API Gateway routing rules, rate limiting, auth filter. Matching API (tag-based) | **Review & Rating Service** (`POST /reviews`, `GET /reviews/user/{id}`), fix security, Swagger UI | User Service, API Gateway, Review Service, API contract |
| **TV2** – Backend Dev | Trip Service + Join Request Service | Trip Service CRUD (tạo/tìm/lọc trip), DB schema PostgreSQL | Join Request flow (gửi/duyệt/từ chối), publish event `join.approved`/`join.rejected` vào RabbitMQ | Unit test Trip & Join Request, **fix bugs Sprint 2** _(không thêm service mới)_ | Trip Service + Join Request Service + RabbitMQ producer |
| **TV3** – Backend Dev | Notification Service + Chat Service | Setup RabbitMQ container, Notification Service consume queue, gửi email/in-app notify | Chat Service với WebSocket (STOMP/Socket.IO), room isolation theo `tripId`, lưu lịch sử | Load test Chat, fix WebSocket disconnect, tích hợp Notification badge/toast vào UI | Async messaging flow hoàn chỉnh, realtime chat ổn định |
| **TV4** – Frontend Dev | ReactJS UI toàn bộ | Setup React app, routing, Axios client. Auth pages. **Dùng `json-server`/`msw` mock API** từ `api-contract.yaml` → không chờ backend | Feed công khai, Trip detail, Join Request UI, Chat widget, Matching section | Review & Rating UI, Profile page, responsive, UX polishing | Frontend hoàn chỉnh, kết nối tất cả services qua Gateway |
| **TV5** – DevOps + Testing + Docs | Infrastructure & QA | Docker + Docker Compose cho tất cả services, Service Registry (Eureka/Consul), `.github/workflows/ci.yml` skeleton | Integration test, Postman collection, GitHub Actions CI hoàn chỉnh | Deploy lên VPS/Cloud/Railway, báo cáo kiến trúc, diagram chính thức, slide demo | Dockerfile, docker-compose.yml, test suite, CI/CD, báo cáo |

---

## 2. 📋 Deliverable Chi Tiết Từng Sprint

### Sprint 1 – Nền tảng & Core Services

| Thành viên | Công việc cụ thể | Output |
|---|---|---|
| TV1 | **Tuần 1 (ưu tiên tuyệt đối):** Viết `docs/api-contract.yaml` – định nghĩa toàn bộ endpoints, request/response schema cho tất cả 6 services → commit lên repo để cả nhóm dùng. Sau đó: khởi tạo repo, User Service (`POST /auth/register`, `POST /auth/login`, JWT, `GET /users/{id}`) | `api-contract.yaml` commit lên repo trước cuối tuần 1. `user-service` Postman test pass |
| TV2 | Trip Service: `POST /trips`, `GET /trips`, `GET /trips/{id}`, `PUT /trips/{id}`, `DELETE /trips/{id}`, filter theo location/date/tag. DB schema PostgreSQL | `trip-service` CRUD hoàn chỉnh |
| TV3 | Setup RabbitMQ container, Notification Service consume queue `join-request-events`, gửi email cơ bản (SMTP) hoặc log in-app | Async flow: message vào queue → Notification Service nhận được |
| TV4 | Khởi tạo React app (Vite), setup React Router, Axios client. **Ngay từ đầu dùng `json-server` hoặc `msw` (Mock Service Worker) để mock API theo `api-contract.yaml`** → code UI song song, không chờ backend. Trang Login/Register | UI chạy với mock data, không bị block bởi backend |
| TV5 | Viết `Dockerfile` cho từng service, `docker-compose.yml` toàn hệ thống, setup Eureka/Consul, tạo `.github/workflows/ci.yml` skeleton | `docker-compose up` khởi động toàn bộ, CI pipeline có sẵn |

### Sprint 2 – Extended Features & Integration

| Thành viên | Công việc cụ thể | Output |
|---|---|---|
| TV1 | API Gateway routing rules (Kong/Spring Cloud Gateway), rate limiting, auth filter. Matching API: gợi ý trip theo tags của user | Gateway hoạt động, `/api/*` redirect đúng service |
| TV2 | Join Request Service: `POST /join-requests`, `PUT /join-requests/{id}/approve`, `PUT /join-requests/{id}/reject`. Publish event `join.approved`/`join.rejected` vào RabbitMQ | Join flow end-to-end hoạt động |
| TV3 | Chat Service: WebSocket endpoint `/ws/chat`, room isolation theo `tripId`, lưu lịch sử tin nhắn vào DB | Realtime chat trong cùng 1 trip |
| TV4 | Feed trang chủ (list trips công khai), Trip detail page, nút "Join Trip" UI, Chat widget, Matching/Suggestion section | 80% UI core hoàn thiện |
| TV5 | Viết Postman collection cho tất cả API, Integration test (end-to-end flow), setup GitHub Actions CI | Test suite chạy pass, CI pipeline xanh |

### Sprint 3 – Polish, Testing & Deploy

| Thành viên | Công việc cụ thể | Output |
|---|---|---|
| TV1 | **Review & Rating Service** (chuyển từ TV2): `POST /reviews`, `GET /reviews/user/{id}`, rating aggregation đơn giản. Fix security API. Expose Swagger UI | Review Service hoàn chỉnh, Swagger UI accessible |
| TV2 | **Chỉ:** fix bugs từ Sprint 2 (Trip Service + Join Request Service), unit test, code review cho TV1's Review Service. Không nhận thêm service mới | Trip + Join Request stable, test coverage đủ |
| TV3 | Load test Chat Service, fix WebSocket disconnect issues, tích hợp Notification badge/toast vào UI (phối hợp TV4) | Stable realtime, notification hiển thị trên UI |
| TV4 | Review & Rating UI, Profile page hiển thị rating, responsive design, UX polishing, kết nối mock → real API | Frontend production-ready |
| TV5 | Deploy lên Docker host / Railway / Render / VPS, viết báo cáo kiến trúc, vẽ diagram chính thức, chuẩn bị slide demo | Hệ thống chạy live, báo cáo nộp đúng hạn |

---

## 3. 🔄 Sơ Đồ Luồng Giao Tiếp Giữa Các Services

### Kiến trúc tổng thể

```
                        ┌─────────────────────┐
                        │      FRONTEND        │
                        │   (React.js / Vue)   │
                        └─────────┬───────────┘
                                  │ HTTP / WebSocket
                        ┌─────────▼───────────┐
                        │     API GATEWAY     │
                        │  (Kong / Spring GW) │
                        │  + Auth Filter      │
                        │  + Rate Limiting    │
                        └──┬──┬──┬──┬──┬──────┘
                           │  │  │  │  │
              ┌────────────┘  │  │  │  └─────────────┐
              │               │  │  │                │
    ┌─────────▼──┐  ┌─────────▼┐ │ ┌▼──────────┐  ┌──▼──────────┐
    │   USER     │  │   TRIP   │ │ │   CHAT    │  │   REVIEW    │
    │  SERVICE   │  │  SERVICE │ │ │  SERVICE  │  │   SERVICE   │
    │  :8081     │  │  :8082   │ │ │  :8085    │  │   :8086     │
    │            │  │          │ │ │ WebSocket │  │             │
    └─────┬──────┘  └─────┬────┘ │ └───────────┘  └─────────────┘
          │               │      │
          │      ┌────────▼──────▼──┐
          │      │  JOIN REQUEST    │
          │      │    SERVICE       │
          │      │    :8083         │
          │      └────────┬─────────┘
          │               │ Publish Event
          │               │ (join.approved / join.rejected)
          │      ┌────────▼─────────┐
          │      │   MESSAGE QUEUE  │
          │      │   (RabbitMQ /    │
          │      │    Kafka)        │
          │      └────────┬─────────┘
          │               │ Subscribe
          │      ┌────────▼─────────┐
          │      │  NOTIFICATION    │
          │      │    SERVICE       │
          │      │    :8084         │
          │      │ (Email / In-app) │
          │      └──────────────────┘
          │
    ┌─────▼──────────────────┐
    │   SERVICE REGISTRY     │
    │   (Eureka / Consul)    │
    │   Tất cả services      │
    │   tự đăng ký tại đây   │
    └────────────────────────┘
```

### Luồng chính: Join Trip Flow (async)

```
User ──[POST /join-requests]──▶ API Gateway
                                    │
                          ┌─────────▼──────────┐
                          │  Join Request Svc   │
                          │  Lưu DB, status=    │
                          │  PENDING            │
                          └─────────────────────┘
                                    │
              Trip Owner ──[PUT /approve]──▶ Join Request Svc
                                    │
                          Status = APPROVED
                                    │
                          Publish Event ──▶ RabbitMQ
                                              │
                                   ┌──────────▼──────────┐
                                   │  Notification Svc   │
                                   │  consume event      │
                                   │  → Send Email/Notif │
                                   └─────────────────────┘
```

### Luồng Chat Realtime

```
User A ──[WebSocket Connect]──▶ Chat Service (/ws/chat?tripId=123)
User B ──[WebSocket Connect]──▶ Chat Service (/ws/chat?tripId=123)

User A sends message ──▶ Chat Service ──▶ Broadcast ──▶ User B
                                    │
                             Lưu vào DB (message history)
```

---

## 4. 🎯 Thứ Tự Ưu Tiên Tính Năng

### MỨC ĐỘ 1 – Bắt buộc (Must Have)
> ❌ Không có = không đủ điều kiện bảo vệ

- [x] User registration, login, JWT auth
- [x] Tạo Trip (địa điểm, ngày, số người, mô tả, tag)
- [x] Tìm / lọc Trip (theo location, ngày, tag)
- [x] Join Request flow (gửi → duyệt/từ chối)
- [x] Notification khi request được duyệt/từ chối (email hoặc in-app)
- [x] API Gateway điều phối request
- [x] Docker Compose chạy toàn bộ hệ thống

### MỨC ĐỘ 2 – Nên có (Should Have)
> ⚠️ Có thì điểm cao hơn đáng kể

- [ ] Chat realtime giữa members trong trip (WebSocket)
- [ ] Feed công khai kiểu mạng xã hội
- [ ] Service Registry (Eureka/Consul)
- [ ] Swagger / OpenAPI documentation
- [ ] Review & Rating sau chuyến đi

### MỨC ĐỘ 3 – Tốt nếu có (Nice to Have)
> ✨ Bonus, nếu còn thời gian

- [ ] Matching / Gợi ý trip dựa theo tags
- [ ] Notification badge realtime trên UI
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deploy live trên cloud (Railway, Render, VPS)
- [ ] Dark mode UI

> [!IMPORTANT]
> **Chiến lược cắt nếu hết thời gian:** Cắt Review Service trước (thay bằng mock), rồi đến Chat Service (thay bằng comment section đơn giản), cuối cùng mới cắt Matching (đã có filter là đủ).

---

## 5. ⚠️ Rủi Ro Thường Gặp & Cách Xử Lý

| Rủi ro | Mức độ | Cách phòng tránh / xử lý |
|---|---|---|
| **API Contract không đồng nhất** giữa Frontend & Backend | 🔴 Cao | **TV1 viết `api-contract.yaml` (OpenAPI) cuối tuần 1**, commit lên repo. TV4 dùng `json-server`/`msw` mock theo file này → code UI không chờ backend |
| **Docker hoạt động khác nhau** trên máy các thành viên | 🔴 Cao | TV5 viết `.env.example` chuẩn, dùng Docker Compose cho mọi thứ, tránh cài thủ công |
| **RabbitMQ/Kafka phức tạp** hơn dự kiến | 🟡 Trung bình | Dùng RabbitMQ (đơn giản hơn Kafka). TV3 làm proof-of-concept ngay đầu Sprint 1 |
| **Merge conflict** do nhiều người cùng sửa 1 file | 🟡 Trung bình | Dùng feature branch strategy, mỗi người làm branch riêng, PR review trước khi merge vào `main`. Dùng `.github/PULL_REQUEST_TEMPLATE.md` |
| **WebSocket không qua được API Gateway** | 🔴 Cao | Kong và Spring Cloud Gateway đều hỗ trợ WebSocket upgrade **nhưng cần cấu hình thêm**. **Phương án dự phòng:** Frontend kết nối WebSocket trực tiếp vào Chat Service (bypass Gateway) — vẫn chấp nhận được trong scope đồ án |
| **Circular dependency giữa các services** | 🟡 Trung bình | Vẽ dependency graph trước khi code, đảm bảo dependency **1 chiều**: `User ← Trip ← JoinRequest ← Notification`. Không service nào gọi ngược lại service phụ thuộc mình |
| **JWT token không nhất quán** giữa các service | 🟡 Trung bình | Dùng chung 1 secret key (env var), mọi service validate token cùng 1 cách. Đặt trong `.env.example` |
| **Database migration conflicts** | 🟢 Thấp | Dùng Flyway hoặc Liquibase, mỗi service quản lý migration riêng |
| **Thành viên không đều kỹ năng** | 🔴 Cao | Pair programming trong Sprint 1, code review lẫn nhau, weekly sync meeting 30 phút |

### Tips thực tế cho nhóm nhỏ

> [!TIP]
> - **Họp nhanh mỗi ngày (standup):** Ai đang làm gì, blockers là gì? (15 phút)
> - **Shared Postman workspace:** Tất cả dùng chung để test API
> - **Không over-engineer:** Consul thay Eureka nếu phức tạp, in-app notification thay email nếu không có SMTP
> - **Feature flag:** Implement tính năng xong nhưng ẩn UI nếu chưa ổn định

---

## 6. 🎤 Gợi Ý Điểm Demo & Nhấn Mạnh Khi Bảo Vệ

### Luồng demo "killer" nên chuẩn bị (chạy live, không dùng slide)

```
1. [TV4 demo UI]   User A đăng ký → đăng nhập → tạo Trip (tag: biển, camping)
2. [TV4 demo UI]   User B đăng nhập → tìm trip theo tag → gửi Join Request
3. [TV4 demo UI]   User A duyệt Join Request
4. [TV5 demo log]  Mở RabbitMQ Management UI → thấy message được publish
5. [TV3 demo]      Notification Service log → email/in-app được gửi
6. [TV3 demo]      User A & B vào Chat của trip → nhắn tin realtime (2 browser tab)
7. [TV5 demo]      Mở docker ps → thấy tất cả services đang chạy
```

### Những điểm kỹ thuật cần chủ động nhấn mạnh

| Điểm nhấn | Vì sao ấn tượng với giám khảo SOA |
|---|---|
| **Database per Service** | Mỗi service có DB riêng, không share schema – đúng chuẩn SOA |
| **Async messaging qua RabbitMQ** | Loose coupling giữa Join Request & Notification – pattern quan trọng nhất của SOA |
| **API Gateway là single entry point** | Giải thích tại sao không gọi trực tiếp vào service, routing, auth filter |
| **Service Discovery** | Các service tìm nhau qua registry, không hardcode IP |
| **WebSocket + REST coexist** | Hai giao thức khác nhau, giải thích khi nào dùng sync/async/realtime |
| **Fault isolation** | Nếu Chat Service chết, các service khác vẫn chạy – demonstrate điều này |
| **Docker Compose** | Reproduce môi trường bằng 1 lệnh `docker-compose up` |

### Câu hỏi phản biện thường gặp & gợi ý trả lời

> [!NOTE]
> **"Tại sao không dùng monolith thay microservices?"**  
> → Vì từng service có thể scale độc lập (Chat Service cần scale hơn User Service), team có thể phát triển song song, deploy độc lập.

> [!NOTE]
> **"Làm sao đảm bảo consistency khi mỗi service có DB riêng?"**  
> → Dùng Saga pattern hoặc eventual consistency. Ví dụ: khi Join Request approved, Notification Service nhận event và cập nhật trạng thái riêng của mình.

> [!NOTE]
> **"API Gateway có trở thành single point of failure không?"**  
> → Có thể, nhưng Gateway thường được scale horizontal. Kong hỗ trợ clustering. Trong scope đồ án, chúng em tập trung vào đúng pattern trước.

> [!NOTE]
> **"RabbitMQ vs Kafka – tại sao chọn RabbitMQ?"**  
> → RabbitMQ phù hợp với message routing linh hoạt, dễ setup hơn cho quy mô nhóm nhỏ. Kafka phù hợp hơn khi cần event streaming ở quy mô lớn.

---

## 7. 📁 Cấu Trúc Repository Gợi Ý

```
travel-buddy-finder/              ← Monorepo (hoặc tách thành nhiều repo)
├── .github/                      ← TV5 setup
│   ├── PULL_REQUEST_TEMPLATE.md  ← Template PR chuẩn cho nhóm
│   └── workflows/
│       └── ci.yml                ← GitHub Actions CI (build + test)
├── user-service/
│   ├── src/
│   ├── Dockerfile
│   └── README.md
├── trip-service/
│   ├── src/
│   ├── Dockerfile
│   └── README.md
├── join-request-service/
│   ├── src/
│   ├── Dockerfile
│   └── README.md
├── notification-service/
│   ├── src/
│   ├── Dockerfile
│   └── README.md
├── chat-service/
│   ├── src/
│   ├── Dockerfile
│   └── README.md
├── review-service/
│   ├── src/
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   ├── mocks/                    ← json-server / msw mock data (TV4 Sprint 1)
│   ├── Dockerfile
│   └── README.md
├── api-gateway/
│   ├── kong.yml  (hoặc application.yml cho Spring Cloud)
│   └── README.md
├── docker-compose.yml            ← Entry point
├── .env.example                  ← Tất cả env vars, không commit .env thật
└── docs/
    ├── architecture-diagram.png
    ├── api-contract.yaml          ← ⚡ TV1 viết TUẦN 1, trước khi nhóm code
    ├── dependency-graph.png       ← Vẽ service dependency 1 chiều
    └── report.pdf
```

---
