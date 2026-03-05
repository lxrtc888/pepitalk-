(function initExplore() {
  const EXPLORE_STORAGE_KEY = "pepitalk_explore_v1";
  const EXPLORE_UNLOCK_KEY = "pepitalk_explore_unlocks";

  const API_BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? ""
    : (window.__PEPITALK_API__ || "");

  const STORY_DATA = [
    {
      id: "story-01",
      title: "深夜便利店",
      type: "惊悚",
      mood: "毛骨悚然 → 释然",
      npcs: ["陈小夜", "林小夏"],
      npcIds: ["char-006", "char-010"],
      color: "#1a1a2e",
      icon: "🏪",
      locked: false,
      synopsis: "城南那家24小时便利店，凌晨3点没有店员，货架上的商品却自己排列整齐。你决定一探究竟。",
      acts: [
        {
          title: "序章：不安的深夜",
          opening: "凌晨 3:17，你失眠了。冰箱空空如也，你穿上外套走向城南那家24小时便利店。\n\n街灯忽明忽暗。你推开玻璃门，门铃「叮」了一声——\n\n但柜台后面，没有人。\n\n货架上的商品排列得异常整齐。太整齐了。像是有人刚刚一件一件摆好的。你注意到角落的监控摄像头正对着你，红点一闪一闪。",
          guidance: "引导玩家探索便利店环境，建立不安氛围。根据玩家选择揭示第一层线索：这家店最近一周每天凌晨3点都会出现「自动整理」现象。"
        },
        {
          title: "深入：不存在的店员",
          opening: "你在柜台后面发现了一本值班记录本。最后一条记录是三天前，字迹潦草：「我不干了。它又来了。」\n\n冰柜突然嗡了一声，日光灯闪了两下。",
          guidance: "展开调查：值班记录、监控录像、附近住户的说法。引入关键NPC——曾在这里打过工的林小夏，或者凌晨常来买东西的陈小夜。"
        },
        {
          title: "转折：真相浮现",
          opening: "你在监控录像里看到了不可能的画面——凌晨3点整，所有商品同时被一股看不见的力量推回了原位。画面里出现了一个模糊的人影，但它没有影子。",
          guidance: "关键决策点：真相有两个可能方向。1) 科学解释：磁场异常+店里曾经发生过的事故 2) 超自然方向：某个人留下的执念。玩家的选择将决定结局走向。"
        },
        {
          title: "结局",
          opening: null,
          guidance: "根据之前的选择收束到2-3个结局。温暖结局：理解了背后的故事，便利店恢复正常。悬疑结局：真相更深，引出更大的谜团。"
        }
      ]
    },
    {
      id: "story-02",
      title: "消失的画家",
      type: "梦幻",
      mood: "唯美 → 怅然",
      npcs: ["方小圆", "吴晚秋"],
      npcIds: ["char-014", "char-025"],
      color: "#2d3436",
      icon: "🎨",
      locked: false,
      synopsis: "一个能画出「灵魂」的街头画家突然消失了。他留下的最后一幅画是空白的——他说那是他自己。",
      acts: [
        {
          title: "序章：空白的画",
          opening: "你在公园的长椅上发现了一幅画。准确地说，是一幅空白的画布，只在右下角写了四个字：「这就是我」。\n\n旁边的花店老板说，画这幅画的老人已经一周没出现了。「他画谁像谁，不是画长相，是画那个人此刻的灵魂。」\n\n你看着空白的画布，突然觉得它并不空——好像有什么东西，正从画布里看着你。",
          guidance: "建立老画家的传奇形象。通过不同人的描述拼凑他的故事。他不是普通的画家，他能捕捉人的「灵魂状态」。"
        },
        {
          title: "深入：追寻画家的足迹",
          opening: "你开始寻找这位画家的踪迹。花店老板给了你一个线索——画家最后几天总是去同一个地方：城市边缘的一座废弃美术馆。",
          guidance: "通过走访画家的朋友、看过画的人、收藏过画作的人，逐步拼出画家消失的原因。引入关键谜团：有人说在另一个城市又看到了他。"
        },
        {
          title: "转折：画中世界",
          opening: "在废弃美术馆里，你找到了画家留下的几十幅画。每一幅画里的人都栩栩如生，表情在不同光线下会变化。你凑近看最后一幅画时——\n\n画里的人动了。",
          guidance: "超现实的转折。画家是否真的进入了自己的画？还是这一切都是一种行为艺术？玩家的理解和选择将决定故事的走向。"
        },
        {
          title: "结局",
          opening: null,
          guidance: "唯美结局：画家找到了真正的自由，以另一种形式存在。惆怅结局：画家留下的不是画，是对这个世界的告别信。"
        }
      ]
    },
    {
      id: "story-03",
      title: "天台钢琴声",
      type: "梦幻",
      mood: "神秘 → 浪漫",
      npcs: ["郭星辰", "赵雨晴"],
      npcIds: ["char-023", "char-008"],
      color: "#0c2461",
      icon: "🎹",
      locked: false,
      synopsis: "满月之夜，城市上空会飘来一段不存在的钢琴曲。没有人知道它从哪里来，但每个听过的人都说那是他们人生中最美的旋律。",
      acts: [
        {
          title: "序章：月光下的旋律",
          opening: "满月。你站在自家天台上，空气里弥漫着夏天的味道。\n\n然后你听到了。\n\n一段钢琴声，从远处的某个天台飘来。旋律温柔得像是有人在用音符倾诉一个秘密。你从没听过这首曲子，但奇怪的是——你觉得你本应该知道它。\n\n你开始在天台之间寻找声源。",
          guidance: "建立神秘而浪漫的氛围。玩家在城市的天台间穿梭寻找声源，每次靠近声音就消失，远离又会重新响起。"
        },
        {
          title: "深入：追逐旋律的人们",
          opening: "你不是唯一在找这段旋律的人。天文爱好者郭星辰说他用声学分析过了，这不是自然共振。音乐制作人赵雨晴录了一段，但回放时只有噪音。",
          guidance: "汇集不同听过钢琴声的人的故事和分析。科学解释和浪漫想象并存。引入关键线索：这段旋律只在满月夜出现，且每次曲调微妙不同。"
        },
        {
          title: "转折：第三个满月",
          opening: "第三个满月夜，你终于追到了声音的源头——一栋废弃大楼的天台。上面空无一人，但你脚边有一朵新鲜的白色茉莉花。",
          guidance: "揭示浪漫的核心：钢琴声与某个人的心愿有关。是分离的恋人？是离开的灵魂？还是城市本身的呼吸？"
        },
        {
          title: "结局",
          opening: null,
          guidance: "浪漫结局：找到了弹琴的人或理解了旋律的含义。诗意结局：接受有些美好不需要解释，学会在月光下聆听。"
        }
      ]
    },
    {
      id: "story-04",
      title: "平行世界的电话",
      type: "科幻",
      mood: "烧脑 → 哲思",
      npcs: ["悠小鹿", "王乐天"],
      npcIds: ["char-002", "char-007"],
      color: "#2c3e50",
      icon: "📞",
      locked: false,
      synopsis: "你接到一个电话，对方的声音和你一模一样——她说她是另一个世界的你。",
      acts: [
        {
          title: "序章：来自另一个你的电话",
          opening: "下午3:33，你的手机响了。来电显示是你自己的号码。\n\n你犹豫了一下，接了。\n\n「别挂。我知道这很难接受，但我真的是你。另一个世界的你。」对方的声音和你一模一样，连语气都是。\n\n「你今天早上是不是犹豫了很久要不要穿那件蓝色的衣服？你最后没穿。我穿了。」\n\n她说的每一个细节都对。",
          guidance: "建立悬念：这到底是恶作剧、幻觉还是真的？通过对方说出只有自己才知道的细节来增加可信度。"
        },
        {
          title: "深入：分支点",
          opening: "第二次通话。她说在她的世界，你做了不同的选择——那个你犹豫过的决定，她做了。从那个分叉点开始，两个世界走向了完全不同的方向。",
          guidance: "探索平行世界的概念。通过对比两个版本的「你」做出的不同选择和不同人生，引发对选择和命运的思考。"
        },
        {
          title: "转折：连接断裂",
          opening: "第三次通话时信号越来越差。她说两个世界的连接正在断裂。她有一个很重要的事情要告诉你——一个你即将面对的选择。但话还没说完，电话就断了。\n\n你回拨过去——空号。",
          guidance: "紧迫感和遗憾感。那个未说完的话成为核心谜题。玩家需要决定：是否相信这一切，以及面对即将到来的选择时如何抉择。"
        },
        {
          title: "结局",
          opening: null,
          guidance: "哲思结局：理解每个选择都创造了一个世界，学会对选择负责。惊喜结局：发现另一个世界的自己留下了某种暗号。"
        }
      ]
    },
    {
      id: "story-05",
      title: "时间裂缝咖啡馆",
      type: "穿越",
      mood: "奇幻 → 温暖",
      npcs: ["苏苏", "陈阿泽"],
      npcIds: ["char-001", "char-020"],
      color: "#6c5b7b",
      icon: "☕",
      locked: false,
      synopsis: "一家神秘咖啡馆，进去一小时，出来已是第二天。更奇怪的是——服务员叫得出你的名字。",
      acts: [
        {
          title: "序章：门口的歪脖子树",
          opening: "你在一条从未走过的小巷里迷了路。转角处出现了一家咖啡馆，门口有一棵歪脖子树，树上挂着小小的风铃。\n\n推开门，温暖的光和咖啡香扑面而来。一切都很普通，除了——\n\n「你来啦。老位置给你留着呢。」服务员微笑着说。\n\n你确定，这是你第一次来这里。",
          guidance: "营造温暖中带着诡异感的氛围。玩家可以选择质疑服务员、坐下来、或者立刻离开。每个选择都有不同的展开。"
        },
        {
          title: "深入：时间错位",
          opening: "你坐下喝了一杯咖啡，聊了几句天。感觉只过了不到一小时，你走出咖啡馆——\n\n天亮了。手机显示已经是第二天的早上。你的未读消息有47条，朋友在问你昨晚去哪了。",
          guidance: "深入探索时间错位的规律。每个来过这家咖啡馆的人都有类似经历。有人在里面「只坐了一会」出来发现过了一周。线索指向：咖啡馆可能不在正常的时间流里。"
        },
        {
          title: "转折：留在这里的人",
          opening: "你第三次来到咖啡馆时，发现角落里坐着一个人。他看起来很年轻，但眼神里有一种老人的沧桑。\n\n「我在这里已经很久了。」他说。「外面可能已经过了很多年。但在这里，时间是温柔的。」",
          guidance: "核心抉择：咖啡馆是一个逃避时间的庇护所还是一个陷阱？那个留下来的人是自愿的还是被困住的？"
        },
        {
          title: "结局",
          opening: null,
          guidance: "温暖结局：理解了咖啡馆存在的意义——给需要暂停的人一个喘息的空间。奇幻结局：发现自己在不同的时间线里留下了不同的痕迹。"
        }
      ]
    },
    {
      id: "story-06",
      title: "地铁末班车第13站",
      type: "惊悚",
      mood: "恐惧 → 反转",
      npcs: ["吴小北", "孙铁柱"],
      npcIds: ["char-009", "char-026"],
      color: "#1e272e",
      icon: "🚇",
      locked: true,
      unlockRequires: 2,
      synopsis: "末班地铁只有12站，但你坐过了站——站牌上写着一个你不认识的名字：第13站。",
      acts: [
        {
          title: "序章：末班车",
          opening: "23:47，你跑着赶上了末班地铁。\n\n车厢里只有三个人。一个低头看手机的年轻人，一个抱着包打瞌睡的中年人，还有一个面无表情望着窗外黑暗的老人。\n\n你坐下来，掏出手机看了一眼。等你再抬头时——\n\n车厢里只剩你一个人了。窗外一片漆黑。列车还在开。\n\n站牌亮了：第 13 站。",
          guidance: "建立密闭空间恐惧感。列车不受控制地行驶，窗外没有任何光源。玩家需要决定：待在座位上，还是去车头查看驾驶室。"
        },
        {
          title: "深入：站台上的人",
          opening: "车门打开了。站台很干净，灯光正常，甚至还有广告牌——但广告上的文字你一个都不认识。\n\n站台上站着七八个人，整齐地排成一排。他们都没有影子。",
          guidance: "在第13站里探索。这些人是谁？他们为什么没有影子？站台上的指示牌指向「出口」和「更深处」——玩家必须选择。"
        },
        {
          title: "转折：最后一趟车",
          opening: "一个没有影子的人走到你面前，递给你一张纸条。上面写着一个名字——你认识这个人。这个人已经去世三年了。\n\n「最后一趟车还有5分钟。你可以留下来见他们，也可以走。」",
          guidance: "核心抉择：情感与理性的对抗。留下来意味着什么？走意味着放弃什么？第13站的真正含义揭晓。"
        },
        {
          title: "结局",
          opening: null,
          guidance: "反转结局：第13站不是恐怖的地方，而是一个告别的站台。恐惧结局：你走了，但从此再也不敢坐末班车。温暖结局：你见到了想见的人。"
        }
      ]
    },
    {
      id: "story-07",
      title: "星空直播事件",
      type: "科幻",
      mood: "宏大 → 敬畏",
      npcs: ["赫拉克特", "郭星辰"],
      npcIds: ["char-005", "char-023"],
      color: "#0a3d62",
      icon: "🌌",
      locked: true,
      unlockRequires: 2,
      synopsis: "一次普通的星空直播，画面里突然出现了一组有规律的光点。持续17秒后消失。录像被反复删除——但你保存了一份。",
      acts: [
        {
          title: "序章：17秒的光",
          opening: "你在B站看到一个普通的星空延时摄影直播。画面很美，弹幕很少。\n\n突然，画面右上角出现了一组光点。不是流星，不是卫星。它们排列整齐，以某种节奏闪烁。\n\n弹幕瞬间爆炸了。\n\n17秒后，光点消失。直播间被关闭。你刚好录了屏。",
          guidance: "以当代网络文化的形式展开科幻故事。玩家拥有唯一的证据，需要决定如何处理这份录像。"
        },
        {
          title: "深入：解码光点",
          opening: "你把录像逐帧分析后发现：光点的闪烁频率如果转换成二进制，形成了一组坐标。\n\n这组坐标指向地球上一个真实的地点——一片荒漠中的某个点。",
          guidance: "科学探索与阴谋论并存。有人想删掉所有证据，有人在暗中寻找和你一样的目击者。物理学教授赫拉克特提供了理论支持。"
        },
        {
          title: "转折：抵达坐标",
          opening: "你到达了那个坐标。荒漠中什么都没有。但当你拿出手机对准天空——\n\n手机屏幕上出现了画面之外看不到的东西。",
          guidance: "核心揭示：信号的含义远比想象中宏大。它不是发给人类的，而是发给——？玩家需要决定是否公开这个发现。"
        },
        {
          title: "结局",
          opening: null,
          guidance: "敬畏结局：理解了宇宙的某种秩序，改变了世界观。孤独结局：没有人相信你。希望结局：发现还有其他人也在寻找答案。"
        }
      ]
    },
    {
      id: "story-08",
      title: "重复的陌生人",
      type: "惊悚",
      mood: "不安 → 顿悟",
      npcs: ["马元宝", "林晨光"],
      npcIds: ["char-013", "char-012"],
      color: "#2f3640",
      icon: "👤",
      locked: true,
      unlockRequires: 2,
      synopsis: "你在三个不同的城市看到了同一个人——穿同样的衣服，做同样的动作，坐在同样的长椅上。",
      acts: [
        {
          title: "序章：第一次",
          opening: "北京，国贸地铁站出口旁的长椅上。\n\n你注意到一个人。穿灰色风衣，戴黑色棒球帽，手里拿着一本翻开的书。不是在读，是在发呆。\n\n三天后，上海，淮海路。同一个人。同样的衣服，同样的姿势，同一本书翻到同一页。\n\n巧合，你想。\n\n一周后，广州，天河城外面。他又在那里了。\n\n这次，他看了你一眼。",
          guidance: "层层递进的不安感。从「巧合」到「不可能」。玩家可以选择忽略、跟踪、或直接搭话。"
        },
        {
          title: "深入：跟踪",
          opening: "你决定跟踪他。他站起来，走了大概两百米，转过一个街角——\n\n不见了。但长椅上留下了那本书。你拿起来翻看——\n\n每一页都画着同一个人。是你。",
          guidance: "恐惧升级。书里的画非常细致，记录了你不同时间的样子。骑行爱好者马元宝和琴师林晨光也见过这个人。拼凑线索。"
        },
        {
          title: "转折：镜像",
          opening: "你终于在第四个城市再次见到他。这次你走到他面前，直视他的脸——\n\n他的脸是空白的。没有五官。但你能感到他在笑。\n\n「终于，你来找我了。」声音从你脑海里响起。",
          guidance: "核心揭示：这个「人」是什么？是你的投影、是另一个维度的观察者、还是某种更深层的存在？"
        },
        {
          title: "结局",
          opening: null,
          guidance: "顿悟结局：理解了「他」存在的意义。不安结局：他消失了，但你开始在别人的生活中看到了自己。"
        }
      ]
    },
    {
      id: "story-09",
      title: "梦境共享实验",
      type: "梦幻",
      mood: "奇异 → 感动",
      npcs: ["周小温", "徐念一"],
      npcIds: ["char-004", "char-011"],
      color: "#4a148c",
      icon: "🌙",
      locked: true,
      unlockRequires: 3,
      synopsis: "五个陌生人做了同一个梦：一扇蓝色的门，门后是星空。他们约出来见面后，发现梦里的细节完全一致——包括门把手的形状。",
      acts: [
        {
          title: "序章：蓝色的门",
          opening: "你又做了那个梦。\n\n一条漫长的走廊，尽头是一扇蓝色的门。门漆剥落了一角，门把手是黄铜色的，微微发热。\n\n你推开门——\n\n门后是一片星空。不是夜空，是星空。你悬浮在其中，四周全是星光。然后你听到有人在叫你的名字。\n\n你醒了。手心有黄铜的触感残留。\n\n你把这个梦画了下来，发到朋友圈。5分钟内，三个不认识的人私信你：「我也做了一模一样的梦。」",
          guidance: "建立梦境的真实感和连接感。玩家需要联系这些做了同样梦的人，发现大家的梦境细节完全吻合。"
        },
        {
          title: "深入：梦境考古",
          opening: "你们五个人见面了。每个人画出的蓝色门几乎一模一样。更奇怪的是——你们发现一本旧笔记本，里面用不同笔迹记录了同一个梦。\n\n笔记本的年代是1987年。",
          guidance: "时间线的震撼：这个梦不是从你们开始的。几十年来不断有人做同样的梦。探索梦境背后可能的原因：心理学、神经科学、超自然？"
        },
        {
          title: "转折：共同入梦",
          opening: "你们决定同时入睡，尝试在梦中相遇。周小温提供了场地，徐念一设计了实验方案。\n\n你闭上眼，走廊再次出现。但这次——蓝色的门是半开的。门后有人的声音。",
          guidance: "共享梦境的高潮体验。门后的世界是什么？那些声音是谁？这次的梦和之前有什么不同？"
        },
        {
          title: "结局",
          opening: null,
          guidance: "感动结局：发现蓝色门是一个连接——连接做过同一个梦的所有人的情感。奇异结局：门后的世界是真实的，你们改变了什么。"
        }
      ]
    },
    {
      id: "story-10",
      title: "异星信号",
      type: "科幻",
      mood: "好奇 → 震撼",
      npcs: ["李小禾", "赵知行"],
      npcIds: ["char-030", "char-024"],
      color: "#1b1464",
      icon: "📡",
      locked: true,
      unlockRequires: 3,
      synopsis: "农场的气象站收到了一组异常信号。频率规律得不像自然干扰。信号持续了三天，然后消失——那三天，所有动物都不正常。",
      acts: [
        {
          title: "序章：异常信号",
          opening: "李小禾的有机农场在城市边缘，安静得只有风和虫鸣。她在农场装了一个简易气象站监测天气。\n\n三天前，气象站收到了一组奇怪的信号。频率极其规律：每4.7秒一个脉冲，持续了整整72小时。\n\n信号消失的那一刻，农场里所有的鸡同时抬头看天。\n\n小禾把信号录了下来发给你。你听了之后——头皮发麻。那不是噪音。那像是某种语言。",
          guidance: "从日常环境（农场）切入科幻主题，增加真实感和可信度。玩家拿到了信号录音，需要决定如何分析和处理。"
        },
        {
          title: "深入：解析信号",
          opening: "你找到了声学专家和语言学家。他们的结论一致：这不是已知的任何自然现象或人类语言。\n\n但一个退休的密码学家说他在冷战时期的档案里见过类似的波形。「当时我们以为是苏联的加密通讯。现在看来，可能不是。」",
          guidance: "引入多方视角：科学、军事、历史。信号的来源逐渐指向一个令人不安的方向。律师赵知行提供了一个关键线索——他经手过一个相关的案件。"
        },
        {
          title: "转折：信号回来了",
          opening: "就在你以为这件事已经结束时——信号回来了。但这次不是气象站收到的。\n\n是你的手机。\n\n凌晨2:00整，你的手机自动播放了那段信号。屏幕上显示来电者是——一个你从未见过的号码，区号不属于地球上任何一个国家。",
          guidance: "信号从被动接收变成主动接触。紧张感升级。玩家必须做出决定：接还是不接这个电话？"
        },
        {
          title: "结局",
          opening: null,
          guidance: "震撼结局：信号的含义超越了人类的理解范畴，改变了玩家对宇宙的认知。希望结局：发现信号是一种邀请。沉默结局：信号再也没有出现，留下永恒的悬念。"
        }
      ]
    }
  ];

  function getExploreStore() {
    try {
      const raw = localStorage.getItem(EXPLORE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_e) {
      return {};
    }
  }

  function setExploreStore(store) {
    localStorage.setItem(EXPLORE_STORAGE_KEY, JSON.stringify(store));
  }

  function getStoryProgress(storyId) {
    const store = getExploreStore();
    return store[storyId] || null;
  }

  function saveStoryProgress(storyId, progress) {
    const store = getExploreStore();
    store[storyId] = progress;
    setExploreStore(store);
  }

  function initStoryProgress(storyId) {
    return {
      storyId,
      status: "in_progress",
      currentAct: 0,
      choices: [],
      turns: [],
      cluesFound: [],
      endings: []
    };
  }

  function saveTurn(storyId, role, content) {
    const progress = getStoryProgress(storyId) || initStoryProgress(storyId);
    progress.turns.push({ role, content, ts: Date.now() });
    if (progress.turns.length > 120) {
      progress.turns = progress.turns.slice(-100);
    }
    saveStoryProgress(storyId, progress);
  }

  function getCompletedCount() {
    const store = getExploreStore();
    return Object.values(store).filter((p) => p.status === "completed").length;
  }

  function isStoryUnlocked(story) {
    if (!story.locked) return true;
    return getCompletedCount() >= (story.unlockRequires || 0);
  }

  let currentStory = null;
  let isThinking = false;
  let abortController = null;

  function getExploreElements() {
    return {
      panel: document.getElementById("explore-panel"),
      storyList: document.getElementById("explore-story-list"),
      adventure: document.getElementById("explore-adventure"),
      advTitle: document.getElementById("explore-adv-title"),
      advAct: document.getElementById("explore-adv-act"),
      advLog: document.getElementById("explore-adv-log"),
      advChoices: document.getElementById("explore-adv-choices"),
      advInput: document.getElementById("explore-adv-input"),
      advForm: document.getElementById("explore-adv-form"),
      advStatus: document.getElementById("explore-adv-status"),
      advBack: document.getElementById("explore-adv-back"),
      closeBtn: document.getElementById("explore-close-btn")
    };
  }

  function renderStoryList() {
    const el = getExploreElements();
    el.storyList.innerHTML = "";
    el.adventure.classList.add("hidden");
    el.storyList.classList.remove("hidden");

    STORY_DATA.forEach((story) => {
      const unlocked = isStoryUnlocked(story);
      const progress = getStoryProgress(story.id);
      const card = document.createElement("div");
      card.className = `explore-story-card${unlocked ? "" : " locked"}`;
      card.style.setProperty("--story-color", story.color);

      const statusText = !unlocked
        ? `🔒 需完成${story.unlockRequires}条故事线`
        : progress?.status === "completed"
        ? "✅ 已通关"
        : progress?.status === "in_progress"
        ? `▶ 进行中 · 第${(progress.currentAct || 0) + 1}幕`
        : "待探索";

      card.innerHTML = `
        <div class="explore-card-icon">${story.icon}</div>
        <div class="explore-card-body">
          <div class="explore-card-title">${story.title}</div>
          <div class="explore-card-type">${story.type} · ${story.mood}</div>
          <div class="explore-card-synopsis">${unlocked ? story.synopsis : "完成更多故事线后解锁"}</div>
          <div class="explore-card-npcs">${unlocked ? "关键角色: " + story.npcs.join("、") : ""}</div>
          <div class="explore-card-status">${statusText}</div>
        </div>
      `;

      if (unlocked) {
        card.addEventListener("click", () => enterStory(story));
      }
      el.storyList.appendChild(card);
    });
  }

  function enterStory(story) {
    currentStory = story;
    const el = getExploreElements();
    el.storyList.classList.add("hidden");
    el.adventure.classList.remove("hidden");
    el.advTitle.textContent = `${story.icon} ${story.title}`;
    el.advLog.innerHTML = "";
    el.advChoices.innerHTML = "";

    let progress = getStoryProgress(story.id);

    if (progress && progress.turns.length > 0) {
      el.advAct.textContent = `第${(progress.currentAct || 0) + 1}幕 · ${story.acts[progress.currentAct || 0]?.title || ""}`;
      const recentTurns = progress.turns.slice(-30);
      recentTurns.forEach((t) => {
        appendAdventureMessage(t.role, t.content, el.advLog);
      });
      el.advLog.scrollTop = el.advLog.scrollHeight;
    } else {
      progress = initStoryProgress(story.id);
      saveStoryProgress(story.id, progress);
      const act = story.acts[0];
      el.advAct.textContent = `第1幕 · ${act.title}`;
      appendAdventureMessage("narrator", act.opening, el.advLog);
      saveTurn(story.id, "narrator", act.opening);
      requestExploreAI(story, progress, "__OPENING__");
    }
  }

  function appendAdventureMessage(role, content, logEl) {
    const div = document.createElement("div");
    if (role === "narrator") {
      div.className = "explore-msg explore-narrator";
      div.innerHTML = formatNarratorText(content);
    } else if (role === "user") {
      div.className = "explore-msg explore-user";
      div.textContent = `▸ ${content}`;
    } else {
      div.className = "explore-msg explore-narrator";
      div.innerHTML = formatNarratorText(content);
    }
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function formatNarratorText(text) {
    if (!text) return "";
    return text
      .replace(/\[场景\]\s*/g, '<span class="explore-tag scene-tag">场景</span> ')
      .replace(/\[线索\]\s*/g, '<span class="explore-tag clue-tag">线索</span> ')
      .replace(/\[对话\]\s*/g, '<span class="explore-tag dialog-tag">对话</span> ')
      .replace(/\[选择\]\s*/g, "")
      .replace(/\n/g, "<br>");
  }

  function parseChoices(text) {
    const choicePattern = /^([A-D])[.。、)]\s*(.+)/gm;
    const choices = [];
    let match;
    while ((match = choicePattern.exec(text)) !== null) {
      choices.push({ key: match[1], text: match[2].trim() });
    }
    return choices;
  }

  function renderChoices(choices, storyId) {
    const el = getExploreElements();
    el.advChoices.innerHTML = "";
    choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "explore-choice-btn";
      btn.textContent = `${c.key}. ${c.text}`;
      btn.addEventListener("click", () => {
        if (isThinking) return;
        handlePlayerChoice(c, storyId);
      });
      el.advChoices.appendChild(btn);
    });
  }

  function setExploreThinking(visible) {
    const el = getExploreElements();
    isThinking = visible;
    el.advStatus.classList.toggle("hidden", !visible);
    el.advStatus.textContent = visible ? "叙事者正在构思..." : "";
    if (el.advForm) {
      const input = el.advForm.querySelector("input");
      const btn = el.advForm.querySelector("button");
      if (input) input.disabled = visible;
      if (btn) btn.disabled = visible;
    }
  }

  async function handlePlayerChoice(choice, storyId) {
    const el = getExploreElements();
    el.advChoices.innerHTML = "";
    appendAdventureMessage("user", choice.text, el.advLog);
    saveTurn(storyId, "user", choice.text);

    const progress = getStoryProgress(storyId);
    if (progress) {
      progress.choices.push(choice.key);
      saveStoryProgress(storyId, progress);
    }

    const story = STORY_DATA.find((s) => s.id === storyId);
    if (story) {
      await requestExploreAI(story, progress, choice.text);
    }
  }

  async function handleFreeInput(text, storyId) {
    const el = getExploreElements();
    el.advChoices.innerHTML = "";
    appendAdventureMessage("user", text, el.advLog);
    saveTurn(storyId, "user", text);

    const story = STORY_DATA.find((s) => s.id === storyId);
    const progress = getStoryProgress(storyId);
    if (story) {
      await requestExploreAI(story, progress, text);
    }
  }

  async function requestExploreAI(story, progress, userAction) {
    setExploreThinking(true);
    const el = getExploreElements();

    const actIndex = progress?.currentAct || 0;
    const act = story.acts[actIndex];
    const recentTurns = (progress?.turns || []).slice(-16)
      .map((t) => `${t.role === "user" ? "玩家" : "叙事者"}: ${t.content}`)
      .join("\n");

    const payload = {
      mode: "explore",
      storyId: story.id,
      story: {
        title: story.title,
        type: story.type,
        synopsis: story.synopsis,
        npcs: story.npcs,
        currentAct: actIndex + 1,
        totalActs: story.acts.length,
        actTitle: act?.title || "",
        actGuidance: act?.guidance || "",
        actOpening: (userAction === "__OPENING__") ? "" : (act?.opening || ""),
        choiceHistory: (progress?.choices || []).join(","),
        cluesFound: (progress?.cluesFound || []).join(",")
      },
      userAction: userAction === "__OPENING__" ? "请基于序章的场景描述，提供2-4个选择项让玩家选择下一步行动。" : userAction,
      conversationHistory: recentTurns
    };

    if (abortController) abortController.abort();
    abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 25000);

    try {
      const res = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`explore_api_${res.status}`);
      const data = await res.json();
      const rawReply = data.reply || "叙事者沉默了片刻...请再试一次。";

      const choices = parseChoices(rawReply);
      const narrativeText = rawReply.replace(/^([A-D])[.。、)]\s*.+$/gm, "").trim();

      appendAdventureMessage("narrator", narrativeText, el.advLog);
      saveTurn(story.id, "narrator", narrativeText);

      if (choices.length >= 2) {
        renderChoices(choices, story.id);
      }

      checkActProgression(story, progress, narrativeText);
    } catch (err) {
      clearTimeout(timeout);
      const fallback = "叙事者被什么东西分了神...请稍后再试。";
      appendAdventureMessage("narrator", fallback, el.advLog);
    } finally {
      setExploreThinking(false);
    }
  }

  function checkActProgression(story, progress, narrativeText) {
    if (!progress) return;
    const keywords = ["[下一幕]", "第二幕", "第三幕", "第四幕", "[结局]", "故事完结", "THE END"];
    const hasProgression = keywords.some((k) => narrativeText.includes(k));

    if (hasProgression && progress.currentAct < story.acts.length - 1) {
      progress.currentAct += 1;
      saveStoryProgress(story.id, progress);
      const el = getExploreElements();
      const newAct = story.acts[progress.currentAct];
      el.advAct.textContent = `第${progress.currentAct + 1}幕 · ${newAct?.title || ""}`;
    }

    if (narrativeText.includes("[结局]") || narrativeText.includes("故事完结") || narrativeText.includes("THE END")) {
      progress.status = "completed";
      saveStoryProgress(story.id, progress);
    }
  }

  function initExploreUI() {
    const exploreBtn = document.getElementById("explore-mode-btn");
    if (!exploreBtn) return;

    exploreBtn.addEventListener("click", () => {
      const el = getExploreElements();
      if (!el.panel) return;
      renderStoryList();
      el.panel.classList.remove("hidden");
    });

    const closeBtn = document.getElementById("explore-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        const el = getExploreElements();
        el.panel.classList.add("hidden");
        currentStory = null;
      });
    }

    const advBack = document.getElementById("explore-adv-back");
    if (advBack) {
      advBack.addEventListener("click", () => {
        currentStory = null;
        if (abortController) abortController.abort();
        renderStoryList();
      });
    }

    const advForm = document.getElementById("explore-adv-form");
    if (advForm) {
      advForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("explore-adv-input");
        const text = input.value.trim();
        if (!text || !currentStory || isThinking) return;
        input.value = "";
        handleFreeInput(text, currentStory.id);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExploreUI);
  } else {
    initExploreUI();
  }

  window.__pepitalkExplore = {
    STORY_DATA,
    renderStoryList,
    enterStory,
    getCompletedCount,
    isStoryUnlocked
  };
})();
