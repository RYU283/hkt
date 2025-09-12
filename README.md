네, 그럼요. 프로젝트의 가치를 제대로 보여줄 수 있도록, 요청하신 모든 항목을 포함하여 전문적이면서도 사람의 손길이 느껴지는 README.md 파일을 작성해 드리겠습니다.

아래 내용을 README.md 파일에 그대로 붙여넣으시면 됩니다.

code
Markdown

download

content_copy

expand_less
# **처음처럼 Kiosk**

> **"가장 편안한 주문은, 말이 통하는 주문입니다."**

##  개발 동기 (Motivation)

어느 날, 식당에서 키오스크 앞에 한참을 서 계시는 어르신을 보았습니다. 복잡한 화면 구성과 작은 글씨 앞에서 주문을 포기하고 결국 직원을 부르는 모습이 안타까웠습니다. 기술의 발전이 오히려 누군가에게는 더 높은 벽이 되고 있다는 생각에 이르렀습니다.

"기술이 사람을 소외시키는 것이 아니라, 모두를 연결하는 다리가 될 수는 없을까?"

이 프로젝트는 바로 그 질문에서 시작되었습니다. 단순한 기능 구현을 넘어, **'누구나'** 라는 가치에 집중했습니다. 어르신들도 편안하게 사용할 수 있는 직관적인 UI와, 가장 자연스러운 소통 방식인 '말'로 주문할 수 있는 똑똑한 키오스크를 만들고자 했습니다.

<br>

##  서비스 설명 (Project Overview)

**처음처럼 Kiosk**은 SvelteKit 기반으로 제작된 레스토랑용 스마트 키오스크 솔루션입니다. 사용자의 편의성을 최우선으로 고려한 미니멀리즘 디자인을 바탕으로, OpenAI의 **GPT-4o** API를 접목하여 차세대 음성 주문 경험을 제공합니다.

프로젝트의 핵심은 Supabase를 활용한 실시간 데이터 처리에 있습니다. 모든 주문과 고객 정보는 데이터베이스에 안정적으로 기록되며, 관리자는 별도의 어드민 페이지를 통해 매장의 운영 현황을 직관적으로 파악하고 데이터 기반의 의사결정을 내릴 수 있습니다.

<br>

##  기능 명세서 (Key Features)

####  사용자 키오스크 (User Kiosk)
-   **직관적인 메뉴 탐색**: 가로형 와이드스크린에 최적화된 화면 구성과 카테고리별 메뉴를 제공합니다.
-   **실시간 장바구니**: 메뉴 추가/변경 시 주문 내역과 총금액이 즉시 업데이트되며, 목록이 길어져도 스크롤을 통해 확인할 수 있습니다.
-   **지능형 음성 주문 (GPT-4o)**:
    -   단순 음성 텍스트 변환(STT)을 넘어, "김치찌개 하나랑 불고기 덮밥 두 개 담아줘"와 같은 자연어의 맥락을 이해하고 장바구니에 정확히 반영합니다.
    -   "전부 취소해줘", "결제할래" 등의 명령어도 인식하여 해당 기능을 실행합니다.
-   **포인트 적립**: 터치에 최적화된 키패드를 통해 휴대폰 번호를 입력하고, 결제 금액의 1%를 적립할 수 있습니다.
-   **단계별 결제 프로세스**: 주문 확인, 포인트 적립, 결제 수단 선택, 결제 진행, 결과 안내 등 명확한 단계로 결제 과정을 안내합니다.

####  관리자 대시보드 (Admin Dashboard)
-   **실시간 매출 현황**: Supabase DB와 연동하여 현재까지의 총매출을 실시간으로 보여줍니다.
-   **메뉴별 판매 통계**: 어떤 메뉴가 가장 많이 팔렸는지 순위별로 집계하여 메뉴 개발 및 재고 관리에 활용할 수 있습니다.
-   **고객별 포인트 관리**: 전화번호로 가입된 고객들의 누적 포인트를 확인하고 관리할 수 있습니다.

<br>

##  개발 환경 및 방법 (Tech Stack & Methods)

| 구분          | 사용 기술                                                                                                                              | 설명                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **프론트엔드**  | ![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=fff)                                                  | 컴파일러 기반의 빠른 성능과 직관적인 문법을 통해 사용자 인터페이스를 구축했습니다.                  |
| **백엔드 & DB** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=fff)                                                  | PostgreSQL 기반의 DB, 실시간 데이터 동기화, DB 함수를 통해 주문 및 포인트 시스템을 구현했습니다.    |
| **AI (음성)** | ![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white) **GPT-4o**                                            | Web Speech API로 수집된 음성 텍스트를 GPT-4o에 전달하여 사용자의 주문 의도를 정확하게 파악했습니다. |
| **배포**        | ![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=fff)                                                           | GitHub 연동을 통해 손쉬운 유지보스 시스템을 구축하고, 빠르고 안정적인 배포 환경을 확보했습니다.          |
| **버전 관리**   | ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff) ![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=fff) | Git을 통해 체계적으로 버전을 관리하고, GitHub를 중앙 원격 저장소로 사용했습니다.                    |

<br>

##  시작하기 (Getting Started)

### 1. 프로젝트 클론
```bash
git clone https://github.com/YourUsername/YourRepositoryName.git
cd YourRepositoryName
```

### 2. 의존성 설치

```Bash
npm install
```


### 3. 환경 변수 설정
 프로젝트 루트에 `.env` 파일을 생성하고, Supabase와 OpenAI의 API 키 정보를 입력합니다.
```bash
Supabase
VITE_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

OpenAI
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

### 4. 개발 서버 실행
```bash
npm run dev
이제 브라우저에서 http://localhost:5173으로 접속하여 키오스크를, http://localhost:5173/admin으로 관리자 페이지를 확인할 수 있습니다.
```
