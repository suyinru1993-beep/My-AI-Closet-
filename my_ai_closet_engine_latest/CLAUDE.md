# My AI Closet (나만의 디지털 옷장 - 로컬 전용 엔진)

## 1. Project Identity
- **Product Vision**: 로컬에 저장된 옷 사진을 오프라인으로 자동 분석하여 개인 맞춤형 디지털 옷장을 구축하고, 사용자의 체형, TPO, 날씨를 반영한 오프라인 코디 추천을 제공하는 시스템.
- **Target Audience**: 20대~40대 남녀 (학생, 직장인 등 다양한 상황에 맞는 옷차림을 고민하는 사용자)
- **Role**: Local Fashion Stylist & Digital Closet Manager

## 2. Core Features
1. **옷장 스캔 & 동기화 (Local Vision)**: 로컬 폴더(`./datasets/Man`, `Woman`, `MyCloset`) 내의 이미지를 Pillow 이미지 분석 엔진을 통해 로컬에서 오프라인 분석하여 대표 색상 및 카테고리를 추론하고 `my_closet.json` 및 `reference_styles.json`으로 저장.
2. **맞춤 코디 추천 (Local Coordinator)**: `my_closet.json`과 `reference_styles.json`의 데이터를 기반으로, 현재 사용자의 날씨, 성별, TPO(어디 가는지), 신체적 고민을 종합하여 오프라인 매칭 엔진이 최적의 상의/하의/아우터 조합과 패션 팁을 추천.

## 3. Architecture & Stack
- **Language**: Python 3.x
- **UI Framework**: Streamlit
- **AI / LLM Engine**: 100% Offline Python Rule Engine & PIL Color Extractor
- **Data Storage**: Local JSON (`my_closet.json`, `reference_styles.json`)
- **Folder Structure**:
  - `app.py`: Streamlit 메인 화면 및 뷰 컨트롤러
  - `config.py`: 상수 및 파일 경로 제어
  - `core/analyzer.py`: 로컬 이미지 동기화, 색상 추출 및 DB 기록 역할
  - `core/recommender.py`: 로컬 상황별 코디 조합 및 스타일링 팁 추천 역할

## 4. Development Rules
- **Canonical Naming**: 역할에 맞는 모호하지 않은 이름 사용 (`analyzer` = 분석기, `recommender` = 추천기).
- **Offline First**: 어떠한 외부 클라우드 API도 사용하지 않으며 100% 로컬(온디바이스)로 완벽히 동작해야 함.
- **Simplicity First**: 불필요한 추상화나 과도한 클래스 구조보다 함수형/절차형 스크립트로 가독성 높은 코드 작성.
- **Surgical Edit**: 기존 기능에 영향이 없도록 수정 범위 최소화.

## 5. Graphify / Ontology Rules
- **Data Schema**:
  - `reference_styles.json`: `gender`, `style_name`, `category_combination`, `color_combination`, `mood`, `season`, `style_tips`, `file_path`
  - `my_closet.json`: `category`, `detail`, `color`, `season`, `style`, `file_path`, `gender`

## 6. Known Constraints
- 로컬 폴더에 이미지 파일이 없을 경우 데모 가상 옷장 데이터가 자동 생성됨.
- 실물 옷 사진 스캔 시, 이미지 파일명 키워드(예: shirt, slacks 등)를 감지하여 카테고리를 분류하고 PIL을 통해 옷의 색상을 자동 추출함.
