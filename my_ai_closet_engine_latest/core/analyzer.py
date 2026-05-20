import os
import json
import uuid
from pathlib import Path
from PIL import Image, ImageDraw

from config import REF_DIR_MAN, REF_DIR_WOMAN, MY_CLOSET_DIR, REF_DB_PATH, CLOSET_DB_PATH, SHOPPING_DIR, SHOPPING_DB_PATH

# DB 로드 유틸리티
def load_db(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

# DB 저장 유틸리티
def save_db(data, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 이미지 파일 탐색 유틸리티 (하위 images 폴더 자동 감지)
def get_image_files(base_path):
    p = Path(base_path)
    if not p.exists():
        return []
    
    images_sub = p / "images"
    target_dir = images_sub if images_sub.exists() else p
    
    files = []
    seen = set()
    for ext in ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG"):
        for filepath in target_dir.glob(ext):
            abs_path = filepath.resolve()
            if abs_path not in seen:
                seen.add(abs_path)
                files.append(filepath)
    return files

# ========================================================
# 1. 100% 오프라인 패션 시각 분류 알고리즘
# ========================================================
def extract_average_color(img_path):
    """Pillow를 사용해 이미지의 중앙 영역 색상을 다중 샘플링하여 대표 색상명을 한글로 추출하는 향상된 알고리즘"""
    try:
        img = Image.open(img_path).convert("RGB")
        width, height = img.size
        # 중앙 50% 영역 크롭 (배경 간섭 최소화)
        left = width * 0.25
        top = height * 0.25
        right = width * 0.75
        bottom = height * 0.75
        img_cropped = img.crop((left, top, right, bottom))
        
        # 10x10으로 축소하여 다중 픽셀 평균 색상 값 도출
        img_small = img_cropped.resize((10, 10))
        pixels = img_small.get_flattened_data()
        r = sum(p[0] for p in pixels) // len(pixels)
        g = sum(p[1] for p in pixels) // len(pixels)
        b = sum(p[2] for p in pixels) // len(pixels)
        
        # 색상 판별 로직
        if r < 50 and g < 50 and b < 50:
            return "블랙"
        elif r > 210 and g > 210 and b > 210:
            return "화이트"
        elif r > 150 and g > 130 and b > 100 and r - b > 20 and r > b:
            return "베이지"
        elif r > 80 and g > 50 and b > 40 and r > g + 10 and g > b and r - b > 15 and r < 160:
            return "브라운"
        elif b > r + 15 and b > g + 10 and r < 60:
            return "네이비"
        elif b > r + 15 and b > g + 10:
            return "블루"
        elif r > g + 40 and r > b + 40:
            return "레드"
        elif abs(r - g) < 20 and abs(g - b) < 20:
            return "그레이"
        else:
            return "기타 색상"
    except Exception:
        return "기타 색상"

def classify_apparel_by_filename(filename):
    """파일명의 키워드를 기반으로 의상의 성격과 카테고리를 추론하는 로컬 알고리즘"""
    fn = filename.lower()
    
    # 1. 스타일 한글명 정의 (현대적 트렌디 명칭 반영)
    style_kor = "원마일 캐주얼"
    if "sportivecasual" in fn or "sportive" in fn:
        style_kor = "스포티 데일리"
    elif "normcore" in fn:
        style_kor = "모던 놈코어"
    elif "lounge" in fn:
        style_kor = "홈앤라운지"
    elif "athleisure" in fn:
        style_kor = "트렌디 애슬레저"
    elif "retro" in fn:
        style_kor = "뉴트로 스트릿"
    elif "romantic" in fn:
        style_kor = "로맨틱 페미닌"
    elif "resort" in fn:
        style_kor = "어반 리조트"
        
    # 2. 의류 종류 및 카테고리 판정
    category = "상의"
    detail = "데일리 의류"
    season = "봄, 가을"
    
    if any(k in fn for k in ["shirt", "셔츠", "티셔츠", "t-shirt", "tshirt", "top", "탑"]):
        category = "상의"
        detail = "클래식 셔츠"
        season = "봄, 가을"
    elif any(k in fn for k in ["knit", "니트", "sweater", "스웨터", "cardigan", "가디건"]):
        category = "상의"
        detail = "라운드넥 니트"
        season = "봄, 가을, 겨울"
    elif any(k in fn for k in ["jean", "청바지", "denim", "데님"]):
        category = "하의"
        detail = "테이퍼드 청바지"
        season = "봄, 가을, 겨울"
    elif any(k in fn for k in ["slacks", "슬랙스", "pants", "바지", "skirt", "스커트"]):
        category = "하의"
        detail = "드레스 슬랙스" if "slacks" in fn else "데일리 하의"
        season = "봄, 가을, 겨울"
    elif any(k in fn for k in ["blazer", "블레이저", "자켓", "jacket", "coat", "코트"]):
        category = "아우터"
        detail = "테일러드 자켓"
        season = "봄, 가을"
    elif any(k in fn for k in ["padding", "패딩", "down", "다운"]):
        category = "아우터"
        detail = "방한 패딩"
        season = "겨울"
    else:
        # 파일명 기반 추정이 불가능할 경우 무조건 상의로 처리하지 않고 "미분류"로 표기
        if "sportivecasual" in fn or "athleisure" in fn:
            category = "상의"
            detail = "스포츠 웨어 탑"
            season = "봄, 여름, 가을"
        elif "normcore" in fn:
            category = "상의"
            detail = "놈코어 기본 탑"
            season = "봄, 가을"
        else:
            category = "미분류"
            detail = "상세 미분류 아이템"
            season = "사계절"
            
    return {
        "category": category,
        "detail": detail,
        "season": season,
        "style": style_kor
    }

# ========================================================
# 2. 로컬 의상 스캔 및 동기화 엔진
# ========================================================
def detect_apparel_by_image_split(image_path):
    """
    이미지를 상단과 하단 영역으로 수직 이분할하여 색상 비교.
    색상이 다르면 "상의 + 하의" 조합으로 자동 분류하고, 유사하면 "원피스" 조합으로 태깅하는 보조 엔진.
    """
    try:
        img = Image.open(image_path).convert("RGB")
        width, height = img.size
        
        # 상단 (20% ~ 45% 높이, 가로 25% ~ 75%) - 상의 영역
        top_box = (width * 0.25, height * 0.2, width * 0.75, height * 0.45)
        # 하단 (55% ~ 80% 높이, 가로 25% ~ 75%) - 하의 영역
        bottom_box = (width * 0.25, height * 0.55, width * 0.8, height * 0.8)
        
        top_img = img.crop(top_box).resize((5, 5))
        bottom_img = img.crop(bottom_box).resize((5, 5))
        
        top_pixels = top_img.get_flattened_data()
        bottom_pixels = bottom_img.get_flattened_data()
        
        r_top = sum(p[0] for p in top_pixels) // len(top_pixels)
        g_top = sum(p[1] for p in top_pixels) // len(top_pixels)
        b_top = sum(p[2] for p in top_pixels) // len(top_pixels)
        
        r_bot = sum(p[0] for p in bottom_pixels) // len(bottom_pixels)
        g_bot = sum(p[1] for p in bottom_pixels) // len(bottom_pixels)
        b_bot = sum(p[2] for p in bottom_pixels) // len(bottom_pixels)
        
        distance = ((r_top - r_bot) ** 2 + (g_top - g_bot) ** 2 + (b_top - b_bot) ** 2) ** 0.5
        
        # 거리가 40을 초과하면 두 영역의 색상이 다름 -> "상의 + 하의"
        if distance > 40:
            return "상의 + 하의"
        else:
            return "원피스"
    except Exception:
        return "상의 + 하의"


def sync_reference_styles_local(force_rebuild=False):
    """남녀 레퍼런스 스타일 폴더를 오프라인으로 자동 분석하여 스타일 교과서 DB를 구축합니다."""
    ref_db = load_db(REF_DB_PATH)
    
    if force_rebuild:
        # 기존 가상 데모 데이터만 남겨놓고 전부 비우기
        ref_db = [item for item in ref_db if item.get("file_path", "").startswith("demo_ref")]
        existing_paths = set()
    else:
        # 기존 가상 데모 데이터 제외
        ref_db = [item for item in ref_db if not item.get("file_path", "").startswith("demo_ref")]
        existing_paths = {item.get("file_path") for item in ref_db}
        
    folders = {
        "Man": REF_DIR_MAN,
        "Woman": REF_DIR_WOMAN
    }
    
    # selected_inventory.json 로드하여 스타일 정보 사전 구축 (Woman 전용)
    inventory_data = {}
    json_path = Path(REF_DIR_WOMAN) / "selected_inventory.json"
    if json_path.exists():
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                inv = json.load(f)
                for item in inv.get("inventory", []):
                    inventory_data[item["id"]] = item
        except Exception as e:
            print(f"Error loading selected_inventory.json: {e}")
            
    new_items_count = 0
    errors = []
    
    # 16개 서브카테고리 매핑 테이블 (AI-Hub Q42xx 기준)
    category_mapping = {
        1: ("아우터", "코트"),
        2: ("아우터", "재킷"),
        3: ("아우터", "점퍼"),
        4: ("아우터", "패딩"),
        5: ("아우터", "베스트"),
        6: ("아우터", "가디건"),
        7: ("아우터", "집업"),
        8: ("상의", "티셔츠"),
        9: ("상의", "셔츠"),
        10: ("상의", "블라우스"),
        11: ("상의", "니트웨어"),
        12: ("하의", "청바지"),
        13: ("하의", "팬츠"),
        14: ("하의", "스커트"),
        15: ("하의", "레깅스"),
        16: ("원피스", "원피스")
    }
    
    for gender, path in folders.items():
        image_files = get_image_files(path)
        labels_dir = Path(path) / "labels"
        
        for img_file in image_files:
            file_path_str = str(img_file)
            if file_path_str in existing_paths:
                continue
                
            try:
                # 100% 로컬 분석 엔진 가동
                color = extract_average_color(file_path_str)
                item_id = img_file.stem
                
                # 1. Woman 전용 selected_inventory.json 매칭 우선 (우선순위 2)
                if gender == "Woman" and item_id in inventory_data:
                    inv_item = inventory_data[item_id]
                    style_mood = inv_item.get("style", "캐주얼")
                    items_list = inv_item.get("items", [])
                    reasons_list = inv_item.get("reasons", [])
                    
                    # reasons 및 items 목록에서 대분류 키워드 추출하여 category_combination 구성
                    cat_set = []
                    reasons_str = " ".join(reasons_list)
                    items_str = " ".join(items_list)
                    
                    if "상의" in reasons_str or any(k in items_str for k in ["티셔츠", "셔츠", "블라우스", "니트"]):
                        cat_set.append("상의")
                    if "하의" in reasons_str or any(k in items_str for k in ["스커트", "바지", "슬랙스", "청바지"]):
                        cat_set.append("하의")
                    if "아우터" in reasons_str or any(k in items_str for k in ["재킷", "자켓", "코트", "점퍼", "가디건"]):
                        cat_set.append("아우터")
                    if "원피스" in reasons_str or any(k in items_str for k in ["드레스", "원피스"]):
                        cat_set.append("원피스")
                        
                    if not cat_set:
                        category_comb = detect_apparel_by_image_split(file_path_str)
                    else:
                        category_comb = " + ".join(cat_set)
                        
                    mood = f"유니크하고 트렌디한 {style_mood} 무드"
                    reasons_clean = [r.split("(+")[0] for r in reasons_list]
                    style_tips = f"이 스타일은 {', '.join(reasons_clean)} 매칭으로 연출된 완성도 높은 코디입니다."
                    
                    style_name = f"{style_mood} {color} 코디"
                    season = "봄, 여름, 가을"
                
                # 2. labels/*.json 매칭 (우선순위 1) 및 파일명 기반 추론
                else:
                    label_data = {}
                    if labels_dir.exists():
                        matching_jsons = list(labels_dir.glob(f"{item_id}_*.json"))
                        if matching_jsons:
                            try:
                                with open(matching_jsons[0], "r", encoding="utf-8") as lf:
                                    label_data = json.load(lf)
                            except Exception:
                                pass
                                
                    item_info = label_data.get("item", {})
                    survey_info = item_info.get("survey", {})
                    lbl_style = item_info.get("style", "")
                    lbl_era = item_info.get("era", "")
                    
                    has_survey_match = False
                    survey_cats = []
                    detail_items = []
                    
                    # Q4201 ~ Q4216 체크박스 검사
                    checked_indices = []
                    for idx in range(1, 17):
                        q_key = f"Q42{idx:02d}"
                        if survey_info.get(q_key, 0) != 0:
                            checked_indices.append(idx)
                            
                    if checked_indices:
                        has_survey_match = True
                        cat_found = set()
                        for idx in checked_indices:
                            main_cat, sub_cat = category_mapping[idx]
                            cat_found.add(main_cat)
                            detail_items.append(sub_cat)
                            
                        for c in ["상의", "하의", "아우터", "원피스"]:
                            if c in cat_found:
                                survey_cats.append(c)
                                
                    if has_survey_match:
                        category_comb = " + ".join(survey_cats)
                    else:
                        # 4순위: 파일명 기반 분류
                        classification = classify_apparel_by_filename(img_file.name)
                        if classification["category"] != "미분류":
                            category_comb = classification["category"]
                        else:
                            # 3순위: 이미지 수직 이분할 색상 분석
                            category_comb = detect_apparel_by_image_split(file_path_str)
                            
                    # 스타일 정보 빌드
                    classification = classify_apparel_by_filename(img_file.name)
                    if lbl_style:
                        style_map = {
                            "sportivecasual": "스포티 데일리",
                            "normcore": "모던 놈코어",
                            "lounge": "홈앤라운지",
                            "athleisure": "트렌디 애슬레저",
                            "retro": "뉴트로 스트릿",
                            "romantic": "로맨틱 페미닌",
                            "resort": "어반 리조트",
                            "classic": "올드머니 클래식",
                            "casual": "원마일 캐주얼",
                            "formal": "미니멀 포멀"
                        }
                        style_mood = style_map.get(lbl_style.lower(), classification["style"])
                    else:
                        style_mood = classification["style"]
                        
                    # 구식 연대 표기(lbl_era)를 완전히 배제하여 트렌디함 유지
                    style_name = f"{style_mood} {color} 스타일 코디"
                    mood = f"심플하고 단정한 {style_mood} 무드"
                    season = classification["season"]
                    
                    if detail_items:
                        detail_str = ", ".join(detail_items)
                        style_tips = f"이 스타일은 [{detail_str}] 아이템들을 매치하여 {style_mood} 감성을 연출한 완성도 높은 코디입니다."
                    else:
                        style_tips = f"이 스타일은 {style_mood} 무드를 극대화하고 {color} 색상의 포인트를 잘 살린 완성도 높은 코디입니다."
                
                data = {
                    "gender": gender,
                    "style_name": style_name,
                    "category_combination": category_comb,
                    "color_combination": f"{color} 계열",
                    "mood": mood,
                    "season": season,
                    "style_tips": style_tips,
                    "file_path": file_path_str
                }
                
                # force_rebuild인 경우 전체 초기화되었으므로 리스트에 직접 추가하고,
                # 일반 동기화의 경우 중복을 피해 추가
                ref_db.append(data)
                new_items_count += 1
            except Exception as e:
                errors.append(f"{img_file.name} ({str(e)})")
                
    if new_items_count > 0 or force_rebuild:
        save_db(ref_db, REF_DB_PATH)
        
    return new_items_count, errors


def sync_user_closet_local():
    """내 옷장 폴더를 오프라인으로 100% 자동 스캔 및 태깅하여 내 옷장 DB를 구축합니다."""
    closet_db = load_db(CLOSET_DB_PATH)
    # 기존에 중복 파일 추가를 막는 existing_paths 로직이 있으므로, navy_blazer.png 하드코딩 필터링 제거
    existing_paths = {item.get("file_path") for item in closet_db}
    
    image_files = get_image_files(MY_CLOSET_DIR)
    
    new_items_count = 0
    errors = []
    
    for img_file in image_files:
        file_path_str = str(img_file)
        if file_path_str in existing_paths:
            continue
            
        try:
            # 100% 로컬 분석 엔진 가동
            color = extract_average_color(file_path_str)
            classification = classify_apparel_by_filename(img_file.name)
            
            cat_code, style_tags = generate_sql_compatible_fields(
                "공용",
                f"{color} {classification['detail']}",
                color,
                classification["season"],
                classification["style"]
            )
            data = {
                "id": uuid.uuid4().hex[:16],
                "category": classification["category"],
                "detail": f"{color} {classification['detail']}",
                "color": color,
                "season": classification["season"],
                "style": classification["style"],
                "file_path": file_path_str,
                "gender": "공용",  # 확장성을 위해 강제 Man 대신 공용 기본값 설정
                "category_code": cat_code,
                "style_tags": style_tags
            }
            closet_db.append(data)
            new_items_count += 1
        except Exception as e:
            errors.append(f"{img_file.name} ({str(e)})")
            
    if new_items_count > 0:
        save_db(closet_db, CLOSET_DB_PATH)
        
    return new_items_count, errors


def sync_shopping_candidates_local():
    """구매 후보 폴더를 오프라인으로 100% 자동 스캔 및 태깅하여 구매 후보 DB를 구축합니다."""
    shopping_db = load_db(SHOPPING_DB_PATH)
    existing_paths = {item.get("file_path") for item in shopping_db}
    
    image_files = get_image_files(SHOPPING_DIR)
    
    new_items_count = 0
    errors = []
    
    for img_file in image_files:
        file_path_str = str(img_file)
        if file_path_str in existing_paths:
            continue
            
        try:
            # 100% 로컬 분석 엔진 가동
            color = extract_average_color(file_path_str)
            classification = classify_apparel_by_filename(img_file.name)
            
            cat_code, style_tags = generate_sql_compatible_fields(
                "공용",
                f"[후보] {color} {classification['detail']}",
                color,
                classification["season"],
                classification["style"]
            )
            data = {
                "id": uuid.uuid4().hex[:16],
                "category": classification["category"],
                "detail": f"[후보] {color} {classification['detail']}",
                "color": color,
                "season": classification["season"],
                "style": classification["style"],
                "file_path": file_path_str,
                "gender": "공용",
                "brand": "",
                "price": 0,
                "url": "",
                "category_code": cat_code,
                "style_tags": style_tags
            }
            shopping_db.append(data)
            new_items_count += 1
        except Exception as e:
            errors.append(f"{img_file.name} ({str(e)})")
            
    if new_items_count > 0:
        save_db(shopping_db, SHOPPING_DB_PATH)
        
    return new_items_count, errors


# ========================================================
# 3. 체험 모드(Demo Mode) 가상 데이터 생성 유틸리티
# ========================================================
def create_demo_data_if_needed():
    """앱 구동 시 기본 샘플 이미지를 그리고 JSON DB 스캐폴딩을 채우는 함수"""
    closet_path = Path(MY_CLOSET_DIR)
    closet_path.mkdir(parents=True, exist_ok=True)
    
    shopping_path = Path(SHOPPING_DIR)
    shopping_path.mkdir(parents=True, exist_ok=True)
    
    # 남성/여성 스타일 교과서 폴더 자동 개설
    man_path = Path(REF_DIR_MAN)
    woman_path = Path(REF_DIR_WOMAN)
    man_path.mkdir(parents=True, exist_ok=True)
    woman_path.mkdir(parents=True, exist_ok=True)
    
    # 학습을 돕는 설명 가이드 파일 생성 (한 번만 생성)
    readme_man = man_path / "README_학습가이드.txt"
    if not readme_man.exists():
        with open(readme_man, "w", encoding="utf-8") as f:
            f.write(
                "👗 [My AI Closet] 남성 스타일 교과서 학습 가이드\n\n"
                "여기에 학습시키고 싶은 남성 코디 이미지(jpg, png 등)를 넣어주세요.\n\n"
                "💡 오프라인 AI가 훨씬 똑똑하게 옷 종류를 알아채기 위한 '파일명 작명 꿀팁':\n"
                "파일명에 아래 영문/한글 키워드가 포함되면 이미지 분석 엔진이 자동으로 카테고리를 아주 정확히 분류해 냅니다!\n"
                "- 셔츠류: 'shirt', '셔츠', '티셔츠'\n"
                "- 니트/가디건류: 'knit', '니트', 'sweater', '스웨터', 'cardigan', '가디건'\n"
                "- 청바지류: 'jean', '청바지', 'denim', '데님'\n"
                "- 슬랙스/바지류: 'slacks', '슬랙스', 'pants', '바지'\n"
                "- 자켓/코트/블레이저류: 'blazer', '블레이저', '자켓', 'jacket', 'coat', '코트'\n"
                "- 패딩/다운류: 'padding', '패딩', 'down', '다운'\n\n"
                "예시 작명: 'blue_denim_jean.jpg', 'beige_knit_sweater.png', 'navy_blazer_jacket.jpg'\n"
            )
            
    readme_woman = woman_path / "README_학습가이드.txt"
    if not readme_woman.exists():
        with open(readme_woman, "w", encoding="utf-8") as f:
            f.write(
                "👗 [My AI Closet] 여성 스타일 교과서 학습 가이드\n\n"
                "여기에 학습시키고 싶은 여성 코디 이미지(jpg, png 등)를 넣어주세요.\n\n"
                "💡 오프라인 AI가 훨씬 똑똑하게 옷 종류를 알아채기 위한 '파일명 작명 꿀팁':\n"
                "파일명에 아래 영문/한글 키워드가 포함되면 이미지 분석 엔진이 자동으로 카테고리를 아주 정확히 분류해 냅니다!\n"
                "- 셔츠류: 'shirt', '셔츠', '티셔츠'\n"
                "- 니트/가디건류: 'knit', '니트', 'sweater', '스웨터', 'cardigan', '가디건'\n"
                "- 청바지류: 'jean', '청바지', 'denim', '데님'\n"
                "- 슬랙스/바지류: 'slacks', '슬랙스', 'pants', '바지'\n"
                "- 자켓/코트/블레이저류: 'blazer', '블레이저', '자켓', 'jacket', 'coat', '코트'\n"
                "- 패딩/다운류: 'padding', '패딩', 'down', '다운'\n\n"
                "예시 작명: 'white_shirt.jpg', 'black_slacks.png', 'gray_cardigan.jpg'\n"
            )
    
    readme_wish = shopping_path / "README_구매후보가이드.txt"
    if not readme_wish.exists():
        with open(readme_wish, "w", encoding="utf-8") as f:
            f.write(
                "🛒 [My AI Closet] 구매 후보(Shopping Candidates) 가이드\n\n"
                "여기에 사고 싶거나 인터넷 쇼핑몰에서 캡처한 의상 이미지(jpg, png 등)를 넣어주세요.\n"
                "진짜 소유한 옷(My Closet)과 완전히 분리되어 가상 코디 매칭 및 구매 판단용으로 안전하게 실험해 볼 수 있습니다.\n\n"
                "💡 옷 이름 짓기 팁 (파일명에 키워드 포함):\n"
                "- 셔츠류: 'shirt', '셔츠'\n"
                "- 니트/가디건류: 'knit', '니트', 'cardigan'\n"
                "- 청바지류: 'jean', '청바지'\n"
                "- 슬랙스/바지류: 'slacks', '슬랙스', 'pants'\n"
                "- 자켓/코트/아우터류: 'blazer', 'jacket', 'coat', '코트'\n\n"
                "예시: 'brown_coat.jpg', 'beige_jacket.png'\n"
            )
    
    def draw_apparel_card(filename, text, color_hex):
        file_path = closet_path / filename
        if file_path.exists():
            return str(file_path)
            
        img = Image.new("RGB", (300, 400), color=color_hex)
        draw = ImageDraw.Draw(img)
        draw.rectangle([10, 10, 290, 390], outline="#ffffff", width=3)
        draw.text((30, 180), text, fill="#ffffff" if color_hex not in ["#ffffff", "#f5f5dc"] else "#333333", stroke_width=1)
        img.save(file_path)
        return str(file_path)

    def draw_wishlist_card(filename, text, color_hex):
        file_path = shopping_path / filename
        if file_path.exists():
            return str(file_path)
            
        img = Image.new("RGB", (300, 400), color=color_hex)
        draw = ImageDraw.Draw(img)
        draw.rectangle([10, 10, 290, 390], outline="#ffd700", width=4) # 구매 후보 템은 골드 테두리
        draw.text((30, 180), text, fill="#ffffff" if color_hex not in ["#ffffff", "#f5f5dc"] else "#333333", stroke_width=1)
        img.save(file_path)
        return str(file_path)

    img_blazer = draw_apparel_card("navy_blazer.png", "Navy Blazer\n(Navy / Formel)", "#1c2e4a")
    img_shirt = draw_apparel_card("white_shirt.png", "White Shirt\n(White / Formel)", "#ffffff")
    img_slacks = draw_apparel_card("black_slacks.png", "Black Slacks\n(Black / Formel)", "#111111")
    img_knit = draw_apparel_card("beige_knit.png", "Beige Knit\n(Beige / Casual)", "#f5f5dc")
    img_jeans = draw_apparel_card("blue_jeans.png", "Blue Jeans\n(Blue / Casual)", "#4682b4")
    img_padding = draw_apparel_card("black_padding.png", "Black Padding\n(Black / Winter)", "#222222")

    img_wish_coat = draw_wishlist_card("brown_coat.png", "Wish: Brown Coat\n(Brown / Casual)", "#8b4513")
    img_wish_blazer = draw_wishlist_card("beige_blazer.png", "Wish: Beige Blazer\n(Beige / Formal)", "#f5f5dc")

    # 데모용 스타일 교과서 DB 구축
    ref_db = load_db(REF_DB_PATH)
    if not ref_db:
        ref_db = [
            {
                "gender": "Man",
                "style_name": "클래식 댄디 비즈니스룩",
                "category_combination": "아우터 + 상의 + 하의",
                "color_combination": "네이비 블레이저 + 화이트 셔츠 + 블랙 슬랙스",
                "mood": "깔끔하고 신뢰감을 주는 포멀한 무드",
                "season": "봄, 가을",
                "style_tips": "네이비와 모노톤(화이트, 블랙)의 조합은 실패가 없는 가장 완벽한 댄디 룩의 정석입니다.",
                "file_path": "demo_ref_1"
            },
            {
                "gender": "Man",
                "style_name": "따뜻한 캐주얼 남친룩",
                "category_combination": "상의 + 하의",
                "color_combination": "베이지 니트 + 블루 청바지",
                "mood": "편안하고 부드러운 인상을 주는 데일리 무드",
                "season": "봄, 가을, 겨울",
                "style_tips": "포근한 베이지 컬러와 화사한 데님의 조합은 이성에게 가장 호감을 주기 좋은 부드러운 분위기를 만듭니다.",
                "file_path": "demo_ref_2"
            },
            {
                "gender": "Man",
                "style_name": "한겨울 캐주얼 시티룩",
                "category_combination": "아우터 + 상의 + 하의",
                "color_combination": "블랙 패딩 + 베이지 니트 + 블루 청바지",
                "mood": "실용적이면서도 스타일을 잃지 않는 보온 무드",
                "season": "겨울",
                "style_tips": "패딩이 블랙으로 무겁기 때문에, 내부 이너는 밝은 베이지 니트를 활용해 밸런스를 맞추는 것이 좋습니다.",
                "file_path": "demo_ref_3"
            },
            {
                "gender": "Woman",
                "style_name": "페미닌 포멀 오피스룩",
                "category_combination": "아우터 + 상의 + 하의",
                "color_combination": "네이비 블레이저 + 화이트 셔츠 + 블랙 슬랙스",
                "mood": "세련되고 격식 있는 커리어우먼 무드",
                "season": "봄, 가을",
                "style_tips": "자켓을 어깨에 살짝 걸치거나 슬랙스 기장을 복사뼈 정도로 맞추면 다리가 길어 보입니다.",
                "file_path": "demo_ref_4"
            }
        ]
        save_db(ref_db, REF_DB_PATH)

    # 데모용 내 옷장 DB 구축
    closet_db = load_db(CLOSET_DB_PATH)
    if not closet_db:
        closet_db = [
            {
                "id": "demo_blazer_001",
                "category": "아우터",
                "detail": "클래식 싱글 블레이저",
                "color": "네이비",
                "season": "봄, 가을",
                "style": "포멀",
                "file_path": img_blazer,
                "gender": "Man"
            },
            {
                "id": "demo_shirt_001",
                "category": "상의",
                "detail": "옥스퍼드 기본 셔츠",
                "color": "화이트",
                "season": "봄, 가을",
                "style": "포멀",
                "file_path": img_shirt,
                "gender": "Man"
            },
            {
                "id": "demo_slacks_001",
                "category": "하의",
                "detail": "스트레이트 슬림 슬랙스",
                "color": "블랙",
                "season": "봄, 가을, 겨울",
                "style": "포멀",
                "file_path": img_slacks,
                "gender": "Man"
            },
            {
                "id": "demo_knit_001",
                "category": "상의",
                "detail": "라운드넥 케이블 니트",
                "color": "베이지",
                "season": "봄, 가을, 겨울",
                "style": "캐주얼",
                "file_path": img_knit,
                "gender": "Man"
            },
            {
                "id": "demo_jeans_001",
                "category": "하의",
                "detail": "테이퍼드 중청 청바지",
                "color": "블루",
                "season": "봄, 가을, 겨울",
                "style": "캐주얼",
                "file_path": img_jeans,
                "gender": "Man"
            },
            {
                "id": "demo_padding_001",
                "category": "아우터",
                "detail": "숏 오버핏 패딩",
                "color": "블랙",
                "season": "겨울",
                "style": "캐주얼",
                "file_path": img_padding,
                "gender": "Man"
            }
        ]
        for item in closet_db:
            cat_code, tags = generate_sql_compatible_fields(
                item.get("gender", "공용"),
                item.get("detail", ""),
                item.get("color", ""),
                item.get("season", ""),
                item.get("style", "")
            )
            item["category_code"] = cat_code
            item["style_tags"] = tags
        save_db(closet_db, CLOSET_DB_PATH)

    # 데모용 구매 후보 DB 구축
    shopping_db = load_db(SHOPPING_DB_PATH)
    if not shopping_db:
        shopping_db = [
            {
                "id": "demo_wish_coat_001",
                "category": "아우터",
                "detail": "[후보] 멜톤 울 오버 브라운 코트",
                "color": "브라운",
                "season": "겨울",
                "style": "캐주얼",
                "file_path": img_wish_coat,
                "gender": "공용",
                "brand": "무신사 스탠다드",
                "price": 129000,
                "url": "https://www.musinsa.com"
            },
            {
                "id": "demo_wish_blazer_001",
                "category": "아우터",
                "detail": "[후보] 캐시미어 싱글 베이지 블레이저",
                "color": "베이지",
                "season": "봄, 가을",
                "style": "포멀",
                "file_path": img_wish_blazer,
                "gender": "공용",
                "brand": "자라(ZARA)",
                "price": 89000,
                "url": "https://www.zara.com"
            }
        ]
        for item in shopping_db:
            cat_code, tags = generate_sql_compatible_fields(
                item.get("gender", "공용"),
                item.get("detail", ""),
                item.get("color", ""),
                item.get("season", ""),
                item.get("style", "")
            )
            item["category_code"] = cat_code
            item["style_tags"] = tags
        save_db(shopping_db, SHOPPING_DB_PATH)


def generate_sql_compatible_fields(gender, detail, color, season, style):
    """성별, 상세명, 색상, 계절, 스타일명을 RDBMS schema.sql 규격(category_code, style_tags)에 맞추어 변환"""
    g_pref = "M"
    if gender in ["Woman", "여성"]:
        g_pref = "F"
        
    style_lower = style.lower() if style else ""
    theme = "CAMPUS"
    
    if any(k in style_lower for k in ["스포티", "애슬레저", "스트릿", "sport", "street", "athleisure"]):
        theme = "STREET"
    elif any(k in style_lower for k in ["놈코어", "라운지", "리조트", "normcore", "lounge", "resort"]):
        theme = "MINIMAL"
    elif any(k in style_lower for k in ["포멀", "클래식", "오피스", "formal", "classic", "office"]):
        theme = "OFFICE"
    elif any(k in style_lower for k in ["페미닌", "캐주얼", "romantic", "casual"]):
        theme = "CAMPUS"
        
    category_code = f"{g_pref}_{theme}"
    
    translation = {
        "상의": "top", "하의": "bottom", "아우터": "outer", "원피스": "dress",
        "블랙": "black", "화이트": "white", "네이비": "navy", "베이지": "beige",
        "그레이": "grey", "브라운": "brown", "블루": "blue", "레드": "red",
        "그린": "green", "옐로우": "yellow", "핑크": "pink",
        "봄": "spring", "여름": "summer", "가을": "autumn", "겨울": "winter",
        "사계절": "all-season", "포멀": "formal", "캐주얼": "casual",
        "스포츠": "sporty", "라운지웨어": "loungewear"
    }
    
    tags = []
    detail_lower = detail.lower() if detail else ""
    if "셔츠" in detail_lower or "shirt" in detail_lower:
        tags.append("shirt")
    if "티셔츠" in detail_lower or "t-shirt" in detail_lower:
        tags.append("t-shirt")
    if "니트" in detail_lower or "knit" in detail_lower:
        tags.append("knit")
    if "청바지" in detail_lower or "데님" in detail_lower or "jean" in detail_lower:
        tags.append("denim")
    if "슬랙스" in detail_lower or "slacks" in detail_lower:
        tags.append("slacks")
    if "자켓" in detail_lower or "재킷" in detail_lower or "jacket" in detail_lower:
        tags.append("jacket")
    if "코트" in detail_lower or "coat" in detail_lower:
        tags.append("coat")
    if "패딩" in detail_lower or "padding" in detail_lower:
        tags.append("padding")
        
    for key, val in translation.items():
        if color and key in color:
            tags.append(val)
        if season and key in season:
            tags.append(val)
        if style and key in style:
            tags.append(val)
            
    unique_tags = []
    for t in tags:
        if t not in unique_tags:
            unique_tags.append(t)
            
    if not unique_tags:
        unique_tags = ["item"]
        
    style_tags = ", ".join(unique_tags)
    return category_code, style_tags


def migrate_existing_data_to_sql_format():
    """기존 JSON 파일에 category_code 와 style_tags가 누락되어 있으면 보완"""
    # 1. 내 옷장
    closet_db = load_db(CLOSET_DB_PATH)
    closet_updated = False
    for item in closet_db:
        if "category_code" not in item or "style_tags" not in item:
            cat_code, tags = generate_sql_compatible_fields(
                item.get("gender", "공용"),
                item.get("detail", ""),
                item.get("color", ""),
                item.get("season", ""),
                item.get("style", "")
            )
            item["category_code"] = item.get("category_code", cat_code)
            item["style_tags"] = item.get("style_tags", tags)
            closet_updated = True
    if closet_updated:
        save_db(closet_db, CLOSET_DB_PATH)
        
    # 2. 구매 후보
    shopping_db = load_db(SHOPPING_DB_PATH)
    shopping_updated = False
    for item in shopping_db:
        if "category_code" not in item or "style_tags" not in item:
            cat_code, tags = generate_sql_compatible_fields(
                item.get("gender", "공용"),
                item.get("detail", ""),
                item.get("color", ""),
                item.get("season", ""),
                item.get("style", "")
            )
            item["category_code"] = item.get("category_code", cat_code)
            item["style_tags"] = item.get("style_tags", tags)
            shopping_updated = True
    if shopping_updated:
        save_db(shopping_db, SHOPPING_DB_PATH)
        
    return closet_updated or shopping_updated
