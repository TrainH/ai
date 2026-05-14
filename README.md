# 🚀 Full-Stack Membership System (with Antigravity)

이 프로젝트는 강력한 AI 코딩 어시스턴트 **Antigravity**와 함께 협업하여 개발한 고성능 풀스택 멤버십 시스템입니다. 보안성, 확장성, 그리고 사용자 경험(UX)을 최우선으로 고려하여 설계되었습니다.

## 🌟 프로젝트 개요
현대적인 웹 어플리케이션에 필수적인 사용자 인증 및 관리 시스템을 구축했습니다. Spring Boot 기반의 견고한 백엔드와 React 기반의 세련된 프론트엔드, 그리고 효율적인 데이터 관리를 위한 어드민 페이지까지 포함된 통합 솔루션입니다.

## 🛠️ 기술 스택
### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security (JWT 기반 인증)
- **Database**: MySQL 8.0, Spring Data JPA
- **Messaging**: Java Mail Sender (HTML 템플릿 지원)
- **Container**: Docker, Docker Compose

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **UI Framework**: Ant Design (Premium Aesthetics)
- **State Management**: React Context API
- **Networking**: Axios

### Admin
- **Framework**: React Admin (데이터 중심의 효율적인 관리 도구)

---

## ✨ 주요 기능
### 1. 사용자 인증 시스템
- **JWT 인증**: Access Token과 Refresh Token을 활용한 안전한 상태 유지 방식.
- **BCrypt 암호화**: 모든 비밀번호는 단방향 해시 암호화되어 안전하게 저장됩니다.

### 2. 이메일 인증 (Email Verification)
- **6자리 보안 코드**: 회원가입 시 실시간 이메일 소유권 확인.
- **Premium HTML 템플릿**: 사용자에게 전달되는 세련된 디자인의 인증 메일 발송 로직 탑재.

### 3. 통합 관리자 대시보드
- **사용자 관리**: 회원 목록 조회, 상세 정보 수정 및 권한 관리 기능.
- **보안 감사**: 관리자 작업에 대한 감사 로그 아키텍처 준비.

### 4. 개발 생산성 및 보안
- **Docker 기반 환경**: 원클릭으로 백엔드, DB, 프론트엔드를 모두 실행할 수 있는 환경 구축.
- **보안 설정 분리**: 환경 변수(`.env`)를 활용한 중요 시크릿 정보 관리.

---

## 🚀 시작하기
1. `.env` 파일을 생성하고 메일 서버 정보를 입력합니다.
2. 루트 디렉토리에서 아래 명령어를 실행합니다:
   ```bash
   docker-compose up -d
   ```
3. 어플리케이션 접속:
   - Frontend: `http://localhost:5173`
   - Admin: `http://localhost:5174` (포트는 설정에 따라 다를 수 있음)

---

Developed with ❤️ by **Antigravity**
