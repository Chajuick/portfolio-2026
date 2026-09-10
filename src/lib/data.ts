export const profile = {
  name: "차주익",
  handle: "chajuick",
  role: "프론트엔드 엔지니어",
  tagline: "매일 여덟 시간 붙잡고 있는 화면을 만듭니다.",
  intro:
    "제조·회계 도메인의 B2B SaaS. 화면 한 장이 누군가의 하루 업무 시간을 좌우하는 자리라, 예쁜 것보다 헷갈리지 않는 것을 먼저 봅니다.",
  meta: [
    { label: "지금", value: "B2B SaaS 프론트엔드 전담" },
    { label: "도메인", value: "제조 · 회계 · 문서관리" },
    { label: "주로 쓰는 것", value: "React · TypeScript · Next.js" },
  ],
  bio: [
    "B2B 제조·회계·문서관리 SaaS의 프론트엔드를 맡고 있습니다. 네 곳의 고객사 시스템과 한 곳의 회계 제품이 제가 짠 화면 위에서 돌아갑니다.",
    "실수를 규칙으로 막지 않으려고 합니다. 규칙은 사람이 기억해야 하지만 검사는 도구가 기억합니다. 멀티테넌트 격리도, 다크 모드 색도, 인쇄 화면도 같은 방식으로 처리했습니다.",
    "퇴근하고는 직접 쓰려고 만듭니다. 아래 개인 프로젝트 대부분은 제가 지금도 쓰고 있는 것들입니다.",
  ],
  github: "https://github.com/Chajuick",
} as const;

/** 섹션 머리글. 화면 문구는 컴포넌트가 아니라 여기서 고친다. */
export const sectionCopy = {
  work: {
    label: "Work",
    title: "현장에서 돌아가는 제품",
    lead: "고객사 이름과 인프라 정보는 뺐습니다. 무엇이 문제였고 왜 그렇게 판단했는지만 남겼습니다.",
  },
  lab: {
    label: "Lab",
    title: "직접 쓰려고 만든 것",
    lead: "필요해서 만들었고, 만들었으니 계속 씁니다. 기능보다 '왜 아무도 이렇게 안 만들었지'에서 출발한 것이 많습니다.",
  },
  craft: {
    label: "Craft",
    title: "기술을 시험한 것",
    lead: "쓸모를 따지지 않고, 구현이 궁금해서 끝까지 가본 기록입니다.",
  },
  about: {
    label: "About",
    title: "소개",
    lead: undefined as string | undefined,
  },
} as const;

export type Metric = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  kind: "work" | "lab" | "craft";
  featured?: boolean;
  role: string;
  summary: string;
  /** 문제 → 판단 → 구현 → 결과 */
  problem?: string;
  decisions?: { title: string; body: string }[];
  outcome?: string;
  metrics?: Metric[];
  stack: string[];
  links?: { label: string; href: string }[];
  /** 공개 저장소가 없는 경우의 사유 */
  private?: string;
};

export const projects: Project[] = [
  // ─────────────────────────────── 실무 ───────────────────────────────
  {
    slug: "donidora",
    title: "도니도라",
    subtitle: "재무·회계관리 SaaS",
    year: "2026 — 운영 중",
    kind: "work",
    featured: true,
    role: "프론트엔드 전담 · 멀티테넌트 구조 설계 참여",
    summary:
      "여러 회사의 회계 데이터를 한 서버에서 다루는 SaaS. 회사마다 DB를 분리하는 DB-per-tenant 구조 위에서, 회계 담당자가 하루 종일 들여다보는 화면을 만들었습니다.",
    problem:
      "회계 데이터는 남의 회사 것이 한 줄이라도 섞이면 끝입니다. 그런데 멀티테넌트에서 테넌트를 잘못 참조하는 실수는 에러를 내지 않습니다 — 조용히 다른 회사의 데이터를 읽고 씁니다. 코드 리뷰만으로 막을 수 있는 종류의 사고가 아니었습니다.",
    decisions: [
      {
        title: "실수를 규칙이 아니라 검사로 막았다",
        body:
          "전역 DB 풀을 직접 가져다 쓰는 코드를 금지하고, 요청에 주입된 커넥션만 쓰도록 강제했습니다. 여기서 멈추지 않고 위반을 찾아내는 격리 검사 스크립트를 만들어, 작업이 끝날 때마다 돌리게 했습니다. 사람이 기억해야 하는 규칙을 도구가 기억하는 규칙으로 옮긴 겁니다.",
      },
      {
        title: "색을 코드에 박지 않았다",
        body:
          "다크 모드에서 흰 배경에 흰 글씨가 되는 사고가 반복됐습니다. 원인은 컴포넌트마다 색을 직접 쓴 것이었고, 해결은 CSS 변수만 쓰도록 통일한 것이었습니다. 이 포트폴리오의 테마 구조도 같은 원칙을 따릅니다.",
      },
      {
        title: "인쇄를 기능으로 취급했다",
        body:
          "회계 업무는 결국 종이로 나갑니다. 그런데 인쇄는 만들고 나면 아무도 다시 확인하지 않는 화면이라, 새 화면이 추가될 때마다 Ctrl+P가 백지로 나오곤 했습니다. 인쇄 대상을 화이트리스트로 관리해서, 등록하지 않으면 애초에 인쇄 화면이 만들어지지 않도록 했습니다.",
      },
    ],
    outcome:
      "2026년 7월부터 실제 회사의 회계 업무가 이 위에서 돌아가고 있습니다. 테넌트 추가는 명령어 한 줄로 끝나고, 격리 위반은 커밋 전에 걸립니다.",
    metrics: [
      { label: "커밋", value: "610+" },
      { label: "멀티테넌트 전환", value: "2026.07" },
      { label: "테넌트 격리 검사", value: "자동화" },
    ],
    stack: ["React", "Vite", "Express", "MariaDB", "멀티테넌트"],
    private: "사내 제품이라 저장소는 비공개입니다.",
  },
  {
    slug: "focuswin-mes",
    title: "FocusWin MES",
    subtitle: "멀티테넌트 제조실행시스템",
    year: "2025 — 2026",
    kind: "work",
    featured: true,
    role: "프론트엔드 전담 · 고객사별 파생 버전 관리",
    summary:
      "생산 현장의 공정 추적과 설비 모니터링을 다루는 제조실행시스템. 하나의 제품을 여러 제조사가 각자의 공정에 맞춰 쓰기 때문에, 공통 뼈대와 고객사별 차이를 어떻게 나눌지가 핵심이었습니다.",
    problem:
      "고객사마다 공정이 다릅니다. 그때마다 프로젝트를 통째로 복사해 고치면 당장은 빠르지만, 공통 버그를 고칠 때 네 군데를 똑같이 고쳐야 합니다. 실제로 그렇게 갈라진 저장소가 여러 개 있었습니다.",
    decisions: [
      {
        title: "보일러플레이트를 먼저 만들었다",
        body:
          "고객사 프로젝트를 새로 시작하기 전에 공통 뼈대를 별도 저장소로 분리했습니다. 새 고객사는 여기서 출발하고, 차이나는 부분만 위에 얹습니다.",
      },
      {
        title: "현장에서 쓰는 화면을 기준으로 잡았다",
        body:
          "사무실 모니터가 아니라 공장 단말기에서 장갑 낀 손으로 누르는 화면입니다. 터치 영역, 글자 크기, 색 대비 기준을 데스크톱 웹과 다르게 잡았습니다.",
      },
    ],
    outcome:
      "고객사 네 곳의 MES가 같은 뼈대 위에서 돌아갑니다. 공통 수정이 한 번으로 끝납니다.",
    metrics: [
      { label: "고객사별 파생", value: "4곳" },
      { label: "형태", value: "SaaS · 단일설치 겸용" },
    ],
    stack: ["React", "TypeScript", "제조 도메인"],
    private: "고객사 시스템이라 저장소와 사명은 공개하지 않습니다.",
  },
  {
    slug: "doc-saas",
    title: "도면관리 SaaS",
    subtitle: "제조사 도면 형상관리",
    year: "2025 — 2026",
    kind: "work",
    role: "프론트엔드 담당",
    summary:
      "정밀가공 업체가 도면을 버전 단위로 관리하는 시스템. 사내 설치형에서 출발해 SaaS로 확장했고, 영업용 오프라인 데모까지 같은 코드베이스에서 파생시켰습니다.",
    problem:
      "영업 미팅은 인터넷이 안 되는 공장 회의실에서 자주 열립니다. 데모를 보여줄 수 없다는 이유로 계약이 밀리는 일이 있었습니다.",
    decisions: [
      {
        title: "노트북 한 대에서 전부 도는 데모를 만들었다",
        body:
          "서버·DB·예시 데이터를 전부 로컬에서 띄우는 오프라인 데모 모드를 만들었습니다. 네트워크가 없어도 실제 제품과 같은 화면이 돕니다.",
      },
    ],
    outcome: "네트워크 없는 현장에서도 실제 제품 화면으로 영업이 가능해졌습니다.",
    stack: ["React", "TypeScript", "오프라인 데모"],
    private: "고객사 시스템이라 저장소와 사명은 공개하지 않습니다.",
  },

  // ─────────────────────────────── 개인 ───────────────────────────────
  {
    slug: "ai-operator",
    title: "올타마",
    subtitle: "무할루시네이션 사내 문서 RAG",
    year: "2026",
    kind: "lab",
    featured: true,
    role: "기획 · 설계 · 개발 전부",
    summary:
      "회사가 등록하고 승인한 문서만 근거로 답하는 사내 AI. 답변마다 어떤 문서의 몇 번을 봤는지 출처를 답니다. 근거가 없으면 지어내지 않고 없다고 말합니다.",
    problem:
      "사내 문서 검색에 LLM을 붙이면 그럴듯한 거짓말을 합니다. 업무 문서에서 이건 치명적입니다 — 틀린 답보다 위험한 건, 틀린 답이 맞는 답과 똑같이 자신 있어 보인다는 점입니다.",
    decisions: [
      {
        title: "사람의 승인을 파이프라인에 넣었다",
        body:
          "업로드하면 AI가 문서 유형을 분류하고 핵심 정보를 추출·요약합니다. 하지만 그것만으로는 답변 근거가 되지 않습니다. 사람이 검토하고 승인한 문서만 검색 대상에 들어갑니다.",
      },
      {
        title: "출처 인용을 형식으로 강제했다",
        body:
          "모든 답변은 문서번호를 표기합니다. 사용자가 원문을 바로 확인할 수 있고, 인용이 없는 문장은 답변으로 인정하지 않습니다.",
      },
    ],
    outcome: "출처 없는 문장이 화면에 나오지 않습니다. 모르면 모른다고 답합니다.",
    metrics: [
      { label: "커밋", value: "69" },
      { label: "원칙", value: "근거 없으면 답하지 않음" },
    ],
    stack: ["Next.js", "TypeScript", "Drizzle ORM", "TanStack Query", "Motion", "RAG"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/ai-operator" }],
  },
  {
    slug: "retention-lab",
    title: "Retention Lab",
    subtitle: "CRM 마케터용 SQL 훈련 시뮬레이터",
    year: "2026",
    kind: "lab",
    featured: true,
    role: "기획 · 설계 · 개발 전부",
    summary:
      "CRM 마케터가 세그먼트를 SQL로 짜고, 메시지를 쓰고, 결과를 평가받는 과정을 반복 훈련하는 시뮬레이터. 브라우저 안에서 실제로 SQL이 실행됩니다.",
    problem:
      "SQL 학습 도구는 많지만 대부분 '문법이 맞았나'만 봅니다. 실무에서 중요한 건 이 쿼리가 뽑은 고객이 정말 보내고 싶었던 고객인가, 그리고 그들에게 이 메시지가 맞는가입니다. 두 개를 같이 훈련하는 도구가 없었습니다.",
    decisions: [
      {
        title: "서버 없이 SQL을 돌렸다",
        body:
          "AlaSQL로 브라우저 인메모리에서 쿼리를 실행합니다. 고객 100명 규모의 가상 웨어하우스를 프론트엔드에서 생성하기 때문에, 백엔드 없이도 진짜 SQL을 쓰고 결과를 즉시 봅니다.",
      },
      {
        title: "채점을 규칙과 AI로 나눴다",
        body:
          "정답이 명확한 부분(세그먼트 조건, 필수 컬럼)은 규칙 기반으로 채점하고, 메시지 톤처럼 정답이 없는 부분만 AI에 맡겼습니다. 전부 AI에 맡기면 같은 답에 다른 점수가 나와 훈련 도구로서 신뢰를 잃습니다.",
      },
    ],
    outcome: "SQL과 메시지를 한 흐름에서 훈련하고, 왜 틀렸는지를 근거와 함께 받습니다.",
    metrics: [
      { label: "챕터", value: "4" },
      { label: "SQL 실행", value: "브라우저 인메모리" },
    ],
    stack: ["React 19", "Tailwind v4", "Zustand", "AlaSQL", "Gemini", "Wouter"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/Crystal-Lab" }],
  },
  {
    slug: "bizai",
    title: "Sales Manager",
    subtitle: "음성 영업일지 AI CRM",
    year: "2026",
    kind: "lab",
    featured: true,
    role: "기획 · 설계 · 개발 전부",
    summary:
      "영업사원이 말로 영업일지를 남기면 AI가 거래처명·금액·후속 일정을 뽑아 CRM에 정리합니다.",
    problem:
      "영업일지는 안 씁니다. 쓸 시간이 없어서가 아니라, 운전하고 이동하는 사이사이에 폼을 채우는 게 불가능해서입니다. 결국 기억에 의존하다 후속 일정을 놓칩니다.",
    decisions: [
      {
        title: "입력을 폼에서 말로 바꿨다",
        body:
          "구조화는 사람이 아니라 AI가 합니다. 사용자는 그냥 있었던 일을 말하고, 거래처·금액·일정 추출은 뒤에서 처리합니다.",
      },
    ],
    outcome: "이동 중에 한 마디 남기면 후속 일정이 잡힙니다.",
    metrics: [{ label: "커밋", value: "86" }],
    stack: ["React", "TypeScript", "Drizzle ORM", "TanStack Query", "Motion", "음성 인식"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/bizai" }],
  },
  {
    slug: "geurimgyeol",
    title: "그림결",
    subtitle: "창작자용 세계관 설정 관리",
    year: "2026",
    kind: "lab",
    role: "기획 · 설계 · 개발 전부",
    summary:
      "소설·게임을 만드는 사람이 세계관과 등장인물 설정을 흩어지지 않게 모아두는 도구. 세계관 계층, 엔티티 간 관계, 타임라인을 다룹니다.",
    problem:
      "창작 설정은 노션과 메모장과 머릿속에 흩어집니다. 등장인물이 늘어나면 관계가 꼬이고, 어제 정한 설정과 오늘 쓰는 설정이 어긋납니다.",
    decisions: [
      {
        title: "문서가 아니라 엔티티로 다뤘다",
        body:
          "설정을 글이 아니라 관계를 가진 객체로 저장합니다. 인물과 인물, 인물과 사건이 연결되기 때문에 하나를 고치면 어디에 영향이 가는지 보입니다.",
      },
    ],
    metrics: [{ label: "커밋", value: "40" }],
    stack: ["React", "TypeScript", "Express", "shadcn/ui", "Wouter", "모노레포"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/geurimgyeol" }],
  },
  {
    slug: "mindfulness",
    title: "마음공부",
    subtitle: "한 권이 한 단어인 일기",
    year: "2026",
    kind: "lab",
    role: "기획 · 설계 · 개발 전부",
    summary:
      "단어 하나에서 출발한 생각이 어디까지 가는지 담담하게 적어나가는 일기. 한 권이 한 단어이고, 하루가 한 장입니다.",
    problem:
      "일기 앱은 대부분 날짜로 묶습니다. 그런데 생각은 날짜가 아니라 주제를 따라 이어집니다. 어제 쓴 '불안'과 두 달 전에 쓴 '불안'이 만나야 뭔가 보입니다.",
    decisions: [
      {
        title: "날짜 대신 단어로 묶었다",
        body:
          "권(단어) 안에 장(하루)이 쌓입니다. 같은 단어를 다시 펼치면 그 주제로 쓴 글이 시간순으로 이어져 보입니다.",
      },
    ],
    metrics: [{ label: "커밋", value: "13" }],
    stack: ["Next.js", "React", "Motion"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/mindfulness" }],
  },
  {
    slug: "our-date",
    title: "우리 데이트",
    subtitle: "둘이 쓰는 데이트 기록",
    year: "2026",
    kind: "lab",
    role: "기획 · 설계 · 개발 전부",
    summary:
      "갈 데이트를 계획하고, 간 데이트를 기억하는 웹앱. 공유 비밀번호로 로그인하고 각자 이름으로 사진과 리뷰를 남깁니다.",
    problem:
      "커플이 쓰는 앱에 계정을 각각 만들게 하면 둘 중 하나는 안 씁니다. 가입 절차 자체가 진입장벽입니다.",
    decisions: [
      {
        title: "계정 대신 공유 비밀번호를 썼다",
        body:
          "둘이 아는 비밀번호 하나로 들어가고, 안에서 각자 이름만 고릅니다. 가입이 없습니다.",
      },
    ],
    metrics: [{ label: "커밋", value: "19" }],
    stack: ["Next.js", "React", "TypeScript"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/durinuri" }],
  },
  {
    slug: "yeonkku",
    title: "연꾸",
    subtitle: "로컬 전용 vCard 편집기",
    year: "2026",
    kind: "lab",
    role: "기획 · 설계 · 개발 전부",
    summary:
      "연락처 파일을 꾸미고 정리하는 웹앱. 모든 처리가 브라우저 안에서 끝나고 데이터가 서버로 나가지 않습니다.",
    problem:
      "연락처는 내 것이 아니라 남의 개인정보입니다. 편의를 위해 남의 전화번호를 모르는 서버에 올리는 건 맞지 않다고 봤습니다.",
    decisions: [
      {
        title: "서버를 아예 두지 않았다",
        body:
          "파싱·편집·내보내기 전부 클라이언트에서 처리합니다. 업로드가 없으니 유출될 것도 없습니다.",
      },
    ],
    stack: ["React", "TypeScript", "Vite", "로컬 전용"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/yeonkku" }],
  },
  {
    slug: "reserve-completed",
    title: "예비완료",
    subtitle: "예비군 훈련 준비 체크",
    year: "2026",
    kind: "lab",
    role: "기획 · 설계 · 개발 전부",
    summary: "훈련 통지를 받은 뒤 훈련일까지 챙겨야 할 것들을 빠뜨리지 않게 해주는 도구.",
    problem: "일 년에 한 번뿐이라 매번 뭘 챙겨야 하는지 까먹습니다.",
    stack: ["Next.js", "React", "TypeScript"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/reserve-completed" }],
  },

  // ─────────────────────────────── 실험 ───────────────────────────────
  {
    slug: "poke-dex",
    title: "띠부띠부씰 도감",
    subtitle: "레트로 도감 UI 실험",
    year: "2026",
    kind: "craft",
    role: "기획 · 설계 · 개발 전부",
    summary:
      "관동 1~100번 띠부띠부씰 컬렉션 트래커. 빨간 포켓몬 도감을 화면으로 옮기는 게 목표였습니다. 보유·중복을 체크하고 이미지로 내보내 자랑할 수 있습니다.",
    stack: ["Next.js", "React", "레트로 UI"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/-" }],
  },
  {
    slug: "gatcha-crane",
    title: "인형뽑기",
    subtitle: "three.js 물리 실험",
    year: "2026",
    kind: "craft",
    role: "기획 · 설계 · 개발 전부",
    summary: "웹에서 인형뽑기 기계를 굴려보는 3D 실험. 집게가 미끄러지는 그 느낌을 재현하는 게 재미의 전부입니다.",
    stack: ["React", "TypeScript", "three.js", "Vite"],
  },
  {
    slug: "chrome-extensions",
    title: "크롬 확장 모음",
    subtitle: "빌드 도구 없이 만든 MV3 확장들",
    year: "2026",
    kind: "craft",
    role: "기획 · 설계 · 개발 전부",
    summary:
      "직접 쓰려고, 그리고 주변 사람 깔아주려고 만든 확장 모음. 폴더 하나가 확장 하나이고, 번들러 없이 순수 HTML·CSS·JS와 Manifest V3로만 만듭니다.",
    stack: ["Manifest V3", "Vanilla JS", "빌드리스"],
    links: [{ label: "GitHub", href: "https://github.com/Chajuick/chrome-extensions" }],
  },
];

export const featured = projects.filter((p) => p.featured);
export const workProjects = projects.filter((p) => p.kind === "work");
export const labProjects = projects.filter((p) => p.kind === "lab");
export const craftProjects = projects.filter((p) => p.kind === "craft");

export const skills = [
  { group: "핵심", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
  { group: "상태·데이터", items: ["Zustand", "TanStack Query", "Drizzle ORM"] },
  { group: "표현", items: ["Motion", "three.js", "Figma"] },
  { group: "백엔드", items: ["Express", "MariaDB", "멀티테넌트 설계"] },
];
