# Fashion Style DNA System Flow

## 整体产品概念

本系统不是传统的“衣服管理 App”，而是：

> 基于 Fashion Semantics（时尚语义）与 Style DNA（风格人格）的穿搭智能系统。

核心目标：

- 理解用户的穿搭风格
- 分析穿搭给人的感知印象
- 建立用户风格 DNA
- 根据衣橱进行智能推荐
- 分析新单品与现有风格的匹配度

---

# 整体流程（Flow Overview）

```text
选择风格人格
↓
Style DNA 分析
↓
个性化穿搭推荐
↓
语义化衣橱管理
↓
新单品匹配分析
```

---

# 01 — 选择风格人格（Style Persona Selection）

## 概念

用户进入系统后，首先通过 36 个虚拟 Persona 选择最接近自己的风格。

这些 Persona 不是“模特图”，而是：

> 风格人格（Style Persona）

每个 Persona 都代表一种穿搭语义组合。

例如：

| Persona | 特征 |
|---|---|
| Clean Minimal | 干净 / 都市 / 极简 |
| Sportive Casual | 活力 / 舒适 / 年轻 |
| Soft Lounge | 柔和 / 放松 / 自然 |
| Chic Feminine | 优雅 / 女性化 / 精致 |
| Techwear | 机能 / 冷感 / 未来感 |

---

## 用户行为

用户：

- 选择喜欢的 Persona
- 点赞喜欢的穿搭
- 跳过不感兴趣的风格

系统：

- 收集用户风格偏好
- 建立初始 Style Embedding
- 生成用户风格向量

---

# 02 — Style DNA 分析（Style DNA Analysis）

## 概念

系统根据：

- 用户选择的 Persona
- 用户上传的穿搭
- 数据集中的 Fashion Semantic 标签

分析用户的风格 DNA。

---

## 输出内容

### 主风格

例如：

```text
Sportive Casual 72%
Normcore 18%
Minimal 10%
```

---

### 风格感知雷达图

根据 Fashion Semantic 数据生成：

| 维度 | 含义 |
|---|---|
| Comfort | 舒适 |
| Clean | 干净 |
| Urban | 都市感 |
| Unique | 独特 |
| Practical | 实用 |
| Active | 活动性 |
| Feminine | 女性化 |

---

### 他人感知印象

例如：

```text
✓ 舒适自然
✓ 活力十足
✓ 干净清爽
✓ 随性松弛
```

---

# 03 — 个性化穿搭推荐（Personal Outfit Recommendation）

## 概念

系统根据用户 Style DNA：

- 推荐适合的穿搭
- 推荐适合的颜色
- 推荐适合的版型
- 推荐适合的单品

---

## 推荐逻辑

不是：

```text
推荐一件衣服
```

而是：

```text
推荐符合你风格语义的穿搭
```

例如：

用户偏好：

- 舒适
- clean
- 活动性

系统推荐：

- 宽松裤
- 低饱和配色
- 运动休闲鞋
- 柔软材质上衣

---

## 推荐场景

| 场景 | 推荐内容 |
|---|---|
| 日常 | 舒适休闲搭配 |
| 通勤 | 都市 clean 风格 |
| 运动 | active outfit |
| 约会 | feminine styling |

---

# 04 — 语义化衣橱管理（Semantic Closet System）

## 概念

传统衣橱：

```text
按衣服类别分类
```

本系统：

```text
按风格语义分类
```

---

## 示例

衣橱不是：

- 裤子
- 上衣
- 外套

而是：

| Semantic | 代表含义 |
|---|---|
| Clean | 干净简约 |
| Soft | 柔和自然 |
| Urban | 都市感 |
| Active | 活力运动 |
| Relaxed | 松弛感 |

---

## 系统能力

系统能够：

- 自动识别衣物语义
- 自动聚类相似风格
- 分析衣橱风格比例
- 找出缺失风格

---

# 05 — 新单品匹配分析（Outfit Compatibility Analysis）

## 概念

用户上传：

- 想购买的新衣服

系统分析：

> 该单品是否适合现有衣橱。

---

## 分析维度

例如：

| 维度 | 影响 |
|---|---|
| Comfort | 是否提升舒适度 |
| Urban | 是否增强都市感 |
| Active | 是否符合活动风格 |
| Clean | 是否破坏整体 clean 风格 |

---

## 输出结果

例如：

```text
匹配度：84%
```

原因：

```text
✓ 提升整体都市感
✓ 保持低饱和配色
✓ 与现有裤装高度兼容
✓ 风格一致性较高
```

---

# 系统核心理念（Core Philosophy）

本系统不是：

```text
识别衣服
```

而是：

> 理解穿搭背后的风格语义与情绪感知。

---

# 产品关键词（Keywords）

- Fashion Intelligence
- Style DNA
- Fashion Semantics
- Outfit Psychology
- Semantic Closet
- Style Embedding
- Fashion Cognition

---

# UI / UX 方向

## 推荐视觉风格

- Editorial Layout
- Quiet Luxury
- Minimal Interface
- Soft Neutral Palette
- Spatial Design
- Typography-driven UI

---

## 参考品牌 / 网站

- COS
- Aesop
- Apple
- Pinterest
- Are.na

---

# 最终一句话定位

> 一个基于 Fashion Semantics 与 Style DNA 的穿搭智能分析系统。

