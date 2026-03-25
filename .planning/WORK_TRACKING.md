# Work Tracking

## 2026-03-03

### What did we implement?
- Initialized full `.planning` artifact set for GSD startup.
- Created project baseline docs: PROJECT, REQUIREMENTS, ROADMAP, STATE, config.
- Added domain research docs with Context7-informed stack and architecture notes.
- Added product and engineering specs: PRD, frontend spec, backend spec, database design, API spec, feature list.
- Implemented runnable V1 front-end prototype files: `index.html`, `styles.css`, `main.js`.
- Added local-device memory persistence, per-character memory retrieval, and memory keyword search.
- Added V1-V3 staged delivery document with local-memory-first strategy.

### What problems did we encounter?
- Source website content fetch was unstable/time-out, so direct page extraction was not reliable.
- No existing codebase scaffold in workspace, requiring documentation-first initialization.

### How did we fix these issues?
- Used user-provided screenshots and interaction description as primary behavioral reference.
- Used Context7 documentation retrieval to anchor technology and implementation best practices.
- Established a complete planning baseline before writing runtime code to avoid context drift.
- Used local storage memory strategy for faster MVP iteration before backend memory service.

### Lessons and reusable decisions
- For simulation-heavy mobile H5, performance architecture must be decided before implementation.
- Persona consistency and memory scoping should be designed as first-class requirements, not post-fixes.

## 2026-03-04

### What did we implement?
- **聊天弹框文字溢出彻底修复**：将 `.chat-modal-card` 加上 `max-height: 92dvh` 和 `overflow: hidden`，`.chat-log` 改为 `flex: 1 1 0; min-height: 0; overflow-y: auto`，让聊天日志自适应剩余空间，彻底杜绝文字溢出。
- **速度调整**：`SPEED_MULTIPLIER` 从 2.35 降至 1.2，人物移动更缓和自然。
- **人群多层纵深分布重构**：
  - 将人物从底部2%窄带扩展到屏幕52%-90%的纵深区域（手机端）。
  - 人物Y坐标随机分布后，缩放和速度根据纵深位置动态计算：远处（Y小）人物小且慢，近处（Y大）人物大且快。
  - 渲染已有Y排序（远先近后），遮挡关系自然正确。
  - 背景底部改为柔和渐变代替之前的硬色带。
  - 清理了不再使用的 `CROWD_Y_OFFSET` 常量。

### What problems did we encounter?
- `.chat-log` 使用固定 `max-height: 34dvh` 无法自适应不同屏幕高度和弹框内其他元素占用空间，导致文字溢出弹框边界。
- 所有人物挤在底部2%的窄带，缺乏层次感和呼吸空间。

### How did we fix these issues?
- 将 `.chat-log` 从固定 max-height 改为 flex 弹性布局（`flex: 1 1 0; min-height: 0`），由 `.chat-modal-card` 的 `max-height` 限制整体高度，`.chat-log` 自动占据除头像/输入框外的全部剩余空间。
- 重构 `buildDensityProfile` 返回 `bandTop/bandBottom/scaleFar/scaleNear/speedFar/speedNear`，`createPerson` 基于Y位置的depth比例插值计算scale和speed，实现"远小近大、远慢近快"的透视层次效果。

### 2026-03-04 (续)

#### What did we implement?
- **人物数量翻倍至40个**：`buildDensityProfile` 手机端 count 从20增至40，平板端50，桌面端60。
- **底部人物完整可见**：`bandBottom` 从超出屏幕的 `height*1.06` 改为 `height*0.93`，确保角色不被屏幕底部截断。
- **新增20个丰富角色**（char-021 至 char-040）：
  - 徐半夏（中医推拿师）、马小野（探险向导）、郭星辰（天文馆讲师）、赵知行（法律援助律师）、吴晚秋（花艺师）、孙铁柱（外卖骑手）、林墨白（书法老师）、周小鱼（幼儿园老师）、王大山（木工匠人）、李小禾（有机农场主）、钱多多（理财规划师）、沈梦溪（占星师）、黄小米（烘焙师）、陆小风（太极拳教练）、许青云（图书管理员）、方小圆（似颜绘画师）、唐小宁（急救培训师）、江小晚（深夜电台主播）、秦老六（出租车司机）、萧然（冥想引导师）。
  - 每个角色均有独特的 personality、speakingStyle、trait、bio。
- **Registry版本升级为v4**：确保用户清除旧缓存自动加载新的40人角色表。
- **地面渐变起始位置上移**：从 `0.72` 调至 `0.46`，适配人物更广阔的纵深分布。

#### What problems did we encounter?
- StrReplace 工具在包含中文全角引号的字符串替换时匹配失败。

#### How did we fix these issues?
- 改用更精准的周边上下文进行字符串定位，避免含特殊Unicode字符的段落匹配失败。

### 2026-03-04 (聊天体验深度升级)

#### What did we implement?
- **修复回复慢/需发两次问题**：server.js API 超时从 5s 提升到 12s；前端 greeting 超时从 2s 提升到 5s；requestAIWithRetry 默认重试次数从 2 改为 3。
- **输入状态移到底部**：chat-status 从 chat-log 上方移到下方（quick-replies 上方），打字时自动滚动到最新位置。
- **40个角色全部添加 deepPersonality 暗面性格**：每个角色有独特的"真实人格"（如控制欲、社恐、贴吧风、公主病、吹毛求疵等），通过 Node 脚本批量注入。
- **性格渐显系统**：buildSystemPrompt 接收 turnCount，前4轮只展示表面性格，5-10轮约30%概率露出真实一面，10轮以上完全展现 deepPersonality。
- **聊天节奏真实化**：prompt 加入详细节奏规则——大部分1-2句短回、偶尔惜字如金（"嗯""哈哈"）、偶尔长篇、有反问/岔题/追问变化，禁止每次整齐2-4句。
- **3条宇宙观暗线故事**：
  1. "深夜便利店"：城南24小时便利店凌晨3点的怪事（5个角色各有不同版本）
  2. "消失的街头画家"：画谁像谁的老人突然消失（5个角色各有线索）
  3. "天台的钢琴声"：满月夜天台传来钢琴声但无人无琴（5个角色各有体验）
  - 通过 getWorldLore(characterId) 按角色分配独特知情片段，只在用户主动聊到相关话题时才自然提起。
- **Registry 升级为 v5**：新增 hasDeep 检查，强制刷新加载新角色数据。

#### What problems did we encounter?
- 40个角色批量添加字段时，StrReplace 逐个操作风险高且效率低。
- PowerShell 不支持 `&&` 链接命令。

#### How did we fix these issues?
- 编写 Node.js 脚本 `_add_deep.js` 通过 indexOf 精确定位每个角色的 `friends: []` 行前插入 deepPersonality 字段，执行后删除脚本。
- PowerShell 中使用 `;` 替代 `&&` 来链接命令。

## 2026-03-09

### What did we implement?
- Added .planning/GAMEPLAY_TODO.md as the long-term gameplay and experience optimization checklist.
- Structured the checklist around three major directions: realistic social normal mode, more professional explore mode, and cross-mode integration.
- Added checkbox-based tracking rules so future updates can be marked in one place and recorded back into work tracking.
- Added `.planning/CORE_CHARACTER_CARDS_V1.md` with six priority character cards for content and gameplay alignment.
- Finalized V1 content baselines for: 陈小夜、林小夏、吴晚秋、沈听澜、方小圆、苏绵.
- Marked the corresponding item in `.planning/GAMEPLAY_TODO.md` as completed.
- Added `.planning/NORMAL_MODE_UPGRADE_V1.md` to define the normal-mode product upgrade from passive chat into an online social space.
- Documented V1 rules for proactive character contact, lightweight pass-by interactions, daily status, user social impression, relationship state, and cross-character weak links.
- Marked the corresponding normal-mode planning item in `.planning/GAMEPLAY_TODO.md` as completed.
- Added `.planning/EXPLORE_CONVENIENCE_STORE_V1.md` as the professional explore-mode story skeleton for `深夜便利店`.
- Defined the story's four-act structure, character roles, key choice consequences, reversal design, ending directions, and cross-mode integration hooks.
- Marked the corresponding convenience-store explore planning item in `.planning/GAMEPLAY_TODO.md` as completed.
- Added `.planning/NORMAL_MODE_SOCIAL_SYSTEM_V1.md` to define the normal-mode social system in a more executable form.
- Documented V1 rules for relationship states, user social impressions, six-character proactive trigger scenes, and frequency strategies.
- Marked the corresponding normal-mode social-system planning item in `.planning/GAMEPLAY_TODO.md` as completed.
- Added `.planning/PROACTIVE_MESSAGE_PACK_V1.md` as the first proactive-message sample pack for the six core characters.
- Wrote V1 proactive dialogue examples for 陈小夜、林小夏、吴晚秋、沈听澜、方小圆、苏绵, grouped by scene type and tone boundaries.
- Marked the corresponding proactive-message planning item in `.planning/GAMEPLAY_TODO.md` as completed.
- Added `.planning/SHARED_WORLD_LINKS_V1.md` to define the first shared-world content pool for public places, rumors, and weak-link dialogue.
- Built V1 shared content around six recurring locations, four recurring rumors, and multi-character weak-link line patterns.
- Marked the corresponding shared-world planning item in `.planning/GAMEPLAY_TODO.md` as completed.
- Added `.planning/USER_SOCIAL_IMPRESSION_MATRIX_V1.md` to formalize how users are perceived by characters in the social layer.
- Defined V1 impression categories, major user impression labels, cross-character interpretation differences, and how impressions influence proactive messages and story entry.
- Marked the corresponding user-impression planning item in `.planning/GAMEPLAY_TODO.md` as completed.
- Added `.planning/EXPLORE_CONVENIENCE_STORE_SCENES_V1.md` to detail the scene-by-scene explore-mode script structure for `深夜便利店`.
- Added `.planning/EXPLORE_MISSING_PAINTER_V1.md` as the second major explore-mode story skeleton with theme, act structure, role split, reversal design, and endings.
- Marked the corresponding convenience-store scene-script item and missing-painter explore item in `.planning/GAMEPLAY_TODO.md` as completed.

### What did we implement next?
- Added a new character `超级峰` into the default role registry in `main.js`.
- Mapped the content from `超级峰.md` into the project's existing character fields: `personality`, `speakingStyle`, `trait`, `bio`, and `deepPersonality`.
- Bumped `REGISTRY_VERSION` from `v5` to `v6` so existing local caches refresh and load the new character roster.
