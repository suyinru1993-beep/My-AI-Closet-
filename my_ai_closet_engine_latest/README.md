# 👗 My AI Closet — 나만의 디지털 옷장 AI 코디 추천 엔진

> **100% 오프라인(On-device)으로 동작하는 로컬 패션 코디 추천 시스템.**
> 외부 API 의존성 0%, 유료 과금 0원. 개인 정보가 외부로 전송되지 않습니다.

---

## 📌 프로젝트 개요

| 항목 | 내용 |
| :--- | :--- |
| **목적** | 내 옷장 사진을 AI가 분석하여 TPO·날씨·체형에 맞는 맞춤 코디 추천 |
| **대상 사용자** | 20대~40대 남녀 (학생, 직장인 등) |
| **핵심 기술** | Python 3.x, Pillow 이미지 분석, 규칙 기반 스코어링 엔진 |
| **UI 프레임워크** | Streamlit |

---

## 🚀 빠른 시작 (Quick Start)

### 1. 환경 설정
```bash
# Python 가상환경 생성 및 활성화
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux

# 의존 라이브러리 설치
pip install -r requirements.txt
```

### 2. 실행
```bash
streamlit run app.py
```
브라우저에서 `http://localhost:8501`로 접속합니다.

### 3. 옷장 채우기
1. `datasets/MyCloset/` 폴더에 소장 의류 사진(jpg, png)을 넣습니다.
2. `datasets/ShoppingCandidates/` 폴더에 구매 후보 의류 사진을 넣습니다.
3. 앱 화면에서 **"스캔 & 동기화"** 버튼을 클릭하면 AI가 자동 분석합니다.

> **💡 파일명 팁:** 파일명에 `shirt`, `blazer`, `jeans` 등의 키워드를 포함하면 분류 정확도가 높아집니다.

---

## 🎯 핵심 기능

### 1. 옷장 스캔 & 자동 분류
- Pillow 이미지 분석으로 **대표 색상 자동 추출**
- 파일명 키워드 + AI Hub 라벨 데이터 기반 **카테고리 자동 분류**
- 이미지 수직 이분할 색상 분석 **보조 분류 엔진**

### 2. 맞춤 코디 추천
- **5대 상세 조건**: 원하는 분위기, 격식 정도, 선호 색상, 기피 대상, 활동량
- **TPO 무드 필터링**: 오피스/데이트/일상/여행 모드
- **기온 기반 아우터 자동 추가**: 추운 날씨 감지 시 아우터 매칭
- **안전 폴백(Fallback)**: 기피 조건 적용 후 의상이 없으면 자동 조건 완화

### 3. 구매 의사결정 도우미
- **3가지 추천 모드**: 내 옷장만 / 구매 후보만 / 믹스 매칭
- **구매 가치 점수**: 색상 호환성 + 중복 여부 분석 → 구매 추천 등급 산출
- **부족 아이템 진단**: 옷장 분석 후 부족한 필수 베이직 아이템 제안

### 4. 마네킹 착장 보드
- 남성/여성 SVG 실루엣 기반 **인형놀이 방식** 시각화
- 상의→하의→아우터 수직 스택 보드
- 코디 히스토리 저장 및 복원

---

## 📂 프로젝트 구조

```
coordi/
├── app.py                     # Streamlit UI 메인 앱
├── config.py                  # 전역 경로 및 설정 상수
├── requirements.txt           # Python 의존 라이브러리
│
├── core/                      # 🧠 핵심 엔진
│   ├── analyzer.py            # 이미지 분석, 색상 추출, 카테고리 분류
│   └── recommender.py         # 코디 추천, 스코어링, 구매 판단
│
├── datasets/                  # 📁 의류 이미지 폴더
│   ├── Man/                   # 남성 스타일 교과서
│   ├── Woman/                 # 여성 스타일 교과서
│   ├── MyCloset/              # 내 진짜 옷장
│   └── ShoppingCandidates/    # 구매 후보
│
├── tests/                     # 🧪 단위 테스트
│   ├── test_engine.py
│   ├── test_reclassification.py
│   └── test_recommend_options.py
│
└── docs/                      # 📄 기술 문서
    ├── API_REFERENCE.md       # 엔진 API 레퍼런스
    ├── ARCHITECTURE.md        # 시스템 아키텍처 가이드
    ├── COORDINATION_ENGINE_REVIEW.md  # 엔진 검수 및 유지보수 가이드
    └── ENGINE_UI_UX_GUIDE.md  # 프론트엔드 연동 및 UI/UX 설계 가이드
```

---

## 🗄️ 데이터베이스 (JSON)

| DB 파일 | 역할 | 핵심 필드 |
| :--- | :--- | :--- |
| `reference_styles.json` | 스타일 교과서 (~1,089개) | gender, style_name, category_combination, mood, season |
| `my_closet.json` | 내 옷장 인벤토리 | id, category, color, season, style, file_path |
| `shopping_candidates.json` | 구매 후보 리스트 | id, category, color, brand, price, url |
| `outfit_history.json` | 코디 히스토리 | 날짜, 날씨, 의상 목록, 성별 |

---

## 🧪 테스트 실행

```bash
python -m unittest discover -s tests -v
```

현재 **10개 단위 테스트** 모두 통과 상태입니다.

---

## 📖 상세 문서

| 문서 | 설명 |
| :--- | :--- |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | 엔진 함수 API 상세 레퍼런스 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 시스템 아키텍처 및 상용화 가이드 |
| [docs/COORDINATION_ENGINE_REVIEW.md](docs/COORDINATION_ENGINE_REVIEW.md) | 엔진 검수 결과 및 유지보수 매뉴얼 |
| [docs/ENGINE_UI_UX_GUIDE.md](docs/ENGINE_UI_UX_GUIDE.md) | 프론트엔드 개발자용 UI/UX 연동 설계 가이드 |

---

## 🔮 향후 로드맵

1. **DB 마이그레이션**: JSON → MySQL/MongoDB 클라우드 DB
2. **쇼핑 API 연동**: 네이버 쇼핑/쿠팡 실시간 최저가 연동
3. **AI 고도화**: 규칙 기반 → 임베딩 벡터 기반 유사도 검색
4. **비동기 처리**: 대량 이미지 스캔 시 Celery 작업 큐 도입

---

## 📜 라이선스

이 프로젝트는 내부 프로토타입 목적으로 개발되었습니다.
