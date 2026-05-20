import json
import re
from pathlib import Path
from config import REF_DB_PATH, CLOSET_DB_PATH, SHOPPING_DB_PATH
from core.analyzer import load_db

def parse_weather(weather_text):
    """날씨/기온 텍스트를 파싱하여 수치화된 상태 딕셔너리 반환"""
    temp_match = re.search(r'(영하\s*)?(-?\d+)도?', weather_text)
    temp = 15 # 기본값
    if temp_match:
        val = int(temp_match.group(2))
        if temp_match.group(1) or val < 0:
            temp = -abs(val)
        else:
            temp = val
            
    is_cold = temp < 10 or any(k in weather_text for k in ["춥", "쌀쌀", "겨울", "눈", "바람", "서늘"])
    is_hot = temp > 25 or any(k in weather_text for k in ["덥", "여름", "폭염", "뜨거운"])
    
    # 기온별 세부 구간 분류
    if temp <= 4:
        temp_group = "freezing_winter"  # 한겨울 (4도 이하)
    elif 5 <= temp <= 9:
        temp_group = "early_winter"     # 초겨울/늦가을 (5~9도)
    elif 10 <= temp <= 16:
        temp_group = "mild_season"      # 선선한 간절기 (10~16도)
    elif 17 <= temp <= 22:
        temp_group = "warm_season"      # 따뜻한 봄가을 (17~22도)
    elif 23 <= temp <= 27:
        temp_group = "early_summer"     # 초여름 (23~27도)
    else:
        temp_group = "hot_summer"       # 한여름 (28도 이상)
        
    return {
        "temperature": temp,
        "temp_group": temp_group,
        "outer_required": temp < 18,
        "warmth_level": "High" if is_cold else "Low" if is_hot else "Medium",
        "rain_safe": "비" not in weather_text and "폭우" not in weather_text
    }

def is_color_match(item_color, ref_color):
    """색상 궁합 배색표 적용 로직"""
    if not item_color or not ref_color:
        return False
    if item_color == ref_color or item_color in ref_color or ref_color in item_color:
        return True
        
    rules = {
        "네이비": ["화이트", "그레이", "베이지", "블루"],
        "블랙": ["그레이", "화이트", "베이지", "레드"],
        "베이지": ["브라운", "네이비", "화이트", "블랙"],
        "그레이": ["블랙", "화이트", "네이비", "블루"],
        "화이트": ["네이비", "블랙", "베이지", "그레이", "브라운"],
        "브라운": ["베이지", "화이트", "블랙", "네이비"]
    }
    
    for key_color, matches in rules.items():
        if key_color in ref_color and any(m in item_color for m in matches):
            return True
            
    return False

def recommend_outfit(
    user_profile: dict, 
    weather_info: str, 
    recommend_mode: str = "내 옷장만 추천", 
    tpo_mood: str = "전체 (자동 분류)", 
    fixed_item_id: str = None,
    desired_mood: str = "선택 안 함",
    formality_level: str = "선택 안 함",
    preferred_color: str = "선택 안 함",
    avoid_options: list = None,
    activity_level: str = "선택 안 함"
) -> dict:
    """
    사용자의 상황에 맞춰 스타일 교과서의 룰북을 실시간 스캔한 뒤,
    선택된 추천 모드(내 옷장만 추천, 구매 후보만으로 가상 코디, 내 옷장 + 구매 후보 믹스 추천)에 따라
    최적의 믹스매칭 코디를 생성하고 구매 후보 의류에 대한 구매 추천 판단을 제공합니다.
    """
    if avoid_options is None:
        avoid_options = []
    ref_db = load_db(REF_DB_PATH)
    closet_db = load_db(CLOSET_DB_PATH)
    shopping_db = load_db(SHOPPING_DB_PATH)
    
    # 모드별 의류 데이터셋 검증
    if (recommend_mode == "내 옷장만 추천" or recommend_mode == "owned_only") and not closet_db:
        return {"error": "현재 내 디지털 옷장이 비어 있습니다. '내 진짜 옷장' 탭에서 이미지를 추가하고 스캔해주세요."}
    elif (recommend_mode == "구매 후보만으로 가상 코디" or recommend_mode == "wishlist_only") and not shopping_db:
        return {"error": "구매 후보 옷장이 비어 있습니다. '구매 후보' 탭에서 사고 싶은 옷 이미지를 추가하고 스캔해주세요."}
    elif (recommend_mode == "내 옷장 + 구매 후보 믹스 추천" or recommend_mode == "owned_plus_wishlist") and not closet_db and not shopping_db:
        return {"error": "내 옷장과 구매 후보 옷장이 모두 비어 있습니다. 이미지를 등록해주세요."}
        
    gender = user_profile.get('gender', '여성')
    tpo = user_profile.get('tpo', '')
    body_type = user_profile.get('body_type', '')
    
    # 고정 아이템 검색
    fixed_item = None
    if fixed_item_id:
        for item in closet_db + shopping_db:
            if item.get("id") == fixed_item_id:
                fixed_item = item
                break
                
    # 1. 날씨 파싱
    weather_data = parse_weather(weather_info)
    gender_eng = "Man" if gender == "남성" else "Woman"
    
    # 2. 스타일 교과서 스코어링 (TPO 및 날씨)
    gender_styles = [item for item in ref_db if item.get("gender") == gender_eng]
    if not gender_styles:
        gender_styles = ref_db
        
    best_ref = None
    max_score = -1
    
    for ref in gender_styles:
        score = 0
        ref_text = f"{ref.get('style_name', '')} {ref.get('category_combination', '')} {ref.get('mood', '')} {ref.get('style_tips', '')}".lower()
        
        # TPO 카테고리화 정밀 매칭
        tpo_lower = tpo.lower()
        if any(k in tpo_lower for k in ["데이트", "소개팅", "기념일"]) and any(k in ref_text for k in ["로맨틱", "데이트", "클래식", "포멀", "romantic"]):
            score += 8
        elif any(k in tpo_lower for k in ["출근", "면접", "미팅", "비즈니스"]) and any(k in ref_text for k in ["포멀", "클래식", "오피스", "놈코어", "normcore"]):
            score += 10
        elif any(k in tpo_lower for k in ["운동", "등산", "러닝"]) and any(k in ref_text for k in ["스포티브", "애슬레저"]):
            score += 10
        elif any(k in tpo_lower for k in ["여행", "바다", "휴양"]) and any(k in ref_text for k in ["리조트", "캐주얼"]):
            score += 8
        elif any(k in tpo_lower for k in ["집", "휴식", "카페", "동네"]) and any(k in ref_text for k in ["라운지웨어", "놈코어", "캐주얼"]):
            score += 7
            
        # 수동 TPO 무드 조건 매핑 (+30점 가중치)
        if tpo_mood != "전체 (자동 분류)":
            if "오피스" in tpo_mood:
                # "놈코어"가 비즈니스 캐주얼에 최적
                if any(m in ref_text for m in ["놈코어", "normcore"]) or any(m in ref_text for m in ["자켓", "코트", "셔츠", "슬랙스"]):
                    score += 30
            elif "데이트" in tpo_mood:
                if any(m in ref_text for m in ["로맨틱", "romantic", "캐주얼", "casual"]):
                    score += 30
            elif "일상" in tpo_mood:
                if any(m in ref_text for m in ["캐주얼", "casual", "놈코어", "스포티", "애슬레저", "홈앤라운지"]):
                    score += 30
            elif "여행" in tpo_mood:
                if any(m in ref_text for m in ["리조트", "레트로", "retro", "스포티"]):
                    score += 30
                
        # [신규] 원하는 분위기 가중치 (+15)
        if desired_mood != "선택 안 함":
            if desired_mood == "캐주얼":
                if any(k in ref_text for k in ["캐주얼", "casual", "원마일", "스포티"]):
                    score += 15
            elif desired_mood == "스트릿":
                if any(k in ref_text for k in ["스포티", "레트로", "점퍼", "청바지"]):
                    score += 15
            elif desired_mood == "포멀/클래식":
                if any(k in ref_text for k in ["놈코어", "normcore"]) and any(k in ref_text for k in ["자켓", "코트", "슬랙스", "셔츠"]):
                    score += 15
            elif desired_mood == "미니멀":
                if any(k in ref_text for k in ["놈코어", "normcore"]):
                    score += 15
            elif desired_mood == "로맨틱/페미닌":
                if any(k in ref_text for k in ["로맨틱", "romantic", "원피스", "스커트"]):
                    score += 15
            elif desired_mood == "레트로":
                if any(k in ref_text for k in ["레트로", "retro"]):
                    score += 15
                
        # [신규] 격식 정도 가중치 (+15)
        if formality_level != "선택 안 함":
            if "높음" in formality_level:
                # 놈코어 무드에 단정하고 격식 있는 아우터가 조합된 경우
                if any(k in ref_text for k in ["놈코어", "normcore"]) and any(k in ref_text for k in ["자켓", "코트", "블레이저", "셔츠", "슬랙스"]):
                    score += 15
            elif "보통" in formality_level:
                if any(k in ref_text for k in ["놈코어", "캐주얼"]) and not any(k in ref_text for k in ["스포티", "애슬레저", "홈앤라운지"]):
                    score += 15
            elif "낮음" in formality_level:
                if any(k in ref_text for k in ["스포티", "애슬레저", "홈앤라운지", "레트로"]):
                    score += 15

        # [신규] 활동량 가중치 (+15)
        if activity_level != "선택 안 함":
            if "높음" in activity_level:
                if any(k in ref_text for k in ["스포티", "애슬레저", "캐주얼"]):
                    score += 15
            elif "낮음" in activity_level:
                # 정적이고 단정한 분위기
                if any(k in ref_text for k in ["놈코어", "로맨틱"]) or any(k in ref_text for k in ["자켓", "코트", "슬랙스"]):
                    score += 15
            
        # 단순 키워드 추가 점수
        for keyword in tpo.split():
            if len(keyword) > 1 and keyword.lower() in ref_text:
                score += 3
                
        # 날씨 기반 매칭 (기온별 세부 매칭)
        ref_season = ref.get("season", "")
        temp_group = weather_data["temp_group"]
        
        if temp_group == "freezing_winter":  # 한겨울 (4도 이하)
            if "패딩" in ref_text or "코트" in ref_text:
                score += 15
            if "사계절" in ref_season:
                score += 5
            # 가벼운 의상이나 여름 스타일은 감점
            if not any(k in ref_text for k in ["패딩", "코트", "점퍼"]):
                score -= 15
        elif temp_group == "early_winter":  # 초겨울/늦가을 (5~9도)
            if any(k in ref_text for k in ["코트", "점퍼", "자켓", "가디건"]):
                score += 12
            if "사계절" in ref_season or "봄, 가을" in ref_season:
                score += 5
        elif temp_group == "mild_season":  # 선선한 간절기 (10~16도)
            if any(k in ref_text for k in ["자켓", "가디건", "점퍼", "트렌치"]):
                score += 10
            if "봄, 가을" in ref_season or "사계절" in ref_season:
                score += 5
            if "패딩" in ref_text:  # 너무 더운 옷 감점
                score -= 10
        elif temp_group == "warm_season":  # 따뜻한 봄가을 (17~22도)
            if "봄, 가을" in ref_season or "사계절" in ref_season:
                score += 10
            if any(k in ref_text for k in ["패딩", "코트"]):
                score -= 15
        elif temp_group == "early_summer":  # 초여름 (23~27도)
            if "봄, 여름, 가을" in ref_season or "사계절" in ref_season:
                score += 10
            if any(k in ref_text for k in ["패딩", "코트", "자켓"]):
                score -= 20
        elif temp_group == "hot_summer":  # 한여름 (28도 이상)
            if "봄, 여름, 가을" in ref_season:
                score += 15
            if any(k in ref_text for k in ["패딩", "코트", "자켓", "점퍼", "가디건"]):
                score -= 30
                
        if score > max_score:
            max_score = score
            best_ref = ref
            
    if not best_ref and gender_styles:
        best_ref = gender_styles[0]
        
    # 3. 매칭 대상 의상 풀 구성 (속성 마킹)
    closet_pool = [{**item, "is_shopping_candidate": False} for item in closet_db]
    shopping_pool = [{**item, "is_shopping_candidate": True} for item in shopping_db]
    
    is_mix_mode = recommend_mode in ["내 옷장 + 구매 후보 믹스 추천", "owned_plus_wishlist"]
    
    if recommend_mode in ["내 옷장만 추천", "owned_only"]:
        search_pool = closet_pool
    elif recommend_mode in ["구매 후보만으로 가상 코디", "wishlist_only"]:
        search_pool = shopping_pool
    else: # 믹스 조합
        search_pool = closet_pool + shopping_pool
        
    recommended_items = []
    warnings_list = []
    
    if best_ref:
        ref_comb = best_ref.get("category_combination", "")
        ref_color_comb = best_ref.get("color_combination", "")
        ref_color = ref_color_comb.replace(" 계열", "")
        
        # 고정 아이템이 존재할 경우 해당 색상을 매치 기준으로 선점
        if fixed_item and fixed_item.get("color"):
            ref_color = fixed_item.get("color")
            
        # 카테고리 분리
        pool_by_category = {}
        for item in search_pool:
            cat = item.get("category", "미분류")
            if cat not in pool_by_category:
                pool_by_category[cat] = []
            pool_by_category[cat].append(item)
            
        target_categories = []
        if any(k in ref_comb for k in ["셔츠", "블라우스", "티셔츠", "니트", "니트웨어", "탑", "상의"]):
            target_categories.append("상의")
        if any(k in ref_comb for k in ["스커트", "치마", "바지", "팬츠", "청바지", "슬랙스", "하의"]):
            target_categories.append("하의")
        if any(k in ref_comb for k in ["재킷", "자켓", "가디건", "베스트", "코트", "점퍼", "패딩", "아우터"]):
            target_categories.append("아우터")
        if any(k in ref_comb for k in ["드레스", "원피스"]):
            target_categories.append("원피스")
            
        # [신규 기피 대상 제외] 아우터/원피스 제외 옵션 필터링
        if avoid_options:
            if "아우터 제외" in avoid_options and "아우터" in target_categories:
                target_categories.remove("아우터")
            if "원피스 제외" in avoid_options and "원피스" in target_categories:
                target_categories.remove("원피스")
            
        if not target_categories:
            target_categories = ["상의", "하의"]
            if weather_data["outer_required"] and "아우터 제외" not in avoid_options:
                target_categories.insert(0, "아우터")
                
        if weather_data["outer_required"] and "아우터" not in target_categories and "아우터 제외" not in avoid_options:
            target_categories.insert(0, "아우터")
            
        # 아이템 매칭
        fixed_item_category = fixed_item.get("category") if fixed_item else None
        
        for cat in target_categories:
            if fixed_item and cat == fixed_item_category:
                # 고정 옷 강제 삽입
                matched_item = dict(fixed_item)
                original_pool_item = next((item for item in search_pool if item.get("id") == fixed_item_id), None)
                if original_pool_item:
                    matched_item["is_shopping_candidate"] = original_pool_item["is_shopping_candidate"]
                else:
                    in_shopping = any(x.get("id") == fixed_item_id for x in shopping_db)
                    matched_item["is_shopping_candidate"] = in_shopping
                    
                if matched_item not in recommended_items:
                    recommended_items.append(matched_item)
                continue
                
            candidates = pool_by_category.get(cat, [])
            if not candidates:
                warnings_list.append(f"의상 풀(Pool)에 '{cat}' 카테고리 의상이 부족합니다.")
                continue
                
            # [신규 기피 대상 제외] 피하고 싶은 색상 또는 품목 필터링
            filtered_candidates = []
            for cand in candidates:
                cand_color = cand.get("color", "")
                cand_detail = cand.get("detail", "")
                
                # 색상 기피 필터링
                color_avoid = False
                if avoid_options:
                    for opt in avoid_options:
                        if "색상" in opt:
                            avoid_color = opt.replace(" 색상", "")
                            if avoid_color in cand_color:
                                color_avoid = True
                                break
                        if "스커트 제외" in opt and (any(k in cand_detail for k in ["스커트", "치마"]) or "스커트" in cand.get("category", "")):
                            color_avoid = True
                            break
                            
                if not color_avoid:
                    filtered_candidates.append(cand)
                    
            # 필터 결과 의상이 0벌인 경우, 일반 폴백(기피 조건 무시하고 진행) 적용
            if not filtered_candidates:
                if avoid_options:
                    warnings_list.append(f"⚠️ [기피 옵션] '{cat}'에서 기피 조건을 피하면 매칭할 의상이 없어 부득이하게 조건을 해제했습니다.")
                filtered_candidates = candidates
                
            best_item = None
            highest_item_score = -1
            
            for cand in filtered_candidates:
                item_score = 0
                cand_color = cand.get("color", "")
                cand_detail = cand.get("detail", "")
                is_candidate = cand.get("is_shopping_candidate", False)
                
                 # 색상 궁합 점수
                if is_color_match(cand_color, ref_color):
                    item_score += 10
                    
                # 계절 및 날씨 적합성 판단 및 점수 반영 (최대 +30점 가중치로 계절 무결성 보장)
                cand_season = cand.get("season", "")
                temp_group = weather_data["temp_group"]
                
                if temp_group == "freezing_winter":  # 한겨울 (4도 이하)
                    if "겨울" in cand_season or "사계절" in cand_season:
                        item_score += 20
                    # 아우터일 때 특히 패딩/헤비코트에 특화 가점
                    if cat == "아우터":
                        if any(k in cand_detail for k in ["패딩", "헤비다운", "다운", "무스탕", "헤비"]):
                            item_score += 30
                        elif any(k in cand_detail for k in ["코트", "울코트"]):
                            item_score += 25
                        elif any(k in cand_detail for k in ["가디건", "자켓", "블레이저", "바람막이"]):
                            item_score -= 15  # 얇은 아우터 감점
                    elif cat == "상의":
                        if any(k in cand_detail for k in ["니트", "목폴라", "기모", "터틀넥", "스웨터"]):
                            item_score += 15
                        if any(k in cand_detail for k in ["반팔", "민소매", "시스루"]):
                            item_score -= 20
                    if "여름" in cand_season:
                        item_score -= 30
                        
                elif temp_group == "early_winter":  # 초겨울/늦가을 (5~9도)
                    if "겨울" in cand_season or "봄, 가을" in cand_season or "사계절" in cand_season:
                        item_score += 15
                    if cat == "아우터":
                        if any(k in cand_detail for k in ["코트", "울코트"]):
                            item_score += 25
                        elif any(k in cand_detail for k in ["패딩", "다운", "경량패딩", "가죽자켓"]):
                            item_score += 20
                    if "여름" in cand_season:
                        item_score -= 30
                        
                elif temp_group == "mild_season":  # 선선한 간절기 (10~16도)
                    if "봄, 가을" in cand_season or "사계절" in cand_season:
                        item_score += 15
                    if cat == "아우터":
                        if any(k in cand_detail for k in ["자켓", "블레이저", "가디건", "트렌치코트", "점퍼", "바람막이"]):
                            item_score += 25
                        elif any(k in cand_detail for k in ["패딩", "헤비다운", "두꺼운 코트"]):
                            item_score -= 20
                    if "겨울" in cand_season or "여름" in cand_season:
                        item_score -= 15
                        
                elif temp_group == "warm_season":  # 따뜻한 봄가을 (17~22도)
                    if "봄, 가을" in cand_season or "사계절" in cand_season:
                        item_score += 15
                    if cat == "아우터":
                        if any(k in cand_detail for k in ["가디건", "자켓", "바람막이"]):
                            item_score += 20
                        elif any(k in cand_detail for k in ["패딩", "코트", "다운"]):
                            item_score -= 30
                    elif cat == "상의":
                        if any(k in cand_detail for k in ["셔츠", "맨투맨", "후드티", "긴팔티"]):
                            item_score += 15
                            
                elif temp_group == "early_summer":  # 초여름 (23~27도)
                    if "여름" in cand_season or "사계절" in cand_season:
                        item_score += 15
                    if any(k in cand_detail for k in ["반팔", "티셔츠", "린넨", "반바지", "시원한"]):
                        item_score += 20
                    if cat == "아우터":
                        item_score -= 25  # 초여름에 아우터는 과함
                    if "겨울" in cand_season or any(k in cand_detail for k in ["패딩", "코트"]):
                        item_score -= 30
                        
                else:  # 한여름 (28도 이상, hot_summer)
                    if "여름" in cand_season:
                        item_score += 20
                    if any(k in cand_detail for k in ["반팔", "민소매", "린넨", "반바지", "숏팬츠"]):
                        item_score += 30
                    if cat == "아우터" or any(k in cand_detail for k in ["패딩", "코트", "긴팔", "니트"]):
                        item_score -= 30

                # [신규] 선호 색상 가치 가중치 (+12)
                if preferred_color != "선택 안 함" and preferred_color in cand_color:
                    item_score += 12
                
                # 믹스 조합 모드일 때 내 옷장 옷(소유한 옷)에 가산점 4점 부여하여 우선 매칭되게 유도
                if is_mix_mode and not is_candidate:
                    item_score += 4
                
                # 체형 보완 점수 적용
                if "하체" in body_type and cat == "하의":
                    if any(c in cand_color for c in ["블랙", "네이비", "다크"]):
                        item_score += 5
                
                if "어깨" in body_type and "좁" in body_type and cat == "아우터":
                    if any(k in cand_detail for k in ["자켓", "블레이저", "코트"]):
                        item_score += 5
                        
                if "키" in body_type and "작" in body_type:
                    if cand_color == ref_color:
                        item_score += 3
                        
                if item_score > highest_item_score:
                    highest_item_score = item_score
                    best_item = cand
                    
            if best_item:
                matched_item = dict(best_item)
                if matched_item not in recommended_items:
                    recommended_items.append(matched_item)
            else:
                warnings_list.append(f"적합한 '{cat}' 의상을 매칭하지 못했습니다.")

    # 4. 구매 후보군 아이템에 대한 "구매 추천 판단" 연산
    for item in recommended_items:
        if item.get("is_shopping_candidate", False):
            # 중복 검사: 내 옷장에 동일 카테고리 + 동일 색상의 옷이 있는지 스캔
            duplicate_count = sum(
                1 for c_item in closet_db
                if c_item.get("category") == item.get("category") and c_item.get("color") == item.get("color")
            )
            
            # 어울리는 옷 개수 연산: 내 옷장의 옷 중 이 후보 색상과 매치되는 옷 개수
            matching_count = sum(
                1 for c_item in closet_db
                if is_color_match(c_item.get("color"), item.get("color"))
            )
            
            # 추천도 스코어링
            if duplicate_count > 0:
                priority = "보류 (중복 우려)"
                reason = (
                    f"어울리는 소장 의상 {matching_count}개 | 중복 의상 {duplicate_count}개\n\n"
                    f"이미 진짜 옷장에 동일한 {item.get('color')} 색상의 {item.get('category')} 의상이 존재하여 중복 구매 우려가 있습니다."
                )
            elif matching_count >= 3:
                priority = "구매 추천 (높음) 🔥"
                reason = (
                    f"어울리는 소장 의상 {matching_count}개 | 중복 의상 {duplicate_count}개\n\n"
                    f"소장하신 옷들과 색상 궁합이 매우 뛰어납니다. 옷장에 겹치지 않는 유니크한 {item.get('color')} {item.get('category')}로서 패션 활용도를 크게 늘려줍니다."
                )
            else:
                priority = "구매 추천 (보통)"
                reason = (
                    f"어울리는 소장 의상 {matching_count}개 | 중복 의상 {duplicate_count}개\n\n"
                    f"색상 매칭은 무난하지만, 어울리는 보유 의상이 {matching_count}개로 다소 제한적이므로 활용도를 조금 더 고려해 보세요."
                )
                
            item["purchase_advice"] = {
                "priority": priority,
                "matching_count": matching_count,
                "duplicate_count": duplicate_count,
                "reason": reason
            }
        else:
            item["purchase_advice"] = None

    # 이유(reasons) 리스트 구성
    reasons_list = [
        f"상황 최적화: 입력하신 TPO({tpo})와 기온({weather_data['temperature']}도)에 부합하는 {best_ref.get('mood', '스타일')} 코디입니다."
    ]
    if tpo_mood != "전체 (자동 분류)":
        reasons_list.append(f"스타일 타겟팅: 지정하신 TPO 분위기 [{tpo_mood}]에 맞춰 추천을 조율했습니다.")
        
    if desired_mood != "선택 안 함":
        reasons_list.append(f"🎯 스타일 타겟팅: 지정하신 무드 [{desired_mood}]를 적용했습니다.")
    if formality_level != "선택 안 함":
        reasons_list.append(f"👔 격식 정도: 격식 [{formality_level}]에 적합한 레퍼런스를 필터링했습니다.")
    if activity_level != "선택 안 함":
        reasons_list.append(f"🏃 활동성 수준: [{activity_level}]에 어울리는 구성을 반영했습니다.")
    if preferred_color != "선택 안 함":
        reasons_list.append(f"🎨 선호 색상 가중치: [{preferred_color}] 계열을 우선 매칭했습니다.")
    if avoid_options:
        reasons_list.append(f"🚫 기피 대상 제외: {', '.join(avoid_options)} 조건을 반영하여 구성했습니다.")
        
    if fixed_item:
        fixed_item_category = fixed_item.get("category")
        fixed_item_color = fixed_item.get("color")
        reasons_list.append(f"📌 고정 아이템 매칭: 오늘 무조건 착용할 [{fixed_item_category}] {fixed_item.get('detail', '')} ({fixed_item_color}) 제품을 필두로 코디 조합을 구성했습니다.")

    # --- 신규: 조건 완화 진단 및 대체 보완 의상 처방 로직 ---
    unmet_conditions = []
    complementary_suggestions = []

    # 1. 원하는 분위기 미충족 판정
    if desired_mood != "선택 안 함":
        ref_mood = best_ref.get("mood", "").lower() if best_ref else ""
        ref_name = best_ref.get("style_name", "").lower() if best_ref else ""
        ref_tips = best_ref.get("style_tips", "").lower() if best_ref else ""
        ref_text_full = f"{ref_mood} {ref_name} {ref_tips}"
        
        # 슬래시 및 공백 분할을 통한 기본 키워드 목록화
        keywords = [k for k in desired_mood.lower().replace("/", " ").split() if len(k) > 0]
        
        # 실제 DB 라벨 매핑 지원을 위한 보조 키워드 동적 확장
        extended_keywords = list(keywords)
        for kw in keywords:
            if kw == "포멀" or kw == "클래식":
                extended_keywords.extend(["놈코어", "normcore"])
            elif kw == "로맨틱" or kw == "페미닌":
                extended_keywords.extend(["romantic"])
            elif kw == "캐주얼":
                extended_keywords.extend(["casual", "원마일"])
            elif kw == "스트릿":
                extended_keywords.extend(["스포티", "레트로"])
            elif kw == "레트로":
                extended_keywords.extend(["retro"])
                
        is_mood_met = any(k in ref_text_full for k in extended_keywords)
            
        if not is_mood_met:
            unmet_conditions.append({
                "type": "desired_mood",
                "label": f"원하는 분위기: {desired_mood}",
                "reason": f"현재 등록된 옷장의 의상 조합 한계로 인해 {desired_mood} 분위기에 적합한 스타일 레퍼런스를 매칭하지 못했습니다."
            })
            # 분위기별 추천 보완 아이템 처방 매핑
            mood_sug = {
                "캐주얼": {"category": "상의", "color": "화이트/그레이", "name": "기본 레터링 티셔츠 또는 스웨트셔츠", "reason": "편안한 캐주얼 분위기를 연출하기 위한 필수 기본 아이템입니다."},
                "스트릿": {"category": "하의", "color": "블랙/데님", "name": "와이드 핏 데님 또는 카고 팬츠", "reason": "힙하고 자유로운 느낌의 스트릿 실루엣을 구성하는 데 유용합니다."},
                "포멀/클래식": {"category": "아우터", "color": "블랙/네이비", "name": "싱글 블레이저 자켓", "reason": "격식 있는 오피스/클래식 스타일의 단정한 뼈대를 잡아주는 핵심 아우터입니다."},
                "미니멀": {"category": "상의", "color": "화이트/블랙", "name": "깔끔한 무지 옥스퍼드 셔츠", "reason": "군더더기 없는 미니멀 룩의 정석이 되는 기본 상의입니다."},
                "로맨틱/페미닌": {"category": "하의/원피스", "color": "베이지/크림", "name": "A라인 스커트 또는 원피스", "reason": "부드럽고 페미닌한 무드를 극대화하는 연출용 의상입니다."},
                "레트로": {"category": "아우터", "color": "브라운/카키", "name": "레더 자켓 또는 체크 남방", "reason": "빈티지하고 개성 있는 레트로 감성을 불어넣어 줄 아우터입니다."}
            }
            sug = mood_sug.get(desired_mood, {"category": "의류 공통", "color": "선택 안 함", "name": f"{desired_mood} 스타일 기본 아이템", "reason": "스타일 분위기 연출을 보완하는 데 도움이 됩니다."})
            complementary_suggestions.append(sug)

    # 2. 선호 색상 미충족 판정
    if preferred_color != "선택 안 함":
        color_found = False
        for item in recommended_items:
            cand_color = item.get("color", "")
            if preferred_color in cand_color:
                color_found = True
                break
        if not color_found:
            unmet_conditions.append({
                "type": "preferred_color",
                "label": f"선호 색상: {preferred_color}",
                "reason": f"현재 옷장이나 구매 후보에 {preferred_color} 계열의 적합한 의상이 없어 코디에 활용하지 못했습니다."
            })
            complementary_suggestions.append({
                "category": "상의 또는 하의",
                "color": preferred_color,
                "name": f"{preferred_color} 색상의 베이직 티셔츠/슬랙스",
                "reason": f"선호하시는 {preferred_color} 계열 코디를 조화롭게 구성하기 위해 보완이 필요한 기본 의류입니다."
            })

    # 3. 기피 대상 조건 강제 해제(Fallback) 판정
    has_avoid_fallback = False
    for w in warnings_list:
        if "기피 조건을 피하면 매칭할 의상이 없어" in w:
            has_avoid_fallback = True
            break

    if has_avoid_fallback:
        unmet_conditions.append({
            "type": "avoid_options",
            "label": f"기피 대상 제외: {', '.join(avoid_options)}",
            "reason": "해당 기피 대상을 제외하면 입을 수 있는 코디 조합이 없어 부득이하게 조건을 해제하고 일반 매칭을 완료했습니다."
        })
        complementary_suggestions.append({
            "category": "의류 공통",
            "color": "무채색/기본색",
            "name": "블랙/그레이 기본 슬랙스 또는 화이트 티셔츠",
            "reason": f"원치 않는 {', '.join(avoid_options)} 스타일을 피하면서도 어떤 상황에나 유연하게 받쳐줄 뉴트럴 대체 아이템입니다."
        })

    return {
        "selected_reference": best_ref,
        "items": recommended_items,
        "score": max_score,
        "reasons": reasons_list,
        "warnings": warnings_list,
        "unmet_conditions": unmet_conditions,
        "complementary_suggestions": complementary_suggestions
    }


def scan_missing_essentials(closet_db):
    """내 옷장 데이터베이스를 분석하여 부족한 필수 아이템과 배색 보완 아이템을 반환합니다."""
    counts = {"상의": 0, "하의": 0, "아우터": 0, "원피스": 0}
    colors = []
    for item in closet_db:
        cat = item.get("category", "미분류")
        if cat in counts:
            counts[cat] += 1
        colors.append(item.get("color", ""))
        
    missing_suggestions = []
    
    # 1. 아우터 부족 체크
    if counts["아우터"] < 1:
        missing_suggestions.append({
            "level": "필수 🚨",
            "category": "아우터",
            "name": "네이비 블레이저 또는 그레이 가디건",
            "reason": "현재 옷장에 아우터가 한 벌도 없습니다. 다양한 TPO에 격식 있게 매칭할 수 있는 기본 아우터가 필요합니다."
        })
    elif counts["아우터"] < 2:
        missing_suggestions.append({
            "level": "추천 💡",
            "category": "아우터",
            "name": "베이지 트렌치코트",
            "reason": "간절기나 데이트룩에 밝은 톤으로 매칭할 수 있는 롱 코트/트렌치코트가 부족합니다."
        })
        
    # 2. 하의 부족 체크
    if counts["하의"] < 2:
        missing_suggestions.append({
            "level": "필수 🚨",
            "category": "하의",
            "name": "블랙 슬랙스 또는 블루 데님 청바지",
            "reason": "하의 가짓수가 매우 적어 코디 하체 실루엣 구성에 제한이 큽니다. 베이직 하의를 추가해 보세요."
        })
        
    # 3. 상의 부족 체크
    if counts["상의"] < 3:
        missing_suggestions.append({
            "level": "필수 🚨",
            "category": "상의",
            "name": "화이트 셔츠 또는 그레이 기본 티셔츠",
            "reason": "기본 레이어링 및 단독 착용을 위한 베이직 상의가 부족합니다."
        })
        
    # 4. 밝은 뉴트럴 톤 부족 체크 (화이트, 베이지, 그레이)
    neutral_count = sum(1 for c in colors if any(n in c for n in ["화이트", "베이지", "그레이"]))
    if neutral_count < 3:
        missing_suggestions.append({
            "level": "추천 💡",
            "category": "신발/의류 공통",
            "name": "화이트 스니커즈 또는 베이지 치노팬츠",
            "reason": "옷장에 밝은 중립색 톤 의류가 부족하여 코디 배색이 너무 어둡거나 획일화될 수 있습니다."
        })
        
    return missing_suggestions

