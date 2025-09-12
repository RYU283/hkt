# 🍽️ 스마트 키오스크 프로젝트 (Smart Kiosk Project)

> **"누구나 쉽고 편하게 주문하는 경험"**

어르신들을 위한 접근성과 미니멀리즘 디자인에 초점을 맞춘 레스토랑 키오스크 UI 프로젝트입니다. SvelteKit과 Supabase를 기반으로 구축하여, 빠르고 인터랙티브한 사용자 경험과 실시간 데이터 처리를 구현했습니다.

![Kiosk UI Screenshot](https://user-images.githubusercontent.com/your-username/your-repo/your-screenshot.png)
*(위 이미지 URL을 실제 프로젝트 스크린샷 URL로 교체해주세요.)*

<br>

## ✨ 주요 기능 (Features)

*   **직관적인 UI/UX**: 큰 글씨와 명확한 아이콘, 넉넉한 터치 영역으로 모든 연령대가 쉽게 사용할 수 있도록 설계되었습니다.
*   **지능형 음성 주문 (GPT-4o)**: **OpenAI의 GPT-4o API**를 연동하여 단순 음성 인식을 넘어, "비빔밥 하나랑 김치찌개 두 개 담아줘" 와 같은 복잡한 자연어 명령을 정확하게 이해하고 주문에 반영합니다.
*   **실시간 주문 시스템**: 메뉴 선택 시 주문 내역이 즉시 반영되며, 스크롤을 통해 많은 양의 주문도 한눈에 확인할 수 있습니다.
*   **포인트 적립 시스템**: 전화번호 기반의 포인트 적립 기능을 통해 고객 데이터를 관리하고, 결제 금액의 1%를 자동으로 적립합니다.
*   **데이터 기반 관리자 페이지**: Supabase와 연동된 관리자 페이지에서 총 매출, 메뉴별 판매 통계, 고객별 포인트 현황을 실시간으로 모니터링할 수 있습니다.
*   **고정형 키오스크 레이아웃**: 페이지가 스크롤되지 않는 고정형 레이아웃을 채택하여 실제 키오스크와 동일한 사용자 경험을 제공합니다.

<br>

## 🛠️ 기술 스택 (Tech Stack)

| 역할          | 기술                                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **프론트엔드**  | ![Svelte](https://img.shields.io/badge/Svelte-FF3E00?logo=svelte&logoColor=fff) ![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=fff) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff) |
| **백엔드 & DB** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=fff)                                             |
| **AI (음성)** | ![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white) **GPT-4o**                                       |
| **배포**        | ![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=fff)                                                      |
| **버전 관리**   | ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff) ![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=fff) |

<br>

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하는 방법입니다.

### 1. 프로젝트 클론
```bash
git clone https://github.com/YourUsername/YourRepositoryName.git
cd YourRepositoryName
2. 의존성 설치
code
Bash
npm install```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고, Supabase와 OpenAI의 API 키 정보를 입력합니다.
Supabase
VITE_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

OpenAI
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

code
Code
### 4. 개발 서버 실행
```bash
npm run dev
이제 브라우저에서 http://localhost:5173으로 접속하여 키오스크를 확인할 수 있습니다.

이 프로젝트는 더 나은 주문 경험을 만들기 위한 고민에서 시작되었습니다.