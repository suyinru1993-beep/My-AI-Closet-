import unittest
import sys
import os
from pathlib import Path

# Add root folder to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from core.analyzer import detect_apparel_by_image_split, sync_reference_styles_local, load_db
from config import REF_DB_PATH, REF_DIR_MAN, REF_DIR_WOMAN

class TestReclassification(unittest.TestCase):
    
    def test_detect_apparel_by_image_split(self):
        # Find any image in REF_DIR_WOMAN/images or REF_DIR_MAN/images
        woman_img_dir = Path(REF_DIR_WOMAN) / "images"
        if not woman_img_dir.exists():
            woman_img_dir = Path(REF_DIR_WOMAN)
            
        images = list(woman_img_dir.glob("*.jpg")) + list(woman_img_dir.glob("*.png"))
        if images:
            img_path = str(images[0])
            result = detect_apparel_by_image_split(img_path)
            self.assertIn(result, ["상의 + 하의", "원피스"])
            print(f"\n[Test] detect_apparel_by_image_split of {images[0].name} returned: {result}")
        else:
            self.skipTest("No images found in Woman folder to test split color logic.")

    def test_rebuild_statistics(self):
        # We don't want to run the full rebuild in a unit test because it takes time,
        # but let's test if loading DB works and if the structure is correct.
        db = load_db(REF_DB_PATH)
        self.assertTrue(len(db) > 0)
        
        # Verify that category combinations are standardized
        categories = {item.get("category_combination") for item in db}
        print(f"\n[Test] Current category combinations after modification: {categories}")
        
        # Checking that we don't have comma separated detailed items in category_combination
        for cat in categories:
            self.assertNotIn(",", cat, f"Category combination '{cat}' is not standardized!")

if __name__ == "__main__":
    unittest.main()
