# 🚀 Full-Stack Membership & Map System (with Antigravity)

이 프로젝트는 강력한 AI 코딩 어시스턴트 **Antigravity**와 함께 협업하여 개발한 고성능 풀스택 시스템입니다. 보안성, 확장성, 그리고 네이버 지도를 활용한 위치 기반 서비스까지 포함된 통합 플랫폼입니다.

## 🌟 프로젝트 개요
현대적인 웹 어플리케이션에 필수적인 **JWT 기반 인증 시스템**과 **네이버 지도 API**를 활용한 위치 정보 서비스를 구축했습니다. Spring Boot 기반의 견고한 백엔드와 React 19 기반의 세련된 프론트엔드, 그리고 효율적인 데이터 관리를 위한 어드민 페이지까지 포함된 통합 솔루션입니다.

## 🛠️ 기술 스택
### Backend
- **Framework**: Spring Boot 3.x (Java 17)
- **Security**: Spring Security (JWT 기반 무상태 인증)
- **Database**: MySQL 8.0, Spring Data JPA
- **Messaging**: Java Mail Sender (Gmail SMTP 연동)
- **Domain**: Auth, User, **Map (신규 추가)**

### Frontend (User)
- **Library**: React 19 (최신 버전 적용)
- **Build Tool**: Vite 8
- **UI Framework**: **Ant Design 6** (Premium Aesthetics)
- **Map SDK**: Naver Maps V3 SDK
- **State Management**: React Context API

### Admin
- **Framework**: React Admin 5 (데이터 중심의 효율적인 관리 도구)

---

## ✨ 주요 기능
### 1. 사용자 인증 및 보안
- **JWT 인증**: Access/Refresh 토큰을 활용한 보안 인증 및 `PrivateRoute`를 통한 경로 보호.
- **BCrypt 암호화**: 모든 비밀번호는 단방향 해시 암호화되어 안전하게 저장됩니다.
- **이메일 인증**: 6자리 보안 코드를 활용한 실시간 이메일 소유권 확인 기능.

### 2. 네이버 지도 서비스 (New)
- **Full-Screen Map**: 헤더와 푸터를 유지하면서 브라우저 본문 영역 전체를 지도로 채우는 최적화된 레이아웃 적용.
- **동적 지도 연동**: NCP(Naver Cloud Platform) 클라이언트 ID를 통한 실시간 지도 로딩 및 마커 표시.
- **환경 변수 관리**: `.env` 파일을 통해 Client ID를 안전하게 관리하며 Vite를 통해 주입.

### 3. 통합 관리자 대시보드
- **사용자 관리**: 회원 목록 조회, 상세 정보 수정 및 권한 관리 기능.
- **리소스 연동**: `dataProvider`를 통한 백엔드 API와의 유기적인 데이터 통신.

---

## 🚀 시작하기
1. 루트 디렉토리에 `.env` 파일을 생성하고 아래 정보를 입력합니다:
   ```env
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   VITE_NAVER_MAP_CLIENT_ID=your_naver_client_id
   ```
2. 루트 디렉토리에서 아래 명령어를 실행합니다:
   ```bash
   docker-compose up -d
   ```
3. 어플리케이션 접속:
   - Frontend: `http://localhost:5173`
   - Admin: `http://localhost:5174`
   - Map Page: `http://localhost:5173/map`

---
Developed with ❤️ by **Antigravity**
