# 📘 My AI Closet — API Reference (엔진 함수 레퍼런스)

이 문서는 `core/` 패키지의 모든 공개 함수에 대한 정확한 시그니처, 인자, 반환값을 기술합니다.

---

## 1. `core.analyzer` — 이미지 분석 및 동기화 모듈

### `load_db(path: str) -> list`
JSON 파일을 로드하여 Python 리스트로 반환합니다.
- **인자:** `path` — JSON 파일의 절대/상대 경로
- **반환:** `list` — JSON 배열 데이터. 파일이 없거나 파싱 실패 시 빈 리스트 `[]`

### `save_db(data: list, path: str) -> None`
Python 리스트를 JSON 파일로 저장합니다.
- **인자:** `data` — 저장할 리스트, `path` — 대상 파일 경로

### `extract_average_color(img_path: str) -> str`
이미지의 중앙 50% 영역을 크롭 후 10×10 리사이즈하여 평균 RGB 값을 산출, 한글 색상명으로 반환합니다.
- **반환값 예시:** `"블랙"`, `"화이트"`, `"베이지"`, `"네이비"`, `"블루"`, `"레드"`, `"그레이"`, `"기타 색상"`

### `classify_apparel_by_filename(filename: str) -> dict`
파일명 키워드를 기반으로 의상 카테고리를 추론합니다.
- **반환:** 
  ```python
  {
      "category": "상의" | "하의" | "아우터" | "미분류",
      "detail": "클래식 셔츠",
      "season": "봄, 가을",
      "style": "캐주얼"
  }
  ```

### `detect_apparel_by_image_split(image_path: str) -> str`
이미지를 상단/하단으로 이분할하여 색상 차이를 분석합니다.
- **반환:** `"상의 + 하의"` (색상 차이 > 40) 또는 `"원피스"` (색상 유사)

### `sync_reference_styles_local(force_rebuild: bool = False) -> tuple[int, list]`
남녀 레퍼런스 스타일 폴더를 스캔하여 `reference_styles.json` DB를 구축합니다.
- **인자:** `force_rebuild` — `True`이면 기존 데이터를 초기화하고 전체 재구축
- **반환:** `(신규 등록 수, 에러 목록)`
  ```python
  (42, ["broken_image.jpg (cannot identify image file)"])
  ```

### `sync_user_closet_local() -> tuple[int, list]`
`datasets/MyCloset/` 폴더를 스캔하여 `my_closet.json` DB를 구축합니다.
- **반환:** `(신규 등록 수, 에러 목록)`

### `sync_shopping_candidates_local() -> tuple[int, list]`
`datasets/ShoppingCandidates/` 폴더를 스캔하여 `shopping_candidates.json` DB를 구축합니다.
- **반환:** `(신규 등록 수, 에러 목록)`

### `create_demo_data_if_needed() -> None`
데모용 가상 의류 이미지 및 초기 DB를 자동 생성합니다. 이미 데이터가 존재하면 건너뜁니다.

---

## 2. `core.recommender` — 코디 추천 및 구매 판단 모듈

### `parse_weather(weather_text: str) -> dict`
날씨/기온 텍스트를 파싱하여 수치화된 상태 딕셔너리로 반환합니다.
- **반환:**
  ```python
  {
      "temperature": 15,           # 파싱된 기온 (℃)
      "outer_required": True,      # 아우터 필요 여부
      "warmth_level": "Medium",    # "High" | "Medium" | "Low"
      "rain_safe": True            # 비 여부
  }
  ```

### `is_color_match(item_color: str, ref_color: str) -> bool`
두 색상이 패션 배색 궁합표에 따라 조화로운지 판정합니다.
- **궁합 규칙:** 네이비↔화이트/그레이/베이지, 블랙↔그레이/화이트/레드 등

### `recommend_outfit(...) -> dict`
**핵심 추천 엔진 함수.** 사용자 프로필과 환경 조건을 받아 최적의 코디를 반환합니다.

**시그니처:**
```python
def recommend_outfit(
    user_profile: dict,              # 필수. {"gender", "tpo", "body_type", ...}
    weather_info: str,               # 필수. "기온 15도, 쌀쌀한 바람"
    recommend_mode: str = "내 옷장만 추천",
    tpo_mood: str = "전체 (자동 분류)",
    fixed_item_id: str = None,       # 고정 착용 아이템 ID
    desired_mood: str = "선택 안 함",
    formality_level: str = "선택 안 함",
    preferred_color: str = "선택 안 함",
    avoid_options: list = None,      # ["아우터 제외", "블랙 색상", ...]
    activity_level: str = "선택 안 함"
) -> dict
```

**추천 모드 (`recommend_mode`):**
| 값 | 설명 |
|---|---|
| `"내 옷장만 추천"` / `"owned_only"` | 소장 의상만으로 코디 |
| `"구매 후보만으로 가상 코디"` / `"wishlist_only"` | 구매 후보만으로 가상 코디 |
| `"내 옷장 + 구매 후보 믹스 추천"` / `"owned_plus_wishlist"` | 두 DB 합산, 소장품 우선 |

**반환값:**
```python
{
    "selected_reference": { ... },        # 선택된 스타일 교과서 가이드
    "items": [                            # 추천된 의상 리스트
        {
            "id": "demo_blazer_001",
            "category": "아우터",
            "detail": "클래식 싱글 블레이저",
            "color": "네이비",
            "file_path": "datasets/MyCloset/navy_blazer.png",
            "is_shopping_candidate": False,
            "purchase_advice": None       # 구매 후보일 경우 dict
        }
    ],
    "score": 25,                          # 매칭 점수
    "reasons": ["상황 최적화: ..."],       # 추천 이유 리스트
    "warnings": [],                       # 경고 메시지 리스트
    "unmet_conditions": [],               # 미충족 조건 리스트
    "complementary_suggestions": []       # 보완 구매 제안 리스트
}
```

**에러 시 반환:**
```python
{"error": "현재 내 디지털 옷장이 비어 있습니다. ..."}
```

**구매 판단 (`purchase_advice`) 구조:**
```python
{
    "priority": "구매 추천 (높음) 🔥" | "구매 추천 (보통)" | "보류 (중복 우려)",
    "matching_count": 4,      # 내 옷장 중 색상 호환 의상 수
    "duplicate_count": 0,     # 내 옷장 중 동일 카테고리+색상 중복 수
    "reason": "소장하신 옷들과 색상 궁합이 매우 뛰어납니다..."
}
```

### `scan_missing_essentials(closet_db: list) -> list`
내 옷장 DB를 분석하여 부족한 필수 아이템을 진단합니다.
- **반환:**
  ```python
  [
      {
          "level": "필수 🚨" | "추천 💡",
          "category": "아우터",
          "name": "네이비 블레이저 또는 그레이 가디건",
          "reason": "현재 옷장에 아우터가 한 벌도 없습니다..."
      }
  ]
  ```

---

## 3. FastAPI 서버 연동 예시

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from core.recommender import recommend_outfit
from core.analyzer import sync_user_closet_local

app = FastAPI(title="My AI Closet API")

class RecommendRequest(BaseModel):
    gender: str
    tpo: str
    body_type: str = ""
    weather: str
    recommend_mode: str = "내 옷장만 추천"

@app.post("/api/recommend")
def get_recommendation(req: RecommendRequest):
    user_profile = {
        "gender": req.gender,
        "tpo": req.tpo,
        "body_type": req.body_type
    }
    result = recommend_outfit(user_profile, req.weather, req.recommend_mode)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/api/sync-closet")
def sync_closet():
    count, errors = sync_user_closet_local()
    return {"new_items": count, "errors": errors}
```

---

> **📌 참고:** 이 엔진은 100% 오프라인 Python 엔진이므로, 유료 API 키 없이 로컬 서버에서 즉시 구동 가능합니다.
