import os

# 프로젝트 루트 디렉토리 (어느 위치에서 실행하든 안정적으로 동작)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. 스타일 교과서
REF_DIR_MAN = os.path.join(BASE_DIR, "datasets", "Man")
REF_DIR_WOMAN = os.path.join(BASE_DIR, "datasets", "Woman")

# 2. 내 진짜 옷장
MY_CLOSET_DIR = os.path.join(BASE_DIR, "datasets", "MyCloset")

# 3. 구매 후보
SHOPPING_DIR = os.path.join(BASE_DIR, "datasets", "ShoppingCandidates")

# DB 파일 경로
REF_DB_PATH = os.path.join(BASE_DIR, "reference_styles.json")      # 스타일 교과서 DB
CLOSET_DB_PATH = os.path.join(BASE_DIR, "my_closet.json")          # 내 옷장 DB
SHOPPING_DB_PATH = os.path.join(BASE_DIR, "shopping_candidates.json")  # 구매 후보 DB
HISTORY_DB_PATH = os.path.join(BASE_DIR, "outfit_history.json")    # 저장된 코디 히스토리 DB
