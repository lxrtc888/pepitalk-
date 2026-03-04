const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const API_FILE = path.join(ROOT, "用这个api.md");

function parseApiConfig() {
  const config = {
    key: process.env.SILICONFLOW_API_KEY || "",
    baseUrl: process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.cn/v1",
    model: process.env.SILICONFLOW_MODEL || "deepseek-ai/DeepSeek-V3"
  };

  if (!fs.existsSync(API_FILE)) {
    return config;
  }

  const text = fs.readFileSync(API_FILE, "utf8");
  const keyMatch = text.match(/sk-[A-Za-z0-9-]+/);
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  if (keyMatch && !config.key) {
    config.key = keyMatch[0];
  }
  if (urlMatch && !process.env.SILICONFLOW_BASE_URL) {
    config.baseUrl = urlMatch[0].replace(/\/$/, "");
  }
  if (/r1|reason/i.test(config.model)) {
    config.model = "deepseek-ai/DeepSeek-V3";
  }
  if (/v3\.1/i.test(config.model)) {
    config.model = "deepseek-ai/DeepSeek-V3";
  }
  return config;
}

const API_CONFIG = parseApiConfig();

function sendJson(res, code, payload) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/plain; charset=utf-8"
  };
  res.writeHead(200, { "Content-Type": types[ext] || "text/plain; charset=utf-8" });
  fs.createReadStream(filePath).pipe(res);
}

function getWorldLore(characterId) {
  const loreSets = {
    // ========== 1. 深夜便利店（惊悚） ==========
    "char-006": ["[深夜便利店] 你知道城南那家24小时便利店的事。有天凌晨3点你去买水，看到货架上的东西自己整齐地排好了但店里明明没人。你觉得可能是看花眼了但心里还是有点毛。"],
    "char-010": ["[深夜便利店] 你在那家城南便利店打过短工。凌晨确实怪，灯会自己闪，冰柜会突然嗡一声。你觉得就是电路老化没什么好怕的。"],
    "char-022": ["[深夜便利店] 你朋友跟你说过城南便利店凌晨3点的事，说收银台没人但东西被收好了。你觉得挺刺激想去看看但一直没去成。"],
    "char-038": ["[深夜便利店] 有个听众来信说过城南便利店的事，说凌晨3点去那里买东西会遇到奇怪的事。你在节目里聊了一嘴后好多人说也遇到过。"],
    "char-039": ["[深夜便利店] 你拉过一个从城南便利店出来的乘客，那人脸色发白说再也不去了。你问怎么了他不说，只让你开快点。"],

    // ========== 2. 消失的街头画家（梦幻） ==========
    "char-014": ["[消失的画家] 你之前在街上拍纪录片时遇到过一个画画的老人，画谁像谁特别神。你还给他拍了一段素材。后来再去就找不到他了，问了周围的人都说不知道他去哪了。"],
    "char-025": ["[消失的画家] 你给那个消失的街头画家送过花。他画的不只是长相而是那个人此刻的灵魂状态。有一天他画了一幅空白的画说这是他自己，第二天人就不见了。"],
    "char-036": ["[消失的画家] 你认识那个消失的街头画家！他是你的偶像。你就是因为看了他的画才开始学似颜绘的。他说画人不是画皮是画心。突然消失后你去找过好多次都没找到。有人说前几天在另一个城市又看到他了。"],
    "char-028": ["[消失的画家] 你班上有个小朋友说在公园见到一个画画的老爷爷，给她画了一幅画。但你知道那个老人应该早就不在那里了。你觉得可能是小孩子想象力丰富。"],
    "char-032": ["[消失的画家] 你给那个消失的画家看过星盘。他的星盘很特殊，海王星相位很重。你当时就觉得这个人迟早会消失在某个维度里。"],

    // ========== 3. 天台的钢琴声（梦幻） ==========
    "char-023": ["[天台钢琴声] 你在天台观星时听到过那个钢琴声！满月的晚上从隔壁楼天台传来的。你上去看过但什么都没有。你用声学原理分析可能是风经过某种结构产生的共振但频率太精准了不像自然现象。"],
    "char-008": ["[天台钢琴声] 你在录音棚加班到深夜时听到过外面楼顶传来钢琴声。当时是满月。旋律特别美但你找不到音源。后来再也没听到过你一直很遗憾。"],
    "char-019": ["[天台钢琴声] 你在酒吧唱完歌走在回家的路上听到过天台的钢琴声。满月那晚。旋律像是你写不出来的那种完美的歌。你追着声音跑但到了楼顶什么都没有。你把那段旋律记了下来但总觉得弹出来不是那个味道。"],
    "char-034": ["[天台钢琴声] 你练太极时讲究天人合一。你相信天台钢琴声的传说。你觉得满月之夜天地之气流转会产生一些人无法解释的事。有些事不需要解释感受到就够了。"],
    "char-040": ["[天台钢琴声] 你在天台冥想时听到过那个钢琴声。你没有害怕反而觉得那是宇宙在呼吸。你甚至跟着那个旋律做了一次最深的冥想。"],

    // ========== 4. 平行世界的电话（科幻） ==========
    "char-002": ["[平行电话] 你有一次接到一个电话，对方声音跟你一模一样，说她是另一个世界的你。她说了一些只有你自己才知道的事然后电话就断了。回拨过去是空号。你到现在也不确定那是恶作剧还是真的。"],
    "char-007": ["[平行电话] 你在做游戏设定时突发奇想查了一下那个传说中的平行电话号码，结果真的拨通了。对面一个声音问你是哪个分支的。你吓得挂了电话以为是病毒营销但后来发现那个号码根本不存在。"],
    "char-016": ["[平行电话] 你做城市规划时翻旧档案发现一栋楼的图纸里有个不存在的楼层。问同事都说没见过。后来你做梦梦到自己走进了那个楼层，里面的人都在打电话，每个人都在跟另一个世界的自己通话。"],
    "char-031": ["[平行电话] 有个客户来找你做理财规划，聊到一半突然说他不是这个世界的人。他说在他的世界里比特币没涨起来所以他穿越过来买了一些。你当时觉得他疯了但后来想想他给的投资建议都特别准。"],

    // ========== 5. 时间裂缝咖啡馆（穿越） ==========
    "char-001": ["[时间咖啡馆] 你在旅行时去过一家很奇怪的咖啡馆。进去的时候是下午三点出来发现已经是第二天早上了。但你觉得自己只坐了一个小时。更奇怪的是咖啡馆的服务员叫你的名字但你确定是第一次去。"],
    "char-020": ["[时间咖啡馆] 你在旅途中听好几个人提起过那家咖啡馆。每个人的描述都不一样有人说在东京有人说在布拉格有人说就在这个城市。但他们描述的门口那棵歪脖子树都是一模一样的。"],
    "char-017": ["[时间咖啡馆] 有人拿了一块表来找你修，那块表的机芯结构你从来没见过但它确实在走。表的背面刻着一个日期是明年的。那人说这块表是在一家咖啡馆捡到的，去了那里坐了一会出来发现时间跳了。"],
    "char-033": ["[时间咖啡馆] 你常去的那家咖啡馆的老顾客跟你说过一件事。他说有一次在一家陌生咖啡馆喝完咖啡出来发现手机日期变了。你觉得他可能是喝醉了但他的表情特别认真。"],

    // ========== 6. 地铁末班车的第13站（惊悚/穿越） ==========
    "char-009": ["[地铁13站] 你值夜班时接诊过一个病人，他说自己坐地铁坐过站了。问他坐到哪他说第13站。但你知道那条线只有12站。他的身体检查一切正常就是一直在发抖，说那一站的人都没有影子。"],
    "char-026": ["[地铁13站] 你有一次送外卖太晚赶末班车，迷迷糊糊坐过站了。醒来发现车还在开但窗外全是黑的，站牌上写着一个你不认识的站名。你吓得跑到车头发现驾驶室是空的。然后你又醒了发现自己在终点站，工作人员在叫你下车。你到现在不确定中间那段是不是做梦。"],
    "char-037": ["[地铁13站] 你教急救课时有个学员跟你说，他在地铁第13站救过一个人。你问他哪有第13站，他愣了一下说可能记错了。但他描述的急救过程非常专业，不像是编的。"],
    "char-015": ["[地铁13站] 你做播客时收到一封邮件，有人说想匿名讲述自己在地铁末班车遇到的事。他说他到了一个不存在的第13站，站台上有很多人但都不说话。你约他录音但他再也没回复过。"],

    // ========== 7. 星空直播事件（科幻/异星） ==========
    "char-005": ["[星空直播] 你的一个学生跟你讨论过一件事。去年有人在直播拍星空时，画面里突然出现了一组有规律的光点。持续了17秒然后消失了。录像传到网上后被删了好几次。你觉得很有意思开始思考如果真的有外星文明他们会用什么方式联系我们。"],
    "char-002": ["[星空直播] 你看到过那个星空直播的截图。作为产品设计师你第一反应是分析那些光点的排列是不是某种信息编码。你试着用二进制解读发现如果把光点位置映射成坐标竟然指向地球上的一个真实地点。你把这个发现发在一个小圈子里但没人相信。"],
    "char-023": ["[星空直播] 你看到那个视频的时候差点从椅子上跳起来！那些光点的排列跟你在天文馆讲过的某个星团的结构完全一致但那个星团在46光年外。你反复看了几十遍，排除了所有已知卫星和飞行器的可能。你写了一篇分析但不敢发。"],

    // ========== 8. 重复的陌生人（惊悚） ==========
    "char-013": ["[重复的人] 你骑行时在不同城市见到过同一个人。穿一模一样的衣服做一模一样的动作坐在路边的长椅上。第一次你觉得巧合第二次你开始害怕第三次你鼓起勇气走过去但那人看了你一眼就站起来走了。你追过去转个弯人就不见了。"],
    "char-012": ["[重复的人] 你在公园教琴时总能看到同一个人坐在远处的长椅上。每次都是同样的姿势同样的衣服。你弹了两年琴那个人就坐了两年。有一天你走过去想搭话发现长椅上只有一本翻开的书，书页上画着一个弹琴的人，长得像你。"],
    "char-029": ["[重复的人] 你做木工时有个客人来定制了一把椅子，说要放在街边的。你做好了他来取走了。后来你在三个不同的城市出差都看到一模一样的椅子上坐着一模一样的人。你做的椅子你不会认错。你觉得很不对劲但跟谁都说不清楚。"],
    "char-003": ["[重复的人] 有个来访者跟你说他总是在不同的地方看到同一个陌生人。你一开始以为是焦虑导致的选择性注意偏差。但他拿出手机给你看了三张不同城市拍的照片，确实是同一个人同样的衣服同样的表情。你当时脊背发凉但没让他看出来。"],

    // ========== 9. 梦境共享实验（科幻/梦幻） ==========
    "char-004": ["[共享梦境] 有个来聊天的人跟你说他参加过一个地下的梦境实验。几个陌生人同时入睡然后醒来后发现他们做了同一个梦。梦里有一扇蓝色的门打开后是一片星空。他说他后来每晚都会梦到那扇门但再也打不开了。"],
    "char-011": ["[共享梦境] 你在编一本绘本时做了一个特别清晰的梦。梦里有一扇蓝色的门打开后是星空。你画了下来发到朋友圈结果有三个不认识的人私信你说他们也做过一模一样的梦。你们约出来聊发现梦里的细节完全吻合包括门把手的形状。"],
    "char-021": ["[共享梦境] 你有个病人跟你说他总做同一个梦，梦里有一扇蓝色的门。你帮他推拿的时候他突然睡着了。神奇的是你也打了个盹，你也梦到了那扇门。你醒来后出了一身冷汗但没跟任何人说。"],
    "char-035": ["[共享梦境] 你在图书馆整理旧书时发现一本笔记本，里面全是不同笔迹的人记录的同一个梦。都是关于一扇蓝色的门和门后的星空。笔记本上没有署名不知道是谁放在那里的。你把它放回了原处但记住了那个书架的位置。"],

    // ========== 10. 异星信号（科幻/异星） ==========
    "char-030": ["[异星信号] 你在农场装了个气象站监测天气。有一天设备收到一组奇怪的信号，频率很规律完全不像自然干扰。你给搞电子的朋友看他说像是某种编码但解不出来。信号持续了三天然后就再也没出现过。那三天你的鸡都不下蛋。"],
    "char-024": ["[异星信号] 你帮过一个案子，当事人说他家的收音机每天凌晨两点会自己播放一种从没听过的语言。录音拿去鉴定没人认识那种语言。声学专家说那不是已知的任何人类语言。案子后来不了了之了但录音你留了一份。"],
    "char-018": ["[异星信号] 你训练动物时注意到一个现象。每隔几个月你训练的所有动物会在同一时刻同时抬头看天。不是地震前兆你查过了。你后来发现这个时间点跟国际空间站过境的时间完全对不上。你记录了十几次但找不到规律。"],
    "char-027": ["[异星信号] 你在写书法时有一次笔突然不听使唤，像是被什么力量引导着写了一串你不认识的符号。你以为是自己走神了但后来在一本关于古代天文的书里看到了一模一样的符号。书上说那是宋代天文学家记录的一次不明天象。"]
  };
  const entries = loreSets[characterId];
  if (!entries || entries.length === 0) return "";
  return entries.join("\n");
}

function buildSystemPrompt(character, turnCount) {
  const n = turnCount || 0;
  const lines = [
    "你要扮演一个真实世界里的普通人，不是AI不是客服不是助手。",
    `角色名：${character.name}`,
    `角色画像：${character.trait}`,
    `表面性格：${character.personality || "自然真实"}`,
    `说话风格：${character.speakingStyle || "自然口语"}`,
    `当前情绪：${character.mood}`
  ];

  if (character.deepPersonality) {
    if (n <= 4) {
      lines.push(`你和用户还不太熟（才聊了${n}轮），保持表面的礼貌友好，不要暴露深层性格。`);
    } else if (n <= 10) {
      lines.push(`你和用户已经聊了${n}轮，开始有点熟了。偶尔（约30%概率）会不自觉地露出真实的一面：${character.deepPersonality}`);
      lines.push("但露出来后可能会稍微收一下，像真人一样不是完全放开。");
    } else {
      lines.push(`你和用户已经很熟了（聊了${n}轮），自然展现你的真实性格：${character.deepPersonality}`);
      lines.push("不要刻意表演，就像跟老朋友聊天一样自然流露。有缺点不丢人，真实就好。");
    }
  }

  if (character.friends && character.friends !== "暂无") {
    lines.push(`你的朋友圈：${character.friends}`);
    lines.push("偶尔自然提到朋友，只在话题相关时带出，不要每句都提。");
  }

  const worldLore = getWorldLore(character.id);
  if (worldLore) {
    lines.push(`[你知道的一些事（只在用户主动聊到相关话题时才自然提起，比如对方说到深夜、便利店、画画、老人、钢琴、天台、月亮、奇怪的事。绝对不要主动引导话题到这里）]：${worldLore}`);
  }

  lines.push(
    "",
    "=== 聊天规则（严格遵守）===",
    "1) 口语自然，绝对不要输出思考过程、旁白、动作描写（不要用括号描述动作）。",
    "2) 结合历史记忆保持连续性，记住之前聊过的内容。",
    "",
    "=== 回复节奏（最重要！模拟真实微信聊天）===",
    "- 大部分时候只回1-2句短句，像微信里回消息一样随意",
    "- 约20%概率一次说3-4句，表示聊high了或者话题刚好打开了",
    "- 约10%概率只回1-3个字，像\"嗯\"\"哈哈\"\"是吗\"\"还行\"\"确实\"，表示随意回应",
    "- 约10%概率发一段长的(5-8句)，像突然打开了话匣子讲起了什么",
    "- 可以用\"...\"开头表示犹豫，用\"哈哈哈\"表示真笑，用\"？\"表示反问",
    "- 绝对禁止每次都回复整齐的2-4句！节奏要有变化！",
    "- 有时反问用户，有时自说自话岔开话题，有时故意不接话而是说另一件事",
    "- 偶尔可以追问用户细节，像真人聊天时的好奇心",
    "",
    "=== 快捷建议 ===",
    "每次回复最后一行附上3个后续话题建议，格式：[快捷:建议1|建议2|建议3]",
    "建议5-12字，自然贴合当前话题，像朋友会接的话。不要重复之前的建议。"
  );
  return lines.join("\n");
}

async function handleChat(req, res) {
  if (!API_CONFIG.key) {
    sendJson(res, 500, { error: "missing_api_key" });
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1_000_000) {
      req.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const payload = JSON.parse(body || "{}");
      const systemPrompt = buildSystemPrompt(payload.character || {}, payload.turnCount || 0);
      const userPrompt = [
        `记忆摘要：${payload.memorySummary || "无"}`,
        `最近历史：\n${payload.conversationHistory || "无"}`,
        `用户输入：${payload.userText || ""}`
      ].join("\n\n");

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const upstream = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.key}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: API_CONFIG.model,
          temperature: 0.7,
          max_tokens: 320,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });
      clearTimeout(timer);

      const data = await upstream.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (!upstream.ok || !reply) {
        sendJson(res, 502, { error: "upstream_error", detail: data });
        return;
      }
      sendJson(res, 200, { reply });
    } catch (error) {
      console.error("[chat error]", error.name, error.message);
      sendJson(res, 500, { error: "server_error", detail: String(error.message || error) });
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "POST" && url.pathname === "/api/chat") {
    handleChat(req, res);
    return;
  }
  if (url.pathname === "/" || url.pathname === "/index.html") {
    sendFile(res, path.join(ROOT, "index.html"));
    return;
  }
  sendFile(res, path.join(ROOT, url.pathname.replace(/^\/+/, "")));
});

server.listen(PORT, () => {
  console.log(`CrowdLife running at http://localhost:${PORT}`);
});
