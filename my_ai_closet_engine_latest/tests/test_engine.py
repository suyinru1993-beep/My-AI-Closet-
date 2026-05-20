import unittest
import sys
from pathlib import Path

# Add root folder to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from core.recommender import scan_missing_essentials, is_color_match, recommend_outfit

class TestCoordinationEngine(unittest.TestCase):
    
    def test_scan_missing_essentials_empty(self):
        # Empty closet should report all essentials missing
        closet = []
        suggestions = scan_missing_essentials(closet)
        
        categories = [s["category"] for s in suggestions]
        self.assertIn("아우터", categories)
        self.assertIn("하의", categories)
        self.assertIn("상의", categories)
        self.assertTrue(any("기본 중립색" in s["reason"] or "밝은 중립색" in s["reason"] for s in suggestions))

    def test_scan_missing_essentials_full(self):
        # Full closet should report no missing essentials
        closet = [
            {"category": "상의", "color": "화이트", "detail": "티셔츠"},
            {"category": "상의", "color": "그레이", "detail": "티셔츠"},
            {"category": "상의", "color": "네이비", "detail": "셔츠"},
            {"category": "하의", "color": "블랙", "detail": "슬랙스"},
            {"category": "하의", "color": "베이지", "detail": "면바지"},
            {"category": "아우터", "color": "그레이", "detail": "가디건"},
            {"category": "아우터", "color": "네이비", "detail": "자켓"}
        ]
        suggestions = scan_missing_essentials(closet)
        
        # Check that essential alerts are not present
        levels = [s["level"] for s in suggestions]
        self.assertNotIn("필수 🚨", levels)

    def test_color_compatibility(self):
        # Test baseline rules
        self.assertTrue(is_color_match("네이비", "베이지"))
        self.assertTrue(is_color_match("블랙", "그레이"))
        self.assertFalse(is_color_match("레드", "그린"))

if __name__ == "__main__":
    unittest.main()
