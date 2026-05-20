import unittest
import sys
from pathlib import Path
from unittest.mock import patch

# Add root folder to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from core.recommender import recommend_outfit

class TestRecommendOptions(unittest.TestCase):
    
    @patch('core.recommender.load_db')
    def test_tpo_mood_filtering(self, mock_load_db):
        # Mock databases
        mock_ref = [
            {
                "gender": "Woman",
                "style_name": "오피스 미니멀 스타일",
                "category_combination": "상의 + 하의",
                "color_combination": "블랙 계열",
                "mood": "단정한 오피스룩, 포멀 스타일",
                "season": "봄, 가을",
                "style_tips": "포멀한 셔츠 매치"
            },
            {
                "gender": "Woman",
                "style_name": "스포티 데일리 룩",
                "category_combination": "상의 + 하의",
                "color_combination": "그레이 계열",
                "mood": "편안한 애슬레저 놈코어 스포티",
                "season": "여름",
                "style_tips": "편한 후드티"
            }
        ]
        mock_closet = [
            {"id": "item1", "category": "상의", "color": "블랙", "detail": "셔츠", "season": "봄", "style": "포멀"},
            {"id": "item2", "category": "하의", "color": "그레이", "detail": "슬랙스", "season": "봄", "style": "포멀"},
            {"id": "item3", "category": "상의", "color": "화이트", "detail": "티셔츠", "season": "여름", "style": "스포티"}
        ]
        mock_shopping = []
        
        def side_effect(path):
            if "reference" in str(path):
                return mock_ref
            elif "closet" in str(path):
                return mock_closet
            elif "shopping" in str(path):
                return mock_shopping
            return []
            
        mock_load_db.side_effect = side_effect
        
        # Test 1: TPO Mood '오피스 & 격식 (포멀/클래식)'
        user_profile = {"gender": "여성", "tpo": "출근", "body_type": ""}
        result = recommend_outfit(user_profile, "기온 15도", "내 옷장만 추천", tpo_mood="💼 오피스 & 격식 (포멀/클래식)")
        
        self.assertIsNotNone(result.get("selected_reference"))
        self.assertEqual(result["selected_reference"]["style_name"], "오피스 미니멀 스타일")
        self.assertTrue(any("스타일 타겟팅" in r for r in result["reasons"]))
        
        # Test 2: TPO Mood '일상 & 애슬레저 (스포티/놈코어)'
        result_sporty = recommend_outfit(user_profile, "기온 25도", "내 옷장만 추천", tpo_mood="🏃 일상 & 애슬레저 (스포티/놈코어)")
        self.assertEqual(result_sporty["selected_reference"]["style_name"], "스포티 데일리 룩")

    @patch('core.recommender.load_db')
    def test_key_item_lock(self, mock_load_db):
        # Mock databases
        mock_ref = [
            {
                "gender": "Woman",
                "style_name": "기본 코디",
                "category_combination": "상의 + 하의",
                "color_combination": "블랙 계열",
                "mood": "캐주얼",
                "season": "봄, 가을",
                "style_tips": "팁"
            }
        ]
        mock_closet = [
            {"id": "item_top_white", "category": "상의", "color": "화이트", "detail": "셔츠", "season": "봄", "style": "포멀"},
            {"id": "item_top_black", "category": "상의", "color": "블랙", "detail": "블라우스", "season": "봄", "style": "포멀"},
            {"id": "item_bottom_grey", "category": "하의", "color": "그레이", "detail": "슬랙스", "season": "봄", "style": "포멀"}
        ]
        mock_shopping = []
        
        def side_effect(path):
            if "reference" in str(path):
                return mock_ref
            elif "closet" in str(path):
                return mock_closet
            elif "shopping" in str(path):
                return mock_shopping
            return []
            
        mock_load_db.side_effect = side_effect
        
        user_profile = {"gender": "여성", "tpo": "테스트", "body_type": ""}
        
        # Lock item_top_white (even though ref color combination is black, we force item_top_white)
        result = recommend_outfit(
            user_profile, 
            "기온 15도", 
            "내 옷장만 추천", 
            fixed_item_id="item_top_white"
        )
        
        recommended_item_ids = [item.get("id") for item in result["items"]]
        self.assertIn("item_top_white", recommended_item_ids)
        self.assertNotIn("item_top_black", recommended_item_ids)
        
        # Check reasons include the key item badge
        self.assertTrue(any("고정 아이템 매칭" in r for r in result["reasons"]))

    @patch('core.recommender.load_db')
    def test_additional_five_conditions(self, mock_load_db):
        # Mock databases
        mock_ref = [
            {
                "gender": "Woman",
                "style_name": "미니멀 시크 룩",
                "category_combination": "상의 + 하의 + 아우터",
                "color_combination": "블랙 계열",
                "mood": "깔끔하고 세련된 미니멀 분위기",
                "season": "봄, 가을",
                "style_tips": "포멀 자켓 매치"
            },
            {
                "gender": "Woman",
                "style_name": "러블리 로맨틱 룩",
                "category_combination": "상의 + 하의",
                "color_combination": "화이트 계열",
                "mood": "로맨틱 페미닌 러블리 데이트",
                "season": "여름",
                "style_tips": "로맨틱 스커트"
            }
        ]
        mock_closet = [
            {"id": "c1", "category": "상의", "color": "화이트", "detail": "레이스 블라우스", "season": "여름", "style": "로맨틱"},
            {"id": "c2", "category": "하의", "color": "레드", "detail": "스커트", "season": "여름", "style": "로맨틱"},
            {"id": "c3", "category": "하의", "color": "블랙", "detail": "슬랙스", "season": "봄", "style": "미니멀"},
            {"id": "c4", "category": "아우터", "color": "그레이", "detail": "자켓", "season": "봄", "style": "포멀"}
        ]
        mock_shopping = []

        def side_effect(path):
            if "reference" in str(path):
                return mock_ref
            elif "closet" in str(path):
                return mock_closet
            elif "shopping" in str(path):
                return mock_shopping
            return []
            
        mock_load_db.side_effect = side_effect
        user_profile = {"gender": "여성", "tpo": "데이트", "body_type": ""}

        # 1. 원하는 분위기: 미니멀 -> 미니멀 시크 룩 선택
        res_mood = recommend_outfit(user_profile, "기온 15도", "내 옷장만 추천", desired_mood="미니멀")
        self.assertEqual(res_mood["selected_reference"]["style_name"], "미니멀 시크 룩")

        # 2. 선호 색상: 블랙 -> 블랙 슬랙스 매칭 우선
        # 피하고 싶은 것: 레드 색상 -> 레드 스커트 기피 처리
        res_color_avoid = recommend_outfit(
            user_profile, 
            "기온 15도", 
            "내 옷장만 추천", 
            preferred_color="블랙", 
            avoid_options=["레드 색상"]
        )
        recommended_ids = [i["id"] for i in res_color_avoid["items"]]
        self.assertIn("c3", recommended_ids)
        self.assertNotIn("c2", recommended_ids)

        # 3. 피하고 싶은 것: 아우터 제외 -> 아우터 카테고리 매치에서 탈락
        res_outer_avoid = recommend_outfit(
            user_profile, 
            "기온 15도", 
            "내 옷장만 추천", 
            avoid_options=["아우터 제외"]
        )
        recommended_categories = [i["category"] for i in res_outer_avoid["items"]]
        self.assertNotIn("아우터", recommended_categories)

        # 4. 폴백 체크: 피하고 싶은 것에 '그레이 색상'을 넣었으나, 아우터 후보가 그레이뿐인 경우
        res_fallback = recommend_outfit(
            user_profile,
            "기온 15도",
            "내 옷장만 추천",
            avoid_options=["그레이 색상"]
        )
        self.assertTrue(any("기피 조건을 피하면 매칭할 의상이 없어" in w for w in res_fallback["warnings"]))
        fallback_ids = [i["id"] for i in res_fallback["items"]]
        self.assertIn("c4", fallback_ids)

    @patch('core.recommender.load_db')
    def test_unmet_conditions_feedback(self, mock_load_db):
        # Mock databases where we don't have suitable matching clothes for desired mood and color
        mock_ref = [
            {
                "gender": "Woman",
                "style_name": "스포티 데일리 룩",
                "category_combination": "상의 + 하의",
                "color_combination": "그레이 계열",
                "mood": "캐주얼",
                "season": "여름",
                "style_tips": "팁"
            }
        ]
        mock_closet = [
            {"id": "c1", "category": "상의", "color": "화이트", "detail": "티셔츠", "season": "여름", "style": "캐주얼"},
            {"id": "c2", "category": "하의", "color": "그레이", "detail": "숏팬츠", "season": "여름", "style": "캐주얼"}
        ]
        mock_shopping = []

        def side_effect(path):
            if "reference" in str(path):
                return mock_ref
            elif "closet" in str(path):
                return mock_closet
            elif "shopping" in str(path):
                return mock_shopping
            return []
            
        mock_load_db.side_effect = side_effect
        user_profile = {"gender": "여성", "tpo": "일상", "body_type": ""}

        # 1. 원하는 분위기 '포멀/클래식' -> 없으므로 unmet에 들어가야 함
        # 2. 선호 색상 '블루' -> 없으므로 unmet에 들어가야 함
        result = recommend_outfit(
            user_profile, 
            "기온 25도", 
            "내 옷장만 추천",
            desired_mood="포멀/클래식",
            preferred_color="블루"
        )

        unmet_types = [u["type"] for u in result["unmet_conditions"]]
        self.assertIn("desired_mood", unmet_types)
        self.assertIn("preferred_color", unmet_types)

        suggestions_categories = [s["category"] for s in result["complementary_suggestions"]]
        self.assertIn("아우터", suggestions_categories)

    @patch('core.recommender.load_db')
    def test_unmet_conditions_slash_handling(self, mock_load_db):
        mock_ref = [
            {
                "gender": "Woman",
                "style_name": "클래식 오피스 룩",
                "category_combination": "상의 + 하의",
                "color_combination": "블랙 계열",
                "mood": "단정하고 깔끔한 분위기",
                "season": "여름",
                "style_tips": "팁"
            }
        ]
        mock_closet = [
            {"id": "c1", "category": "상의", "color": "화이트", "detail": "티셔츠", "season": "여름", "style": "클래식"},
            {"id": "c2", "category": "하의", "color": "블랙", "detail": "슬랙스", "season": "여름", "style": "클래식"}
        ]
        mock_shopping = []

        def side_effect(path):
            if "reference" in str(path):
                return mock_ref
            elif "closet" in str(path):
                return mock_closet
            elif "shopping" in str(path):
                return mock_shopping
            return []
            
        mock_load_db.side_effect = side_effect
        user_profile = {"gender": "여성", "tpo": "일상", "body_type": ""}

        # '포멀/클래식' contains '클래식', which is in style_name '클래식 오피스 룩'.
        # Therefore, desired_mood should NOT be in unmet_conditions.
        result = recommend_outfit(
            user_profile, 
            "기온 25도", 
            "내 옷장만 추천",
            desired_mood="포멀/클래식"
        )

        unmet_types = [u["type"] for u in result["unmet_conditions"]]
        self.assertNotIn("desired_mood", unmet_types)


if __name__ == "__main__":
    unittest.main()
