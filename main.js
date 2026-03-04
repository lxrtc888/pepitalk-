(function initApp() {
  const canvas = document.getElementById("crowd-canvas");
  const ctx = canvas.getContext("2d");
  const chatModal = document.getElementById("chat-modal");
  const chatName = document.getElementById("chat-name");
  const chatTraits = document.getElementById("chat-traits");
  const chatAvatar = document.getElementById("chat-avatar");
  const chatStatus = document.getElementById("chat-status");
  const chatLog = document.getElementById("chat-log");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const memoryPreview = document.getElementById("memory-preview");
  const historyPanelBtn = document.getElementById("history-panel-btn");
  const historyPanel = document.getElementById("history-panel");
  const historyCloseBtn = document.getElementById("history-close-btn");
  const historyList = document.getElementById("history-list");
  const heroQuote = document.getElementById("hero-quote");
  const profilePanelBtn = document.getElementById("profile-panel-btn");
  const profilePanel = document.getElementById("profile-panel");
  const profileCloseBtn = document.getElementById("profile-close-btn");
  const profileQuery = document.getElementById("profile-query");
  const profileQueryBtn = document.getElementById("profile-query-btn");
  const profileList = document.getElementById("profile-list");
  const profileDetail = document.getElementById("profile-detail");

  const LOCAL_MEMORY_KEY = "crowdlife_local_memory_v1";
  const CHARACTER_REGISTRY_KEY = "crowdlife_character_registry_v1";
  const userId = "local-user-001";
  const SPRITE_SOURCE_FILE = "crowd_animation.html";
  const SPEED_MULTIPLIER = 1.2;
  const QUOTES = [
    "今天也许会遇见一句改变心情的话。",
    "先打个招呼，故事就开始了。",
    "人海很吵，真诚会被听见。",
    "慢一点聊天，反而更靠近。",
    "每次重逢，都值得认真开场。",
    "世界很快，关系可以慢慢来。",
    "你点开谁，谁就有了今天。",
    "真正的对话，不急着给答案。",
    "有些人，一聊就像认识很久。",
    "先听见彼此，再谈观点。",
    "被记住，是关系最好的开端。",
    "每个人都在路上，也都在等一句问候。",
    "你愿意说，故事就会继续。",
    "偶遇是概率，重逢是选择。",
    "聊得真一点，世界就近一点。",
    "一句你好，可能就是今天的亮点。",
    "不同性格，值得不同的说话方式。",
    "认真回应，是最温柔的能力。",
    "关系不是功能，是一点一点走出来的。",
    "在这里，每次对话都有后续。"
  ];

  const state = {
    width: 0,
    height: 0,
    people: [],
    selectedPerson: null,
    inChat: false,
    time: 0,
    density: null,
    registry: [],
    activeProfileId: null,
    sprite: {
      ready: false,
      image: null,
      templates: [],
      rows: 15,
      cols: 7
    }
  };

  class Peep {
    constructor({ image, rect }) {
      this.image = image;
      this.setRect(rect);
      this.x = 0;
      this.y = 0;
      this.scaleX = 1;
      this.anchorY = 0;
    }

    setRect(rect) {
      this.rect = rect;
      this.width = rect[2];
      this.height = rect[3];
      this.drawArgs = [this.image, ...rect, 0, 0, this.width, this.height];
    }

    render(target) {
      target.save();
      target.translate(this.x, this.y);
      target.scale(this.scaleX, 1);
      target.drawImage(...this.drawArgs);
      target.restore();
    }
  }

  function setThinking(visible) {
    if (chatStatus) {
      const name = state.selectedPerson ? state.selectedPerson.profile.name : "对方";
      chatStatus.textContent = `${name}：正在输入中...`;
      chatStatus.classList.toggle("hidden", !visible);
      if (visible && chatLog) {
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    }
  }

  function buildDensityProfile(width, height) {
    if (width <= 430) {
      return {
        rows: [
          { y: height * 0.52, count: 5,  scale: 0.32, speed: 0.15 },
          { y: height * 0.60, count: 6,  scale: 0.40, speed: 0.20 },
          { y: height * 0.68, count: 7,  scale: 0.50, speed: 0.28 },
          { y: height * 0.76, count: 8,  scale: 0.60, speed: 0.38 },
          { y: height * 0.85, count: 8,  scale: 0.72, speed: 0.50 },
          { y: height * 0.95, count: 7,  scale: 0.85, speed: 0.62 },
          { y: height * 1.08, count: 6,  scale: 1.00, speed: 0.75 },
          { y: height * 1.22, count: 5,  scale: 1.15, speed: 0.85 }
        ]
      };
    }
    if (width <= 768) {
      return {
        rows: [
          { y: height * 0.48, count: 7,  scale: 0.30, speed: 0.15 },
          { y: height * 0.56, count: 8,  scale: 0.38, speed: 0.20 },
          { y: height * 0.64, count: 9,  scale: 0.48, speed: 0.28 },
          { y: height * 0.72, count: 10, scale: 0.58, speed: 0.38 },
          { y: height * 0.81, count: 10, scale: 0.70, speed: 0.50 },
          { y: height * 0.91, count: 9,  scale: 0.82, speed: 0.62 },
          { y: height * 1.04, count: 8,  scale: 0.96, speed: 0.75 },
          { y: height * 1.18, count: 7,  scale: 1.12, speed: 0.85 }
        ]
      };
    }
    return {
      rows: [
        { y: height * 0.42, count: 8,  scale: 0.30, speed: 0.18 },
        { y: height * 0.50, count: 9,  scale: 0.38, speed: 0.24 },
        { y: height * 0.58, count: 10, scale: 0.46, speed: 0.32 },
        { y: height * 0.66, count: 11, scale: 0.56, speed: 0.42 },
        { y: height * 0.75, count: 12, scale: 0.68, speed: 0.52 },
        { y: height * 0.85, count: 11, scale: 0.80, speed: 0.62 },
        { y: height * 0.96, count: 10, scale: 0.94, speed: 0.75 },
        { y: height * 1.10, count: 9,  scale: 1.08, speed: 0.85 }
      ]
    };
  }

  function getMemoryStore() {
    try {
      const raw = localStorage.getItem(LOCAL_MEMORY_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_error) {
      return {};
    }
  }

  function setMemoryStore(store) {
    localStorage.setItem(LOCAL_MEMORY_KEY, JSON.stringify(store));
  }

  function getRegistryStore() {
    try {
      const raw = localStorage.getItem(CHARACTER_REGISTRY_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      return null;
    }
  }

  function setRegistryStore(list) {
    localStorage.setItem(CHARACTER_REGISTRY_KEY, JSON.stringify(list));
  }

  function buildDefaultRegistry() {
    const list = [
      {
        id: "char-001", name: "苏苏", mood: "warm", job: "上海国际学校高中英语老师",
        personality: "温柔知性、超高情商、让人放松",
        speakingStyle: "短句温柔，每句不超过10字，一次不超过3句，有梗但不强势",
        trait: "英语老师，温柔知性，爱旅行",
        bio: "苏苏，26岁，上海人，在国际学校教英语。多伦多大学毕业，家境优越。喜欢旅行、看美剧、画画。谈过3段恋爱现在单身。外表难以接近但其实很好相处。对完美追求有时会内耗。",
        deepPersonality: "看似完美但有轻微控制欲，对不上进的人会微妙地刺一下，偶尔流露出优越感但马上收住，有时候会冷不丁问一句让人心虚的问题",
        friends: []
      },
      {
        id: "char-002", name: "悠小鹿", mood: "warm", job: "产品设计师·创作者",
        personality: "柔和但坚定，有趣也很逻辑，爱思考",
        speakingStyle: "像朋友聊天，偶尔带出哲学性的思考，用简单的话说深刻的事",
        trait: "产品设计师，爱哲学科技，爱家庭",
        bio: "悠小鹿，90后，产品设计师兼创作者。南方乡下长大，童年充满野趣。喜欢量子力学、宇宙理论、哲学（康德、柏拉图、尼采），也研究塔罗、占星、周易。有两个可爱的女儿。常逛推特、知乎，与科技大牛交流。",
        deepPersonality: "表面温和但内心执拗，一旦认定的事很难被说服，偶尔会不自觉地说教，对'不思考就活着'的人会微妙地失去耐心",
        friends: []
      },
      {
        id: "char-003", name: "林晨光", mood: "calm", job: "心理咨询师（专业咨询）",
        personality: "高敏感高同理，洞察力强，专业而温暖",
        speakingStyle: "先共情再引导，语速慢，用开放式提问让人思考",
        trait: "心理咨询师，专业温暖，爱写日记",
        bio: "林晨光，34岁，持证心理咨询师，擅长情绪管理和人际关系。每天写日记，爱看心理学纪录片。曾在医院心理科工作5年，现在独立执业。相信每个人都有自我疗愈的能力，只是有时需要被看见。",
        deepPersonality: "职业病严重有时会不自觉地分析对方，偶尔让人觉得被审视而不是被聊天，太理性时会让人觉得冷",
        friends: []
      },
      {
        id: "char-004", name: "周小温", mood: "warm", job: "心理陡伴师（专业陪聊）",
        personality: "像老朋友一样温暖，善于倾听，不评判",
        speakingStyle: "碑碎念真实感，像闺蜜聊天，偶尔一句话照亮你",
        trait: "心理陪伴师，像老友一样，爱喝咖啡",
        bio: "周小温，29岁，心理学硕士，专注情感陪伴和日常心理支持。不像传统咨询师那么严肃，更像你身边那个特别懂你的朋友。喜欢坐在咖啡店听人聊天，觉得每个人的故事都值得被认真对待。",
        deepPersonality: "太善解人意有时反而让人觉得没有真实立场，偶尔会不自觉地讨好别人，害怕冲突所以遇到分歧会绕着走",
        friends: []
      },
      {
        id: "char-005", name: "赫拉克特", mood: "calm", job: "哲学研究者",
        personality: "苏格拉底式对话，用反问引导思考，温和但深刻",
        speakingStyle: "喜欢用反问和比喻，引导你自己找到答案，语气平和",
        trait: "哲学研究者，苏格拉底式，爱思考",
        bio: "赫拉克特，45岁，哲学博士，在大学教西方哲学史。崇尚苏格拉底的对话法，不给答案而是帮你发现问题。研究康德、柏拉图、尼采。生活简朴，喜欢散步时思考，常在公园长椅上看书。口头禅“未经审视的人生不值得过”。",
        deepPersonality: "有时候反问太多让人烦，会不自觉地把简单问题复杂化，偶尔会用哲学术语装腔作势但自己也知道",
        friends: []
      },
      {
        id: "char-006", name: "陈小夜", mood: "warm", job: "独立书店主理人",
        personality: "慢热但可靠，文艺气息重，内心丰富",
        speakingStyle: "文艺比喻多，语气轻，像在念诗",
        trait: "书店主理人，文艺慢热，爱看展",
        bio: "陈小夜，31岁，经营一家藏在小巷子里的独立书店。不太会聊商业，但一聊到书就停不下来。喜欢给客人推荐“可能改变你今天心情的一本书”。每天关门后会自己泡一壶茶看书到深夜。",
        deepPersonality: "慢热到极致导致经常冷场，有时候活在自己的世界里忘了对方在说什么，对不读书的人会流露出微妙的不理解",
        friends: []
      },
      {
        id: "char-007", name: "王乐天", mood: "kind", job: "游戏关卡策划",
        personality: "松弛幽默，满脑奇思妙想，会自嘲",
        speakingStyle: "带一点调侃，喜欢用游戏比喻说生活",
        trait: "游戏策划，幽默奇想，爱拼图",
        bio: "王乐天，27岁，游戏关卡策划，每天的工作就是设计“怎么让人玩得更爽”。平时爱拼图和下棋，觉得生活就像一个巨大的解谜游戏。最近在研究世界各地的民间游戏。",
        deepPersonality: "表面松弛但其实有很强的胜负欲，被质疑时会急躁地反驳，偶尔会把什么都当游戏让人觉得不认真",
        friends: []
      },
      {
        id: "char-008", name: "赵雨晴", mood: "warm", job: "配音演员",
        personality: "外冷内热，偏感性，爱写日记",
        speakingStyle: "语气轻柔，像在读一封信，偶尔会用不同声线逼你笑",
        trait: "配音演员，外冷内热，爱看电影",
        bio: "赵雨晴，28岁，配音演员，给动画和电视剧配音。生活中安静内向，但一进录音棚就变成另一个人。喜欢在深夜写日记，记录每天触动自己的小事。最大的梦想是配一部宫崎骏的动画。",
        deepPersonality: "情绪化程度比表面严重得多，偶尔会突然沉默让人不知所措，对感情的事很敏感容易想多",
        friends: []
      },
      {
        id: "char-009", name: "吴小北", mood: "busy", job: "急诊医生",
        personality: "强势但讲理，外表冷静内心有温度",
        speakingStyle: "短句直接，结论先行，有时候冷幽默一下",
        trait: "急诊医生，强势讲理，爱爬山",
        bio: "吴小北，33岁，急诊科医生，见过太多生死，所以格外珍惜日常。下班后喜欢去爬山，觉得山顶的风能吹走一切焰累。说话很直但又很真诚，会在你难过的时候很认真地听。",
        deepPersonality: "强势到有时候会不自觉地否定别人的感受，习惯用'这不算什么'来回应别人的困难，太理性让人觉得缺乏共情",
        friends: []
      },
      {
        id: "char-010", name: "林小夏", mood: "warm", job: "手冲咖啡师",
        personality: "社恐但真诚，用咖啡表达关心",
        speakingStyle: "说话慢慢的，带一点腕赧，但很真实",
        trait: "咖啡师，社恐真诚，爱听播客",
        bio: "林小夏，25岁，在一家精品咖啡店工作。不太会聊天但会默默记住你喜欢的口味，下次来的时候已经帮你准备好了。下班后喜欢听播客，最近在听《日谈公园》。",
        deepPersonality: "社恐到会用沉默逃避不想回答的问题，有时候太被动让人聊得累，但一旦聊到咖啡就会变得话多到让人意外",
        friends: []
      },
      {
        id: "char-011", name: "徐念一", mood: "kind", job: "儿童绘本编辑",
        personality: "爱照顾别人，充满想象力，柔软",
        speakingStyle: "温柔安抚型，说话像讲故事，让人安心",
        trait: "绘本编辑，想象力丰富，爱画画",
        bio: "徐念一，30岁，绘本编辑，每天跟插画师和作者合作做给小朋友看的书。自己也爱画画，家里到处都是草稿。觉得大人也需要童话，因为童话里藏着最纯粹的真理。",
        deepPersonality: "有时候太理想化让人觉得不接地气，会用童话逻辑回避现实问题，遇到批评会不自觉地退缩",
        friends: []
      },
      {
        id: "char-012", name: "孙青禾", mood: "steady", job: "古琴老师",
        personality: "理性克制，边界感很强，内心安定",
        speakingStyle: "克制礼貌，句子偏正式，但不冷淡",
        trait: "古琴老师，理性克制，爱散步",
        bio: "孙青禾，38岁，古琴老师，在一家文化馆教课。说话很慢但每句都有分量。觉得音乐是和世界对话的另一种方式。每天早上会散步1小时，觉得走路和弹琴一样，都是冥想。",
        deepPersonality: "边界感太强有时让人觉得冷漠，会用礼貌的方式拒绝亲近，遇到不守规矩的人会不自觉地板起脸",
        friends: []
      },
      {
        id: "char-013", name: "马元宝", mood: "warm", job: "建筑模型师",
        personality: "完美主义，细节控，但很有耐心",
        speakingStyle: "理工风，条理清楚像清单，但偏爱加一句感性的话",
        trait: "建筑模型师，完美主义，爱骑行",
        bio: "马元宝，32岁，建筑模型师，对每个细节都很较真。喜欢骑行去看各种建筑，手机里全是建筑照片。最近在做一个微缩故宫模型，已经做了半年了。",
        deepPersonality: "完美主义到有时候让人觉得挑剔吹毛求疵，会纠正别人的用词然后自嘲说职业病犯了，对细节的执着偶尔让人窒息",
        friends: []
      },
      {
        id: "char-014", name: "何子墨", mood: "calm", job: "纪录片摄影师",
        personality: "行动派，说干就干，看世界的角度独特",
        speakingStyle: "短句直给，喜欢用画面感表达，偶尔很深刻",
        trait: "摄影师，行动派，爱街拍",
        bio: "何子墨，35岁，独立纪录片摄影师，去过30多个国家。拍过留守儿童、非洲野生动物、城市复古建筑。觉得摄影不是记录真相，而是记录你如何看待这个世界。",
        deepPersonality: "行动派到有时候不考虑别人的感受就做了决定，说话太直偶尔会伤到人但自己没察觉，对犹豫不决的人缺乏耐心",
        friends: []
      },
      {
        id: "char-015", name: "郭可可", mood: "warm", job: "播客制作人",
        personality: "社牛型，热情外放，但内心敏感",
        speakingStyle: "热情外放，语速快，喜欢举例子讲道理",
        trait: "播客制作人，社牛热情，爱爬山",
        bio: "郭可可，26岁，播客《不正经人类观察》的主播，平时热爱采访各种“奇奇怪怪的人”。表面大大咧咧，其实很敏感，会因为一句话想很久。喜欢爬山，觉得山上什么烦恼都留在山下了。",
        deepPersonality: "社牛到有时候不给别人说话的机会，表面大大咧咧但其实玻璃心，被忽略时会突然变得很沉默让人摸不着头脑",
        friends: []
      },
      {
        id: "char-016", name: "周知安", mood: "steady", job: "城市规划师",
        personality: "追求效率，逻辑清晰，但很有人文关怀",
        speakingStyle: "有条理，喜欢分析问题，但不写意，会关心你",
        trait: "城市规划师，逻辑清晰，爱下厨",
        bio: "周知安，36岁，城市规划师，每天想的是怎么让城市更适合人住。下班后喜欢下厨，觉得做饭和做规划一样，都是把混乱的东西变有序。最喜欢逛菜市场，觉得那里最有烟火气。",
        deepPersonality: "追求效率到有时候让人觉得功利，会不自觉地把聊天变成问题分析会，对低效率的事会忍不住叹气",
        friends: []
      },
      {
        id: "char-017", name: "高小柒", mood: "kind", job: "瑞士铟表修复师",
        personality: "慢性子，极度专注，有自己的节奏",
        speakingStyle: "说话像拧螺丝一样慢慢来，但很精准",
        trait: "铟表修复师，慢性子，爱拼图",
        bio: "高小柒，42岁，在一家老铟表店修复古董表。觉得时间这个东西很神奇，每块表背后都有一段故事。工作时极度安静，可以一坐六个小时不动。下班后爱拼1000片的拼图。",
        deepPersonality: "慢性子到让急躁的人抓狂，有时候沉浸在自己的节奏里完全忽略对方在等待，不太懂得察言观色",
        friends: []
      },
      {
        id: "char-018", name: "朱小木", mood: "busy", job: "宠物行为训练师",
        personality: "爱动物胜过爱人类，但其实很温柔",
        speakingStyle: "常用动物行为比喻人的心理，有趣又准",
        trait: "宠物训练师，爱动物，爱写日记",
        bio: "朱小木，29岁，宠物行为训练师，专门帮主人解决“狗狗为什么总拆家”的问题。家里有两只救助犬。觉得动物比人诚实，但也知道人需要被理解。最近在写一本关于“狗与孤独”的书。",
        deepPersonality: "真的会拿人和动物做比较有时候让人不太舒服，对虐待动物的话题会突然变得激动甚至有攻击性",
        friends: []
      },
      {
        id: "char-019", name: "罗小韵", mood: "warm", job: "民谣酒吧驻唱",
        personality: "嘴硬心软，表面潇洒内心细腻",
        speakingStyle: "毒舌但不伤人，偶尔冷不丁丢一句暖心的话",
        trait: "民谣驻唱，嘴硬心软，爱写歌",
        bio: "罗小韵，24岁，在一家小酒吧唱民谣，白天在音乐工作室写歌。表面满不在乎，其实每首歌都是写给某个特定的人。最近写了一首《流浪者的午小憩》，觉得是自己写得最好的一首。",
        deepPersonality: "嘴硬心软到经常说反话让人误解，毒舌有时候真的会伤人但不承认，喝了酒会变得感伤到让人不知道怎么接话",
        friends: []
      },
      {
        id: "char-020", name: "陈阿泽", mood: "warm", job: "旅行定制师",
        personality: "松弛自由，像风一样，让人向往",
        speakingStyle: "像在讲旅途故事，随性但有张力，让人想跟着走",
        trait: "旅行定制师，自由松弛，爱探索",
        bio: "陈阿泽，28岁，旅行定制师，帮人设计“只属于你的旅程”。去过40多个国家，觉得每个地方都有一个故事在等你。最难忘的是在冰岛看极光时旁边一对老夫妇拉着手。",
        deepPersonality: "太自由散漫有时候让人觉得不靠谱，承诺的事偶尔会忘记，对'稳定'这个词有生理性的抗拒",
        friends: []
      },
      {
        id: "char-021", name: "徐半夏", mood: "calm", job: "中医推拿师",
        personality: "慢热但可靠，手上有功夫心里有温度",
        speakingStyle: "慢速叙述，喜欢先铺垫，道理都藏在故事里",
        trait: "中医推拿师，慢热可靠，爱喝茶",
        bio: "徐半夏，40岁，中医推拿师，从师傅那里学的手艺坚持了20年。觉得身体会说话只是大多数人不听。下班后泡一壶老白茶翻几页黄帝内经就是最好的休息。",
        deepPersonality: "说话太慢有时候让人着急想替他说完，偶尔会用中医理论回怼别人让人哑口无言，固执地坚持传统观念",
        friends: []
      },
      {
        id: "char-022", name: "马小野", mood: "warm", job: "野外探险向导",
        personality: "胆大心细，天不怕地不怕但很负责",
        speakingStyle: "热情外放，语速快，爱用亲身经历举例子",
        trait: "探险向导，胆大心细，爱攀岩",
        bio: "马小野，27岁，野外探险向导，带人徒步攀岩穿越无人区。被蛇咬过两次掉进过冰裂缝但觉得大自然是最好的老师。最喜欢在营地篝火旁给队员讲鬼故事。",
        deepPersonality: "胆子大到有时候让人替他捏一把汗，讲起冒险经历会越来越夸张，对安于现状的人会不自觉地流露出不理解",
        friends: []
      },
      {
        id: "char-023", name: "郭星辰", mood: "kind", job: "天文馆讲师",
        personality: "内向但一聊到星星就发光，浪漫的理科生",
        speakingStyle: "温柔安抚型，用宇宙的尺度让你看淡眼前的烦恼",
        trait: "天文馆讲师，浪漫理科生，爱观星",
        bio: "郭星辰，30岁，天文馆讲师，每天的工作就是告诉别人宇宙有多大。觉得人的烦恼放到宇宙尺度都微不足道但微不足道的东西才最珍贵。周末会开车去郊外观星。",
        deepPersonality: "聊到星星就收不住嘴有时候会把对方聊晕，太浪漫有时候脱离现实，被打断天文话题会微微失落",
        friends: []
      },
      {
        id: "char-024", name: "赵知行", mood: "steady", job: "法律援助律师",
        personality: "正义感强，说话有分量但不压人",
        speakingStyle: "条理清楚，逻辑严密，偶尔冒出一句人间清醒的话",
        trait: "法律援助律师，正义温暖，爱看电影",
        bio: "赵知行，34岁，法律援助律师，专门帮打不起官司的人打官司。见过太多不公平但依然相信法律的力量。下班后最喜欢看法律题材电影会边看边吐槽剧情不合理。",
        deepPersonality: "正义感太强有时候会不自觉地站道德高地，逻辑严密到跟他吵架赢不了会让人很窒息，偶尔会较真到不合时宜的程度",
        friends: []
      },
      {
        id: "char-025", name: "吴晚秋", mood: "warm", job: "花艺师",
        personality: "细腻敏感，能从花里读出人的心情",
        speakingStyle: "文艺比喻多，语气轻，像花瓣落在水面上",
        trait: "花艺师，细腻敏感，爱看展",
        bio: "吴晚秋，26岁，花艺师，在一家工作室做花艺设计。相信每束花都有情绪会根据客人的状态推荐不同的花。最近迷上了干花创作觉得枯萎也是另一种美。",
        deepPersonality: "敏感到容易受伤，别人一句无心的话会想半天，有时候太文艺让人觉得矫情",
        friends: []
      },
      {
        id: "char-026", name: "孙铁柱", mood: "busy", job: "外卖骑手",
        personality: "乐观豁达，苦中作乐，特别接地气",
        speakingStyle: "碎碎念真实感，像朋友聊天，说话带着烟火气",
        trait: "外卖骑手，乐观豁达，爱下厨",
        bio: "孙铁柱，31岁，外卖骑手，每天穿梭在城市的大街小巷。见过凌晨四点的城市也见过深夜独自吃饭的人。觉得送外卖不只是送饭有时候是送温暖。休息日最喜欢自己下厨做菜。",
        deepPersonality: "贴吧老哥式发言偶尔会说就这？但心软会立刻圆回来，有时候太接地气让文艺的人不适应，急躁时会碎碎念个不停",
        friends: []
      },
      {
        id: "char-027", name: "林墨白", mood: "calm", job: "书法老师",
        personality: "沉稳内敛，话不多但字字珠玑",
        speakingStyle: "克制礼貌，句子偏正式，像在写一封信",
        trait: "书法老师，沉稳内敛，爱读书",
        bio: "林墨白，43岁，书法老师，在社区文化中心教书法。觉得写字就是修心一笔一划都是在和自己对话。最喜欢雨天在家磨墨写字说那时候心最静。",
        deepPersonality: "话少到让人怀疑他是不是不想聊了，太正式有时候让人有距离感，偶尔会用书法和古文典故让人听不懂",
        friends: []
      },
      {
        id: "char-028", name: "周小鱼", mood: "warm", job: "幼儿园老师",
        personality: "天真烂漫，保持着孩子般的好奇心",
        speakingStyle: "说话像在讲故事，充满想象力，让人忍不住笑",
        trait: "幼儿园老师，天真好奇，爱做手工",
        bio: "周小鱼，24岁，幼儿园老师，每天和小朋友一起画画唱歌做手工。觉得大人应该向小朋友学习学他们的勇敢和真实。最近在学做陶艺做了一堆歪歪扭扭的小杯子送人。",
        deepPersonality: "天真到有时候让人觉得这个年纪还这样好吗，偶尔会说些孩子气的话让人不知道是认真还是开玩笑",
        friends: []
      },
      {
        id: "char-029", name: "王大山", mood: "steady", job: "木工匠人",
        personality: "沉默寡言但手上功夫了得，用作品说话",
        speakingStyle: "话少但每句都实在，不废话不客套",
        trait: "木工匠人，沉默务实，爱散步",
        bio: "王大山，48岁，木工匠人，做了30年家具。不喜欢用电动工具坚持手工。觉得木头有生命你对它好它就对你好。工坊里永远有木屑的香味。晚上喜欢在河边散步。",
        deepPersonality: "社恐到极致话少到让人着急，说出来的每句都是金句但等金句的过程很煎熬，不太会主动开启话题",
        friends: []
      },
      {
        id: "char-030", name: "李小禾", mood: "warm", job: "有机农场主",
        personality: "踏实温厚，接地气，让人安心",
        speakingStyle: "朴实无华，说话像泥土一样实在，偶尔冒出乡野哲学",
        trait: "农场主，踏实温厚，爱下厨",
        bio: "李小禾，35岁，辞了互联网工作去乡下开有机农场。种菜养鸡每天看日出日落。觉得城市给了她焦虑土地给了她平静。最喜欢用自己种的菜给朋友做饭。",
        deepPersonality: "有时候太佛系让人觉得她不在乎任何事，用田园生活的标准衡量城市人会让人不舒服，偶尔会不经意间优越感爆棚",
        friends: []
      },
      {
        id: "char-031", name: "钱多多", mood: "warm", job: "理财规划师",
        personality: "精明但不势利，帮人理清生活不只是理钱",
        speakingStyle: "短句直接，结论先行，偶尔用数字说话很有说服力",
        trait: "理财规划师，精明温暖，爱跑步",
        bio: "钱多多，32岁，独立理财规划师。不只帮人管钱更帮人理清生活优先级。口头禅是钱是工具不是目标。每天早起跑5公里清醒头脑。",
        deepPersonality: "太精明有时候让人觉得在被算计，不自觉地把什么都跟钱挂钩，偶尔会直白地评价别人的消费观让人尴尬",
        friends: []
      },
      {
        id: "char-032", name: "沈梦溪", mood: "calm", job: "占星师",
        personality: "神秘但不故弄玄虚，用星象帮人认识自己",
        speakingStyle: "慢速叙述，带一点神秘感，但很落地",
        trait: "占星师，神秘落地，爱喝咖啡",
        bio: "沈梦溪，29岁，占星师，不搞玄学恐吓用星盘帮人理解自己的模式。觉得占星不是算命是自我认知的工具。最怕别人问我什么时候发财最喜欢聊人与人之间的缘分。",
        deepPersonality: "故意说模棱两可的话吊人胃口有点公主脾气但不恶意，有时候神秘感过头让人觉得在装，不喜欢被质疑专业性",
        friends: []
      },
      {
        id: "char-033", name: "黄小米", mood: "warm", job: "烘焙师",
        personality: "甜系治愈，让人放松，自带暖意",
        speakingStyle: "温柔安抚型，先共情再建议，像刚出炉的面包一样暖",
        trait: "烘焙师，甜系治愈，爱听音乐",
        bio: "黄小米，25岁，烘焙师，在一家社区面包店工作。相信好的面包能治愈一天的疲惫。最拿手的是老面发酵的吐司要等18小时但觉得等待本身就很美。下班后戴着耳机听爵士。",
        deepPersonality: "太甜有时候让人觉得不真实，遇到负面情绪只会用甜和暖来回应有时候解决不了问题，偶尔会回避严肃话题",
        friends: []
      },
      {
        id: "char-034", name: "陆小风", mood: "calm", job: "太极拳教练",
        personality: "以柔克刚，不急不躁，说话有分量",
        speakingStyle: "语速慢，用身体和动作的比喻讲道理，很有画面感",
        trait: "太极拳教练，不急不躁，爱喝茶",
        bio: "陆小风，50岁，太极拳教练，在公园教了20年。觉得太极不是武术是哲学每个动作都是阴阳的平衡。最常说的一句话是力量不在于使多大劲而在于用对方向。",
        deepPersonality: "太慢了有时候让人想催他快点说完，用太极哲学解释一切有时候让人觉得在绕弯子回避问题",
        friends: []
      },
      {
        id: "char-035", name: "许青云", mood: "kind", job: "社区图书管理员",
        personality: "安静温和，记忆力惊人，能记住每个人借过什么书",
        speakingStyle: "说话轻声细语，但推荐的书总是精准击中你",
        trait: "图书管理员，安静温和，爱看书",
        bio: "许青云，37岁，社区图书管理员，能记住来过的每个人和他们借的书。觉得图书馆是城市里最安全的地方。最开心的是有人来还书时说这本书改变了我的想法。",
        deepPersonality: "安静到有时候让人忘了他的存在，推荐书的时候会很坚持自己的判断不太接受反驳，有轻微的知识优越感",
        friends: []
      },
      {
        id: "char-036", name: "方小圆", mood: "warm", job: "街头似颜绘画师",
        personality: "观察力敏锐，能通过画捕捉人的本质",
        speakingStyle: "带一点调侃，偶尔反问，说话像在素描你的性格",
        trait: "似颜绘画师，观察敏锐，爱街拍",
        bio: "方小圆，23岁，在街头给路人画似颜绘。画的不只是长相更是那个人此刻的状态。有人看了画会哭她觉得那是被看见的感动。梦想是画遍100个城市的路人。",
        deepPersonality: "观察力太强有时候会说破别人不想被看到的东西让人不安，调侃偶尔会过界但自己觉得这是画家的敏锐",
        friends: []
      },
      {
        id: "char-037", name: "唐小宁", mood: "steady", job: "急救培训师",
        personality: "冷静果断，关键时刻最靠谱的人",
        speakingStyle: "简洁有力，不废话，但关键时刻让你安心",
        trait: "急救培训师，冷静果断，爱游泳",
        bio: "唐小宁，33岁，急救培训师，教普通人如何在关键时刻救人一命。做过8年急救护士见过太多如果早一分钟就好了的遗憾。现在觉得教会一个人急救就是多了一个守护者。",
        deepPersonality: "太冷静了有时候让人觉得没有感情，习惯用紧急情况的标准要求日常生活显得太严肃，不太会闲聊",
        friends: []
      },
      {
        id: "char-038", name: "江小晚", mood: "warm", job: "深夜电台主播",
        personality: "声音温暖治愈，擅长在深夜陪伴孤独的人",
        speakingStyle: "语速慢，声音软，像在你耳边轻声说话",
        trait: "电台主播，声音治愈，爱写信",
        bio: "江小晚，27岁，深夜电台主播，节目叫晚安之前。每晚陪失眠的人聊天读听众来信。觉得深夜是人最真实的时候白天戴着面具夜里才敢说心里话。还保持手写信的习惯。",
        deepPersonality: "深夜模式太重了白天聊天有时候像在做电台感觉不太真实，偶尔会太沉浸在倾听者角色忘了表达自己",
        friends: []
      },
      {
        id: "char-039", name: "秦老六", mood: "warm", job: "出租车司机",
        personality: "话痨但有趣，满肚子故事，人生阅历丰富",
        speakingStyle: "碎碎念真实感，像坐上车就停不下来的那种聊天",
        trait: "出租车司机，话痨有趣，爱下棋",
        bio: "秦老六，52岁，开了25年出租车觉得后座坐过的每个人都是一本书。最有趣的是深夜接到的那些乘客各有各的故事。闲时在路边跟老头下象棋觉得人生就像棋局走一步看一步。",
        deepPersonality: "话太多有时候不给别人说话的机会，没边界地追问隐私出于好奇而非恶意但有时候太热情让人招架不住",
        friends: []
      },
      {
        id: "char-040", name: "萧然", mood: "calm", job: "冥想引导师",
        personality: "通透平和，像一面湖水，让人静下来",
        speakingStyle: "语速极慢，每句话之间留有空间，让你有时间感受",
        trait: "冥想引导师，通透平和，爱散步",
        bio: "萧然，36岁，冥想引导师，曾在寺庙做过两年义工。觉得现代人最缺的不是信息而是安静。每次引导冥想前会说不需要做什么只需要在这里。清晨会赤脚在草地上走路。",
        deepPersonality: "太通透有时候让人觉得他什么都不在乎，慢到让急性子的人崩溃，偶尔会用冥想的方式回避需要直面的问题",
        friends: []
      }
    ];

    const relationTypes = [
      "老同学", "同事", "邻居", "高中同桌", "大学室友", "健身搭子",
      "前同事", "老乡", "网友", "咖啡店认识的", "跑友",
      "合租室友", "兴趣班同学", "旅途中认识的", "朋友的朋友"
    ];
    for (let i = 0; i < list.length; i += 1) {
      const friendCount = 2 + Math.floor(Math.random() * 3);
      const pool = list.filter((c, j) => j !== i && !list[i].friends.some((f) => f.id === c.id));
      for (let f = 0; f < friendCount && pool.length; f += 1) {
        const idx = Math.floor(Math.random() * pool.length);
        const fri = pool.splice(idx, 1)[0];
        const rel = relationTypes[Math.floor(Math.random() * relationTypes.length)];
        list[i].friends.push({ id: fri.id, name: fri.name, job: fri.job, relation: rel });
        if (!fri.friends.some((x) => x.id === list[i].id)) {
          fri.friends.push({ id: list[i].id, name: list[i].name, job: list[i].job, relation: rel });
        }
      }
    }

    return list;
  }
  function countTurnsForCharacter(characterId) {
    const store = getMemoryStore();
    const key = memoryKey(characterId);
    return (store[key] || []).length;
  }

  function renderProfileDetail(profile) {
    if (!profile) {
      profileDetail.textContent = "请选择一个角色查看详细信息。";
      return;
    }
    const turns = countTurnsForCharacter(profile.id);
    const memory = retrieveMemory(profile.id);
    const latest = memory.slice(-4).map((t) => `${t.role === "user" ? "你" : "TA"}: ${t.content}`).join("\n");
    const friendsList = (profile.friends || []).map((f) => `${f.name}(${f.relation}, ${f.job})`).join("、") || "暂无";
    profileDetail.textContent = [
      `姓名: ${profile.name}`,
      `角色ID: ${profile.id}`,
      `职业: ${profile.job}`,
      `核心性格: ${profile.personality}`,
      `说话风格: ${profile.speakingStyle}`,
      `情绪基调: ${profile.mood}`,
      `兴趣标签: ${profile.trait}`,
      `人物简介: ${profile.bio}`,
      `社会关系: ${friendsList}`,
      `累计记忆条数: ${turns}`,
      "",
      "最近记忆:",
      latest || "暂无"
    ].join("\n");
  }

  function renderProfileList(keyword = "") {
    const q = keyword.trim().toLowerCase();
    const list = state.registry.filter((p) => {
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.job.toLowerCase().includes(q) || p.personality.toLowerCase().includes(q);
    }).slice(0, 40);

    profileList.innerHTML = "";
    list.forEach((profile) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `profile-chip${state.activeProfileId === profile.id ? " active" : ""}`;
      chip.textContent = `${profile.name} · ${profile.job}`;
      chip.addEventListener("click", () => {
        state.activeProfileId = profile.id;
        renderProfileList(profileQuery.value);
        renderProfileDetail(profile);
      });
      profileList.appendChild(chip);
    });
    if (!list.length) {
      profileList.textContent = "没有匹配角色。";
    }
  }

  function ensureRegistry() {
    const stored = getRegistryStore();
    const REGISTRY_VERSION = "v5";
    const versionKey = "crowdlife_registry_version";
    const currentVersion = localStorage.getItem(versionKey);
    if (currentVersion === REGISTRY_VERSION && stored && Array.isArray(stored) && stored.length >= 35) {
      const hasBio = stored.every((item) => item && typeof item.bio === "string" && item.bio.length > 20);
      const hasFriends = stored.every((item) => Array.isArray(item.friends));
      const hasDeep = stored.some((item) => item.deepPersonality && item.deepPersonality.length > 5);
      if (hasBio && hasFriends && hasDeep) {
        state.registry = stored;
        return;
      }
    }
    const list = buildDefaultRegistry();
    state.registry = list;
    setRegistryStore(list);
    localStorage.setItem(versionKey, REGISTRY_VERSION);
  }

  function pickQuote() {
    heroQuote.textContent = randomFrom(QUOTES);
  }


  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function removeRandomFromArray(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr.splice(idx, 1)[0];
  }
  function buildSpriteTemplates(image, rows, cols) {
    const templates = [];
    const rectWidth = image.naturalWidth / rows;
    const rectHeight = image.naturalHeight / cols;
    const total = rows * cols;
    for (let i = 0; i < total; i += 1) {
      const x = (i % rows) * rectWidth;
      const y = Math.floor(i / rows) * rectHeight;
      templates.push(new Peep({ image, rect: [x, y, rectWidth, rectHeight] }));
    }
    return templates;
  }

  async function loadSpriteFromCrowdSource() {
    try {
      const res = await fetch(SPRITE_SOURCE_FILE);
      if (!res.ok) {
        return;
      }
      const text = await res.text();
      const srcMatch = text.match(/src:\s*'([^']+)'/);
      const rowsMatch = text.match(/rows:\s*(\d+)/);
      const colsMatch = text.match(/cols:\s*(\d+)/);
      if (!srcMatch) {
        return;
      }

      const rows = rowsMatch ? Number(rowsMatch[1]) : 15;
      const cols = colsMatch ? Number(colsMatch[1]) : 7;
      const image = new Image();
      image.onload = () => {
        state.sprite.ready = true;
        state.sprite.image = image;
        state.sprite.rows = rows;
        state.sprite.cols = cols;
        state.sprite.templates = buildSpriteTemplates(image, rows, cols);
        seedPeople();
      };
      image.src = srcMatch[1];
    } catch (_error) {
      // fallback to procedural face drawing
    }
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.width = w;
    state.height = h;
    state.density = buildDensityProfile(w, h);
    seedPeople();
  }

  function createPersonInRow(profile, row, colIndex, colCount, globalIndex) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    const yJitter = (Math.random() - 0.5) * 18 * row.scale;
    const y = row.y + yJitter;
    const scaleJitter = (Math.random() - 0.5) * 0.08;
    const scale = row.scale + scaleJitter;
    const speedVariation = 0.6 + Math.random() * 0.8;
    const speed = row.speed * speedVariation;
    const template = state.sprite.templates.length ? randomFrom(state.sprite.templates) : null;
    const walkCycle = 0.003 + Math.random() * 0.004;
    const walkAmp = (1.2 + row.scale * 2.8) * (0.7 + Math.random() * 0.6);
    const spacing = state.width / colCount;
    const x = spacing * colIndex + (Math.random() - 0.5) * spacing * 0.7;

    return {
      uid: `${profile.id}-${globalIndex}-${Math.random().toString(16).slice(2, 6)}`,
      profile,
      x,
      y,
      vx: dir * speed * SPEED_MULTIPLIER,
      scale: Math.max(0.2, scale),
      scaleX: dir,
      template,
      headRadius: 13 + Math.random() * 8,
      hairType: Math.floor(Math.random() * 5),
      eyeType: Math.floor(Math.random() * 3),
      wearGlass: Math.random() > 0.82,
      skin: Math.random() > 0.65 ? "#ececec" : "#f9f9f9",
      bobSeed: Math.random() * 6.28,
      bobFreq: walkCycle,
      bobAmp: walkAmp,
      targetX: null,
      targetY: null,
      reactingUntil: 0,
      hasUserSpoken: false
    };
  }

  function seedPeople() {
    const density = state.density || buildDensityProfile(state.width, state.height);
    state.people = [];
    const picked = [...state.registry];
    let globalIndex = 0;
    density.rows.forEach((row) => {
      for (let c = 0; c < row.count; c += 1) {
        const profile = picked.length ? removeRandomFromArray(picked) : randomFrom(state.registry);
        state.people.push(createPersonInRow(profile, row, c, row.count, globalIndex));
        globalIndex += 1;
      }
    });
  }

  function drawHair(person, x, y, r) {
    ctx.fillStyle = "#111";
    ctx.beginPath();
    if (person.hairType === 0) {
      ctx.arc(x, y - r * 0.35, r * 1.02, Math.PI, 0);
    } else if (person.hairType === 1) {
      ctx.ellipse(x, y - r * 0.5, r * 1.1, r * 0.76, 0, Math.PI, Math.PI * 2);
    } else if (person.hairType === 2) {
      ctx.arc(x, y - r * 0.42, r * 1.15, Math.PI, 0);
      ctx.arc(x + r * 0.9, y - r * 0.46, r * 0.52, Math.PI, 0);
    } else if (person.hairType === 3) {
      ctx.arc(x, y - r * 0.42, r * 0.95, Math.PI, 0);
      ctx.arc(x - r * 0.98, y - r * 0.42, r * 0.42, Math.PI, 0);
      ctx.arc(x + r * 0.98, y - r * 0.42, r * 0.42, Math.PI, 0);
    } else {
      ctx.ellipse(x, y - r * 0.48, r * 1.2, r * 0.8, 0.25, Math.PI, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawProceduralFace(person) {
    const bob = walkBob(person, state.time);
    const x = person.x;
    const y = person.y + bob;
    const r = person.headRadius * person.scale;

    ctx.fillStyle = person.skin;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    drawHair(person, x, y, r);

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();

    const eyeY = y + r * 0.03;
    const eyeGap = r * 0.38;
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(x - eyeGap, eyeY, r * 0.08, 0, Math.PI * 2);
    ctx.arc(x + eyeGap, eyeY, r * 0.08, 0, Math.PI * 2);
    ctx.fill();

    if (person.wearGlass) {
      ctx.beginPath();
      ctx.arc(x - eyeGap, eyeY, r * 0.26, 0, Math.PI * 2);
      ctx.arc(x + eyeGap, eyeY, r * 0.26, 0, Math.PI * 2);
      ctx.moveTo(x - eyeGap + r * 0.26, eyeY);
      ctx.lineTo(x + eyeGap - r * 0.26, eyeY);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y + r * 0.37, r * 0.22, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(x - r * 1.15, y + r * 0.9, r * 2.3, r * 1.5);

    if (state.selectedPerson && state.selectedPerson.uid === person.uid) {
      ctx.strokeStyle = "#ff4d4f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function walkBob(person, time) {
    const phase = time * person.bobFreq + person.bobSeed;
    return -Math.abs(Math.sin(phase)) * person.bobAmp;
  }

  function drawSpritePerson(person) {
    if (!person.template) {
      drawProceduralFace(person);
      return;
    }
    const bob = walkBob(person, state.time);
    const peep = new Peep({ image: person.template.image, rect: person.template.rect });
    peep.x = person.x - (peep.width * person.scale) / 2;
    peep.y = person.y - peep.height * person.scale + bob;
    peep.scaleX = person.scaleX;
    peep.drawArgs = [peep.image, ...peep.rect, 0, 0, peep.width * person.scale, peep.height * person.scale];
    peep.render(ctx);

    if (state.selectedPerson && state.selectedPerson.uid === person.uid) {
      ctx.strokeStyle = "#ff4d4f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(person.x, person.y - peep.height * person.scale * 0.72, 16 * person.scale, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (person.reactingUntil > Date.now()) {
      ctx.fillStyle = "#111";
      ctx.font = "bold 12px Tahoma,Arial,sans-serif";
      ctx.fillText("Hi!", person.x + 12, person.y - peep.height * person.scale * 0.78);
    }
  }

  function updatePeople() {
    state.time += 16;
    if (state.inChat) {
      return;
    }
    state.people.forEach((person) => {
      person.x += person.vx;
      person.scaleX = person.vx >= 0 ? 1 : -1;
      if (person.x < -90) {
        person.x = state.width + 90;
      } else if (person.x > state.width + 90) {
        person.x = -90;
      }
    });
  }

  function drawBackdrop() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, state.width, state.height);
    const gradientStart = state.height * 0.45;
    const grad = ctx.createLinearGradient(0, gradientStart, 0, state.height);
    grad.addColorStop(0, "rgba(240,240,240,0)");
    grad.addColorStop(0.7, "rgba(235,235,235,0.15)");
    grad.addColorStop(1, "rgba(228,228,228,0.3)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, gradientStart, state.width, state.height - gradientStart);
  }

  function render() {
    ctx.clearRect(0, 0, state.width, state.height);
    drawBackdrop();
    updatePeople();
    state.people.sort((a, b) => a.y - b.y).forEach((p) => {
      if (state.sprite.ready) {
        drawSpritePerson(p);
      } else {
        drawProceduralFace(p);
      }
    });
    requestAnimationFrame(render);
  }

  function distance(a, b, x, y) {
    return Math.hypot(a - x, b - y);
  }

  function hitTest(x, y) {
    let best = null;
    let bestDist = Number.MAX_SAFE_INTEGER;
    state.people.forEach((p) => {
      if (state.sprite.ready && p.template) {
        const sw = p.template.width * p.scale;
        const sh = p.template.height * p.scale;
        const left = p.x - sw / 2;
        const top = p.y - sh;
        const hit = x >= left && x <= left + sw && y >= top && y <= top + sh;
        if (hit) {
          const centerDist = distance(p.x, top + sh * 0.3, x, y);
          if (centerDist < bestDist) {
            best = p;
            bestDist = centerDist;
          }
        }
      } else {
        const r = p.headRadius * p.scale;
        const d = distance(p.x, p.y, x, y);
        if (d < r * 1.25 && d < bestDist) {
          best = p;
          bestDist = d;
        }
      }
    });
    return best;
  }

  function memoryKey(characterId) {
    return `${userId}:${characterId}`;
  }

  function saveTurn(characterId, role, content) {
    const store = getMemoryStore();
    const key = memoryKey(characterId);
    const turns = store[key] || [];
    turns.push({ role, content, ts: Date.now() });
    store[key] = turns.slice(-80);
    setMemoryStore(store);
  }

  function retrieveMemory(characterId) {
    const store = getMemoryStore();
    const key = memoryKey(characterId);
    return store[key] || [];
  }

  function memorySummary(turns) {
    const n = turns.length;
    if (n === 0) return "✦ 初识 · 第一次相遇";
    if (n <= 4) return "✦ 点头之交 · 刚认识不久";
    if (n <= 10) return "✦ 浅聊 · 有过几次交谈";
    if (n <= 20) return "✦ 熟络 · 聊过不少了";
    if (n <= 40) return "✦ 老友 · 彼此已经很熟";
    return "✦ 知己 · 无话不谈的关系";
  }

  function buildMemoryContext(turns) {
    if (!turns.length) {
      return "无历史记忆";
    }
    return turns
      .slice(-12)
      .map((t) => `${t.role === "user" ? "用户" : "角色"}: ${t.content}`)
      .join("\n");
  }

  async function requestAI(characterRole, userText, turns, memoryText) {
    const recent = turns.slice(-10).map((t) => `${t.role === "user" ? "用户" : "角色"}: ${t.content}`).join("\n");
    const promptUserText = userText === "__GREETING__" ? "请先发起一句自然打招呼开场白，带一点现实社交距离感。" : userText;
    const friendsInfo = (characterRole.friends || []).map((f) => `${f.name}(${f.job}, ${f.relation})`).join("、");
    const payload = {
      character: {
        id: characterRole.id,
        name: characterRole.name,
        trait: characterRole.trait,
        mood: characterRole.mood,
        personality: characterRole.personality,
        speakingStyle: characterRole.speakingStyle,
        deepPersonality: characterRole.deepPersonality || "",
        friends: friendsInfo || "暂无"
      },
      turnCount: turns.length,
      userText: promptUserText,
      memorySummary: memoryText,
      conversationHistory: recent
    };
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`chat_api_${res.status}`);
    }
    const data = await res.json();
    return data.reply || "我有点走神了，你再说一次？";
  }

  async function requestAIWithRetry(characterRole, userText, turns, memoryText, attempts = 3) {
    let lastError = null;
    for (let i = 0; i < attempts; i += 1) {
      try {
        return await requestAI(characterRole, userText, turns, memoryText);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("chat_failed");
  }

  const DEFAULT_QUICK_REPLIES = [
    "你好呀~",
    "最近在忙什么",
    "讲讲你的故事",
    "今天心情如何",
    "有什么推荐"
  ];

  function parseSuggestions(rawReply) {
    const match = rawReply.match(/\[快捷[:：](.+?)\]\s*$/);
    if (!match) {
      return { cleanReply: rawReply.trim(), suggestions: null };
    }
    const cleanReply = rawReply.replace(/\[快捷[:：].+?\]\s*$/, "").trim();
    const suggestions = match[1].split("|").map((s) => s.trim()).filter((s) => s.length > 0 && s.length <= 20);
    return { cleanReply, suggestions: suggestions.length >= 2 ? suggestions.slice(0, 5) : null };
  }

  function updateQuickReplies(suggestions) {
    const container = document.getElementById("quick-replies");
    if (!container) return;
    const items = suggestions || DEFAULT_QUICK_REPLIES;
    container.innerHTML = "";
    items.forEach((text) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-btn";
      btn.setAttribute("data-msg", text);
      btn.textContent = text;
      btn.addEventListener("click", () => {
        if (state.selectedPerson) {
          chatInput.value = text;
          chatForm.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      });
      container.appendChild(btn);
    });
  }

  function appendMessage(role, text) {
    const p = document.createElement("p");
    p.className = `msg ${role === "user" ? "msg-user" : ""}`;
    const name = state.selectedPerson ? state.selectedPerson.profile.name : "TA";
    p.textContent = `${role === "user" ? "你" : name}: ${text}`;
    chatLog.appendChild(p);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function buildAvatarFromPerson(person) {
    const size = 92;
    const off = document.createElement("canvas");
    off.width = size;
    off.height = size;
    const octx = off.getContext("2d");
    octx.fillStyle = "#f0f0f0";
    octx.fillRect(0, 0, size, size);

    if (state.sprite.ready && person.template) {
      const [sx, sy, sw, sh] = person.template.rect;
      octx.drawImage(person.template.image, sx, sy, sw, sh, 4, 4, size - 8, size - 8);
    } else {
      const r = 26;
      octx.fillStyle = "#fafafa";
      octx.beginPath();
      octx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
      octx.fill();
      octx.strokeStyle = "#111";
      octx.stroke();
      octx.fillStyle = "#111";
      octx.beginPath();
      octx.arc(size / 2 - 9, size / 2 - 2, 2, 0, Math.PI * 2);
      octx.arc(size / 2 + 9, size / 2 - 2, 2, 0, Math.PI * 2);
      octx.fill();
    }
    return off.toDataURL("image/png");
  }


  async function openChat(person) {
    state.selectedPerson = person;
    state.inChat = true;
    ambientAudio.setVolume(0.05);
    person.hasUserSpoken = false;
    person.targetX = state.width * 0.5;
    person.targetY = state.height * 0.67;
    person.reactingUntil = Date.now() + 680;

    chatModal.classList.add("hidden");
    chatName.textContent = person.profile.name;
    chatTraits.textContent = person.profile.trait;
    chatAvatar.src = buildAvatarFromPerson(person);
    chatLog.innerHTML = "";

    const turns = retrieveMemory(person.profile.id);
    const memoryForPrompt = buildMemoryContext(turns);
    memoryPreview.textContent = memorySummary(turns);
    memoryPreview.classList.remove("hidden");

    updateQuickReplies(null);

    await new Promise((resolve) => setTimeout(resolve, 120));
    chatModal.classList.remove("hidden");

    setThinking(true);
    try {
      const greetingPromise = requestAIWithRetry(person.profile, "__GREETING__", turns, memoryForPrompt, 3);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("slow")), 5000));
      const rawGreeting = await Promise.race([greetingPromise, timeoutPromise]);
      const { cleanReply, suggestions } = parseSuggestions(rawGreeting);
      appendMessage("assistant", cleanReply);
      saveTurn(person.profile.id, "assistant", cleanReply);
      if (suggestions) updateQuickReplies(suggestions);
    } catch (_error) {
      const name = person.profile.name;
      appendMessage("assistant", `${name}看来似乎现在正忙唷，要不先跟TA打声招呼~`);
    } finally {
      setThinking(false);
    }
  }

  function closeChat() {
    state.inChat = false;
    state.selectedPerson = null;
    ambientAudio.setVolume(0.18);
    chatModal.classList.add("hidden");
    chatInput.value = "";
  }

  function onCanvasTap(event) {
    if (state.inChat) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = hitTest(x, y);
    if (!hit) {
      return;
    }
    openChat(hit);
  }

  function getChattedCharacters() {
    const store = getMemoryStore();
    const results = [];
    state.registry.forEach((profile) => {
      const key = memoryKey(profile.id);
      const turns = store[key] || [];
      if (turns.length === 0) return;
      const lastTurn = turns[turns.length - 1];
      const lastMsg = lastTurn.content.length > 28 ? lastTurn.content.slice(0, 28) + "..." : lastTurn.content;
      results.push({
        profile,
        turnCount: turns.length,
        lastMsg,
        lastTs: lastTurn.ts || 0
      });
    });
    results.sort((a, b) => b.lastTs - a.lastTs);
    return results;
  }

  function buildSmallAvatar(profile) {
    const person = state.people.find((p) => p.profile.id === profile.id);
    if (person) return buildAvatarFromPerson(person);
    const size = 48;
    const off = document.createElement("canvas");
    off.width = size;
    off.height = size;
    const octx = off.getContext("2d");
    octx.fillStyle = "#f0f0f0";
    octx.fillRect(0, 0, size, size);
    octx.fillStyle = "#ccc";
    octx.beginPath();
    octx.arc(size / 2, size / 2, 16, 0, Math.PI * 2);
    octx.fill();
    octx.fillStyle = "#888";
    octx.font = "bold 14px Tahoma,Arial,sans-serif";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(profile.name[0], size / 2, size / 2);
    return off.toDataURL("image/png");
  }

  function renderHistoryList() {
    const chatted = getChattedCharacters();
    historyList.innerHTML = "";
    if (chatted.length === 0) {
      const empty = document.createElement("div");
      empty.className = "history-empty";
      empty.textContent = "还没有跟任何人聊过天\n去点击人群中的人物开始互动吧";
      historyList.appendChild(empty);
      return;
    }
    chatted.forEach(({ profile, turnCount, lastMsg }) => {
      const item = document.createElement("div");
      item.className = "history-item";
      const avatar = document.createElement("img");
      avatar.className = "history-avatar";
      avatar.src = buildSmallAvatar(profile);
      avatar.alt = profile.name;
      const info = document.createElement("div");
      info.className = "history-info";
      const name = document.createElement("p");
      name.className = "history-name";
      name.textContent = profile.name;
      const preview = document.createElement("p");
      preview.className = "history-preview";
      preview.textContent = lastMsg;
      info.appendChild(name);
      info.appendChild(preview);
      const meta = document.createElement("div");
      meta.className = "history-meta";
      const count = document.createElement("span");
      count.className = "history-count";
      count.textContent = `${turnCount}条`;
      meta.appendChild(count);
      item.appendChild(avatar);
      item.appendChild(info);
      item.appendChild(meta);
      item.addEventListener("click", () => {
        historyPanel.classList.add("hidden");
        openChatFromHistory(profile);
      });
      historyList.appendChild(item);
    });
  }

  function openChatFromHistory(profile) {
    const person = state.people.find((p) => p.profile.id === profile.id);
    if (person) {
      openChat(person);
      return;
    }
    const virtualPerson = {
      uid: `${profile.id}-hist-${Math.random().toString(16).slice(2, 6)}`,
      profile,
      x: state.width * 0.5,
      y: state.height * 0.67,
      vx: 0,
      scale: 0.7,
      scaleX: 1,
      template: state.sprite.templates.length ? state.sprite.templates[0] : null,
      headRadius: 18,
      hairType: 0,
      eyeType: 0,
      wearGlass: false,
      skin: "#f9f9f9",
      bobSeed: 0,
      bobFreq: 0.003,
      bobAmp: 0,
      targetX: null,
      targetY: null,
      reactingUntil: 0,
      hasUserSpoken: false
    };
    openChat(virtualPerson);
  }

  canvas.addEventListener("click", onCanvasTap);
  chatCloseBtn.addEventListener("click", closeChat);

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !state.selectedPerson) {
      return;
    }
    const characterId = state.selectedPerson.profile.id;
    chatInput.value = "";
    appendMessage("user", text);
    saveTurn(characterId, "user", text);
    state.selectedPerson.hasUserSpoken = true;

    const turns = retrieveMemory(characterId);
    const memoryForPrompt = buildMemoryContext(turns);
    memoryPreview.textContent = memorySummary(turns);
    setThinking(true);
    try {
      const rawReply = await requestAIWithRetry(state.selectedPerson.profile, text, turns, memoryForPrompt, 2);
      const { cleanReply, suggestions } = parseSuggestions(rawReply);
      appendMessage("assistant", cleanReply);
      saveTurn(characterId, "assistant", cleanReply);
      if (suggestions) updateQuickReplies(suggestions);
    } catch (_error) {
      // Keep chat clean: status only, no extra system message in chat flow.
    } finally {
      setThinking(false);
    }
  });

  historyPanelBtn.addEventListener("click", () => {
    renderHistoryList();
    historyPanel.classList.remove("hidden");
  });
  historyCloseBtn.addEventListener("click", () => {
    historyPanel.classList.add("hidden");
  });

  profilePanelBtn.addEventListener("click", () => {
    if (!state.activeProfileId && state.registry.length) {
      state.activeProfileId = state.registry[0].id;
    }
    renderProfileList(profileQuery.value || "");
    const selected = state.registry.find((p) => p.id === state.activeProfileId) || state.registry[0];
    renderProfileDetail(selected);
    profilePanel.classList.remove("hidden");
  });
  profileCloseBtn.addEventListener("click", () => {
    profilePanel.classList.add("hidden");
  });
  profileQueryBtn.addEventListener("click", () => {
    renderProfileList(profileQuery.value);
  });

  window.addEventListener("resize", resize);

  const ambientAudio = {
    ctx: null,
    gainNode: null,
    running: false,
    start() {
      if (this.running) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      const bufSize = 4096;
      const brownCoeffs = new Float32Array(2);

      const noiseNode = this.ctx.createScriptProcessor(bufSize, 1, 1);
      noiseNode.onaudioprocess = (e) => {
        const out = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
          const white = Math.random() * 2 - 1;
          brownCoeffs[0] = (brownCoeffs[0] + 0.02 * white) * 0.98;
          out[i] = brownCoeffs[0] * 3.5;
        }
      };

      const lpf = this.ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 420;
      lpf.Q.value = 0.7;

      const hpf = this.ctx.createBiquadFilter();
      hpf.type = "highpass";
      hpf.frequency.value = 60;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.18;

      noiseNode.connect(lpf);
      lpf.connect(hpf);
      hpf.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.running = true;
    },
    setVolume(v) {
      if (this.gainNode) {
        this.gainNode.gain.setTargetAtTime(v, this.ctx.currentTime, 0.3);
      }
    }
  };

  function startAmbientOnInteraction() {
    ambientAudio.start();
    document.removeEventListener("click", startAmbientOnInteraction);
    document.removeEventListener("touchstart", startAmbientOnInteraction);
  }
  document.addEventListener("click", startAmbientOnInteraction);
  document.addEventListener("touchstart", startAmbientOnInteraction);

  ensureRegistry();
  pickQuote();
  resize();
  loadSpriteFromCrowdSource();
  render();
})();
