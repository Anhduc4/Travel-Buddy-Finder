# 🔀 Quy Trình Làm Việc Nhóm – GitHub Monorepo
## Travel Buddy Finder | 5 thành viên

---

## 1. 🗂️ Cấu Trúc Branch

```
main                          ← Production-ready, chỉ merge qua PR có review
└── develop                   ← Branch tích hợp chung, merge từ feature branches
    ├── feature/user-service          (TV1)
    ├── feature/api-gateway           (TV1)
    ├── feature/trip-service          (TV2)
    ├── feature/join-request-service  (TV2)
    ├── feature/notification-service  (TV3)
    ├── feature/chat-service          (TV3)
    ├── feature/frontend-auth         (TV4)
    ├── feature/frontend-feed         (TV4)
    ├── feature/review-service        (TV1 – Sprint 3)
    ├── feature/docker-setup          (TV5)
    ├── feature/ci-pipeline           (TV5)
    └── fix/<tên-bug>                 (ai fix thì tạo)
```

### Quy tắc branch
| Branch | Mục đích | Ai tạo | Merge vào |
|---|---|---|---|
| `main` | Code deploy được | TV1 (lead) | — |
| `develop` | Tích hợp sprint | TV1 setup | `main` cuối sprint |
| `feature/*` | Tính năng mới | Mỗi thành viên tự tạo | `develop` |
| `fix/*` | Sửa bug | Ai phát hiện bug | `develop` |
| `hotfix/*` | Bug khẩn cấp trên main | TV1 | `main` + `develop` |

> **Quy tắc vàng:** KHÔNG bao giờ commit thẳng lên `main` hoặc `develop`.  
> Mọi thay đổi đều phải qua **Pull Request + ít nhất 1 người review**.

---

## 2. ✍️ Quy Ước Đặt Tên Commit (Conventional Commits)

### Cú pháp
```
<type>(<scope>): <mô tả ngắn>

[body tùy chọn]
[footer tùy chọn]
```

### Các type hợp lệ
| Type | Dùng khi | Ví dụ |
|---|---|---|
| `feat` | Thêm tính năng mới | `feat(user-service): add JWT login endpoint` |
| `fix` | Sửa bug | `fix(trip-service): correct date filter query` |
| `docs` | Cập nhật tài liệu | `docs(api-contract): add review service schema` |
| `chore` | Config, build, CI | `chore(docker): add notification-service container` |
| `test` | Thêm/sửa test | `test(join-request): add unit test for approve flow` |
| `refactor` | Refactor không thêm/xóa tính năng | `refactor(chat): extract room manager class` |
| `style` | Format code, không đổi logic | `style(frontend): fix eslint warnings` |

### Scope gợi ý
```
user-service | trip-service | join-request-service |
notification-service | chat-service | review-service |
frontend | api-gateway | docker | ci | docs
```

### Ví dụ commit thực tế
```bash
# ✅ Đúng
git commit -m "feat(trip-service): add filter by tags and location"
git commit -m "fix(chat): handle WebSocket disconnect gracefully"
git commit -m "chore(docker): add rabbitmq healthcheck to compose"
git commit -m "docs(api-contract): update join-request response schema"

# ❌ Sai
git commit -m "update code"
git commit -m "fix bug"
git commit -m "WIP"
```

---

## 3. 🔄 Quy Trình Làm Việc Hàng Ngày

### Bắt đầu ngày làm việc
```bash
# 1. Đảm bảo develop mới nhất
git checkout develop
git pull origin develop

# 2. Checkout sang branch của mình (hoặc tạo mới nếu chưa có)
git checkout feature/trip-service
# Hoặc tạo mới:
git checkout -b feature/trip-service-filter

# 3. Merge develop mới nhất vào branch của mình để tránh conflict
git merge develop
```

### Trong quá trình code
```bash
# Commit thường xuyên (mỗi khi xong 1 unit nhỏ)
git add .
git commit -m "feat(trip-service): add GET /trips with pagination"

# Push lên remote thường xuyên (tránh mất code)
git push origin feature/trip-service
```

### Khi xong tính năng → Tạo Pull Request
```bash
# Đảm bảo branch của mình up-to-date với develop
git checkout develop
git pull origin develop
git checkout feature/trip-service
git merge develop          # Resolve conflict nếu có
git push origin feature/trip-service

# → Lên GitHub tạo Pull Request
```

---

## 4. 📋 Quy Trình Pull Request (PR)

### Checklist trước khi tạo PR
```
[ ] Code chạy được trên máy local
[ ] docker-compose up không bị lỗi (nếu có thay đổi docker)
[ ] Đã viết/cập nhật test cho code mới
[ ] Không có console.log / System.out.println debug thừa
[ ] Đã tự đọc lại diff trước khi tạo PR
[ ] Tên branch đúng quy ước (feature/*, fix/*)
[ ] Tất cả commit message đúng format
```

### Template PR (`.github/PULL_REQUEST_TEMPLATE.md`)
```markdown
## Mô tả thay đổi
<!-- Tóm tắt ngắn gọn PR này làm gì -->

## Loại thay đổi
- [ ] Tính năng mới (feat)
- [ ] Sửa bug (fix)
- [ ] Cập nhật tài liệu (docs)
- [ ] Cấu hình / DevOps (chore)

## Service bị ảnh hưởng
- [ ] user-service
- [ ] trip-service
- [ ] join-request-service
- [ ] notification-service
- [ ] chat-service
- [ ] review-service
- [ ] frontend
- [ ] api-gateway
- [ ] docker / CI

## Test
- [ ] Đã test thủ công (mô tả cách test)
- [ ] Đã viết unit test
- [ ] docker-compose up chạy bình thường

## Screenshots (nếu có UI thay đổi)

## Lưu ý cho reviewer
<!-- Điểm nào cần chú ý đặc biệt? -->

## Linked issues / tasks
<!-- Ref: #issue_number hoặc Task: TV2 Sprint 2 -->
```

### Quy tắc Review PR
| Quy tắc | Chi tiết |
|---|---|
| **Ai review** | Ít nhất **1 thành viên khác** approve trước khi merge |
| **Thời gian** | Reviewer phản hồi trong vòng **4 tiếng** trong giờ làm việc |
| **Ai merge** | Người **tạo PR** tự merge sau khi được approve |
| **Merge strategy** | Dùng **Squash and merge** vào `develop` (giữ history sạch) |
| **Review `main`** | Cần **TV1 (lead) approve** + CI pass |
| **Xóa branch sau merge** | ✅ Bật **Automatically delete head branches** trong `Repo → Settings → General` |

> [!WARNING]
> **Lưu ý khi dùng Squash and merge:** Sau khi PR được squash merge, branch cũ sẽ bị "lệch" khỏi develop.
> - ✅ Xóa branch cũ ngay sau khi merge (GitHub tự xóa nếu bật auto-delete)
> - ✅ Tạo branch **mới** từ `develop` nếu cần tiếp tục
> - ❌ **KHÔNG** tiếp tục commit lên branch cũ sau khi đã được merge

### Labels PR gợi ý
```
🟢 ready-for-review    → PR xong, cần người review
🔵 in-review           → Đang được review
🟡 changes-requested   → Cần sửa theo feedback
🔴 blocked             → Blocked bởi dependency khác
🟣 wip                 → Work in progress, chưa review
```

---

## 5. ⚙️ GitHub Actions CI (`.github/workflows/ci.yml`)

```yaml
name: CI Pipeline

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  # ─────────────────────────────────────────────
  # Job 1: Detect which services/folders changed
  # ─────────────────────────────────────────────
  changes:
    runs-on: ubuntu-latest
    outputs:
      user-service:         ${{ steps.filter.outputs.user-service }}
      trip-service:         ${{ steps.filter.outputs.trip-service }}
      join-request-service: ${{ steps.filter.outputs.join-request-service }}
      notification-service: ${{ steps.filter.outputs.notification-service }}
      chat-service:         ${{ steps.filter.outputs.chat-service }}
      review-service:       ${{ steps.filter.outputs.review-service }}
      frontend:             ${{ steps.filter.outputs.frontend }}
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            user-service:
              - 'user-service/**'
            trip-service:
              - 'trip-service/**'
            join-request-service:
              - 'join-request-service/**'
            notification-service:
              - 'notification-service/**'
            chat-service:
              - 'chat-service/**'
            review-service:
              - 'review-service/**'
            frontend:
              - 'frontend/**'

  # ─────────────────────────────────────────────
  # Job 2-7: Build & Test từng service (Spring Boot)
  # TV5 điều chỉnh runtime/lệnh nếu dùng Node.js
  # ─────────────────────────────────────────────
  test-user-service:
    needs: changes
    if: ${{ needs.changes.outputs.user-service == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn clean test
        working-directory: ./user-service

  test-trip-service:
    needs: changes
    if: ${{ needs.changes.outputs.trip-service == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn clean test
        working-directory: ./trip-service

  test-join-request-service:
    needs: changes
    if: ${{ needs.changes.outputs.join-request-service == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn clean test
        working-directory: ./join-request-service

  test-notification-service:
    needs: changes
    if: ${{ needs.changes.outputs.notification-service == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn clean test
        working-directory: ./notification-service

  test-chat-service:
    needs: changes
    if: ${{ needs.changes.outputs.chat-service == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn clean test
        working-directory: ./chat-service

  test-review-service:
    needs: changes
    if: ${{ needs.changes.outputs.review-service == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: mvn clean test
        working-directory: ./review-service

  test-frontend:
    needs: changes
    if: ${{ needs.changes.outputs.frontend == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: npm ci && npm run build
        working-directory: ./frontend

  # ─────────────────────────────────────────────
  # Job 8: Docker Compose validation (luôn chạy)
  # ─────────────────────────────────────────────
  docker-compose-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate docker-compose syntax
        run: docker-compose config
      - name: Build all images
        run: docker-compose build
```

> [!TIP]
> **TV5 lưu ý:** Nếu services dùng Node.js thay Spring Boot, thay `mvn clean test` bằng `npm ci && npm test` và bỏ bước setup-java.

---

## 6. 📅 Lịch Làm Việc & Meeting Nhóm

### Kênh liên lạc nhóm
| Kênh | Dùng cho |
|---|---|
| **Discord – `#standup`** | Standup hàng ngày, thông báo nhanh |
| **Discord – `#dev-general`** | Thảo luận kỹ thuật, hỏi đáp |
| **Discord – `#blocked`** | Báo bị block, cần hỗ trợ gấp |
| **GitHub Issues / PR comments** | Thảo luận gắn liền với code |
| **Zalo nhóm** | Liên lạc khẩn ngoài giờ |

> **Thay Discord bằng Zalo/Slack nếu cả nhóm thống nhất.** Quan trọng là chọn **1 kênh duy nhất** cho standup và không thay đổi.

### Standup hàng ngày (15 phút)
> 📍 **Kênh:** Discord `#standup` | **Thời gian cố định: 9:00 sáng mỗi ngày**  
> Mỗi người trả lời 3 câu (gõ text, không cần voice):
> 1. Hôm qua tôi đã làm gì?
> 2. Hôm nay tôi sẽ làm gì?
> 3. Có vấn đề/blockers gì không?

### Sprint Planning (đầu mỗi sprint – 60 phút)
> 📍 **Kênh:** Gặp trực tiếp hoặc Discord voice
- Review kết quả sprint trước
- Phân chia task chi tiết cho sprint mới
- Confirm API contract nếu có thay đổi

### Sprint Review (cuối mỗi sprint – 45 phút)
> 📍 **Kênh:** Gặp trực tiếp hoặc Discord voice
- Demo tính năng đã hoàn thành
- Merge `develop` → `main`
- Cập nhật tài liệu

### Merge `develop` → `main`
```bash
# Chỉ làm cuối sprint, do TV1 thực hiện
git checkout main
git merge --no-ff develop -m "chore: merge sprint-X into main"
git tag v0.X.0
git push origin main --tags
```

---

## 7. 🆘 Khi Bị Block

> **Block** = bị chặn tiến độ vì chờ người khác hơn **4 tiếng** hoặc gặp vấn đề không tự giải quyết được.

### Quy trình xử lý
```
1. Tag thành viên liên quan trong PR comment hoặc Issue
   → @TV2 cần approve schema này để TV3 tiếp tục

2. Báo ngay trong Discord #blocked
   → [BLOCKED] TV4 đang chờ trip-service API từ TV2
      Blocked since: 14:00 | Cần gấp

3. Trong khi chờ → tiếp tục code bằng mock/stub
   → TV4 dùng json-server mock endpoint đó trước
   → TV2 xử lý xong thì TV4 thay mock bằng real API

4. Nếu sau 24h vẫn chưa unblock → báo toàn nhóm
   trong standup sáng hôm sau để cả nhóm giải quyết
```

### Label "blocked" trên GitHub
- Gắn label `🔴 blocked` vào PR hoặc Issue bị ảnh hưởng
- Ghi rõ **blocked bởi ai** và **cần gì** trong description
- Khi unblock → gỡ label, comment "Unblocked by PR #xxx"

---

## 8. 🚨 Xử Lý Conflict

### Khi bị conflict khi merge develop
```bash
# 1. Xem file bị conflict
git status

# 2. Mở file, tìm markers:
# <<<<<<< HEAD (code của mình)
# =======
# >>>>>>> develop (code từ develop)

# 3. Sửa thủ công, giữ lại code đúng

# 4. Đánh dấu đã resolve
git add <file-conflict>
git commit -m "fix: resolve merge conflict in trip-service"
```

### Nguyên tắc tránh conflict
| Nguyên tắc | Chi tiết |
|---|---|
| Merge develop vào branch của mình **mỗi ngày** | Tránh drift quá xa |
| Mỗi người phụ trách **1 service riêng** | Ít chồng chéo file |
| Không sửa `docker-compose.yml` và `.env.example` tùy tiện | TV5 là owner 2 file này |
| File `docs/api-contract.yaml` | TV1 là owner, người khác tạo PR nếu muốn sửa |

---

## 8. 🔐 Quản Lý Secrets & Environment Variables

### File `.env.example` (commit lên repo)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=86400000

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Email (Notification Service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here

# Service ports
USER_SERVICE_PORT=8081
TRIP_SERVICE_PORT=8082
JOIN_REQUEST_SERVICE_PORT=8083
NOTIFICATION_SERVICE_PORT=8084
CHAT_SERVICE_PORT=8085
REVIEW_SERVICE_PORT=8086
```

### Quy tắc secrets
```
✅ Commit: .env.example   (template, giá trị giả)
❌ KHÔNG commit: .env     (giá trị thật)
❌ KHÔNG commit: *secret*, *password*, *key* hardcode trong code
```

### Chia sẻ secrets trong nhóm
> Dùng **GitHub Actions Secrets** cho CI/CD  
> Dùng **group chat riêng** để chia sẻ giá trị `.env` thật  
> Lệnh copy template: `cp .env.example .env` rồi điền giá trị thật

---

## 9. 📌 Tóm Tắt Quick Reference

```
┌─────────────────────────────────────────────────────────┐
│               WORKFLOW TÓM TẮT                          │
│                                                         │
│  1. git checkout develop && git pull                    │
│  2. git checkout -b feature/tên-tính-năng              │
│  3. Code + commit thường xuyên                          │
│     → git commit -m "feat(scope): mô tả"               │
│  4. git push origin feature/tên-tính-năng              │
│  5. Tạo PR trên GitHub → assign reviewer               │
│  6. Reviewer approve → Squash and merge vào develop    │
│  7. Cuối sprint: develop → main (TV1 thực hiện)        │
└─────────────────────────────────────────────────────────┘

BRANCH: main ← develop ← feature/*
COMMIT: feat|fix|docs|chore|test|refactor(scope): msg  
PR:     ≥1 approve + CI pass → Squash merge
MERGE:  develop vào branch của mình MỖI NGÀY
SECRET: .env.example ✅ commit | .env ❌ không commit
```

---

