import streamlit as st
import os
import pandas as pd
import datetime
import base64
from config import REF_DIR_MAN, REF_DIR_WOMAN, MY_CLOSET_DIR, SHOPPING_DIR, REF_DB_PATH, CLOSET_DB_PATH, SHOPPING_DB_PATH, HISTORY_DB_PATH
from core.analyzer import sync_reference_styles_local, sync_user_closet_local, sync_shopping_candidates_local, load_db, create_demo_data_if_needed, save_db, migrate_existing_data_to_sql_format
from core.recommender import recommend_outfit, scan_missing_essentials

# 페이지 기본 설정
st.set_page_config(page_title="My AI Closet", page_icon="👗", layout="wide")

def get_image_base64(filepath):
    if not filepath:
        return ""
    if not os.path.isabs(filepath):
        filepath = os.path.abspath(filepath)
    if not os.path.exists(filepath):
        return ""
    try:
        with open(filepath, "rb") as f:
            data = f.read()
            encoded = base64.b64encode(data).decode("utf-8")
            ext = os.path.splitext(filepath)[1].lower().replace(".", "")
            if ext in ["jpg", "jpeg"]:
                ext = "jpeg"
            elif ext not in ["png", "webp", "gif"]:
                ext = "png"
            return f"data:image/{ext};base64,{encoded}"
    except:
        return ""

SVG_MALE = """
<svg viewBox="0 0 100 200" style="position:absolute; top:40px; left:0; width:100%; height:85%; opacity:0.07; z-index:1; pointer-events:none;">
  <path d="M50,15 A10,10 0 1,0 50,35 A10,10 0 1,0 50,15 Z M25,50 L75,50 L70,120 L30,120 Z M33,122 L47,122 L45,190 L35,190 Z M53,122 L67,122 L65,190 L55,190 Z" fill="#4a5568" />
</svg>
"""

SVG_FEMALE = """
<svg viewBox="0 0 100 200" style="position:absolute; top:40px; left:0; width:100%; height:85%; opacity:0.07; z-index:1; pointer-events:none;">
  <path d="M50,18 A8,8 0 1,0 50,34 A8,8 0 1,0 50,18 Z M28,50 L72,50 L64,80 L68,120 L32,120 L36,80 Z M34,122 L47,122 L45,190 L37,190 Z M53,122 L66,122 L64,190 L55,190 Z" fill="#4a5568" />
</svg>
"""

def make_slot_html(item, slot_type, default_label):
    if not item:
        return f'<div class="apparel-slot {slot_type} slot-empty">{default_label}</div>'
    
    img_b64 = get_image_base64(item.get("file_path"))
    img_tag = f'<img src="{img_b64}" class="slot-img" />' if img_b64 else f'<div style="padding:20px; text-align:center; color:#a0aec0; font-size:0.85em;">이미지 없음</div>'
    
    is_cand = item.get("is_shopping_candidate", False)
    badge = '<span class="slot-badge-shopping">🛒 구매후보</span>' if is_cand else '<span class="slot-badge-owned">🏠 내옷장</span>'
    
    category = item.get("category", "미분류")
    detail = item.get("detail", "")
    color = item.get("color", "")
    
    label = f'<div class="slot-label">{category}: {detail} ({color})</div>'
    
    return f'''
    <div class="apparel-slot {slot_type}">
        {badge}
        {img_tag}
        {label}
    </div>
    '''

def render_mannequin_board(items, gender):
    outer = None
    top = None
    bottom = None
    dress = None
    
    for item in items:
        cat = item.get("category")
        if cat == "아우터":
            outer = item
        elif cat == "상의":
            top = item
        elif cat == "하의":
            bottom = item
        elif cat == "원피스":
            dress = item
            
    svg_silhouette = SVG_MALE if gender == "남성" else SVG_FEMALE
    
    if dress:
        basic_slots = make_slot_html(dress, "dress-slot", "👗 원피스 없음")
    else:
        top_slot_html = make_slot_html(top, "top-slot", "👕 상의 부족")
        bottom_slot_html = make_slot_html(bottom, "bottom-slot", "👖 하의 부족")
        basic_slots = top_slot_html + bottom_slot_html
        
    outer_slot_html = make_slot_html(outer, "top-slot", "🧥 아우터 없음")
    if dress:
        outer_bottom_slot_html = make_slot_html(dress, "bottom-slot", "👗 원피스 없음")
    else:
        outer_bottom_slot_html = make_slot_html(bottom, "bottom-slot", "👖 하의 부족")
    outer_slots = outer_slot_html + outer_bottom_slot_html

    style = """
    <style>
    .mannequin-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        margin-bottom: 20px;
        width: 100%;
    }
    .mannequin-frame {
        flex: 1;
        min-width: 250px;
        max-width: 300px;
        height: 480px;
        background-color: #fafafa;
        border: 2px solid #eaeaea;
        border-radius: 16px;
        padding: 15px;
        position: relative;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .mannequin-title {
        font-size: 1em;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
        z-index: 2;
        text-align: center;
        background: rgba(250, 250, 250, 0.85);
        padding: 2px 8px;
        border-radius: 4px;
    }
    .slots-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        position: relative;
        z-index: 2;
    }
    .apparel-slot {
        width: 95%;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .apparel-slot.top-slot {
        height: 180px;
    }
    .apparel-slot.bottom-slot {
        height: 200px;
    }
    .apparel-slot.dress-slot {
        height: 395px;
    }
    .slot-empty {
        border: 2px dashed #cbd5e0;
        background: rgba(247, 250, 252, 0.6);
        color: #a0aec0;
        font-size: 0.9em;
        font-weight: bold;
    }
    .slot-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background-color: #ffffff;
    }
    .slot-badge-owned {
        position: absolute;
        top: 8px;
        left: 8px;
        background-color: #b7eb8f;
        color: #389e0d;
        font-size: 0.72em;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        z-index: 3;
    }
    .slot-badge-shopping {
        position: absolute;
        top: 8px;
        left: 8px;
        background-color: #ffe58f;
        color: #d48806;
        font-size: 0.72em;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        z-index: 3;
    }
    .slot-label {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: rgba(0,0,0,0.6);
        color: white;
        font-size: 0.75em;
        text-align: center;
        padding: 4px 0;
        font-weight: 500;
        z-index: 3;
    }
    </style>
    """

    html_content = f"""
    {style}
    <div class="mannequin-container">
        <!-- 기본 코디 -->
        <div class="mannequin-frame">
            {svg_silhouette}
            <div class="mannequin-title">✨ 기본 코디 (Basic)</div>
            <div class="slots-wrapper">
                {basic_slots}
            </div>
        </div>
        
        <!-- 아우터 착용 -->
        <div class="mannequin-frame">
            {svg_silhouette}
            <div class="mannequin-title">🧥 아우터 착장 (Outerwear)</div>
            <div class="slots-wrapper">
                {outer_slots}
            </div>
        </div>
    </div>
    """
    # Strip leading/trailing whitespaces from each line to prevent Streamlit markdown code block conversion
    clean_html = "\n".join(line.strip() for line in html_content.splitlines())
    return clean_html

def main():
    # 카테고리 정렬 순서 정의 (오류 방지를 위해 최상단 정의)
    category_order = {"아우터": 0, "상의": 1, "하의": 2, "원피스": 3}
    
    # 기본 코디 분위기 (TPO 무드) 변수를 기본값으로 자동 정의
    tpo_mood = "전체 (자동 분류)"

    # 0. 데모 모드 사전 실행 (없으면 자동 생성)
    create_demo_data_if_needed()
    migrate_existing_data_to_sql_format()

    st.title("👗 My AI Closet (나만의 디지털 옷장 & 코디 추천)")
    st.markdown("트렌디한 **스타일 교과서**를 바탕으로, **내 옷장** 및 **구매 후보**의 옷들을 조합하여 최고의 맞춤 코디 제안을 드립니다!")

    # session state 초기화
    if "recommendation_result" not in st.session_state:
        st.session_state["recommendation_result"] = None
    if "selected_mode" not in st.session_state:
        st.session_state["selected_mode"] = "내 옷장만 추천"

    # ================= 사이드바 (프로필 및 입력만 깔끔하게 구성) =================
    with st.sidebar:
        st.header("👤 사용자 프로필")
        gender = st.selectbox("성별", ["남성", "여성"])
        age_job = st.text_input("연령 및 직업", value="30대 회사원", placeholder="예: 20대 대학생, 30대 회사원")
        body_type = st.text_area("체형 및 고민 사항", value="하체가 조금 통통한 편이고 어깨가 좁아 보임", placeholder="예: 어깨가 넓은 편, 하체가 통통해서 커버하고 싶음")
        
        st.markdown("---")
        st.header("🌤️ 오늘의 상황")
        tpo = st.text_input("어디 가시나요? (TPO)", value="주말 브런치 데이트", placeholder="예: 한남동 분위기 좋은 카페, 격식 있는 결혼식 하객")
        weather = st.text_input("오늘 날씨 및 기온", value="기온 16도, 다소 바람 불어 쌀쌀함", placeholder="예: 기온 15도, 쌀쌀한 바람")

        # 상세 조건 설정 Expander (사이드바로 이동)
        st.markdown("---")
        with st.expander("⚙️ 상세 조건 설정", expanded=False):
            closet_db_recommend = load_db(CLOSET_DB_PATH)
            shopping_db_recommend = load_db(SHOPPING_DB_PATH)
            
            lock_options = ["선택 안 함"]
            lock_id_map = {}
            
            if closet_db_recommend:
                for item in closet_db_recommend:
                    label = f"🏠 [내 옷장] {item.get('category')} - {item.get('detail')} ({item.get('color')} / {item.get('season')})"
                    lock_options.append(label)
                    lock_id_map[label] = item.get("id")
                    
            if shopping_db_recommend:
                for item in shopping_db_recommend:
                    label = f"🛒 [구매 후보] {item.get('category')} - {item.get('detail')} ({item.get('color')} / {item.get('season')})"
                    lock_options.append(label)
                    lock_id_map[label] = item.get("id")
                    
            selected_lock_label = st.selectbox(
                "📌 특정 옷 고정 (Key Item Lock)",
                lock_options,
                key="recommend_fixed_item"
            )
            fixed_item_id = lock_id_map.get(selected_lock_label)
            
            st.markdown("<small style='color:#666;'>상세 스타일 가이드 매칭 조건</small>", unsafe_allow_html=True)
            desired_mood = st.selectbox(
                "원하는 분위기",
                ["선택 안 함", "캐주얼", "스트릿", "포멀/클래식", "미니멀", "로맨틱/페미닌", "레트로"],
                key="rec_desired_mood"
            )
            formality_level = st.selectbox(
                "격식 정도",
                ["선택 안 함", "높음 (정장/클래식)", "보통 (비즈니스 캐주얼/댄디)", "낮음 (일상 캐주얼/스트릿)"],
                key="rec_formality"
            )
            preferred_color = st.selectbox(
                "선호 색상",
                ["선택 안 함", "화이트", "블랙", "네이비", "베이지", "그레이", "브라운", "블루", "레드", "그린", "옐로우"],
                key="rec_pref_color"
            )
            avoid_options = st.multiselect(
                "피하고 싶은 것",
                ["레드 색상", "옐로우 색상", "핑크 색상", "그린 색상", "아우터 제외", "원피스 제외", "스커트 제외"],
                key="rec_avoid"
            )
            activity_level = st.selectbox(
                "활동량 수준",
                ["선택 안 함", "높음 (야외 활동/스포츠)", "보통 (일반적인 일상)", "낮음 (실내/카페/사무실)"],
                key="rec_activity"
            )

    # ================= 메인 화면 (탭) =================
    tab1, tab2, tab3, tab4 = st.tabs([
        "🎓 스타일 교과서 (Reference)",
        "📂 내 진짜 옷장 (My Closet)",
        "🛍️ 구매 후보 (Shopping Candidates)",
        "✨ 오늘의 AI 코디 추천"
    ])

    # ----------------------------------------------------
    # 탭 1: 스타일 교과서 (Reference)
    # ----------------------------------------------------
    with tab1:
        st.subheader("🎓 스타일 교과서 동기화 및 학습")
        st.markdown(
            f"스타일리시한 코디 조합들이 들어있는 폴더를 스캔하여 **코디 기법을 자동 학습**합니다.\n"
            f"- **학습 경로:** 남성(`{REF_DIR_MAN}`), 여성(`{REF_DIR_WOMAN}`)"
        )
        
        col_btn1, col_btn2 = st.columns(2)
        with col_btn1:
            if st.button("🔄 스타일 교과서 학습 시작 (신규 추가분)", key="sync_ref"):
                with st.spinner("이미지로부터 코디 규칙과 스타일링 팁을 오프라인으로 고속 분석하고 있습니다..."):
                    try:
                        new_count, errors = sync_reference_styles_local(force_rebuild=False)
                        if new_count > 0:
                            st.success(f"성공적으로 {new_count}개의 새로운 스타일을 학습 데이터베이스에 추가했습니다!")
                        else:
                            st.info("새로 학습할 스타일이 없습니다. (기존 데이터가 최신입니다)")
                        
                        if errors:
                            st.warning("일부 레퍼런스 이미지 분석에 실패했습니다:\n" + "\n".join(errors[:5]) + ("..." if len(errors)>5 else ""))
                    except Exception as e:
                        st.error(f"오류 발생: {e}")
                        
        with col_btn2:
            if st.button("⚙️ 스타일 교과서 전체 재구축 (Rebuild)", key="rebuild_ref"):
                with st.spinner("스타일 교과서 DB를 비우고 1,089개 이미지를 처음부터 전체 정밀 분석하여 재구축하고 있습니다..."):
                    try:
                        new_count, errors = sync_reference_styles_local(force_rebuild=True)
                        st.success(f"성공적으로 스타일 교과서 DB 전체 {new_count}개 데이터를 정밀 재구성했습니다!")
                        if errors:
                            st.warning("일부 이미지 분석 실패:\n" + "\n".join(errors[:5]))
                    except Exception as e:
                        st.error(f"재구축 중 오류 발생: {e}")
        
        st.markdown("---")
        ref_db = load_db(REF_DB_PATH)
        if ref_db:
            st.subheader("📊 스타일 카테고리 분포 통계")
            
            # 남/여 분포 메트릭
            man_count = sum(1 for item in ref_db if item.get("gender") == "Man")
            woman_count = sum(1 for item in ref_db if item.get("gender") == "Woman")
            
            col_stat1, col_stat2, col_stat3 = st.columns(3)
            with col_stat1:
                st.metric("총 학습 레퍼런스 스타일", f"{len(ref_db)}개")
            with col_stat2:
                st.metric("남성(Man) 스타일 수", f"{man_count}개")
            with col_stat3:
                st.metric("여성(Woman) 스타일 수", f"{woman_count}개")
                
            # 카테고리 조합 분포 계산
            from collections import Counter
            comb_counts = Counter(item.get("category_combination", "미분류") for item in ref_db)
            total_items = len(ref_db)
            
            dist_data = []
            for comb, cnt in comb_counts.most_common():
                dist_data.append({
                    "카테고리 조합": comb,
                    "개수 (개)": cnt,
                    "비율 (%)": round(cnt / total_items * 100, 2)
                })
            df_dist = pd.DataFrame(dist_data)
            
            col_chart1, col_chart2 = st.columns([2, 3])
            with col_chart1:
                st.markdown("**카테고리별 개수 및 비율 표**")
                st.dataframe(df_dist, use_container_width=True, hide_index=True)
            with col_chart2:
                st.markdown("**카테고리 조합별 분포 시각화**")
                chart_df = pd.DataFrame(
                    {"개수": [d["개수 (개)"] for d in dist_data]},
                    index=[d["카테고리 조합"] for d in dist_data]
                )
                st.bar_chart(chart_df, use_container_width=True)
                
            st.markdown("---")
            st.subheader("📚 현재 학습된 스타일 가이드 리스트")
            
            # 테이블 형태로 학습 데이터 요약 출력
            summary_data = []
            for item in ref_db:
                summary_data.append({
                    "성별": "남성(Man)" if item.get("gender") == "Man" else "여성(Woman)",
                    "스타일명": item.get("style_name"),
                    "의상 조합": item.get("category_combination"),
                    "색상 조합": item.get("color_combination"),
                    "분위기": item.get("mood"),
                    "계절": item.get("season"),
                    "스타일링 팁": item.get("style_tips")
                })
            df = pd.DataFrame(summary_data)
            st.dataframe(df, use_container_width=True)
        else:
            st.info("아직 학습된 스타일이 없습니다. 위의 '스타일 교과서 학습 시작' 버튼을 눌러주세요.")

    # ----------------------------------------------------
    # 탭 2: 내 진짜 옷장 (My Closet)
    # ----------------------------------------------------
    with tab2:
        st.subheader("📂 내 진짜 옷장 관리")
        st.markdown(
            f"실제 내가 가지고 있어 입을 수 있는 옷들을 등록하고 관리합니다.\n"
            f"- **내 옷 저장 경로:** `{MY_CLOSET_DIR}`"
        )
        
        if st.button("🔄 내 옷장 이미지 스캔", key="sync_closet"):
            with st.spinner("내 옷장의 옷들을 100% 로컬 오프라인 스캔 및 태깅 중입니다..."):
                try:
                    new_count, errors = sync_user_closet_local()
                    if new_count > 0:
                        st.success(f"성공적으로 {new_count}개의 진짜 옷을 내 옷장에 등록했습니다!")
                    else:
                        st.info("새롭게 스캔할 사진이 없습니다. (기존 옷장이 최신입니다)")
                    
                    if errors:
                        st.warning("일부 내 옷 분석에 실패했습니다:\n" + "\n".join(errors[:5]) + ("..." if len(errors)>5 else ""))
                except Exception as e:
                    st.error(f"오류 발생: {e}")
                        
        st.markdown("---")
        st.subheader("👚 내 실제 등록 의상 목록")
        closet_db = load_db(CLOSET_DB_PATH)
        if closet_db:
            st.write(f"총 **{len(closet_db)}**벌의 옷이 디지털 옷장에 등록되어 있습니다.")
            
            st.markdown("#### ✏️ 의상 태그 수동 수정 (데이터 에디터)")
            df_closet = pd.DataFrame(closet_db)
            
            # 태그 수정 항목 확장 (카테고리, 색상, 계절, 스타일, 성별, SQL 호환 필드)
            edited_df = st.data_editor(
                df_closet,
                column_config={
                    "file_path": st.column_config.TextColumn("파일 경로", disabled=True),
                    "category": st.column_config.SelectboxColumn("카테고리", options=["상의", "하의", "아우터", "원피스", "미분류"]),
                    "color": st.column_config.SelectboxColumn("색상", options=["블랙", "화이트", "네이비", "베이지", "그레이", "브라운", "블루", "레드", "그린", "옐로우", "기타"]),
                    "season": st.column_config.SelectboxColumn("계절", options=["봄", "여름", "가을", "겨울", "봄, 가을", "사계절", "봄, 가을, 겨울"]),
                    "style": st.column_config.SelectboxColumn("스타일", options=["캐주얼", "포멀", "스포츠", "라운지웨어", "기타"]),
                    "gender": st.column_config.SelectboxColumn("성별", options=["공용", "Man", "Woman"]),
                    "category_code": st.column_config.SelectboxColumn("카테고리 코드 (SQL)", options=["M_CAMPUS", "F_CAMPUS", "M_OFFICE", "F_OFFICE", "M_STREET", "F_STREET", "M_MINIMAL", "F_MINIMAL"]),
                    "style_tags": st.column_config.TextColumn("스타일 태그 (SQL)", help="쉼표로 구분된 태그셋")
                },
                use_container_width=True,
                num_rows="dynamic",
                key="closet_editor"
            )
            
            if st.button("💾 변경된 태그 저장", key="save_tags"):
                save_db(edited_df.to_dict(orient="records"), CLOSET_DB_PATH)
                st.success("옷장 태그 정보가 성공적으로 업데이트되었습니다!")
                st.rerun()
                
            # 부족한 옷 추천 진단 UI 추가
            st.markdown("---")
            st.markdown("### 🚨 내 옷장 진단: 부족한 베이직 아이템 추천")
            missing_items = scan_missing_essentials(closet_db)
            if missing_items:
                st.write(f"현재 옷장 구성을 바탕으로 **{len(missing_items)}**개의 추천 보완 리스트가 진단되었습니다:")
                for item in missing_items:
                    level_color = "#ff4d4f" if "필수" in item["level"] else "#faad14"
                    st.markdown(
                        f"<div style='background-color:#fafafa; padding:12px; border-radius:5px; border-left:5px solid {level_color}; margin-bottom:10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>"
                        f"<span style='color:{level_color}; font-weight:bold;'>[{item['level']}] {item['category']}</span> - <b>{item['name']}</b><br/>"
                        f"<span style='font-size:0.9em; color:#666;'>💡 {item['reason']}</span>"
                        f"</div>",
                        unsafe_allow_html=True
                    )
            else:
                st.success("🎉 필수 베이직 웨어가 골고루 구비되어 있어 매우 균형 잡힌 디지털 옷장입니다!")

            st.markdown("---")
            st.markdown("#### 👕 내 옷장 갤러리 뷰")
            cols = st.columns(3)
            for i, item in enumerate(closet_db):
                with cols[i % 3]:
                    try:
                        st.image(item.get("file_path"), use_container_width=True)
                    except Exception:
                        st.write("⚠️ 이미지 파일을 불러올 수 없습니다.")
                    st.caption(
                        f"**{item.get('category')}** - {item.get('detail')} "
                        f"({item.get('color')} / {item.get('season')} / {item.get('style')})"
                    )
        else:
            st.info(
                f"내 옷장이 비어있습니다. `{MY_CLOSET_DIR}` 폴더에 사용자님의 실제 의상 사진을 넣고 "
                f"'내 옷장 이미지 스캔' 버튼을 눌러주세요."
            )

    # ----------------------------------------------------
    # 탭 3: 구매 후보 (Shopping Candidates)
    # ----------------------------------------------------
    with tab3:
        st.subheader("🛍️ 구매 후보 관리 (쇼핑 시뮬레이션)")
        st.markdown(
            f"인터넷 쇼핑몰에서 저장하거나 사고 싶은 구매 후보 의류 이미지를 관리하는 공간입니다. "
            f"내 진짜 옷장과 분리되어 작동하며, 구매 전 시뮬레이션과 구매 의사결정 조언 기능에 사용됩니다.\n"
            f"- **구매 후보 저장 경로:** `{SHOPPING_DIR}`"
        )
        
        if st.button("🔄 구매 후보 이미지 스캔", key="sync_shopping"):
            with st.spinner("구매 후보 폴더의 의상들을 100% 로컬 오프라인 스캔 및 태깅 중입니다..."):
                try:
                    new_count, errors = sync_shopping_candidates_local()
                    if new_count > 0:
                        st.success(f"성공적으로 {new_count}개의 구매 후보 아이템을 등록했습니다!")
                    else:
                        st.info("새롭게 스캔할 사진이 없습니다. (구매 후보 폴더가 최신입니다)")
                    
                    if errors:
                        st.warning("일부 후보 아이템 분석에 실패했습니다:\n" + "\n".join(errors[:5]) + ("..." if len(errors)>5 else ""))
                except Exception as e:
                    st.error(f"오류 발생: {e}")
                        
        st.markdown("---")
        st.subheader("🛒 구매 후보 대조 의상 목록")
        shopping_db = load_db(SHOPPING_DB_PATH)
        if shopping_db:
            st.write(f"총 **{len(shopping_db)}**벌의 구매 예정 옷들이 등록되어 있습니다.")
            
            st.markdown("#### ✏️ 구매 후보 태그 및 쇼핑 메모 수동 수정")
            df_shopping = pd.DataFrame(shopping_db)
            
            # 태그 정보 및 쇼핑 정보(브랜드, 가격, URL, SQL 호환 필드) 직접 기재
            edited_shop_df = st.data_editor(
                df_shopping,
                column_config={
                    "file_path": st.column_config.TextColumn("파일 경로", disabled=True),
                    "category": st.column_config.SelectboxColumn("카테고리", options=["상의", "하의", "아우터", "원피스", "미분류"]),
                    "color": st.column_config.SelectboxColumn("색상", options=["블랙", "화이트", "네이비", "베이지", "그레이", "브라운", "블루", "레드", "그린", "옐로우", "기타"]),
                    "season": st.column_config.SelectboxColumn("계절", options=["봄", "여름", "가을", "겨울", "봄, 가을", "사계절", "봄, 가을, 겨울"]),
                    "style": st.column_config.SelectboxColumn("스타일", options=["캐주얼", "포멀", "스포츠", "라운지웨어", "기타"]),
                    "brand": st.column_config.TextColumn("브랜드/쇼핑몰"),
                    "price": st.column_config.NumberColumn("가격(원)", format="%d"),
                    "url": st.column_config.TextColumn("상품 링크(URL)"),
                    "gender": st.column_config.SelectboxColumn("성별", options=["공용", "Man", "Woman"]),
                    "category_code": st.column_config.SelectboxColumn("카테고리 코드 (SQL)", options=["M_CAMPUS", "F_CAMPUS", "M_OFFICE", "F_OFFICE", "M_STREET", "F_STREET", "M_MINIMAL", "F_MINIMAL"]),
                    "style_tags": st.column_config.TextColumn("스타일 태그 (SQL)", help="쉼표로 구분된 태그셋")
                },
                use_container_width=True,
                num_rows="dynamic",
                key="shopping_editor"
            )
            
            if st.button("💾 변경된 구매 후보 태그 저장", key="save_shop_tags"):
                save_db(edited_shop_df.to_dict(orient="records"), SHOPPING_DB_PATH)
                st.success("구매 후보 태그 정보가 성공적으로 업데이트되었습니다!")
                st.rerun()
                
            st.markdown("---")
            st.markdown("#### 🛍️ 구매 후보 갤러리 뷰")
            cols = st.columns(3)
            for i, item in enumerate(shopping_db):
                with cols[i % 3]:
                    try:
                        st.image(item.get("file_path"), use_container_width=True)
                    except Exception:
                        st.write("⚠️ 이미지 파일을 불러올 수 없습니다.")
                    
                    price_val = f"{int(item.get('price')):,}원" if item.get('price') else "가격 정보 없음"
                    brand_val = item.get('brand') if item.get('brand') else "브랜드 정보 없음"
                    
                    st.caption(
                        f"**{item.get('category')}** - {item.get('detail')} "
                        f"({item.get('color')} / {item.get('season')})\n\n"
                        f"🏬 {brand_val} | 💰 {price_val}"
                    )
                    if item.get("url"):
                        st.markdown(f"[🔗 상품 링크 바로가기]({item.get('url')})")
        else:
            st.info(
                f"등록된 구매 후보가 비어있습니다. `{SHOPPING_DIR}` 폴더에 쇼핑몰 캡처 등의 이미지를 넣고 "
                f"'구매 후보 이미지 스캔' 버튼을 눌러주세요."
            )

    # ----------------------------------------------------
    # 탭 4: 오늘의 AI 코디 추천
    # ----------------------------------------------------
    with tab4:
        st.subheader("✨ 스타일 교과서 기반 맞춤 추천 및 구매 가이드")
        
        st.markdown("<p style='color:#666; font-size:0.9em;'>👈 좌측 사이드바의 <strong>[상세 조건 설정]</strong>에서 오늘의 분위기, 고정 아이템, 기호 색상/스타일 등을 자유롭게 설정하실 수 있습니다.</p>", unsafe_allow_html=True)
        
        # 3개의 추천 모드 실행 버튼 배치
        col1, col2, col3 = st.columns(3)
        
        run_mode = None
        with col1:
            if st.button("👕 내 옷장만 추천", use_container_width=True, key="btn_owned"):
                run_mode = "내 옷장만 추천"
        with col2:
            if st.button("🛒 구매 후보만 추천", use_container_width=True, key="btn_shopping"):
                run_mode = "구매 후보만으로 가상 코디"
        with col3:
            if st.button("🔀 내 옷장 + 구매 후보 믹스 추천", use_container_width=True, key="btn_mix"):
                run_mode = "내 옷장 + 구매 후보 믹스 추천"
                
        if run_mode:
            if not gender or not tpo or not weather:
                st.warning("사이드바에 필수 정보(성별, TPO, 날씨)를 모두 입력해주세요!")
            else:
                user_profile = {
                    "gender": gender,
                    "age_job": age_job,
                    "body_type": body_type,
                    "tpo": tpo
                }
                
                with st.spinner("AI 스타일리스트가 코디 조합과 구매 가치를 분석하는 중..."):
                    try:
                        result = recommend_outfit(
                            user_profile, 
                            weather, 
                            run_mode, 
                            tpo_mood=tpo_mood, 
                            fixed_item_id=fixed_item_id,
                            desired_mood=desired_mood,
                            formality_level=formality_level,
                            preferred_color=preferred_color,
                            avoid_options=avoid_options,
                            activity_level=activity_level
                        )
                        st.session_state["recommendation_result"] = result
                        st.session_state["selected_mode"] = run_mode
                    except Exception as e:
                        st.error(f"추천 중 오류 발생: {e}")

        # 추천 결과 렌더링
        if st.session_state["recommendation_result"]:
            result = st.session_state["recommendation_result"]
            if "error" in result:
                st.warning(result["error"])
            else:
                best_ref = result.get("selected_reference")
                items = result.get("items", [])
                score = result.get("score", 0)
                reasons = result.get("reasons", [])
                warnings = result.get("warnings", [])
                
                st.success(f"매칭 완료! (적합도 점수: {score}점)")
                
                # 경고(옷장 부족 아이템) 노출
                if warnings:
                    for w in warnings:
                        st.warning(f"⚠️ 의상 상태 알림: {w}")
                        
                ref_name = best_ref.get("style_name", "커스텀 스타일") if best_ref else "베이직"
                
                st.markdown(f"### 🎨 오늘의 AI 맞춤 코디: **{ref_name}** 모티브")
                
                # 카테고리 정렬 순서 정의
                category_order = {"아우터": 0, "상의": 1, "하의": 2, "원피스": 3}
                
                if items:
                    # 2컬럼 레이아웃: 좌측 착장 보드 스택, 우측 코디 연출 가이드
                    col_board, col_info = st.columns([1, 1.2])
                    
                    with col_board:
                        st.markdown("<h4 style='text-align:center;'>👕 오늘의 착장 보드 (Outfit Board)</h4>", unsafe_allow_html=True)
                        
                        # 마네킹 착장 보드 HTML 렌더링
                        mannequin_html = render_mannequin_board(items, gender)
                        st.markdown(mannequin_html, unsafe_allow_html=True)
                        
                        # 하단 매칭 아이템 상세 정보
                        st.markdown("<br/><h5>🔍 매칭 아이템 상세 정보</h5>", unsafe_allow_html=True)
                        sorted_items = sorted(items, key=lambda x: category_order.get(x.get("category"), 4))
                        for idx, item in enumerate(sorted_items):
                            is_candidate = item.get("is_shopping_candidate", False)
                            badge_html = (
                                "<span style='background-color:#ffe58f; color:#d48806; padding:3px 8px; border-radius:12px; font-weight:bold; font-size:0.8em; margin-right:5px;'>🛒 구매 후보</span>"
                                if is_candidate else
                                "<span style='background-color:#b7eb8f; color:#389e0d; padding:3px 8px; border-radius:12px; font-weight:bold; font-size:0.8em; margin-right:5px;'>🏠 내 옷장 소장</span>"
                            )
                            
                            st.markdown(
                                f"<div style='border:1px solid #e0e0e0; border-radius:8px; padding:10px; margin-bottom:8px; background-color:#ffffff;'>", 
                                unsafe_allow_html=True
                            )
                            c_img, c_desc = st.columns([1, 4])
                            with c_img:
                                try:
                                    st.image(item.get("file_path"), use_container_width=True)
                                except:
                                    st.write("이미지 없음")
                            with c_desc:
                                st.markdown(f"**{item.get('category', '미분류')}** | **{item.get('detail', '')}** ({item.get('color', '')})")
                                st.markdown(badge_html, unsafe_allow_html=True)
                                
                                if is_candidate:
                                    meta_parts = []
                                    if item.get("brand"):
                                        meta_parts.append(f"브랜드: {item['brand']}")
                                    if item.get("price"):
                                        meta_parts.append(f"가격: {int(item['price']):,}원")
                                    if meta_parts:
                                        st.markdown(f"<small style='color:#777;'>" + " | ".join(meta_parts) + "</small>", unsafe_allow_html=True)
                                    if item.get("url"):
                                        st.markdown(f"<a href='{item['url']}' target='_blank' style='font-size:0.85em; color:#1e90ff; text-decoration:none;'>🔗 상품 바로가기</a>", unsafe_allow_html=True)
                                        
                                    if item.get("purchase_advice"):
                                        advice = item["purchase_advice"]
                                        status_color = "#f0f5ff" if "보류" in advice["priority"] else "#fff7e6"
                                        border_color = "#adc6ff" if "보류" in advice["priority"] else "#ffd591"
                                        st.markdown(
                                            f"<div style='background-color:{status_color}; padding:6px 10px; border-radius:4px; border:1px solid {border_color}; margin-top:8px; font-size:0.8em; color:#333;'>"
                                            f"📢 <b>{advice['priority']}</b><br/>"
                                            f"{advice['reason'].split(chr(10))[0]}</div>",
                                            unsafe_allow_html=True
                                        )
                            st.markdown("</div>", unsafe_allow_html=True)
                            
                    with col_info:
                        st.markdown("<h4 style='text-align:center;'>💡 AI 연출 가이드 및 스타일링 조화</h4>", unsafe_allow_html=True)
                        st.markdown(
                            f"<div style='background-color:#fafafa; border:1px solid #e8e8e8; border-radius:8px; padding:15px; margin-bottom:15px; text-align:center;'>"
                            f"<span style='font-size:0.9em; color:#888;'>종합 코디 조화도</span><br/>"
                            f"<span style='font-size:2.2em; color:#ff4d4f; font-weight:bold;'>{score}점</span>"
                            f"</div>",
                            unsafe_allow_html=True
                        )
                        st.markdown("**🌟 코디 매칭 및 추천 이유:**")
                        for r in reasons:
                            st.markdown(f"- {r}")
                            
                    # 신규: 조건 완화 진단 및 대체 보완 의상 처방 UI
                    unmet = result.get("unmet_conditions", [])
                    suggestions = result.get("complementary_suggestions", [])
                    
                    if unmet:
                        st.markdown("---")
                        st.markdown("### 💡 AI 스타일리스트의 옷장 진단 및 보완 처방")
                        st.info("💡 현재 옷장의 의류 종류나 수량이 적어 입력하신 일부 세부 조건이 완화되었습니다. 보유 옷 중 가장 가까운 최선의 조합을 추천해 드렸습니다.")
                        
                        st.markdown("#### 🚫 완화된 스타일 조건")
                        u_cols = st.columns(len(unmet) if len(unmet) < 3 else 3)
                        for u_idx, cond in enumerate(unmet):
                            with u_cols[u_idx % len(u_cols)]:
                                st.markdown(
                                    f"<div style='background-color:#fff1f0; padding:12px; border-radius:6px; border:1px solid #ffa39e; height:100%;'>"
                                    f"<span style='color:#cf1322; font-weight:bold;'>📌 {cond['label']}</span><br/>"
                                    f"<span style='font-size:0.9em; color:#555;'>{cond['reason']}</span>"
                                    f"</div>",
                                    unsafe_allow_html=True
                                )
                        
                        if suggestions:
                            st.markdown("<br/>", unsafe_allow_html=True)
                            st.markdown("#### 🛍️ 원하던 코디 분위기를 완성하기 위해 부족한 보완 의상")
                            st.write("아래 아이템들을 진짜 옷장에 추가하시거나 구매 후보로 등록해 매치해 보세요:")
                            for sug in suggestions:
                                color_badge = f"<span style='background-color:#eaeaea; color:#333; padding:2px 6px; border-radius:4px; font-size:0.85em; font-weight:bold; margin-left:5px;'>{sug['color']}</span>" if sug.get('color') != '선택 안 함' else ""
                                st.markdown(
                                    f"<div style='background-color:#f0f8ff; padding:12px; border-radius:6px; border-left:5px solid #1e90ff; margin-bottom:10px;'>"
                                    f"<span style='color:#1e90ff; font-weight:bold; font-size:1.05em;'>[{sug['category']}] {sug['name']}</span>{color_badge}<br/>"
                                    f"<span style='font-size:0.9em; color:#555; display:inline-block; margin-top:5px;'>💡 {sug['reason']}</span>"
                                    f"</div>",
                                    unsafe_allow_html=True
                                )
                    
                    # 오늘 코디 저장하기 기능
                    st.markdown("---")
                    if st.button("💾 오늘 코디 저장하기", key="save_outfit_btn"):
                        try:
                            history = load_db(HISTORY_DB_PATH)
                            new_history_item = {
                                "id": str(int(datetime.datetime.now().timestamp())),
                                "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                                "tpo": tpo,
                                "weather": weather,
                                "recommend_mode": st.session_state.get("selected_mode", "미정"),
                                "style_name": ref_name,
                                "gender": gender,
                                "items": [
                                    {
                                        "category": it.get("category"),
                                        "detail": it.get("detail"),
                                        "color": it.get("color"),
                                        "brand": it.get("brand", ""),
                                        "price": it.get("price", 0),
                                        "url": it.get("url", ""),
                                        "file_path": it.get("file_path"),
                                        "is_shopping_candidate": it.get("is_shopping_candidate", False)
                                    } for it in items
                                ],
                                "reasons": reasons
                            }
                            history.append(new_history_item)
                            save_db(history, HISTORY_DB_PATH)
                            st.success("🎉 코디가 성공적으로 저장되었습니다! 아래의 히스토리에서 언제든 다시 확인하실 수 있습니다.")
                        except Exception as e:
                            st.error(f"저장 중 오류 발생: {e}")
                else:
                    st.info("매칭된 아이템이 없습니다. 다른 조건을 시도해보세요.")
        
        # ----------------------------------------------------
        # 저장된 코디 히스토리 영역
        # ----------------------------------------------------
        st.markdown("---")
        st.subheader("📜 저장된 코디 히스토리")
        history = load_db(HISTORY_DB_PATH)
        if history:
            st.write(f"총 **{len(history)}**개의 저장된 코디 매칭이 있습니다.")
            
            options = [f"[{h.get('date')}] {h.get('tpo')} ({h.get('style_name')})" for h in reversed(history)]
            selected_opt = st.selectbox("다시 볼 저장된 코디 선택", options, key="history_select")
            
            if selected_opt:
                selected_idx = len(history) - 1 - options.index(selected_opt)
                h_item = history[selected_idx]
                
                st.markdown(f"<div style='background-color:#f9f9f9; padding:20px; border-radius:8px; border:1px solid #eee; margin-bottom:15px;'>", unsafe_allow_html=True)
                st.markdown(f"#### 📅 {h_item.get('date')} - {h_item.get('tpo')} ({h_item.get('style_name')})")
                st.write(f"🌤️ **날씨 상황:** {h_item.get('weather')} | ⚙️ **추천 모드:** {h_item.get('recommend_mode')}")
                
                h_items = h_item.get("items", [])
                h_reasons = h_item.get("reasons", [])
                h_gender = h_item.get("gender", gender)
                
                # 2컬럼 레이아웃: 좌측 수직 스택 착장 보드, 우측 AI 추천 사유
                h_col_board, h_col_info = st.columns([1, 1.2])
                
                with h_col_board:
                    st.markdown("<h5 style='text-align:center;'>👕 저장된 착장 보드</h5>", unsafe_allow_html=True)
                    
                    # 저장된 코디 마네킹 보드 렌더링
                    h_mannequin_html = render_mannequin_board(h_items, h_gender)
                    st.markdown(h_mannequin_html, unsafe_allow_html=True)
                    
                    # 하단 상세 정보
                    st.markdown("<br/><h6>🔍 매칭 아이템 상세 정보</h6>", unsafe_allow_html=True)
                    sorted_h_items = sorted(h_items, key=lambda x: category_order.get(x.get("category"), 4))
                    for h_idx, it in enumerate(sorted_h_items):
                        is_cand = it.get("is_shopping_candidate", False)
                        badge_html = (
                            "<span style='background-color:#ffe58f; color:#d48806; padding:3px 8px; border-radius:12px; font-weight:bold; font-size:0.8em; margin-right:5px;'>🛒 구매 후보</span>"
                            if is_cand else
                            "<span style='background-color:#b7eb8f; color:#389e0d; padding:3px 8px; border-radius:12px; font-weight:bold; font-size:0.8em; margin-right:5px;'>🏠 내 옷장 소장</span>"
                        )
                        
                        st.markdown(
                            f"<div style='border:1px solid #e0e0e0; border-radius:6px; padding:10px; margin-bottom:8px; background-color:#ffffff;'>", 
                            unsafe_allow_html=True
                        )
                        col_h_img, col_h_desc = st.columns([1, 4])
                        with col_h_img:
                            try:
                                st.image(it.get("file_path"), use_container_width=True)
                            except:
                                st.write("이미지 없음")
                        with col_h_desc:
                            st.markdown(f"**{it.get('category')}** | **{it.get('detail')}** ({it.get('color', '')})")
                            st.markdown(badge_html, unsafe_allow_html=True)
                            if is_cand:
                                meta_parts = []
                                if it.get("brand"):
                                    meta_parts.append(f"브랜드: {it['brand']}")
                                if it.get("price"):
                                    meta_parts.append(f"가격: {int(it['price']):,}원")
                                if meta_parts:
                                    st.markdown(f"<small style='color:#777;'>" + " | ".join(meta_parts) + "</small>", unsafe_allow_html=True)
                                if it.get("url"):
                                    st.markdown(f"<a href='{it['url']}' target='_blank' style='font-size:0.8em; color:#1e90ff; text-decoration:none;'>🔗 상품 바로가기</a>", unsafe_allow_html=True)
                        st.markdown("</div>", unsafe_allow_html=True)
                        
                with h_col_info:
                    st.markdown("##### 💡 당시 AI 추천 및 매칭 사유")
                    for hr in h_reasons:
                        st.markdown(f"- {hr}")
                        
                st.markdown("</div>", unsafe_allow_html=True)
        else:
            st.info("아직 저장된 코디가 없습니다. 위의 추천 결과에서 '오늘 코디 저장하기' 버튼을 눌러보세요.")

if __name__ == "__main__":
    main()
