# PepiTalk Cloudflare 部署指南

## 架构说明

```
用户手机浏览器
    │
    ├─── 前端静态页面 ──→ Cloudflare Pages (免费)
    │    (index.html, styles.css, main.js)
    │
    └─── AI对话API ──→ Cloudflare Workers (免费) ──→ SiliconFlow API
         (/api/chat)
```

---

## 第一步：部署前端（Cloudflare Pages）

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单点击 **Workers & Pages**
3. 点击 **Create** → **Pages** → **Connect to Git**
4. 选择 GitHub 账号，找到 `pepitalk-` 仓库
5. 配置构建设置：
   - **Project name**: `pepitalk`
   - **Production branch**: `main`
   - **Build command**: 留空（不需要构建）
   - **Build output directory**: 留空 或填 `/`（根目录就是静态文件）
6. 点击 **Save and Deploy**

部署成功后你会得到一个地址，类似：`https://pepitalk.pages.dev`

> 之后每次 push 到 GitHub，Cloudflare Pages 会自动重新部署！

---

## 第二步：部署后端 API（Cloudflare Workers）

### 方法 A：通过 Cloudflare Dashboard（最简单）

1. 在 Cloudflare Dashboard 左侧点击 **Workers & Pages**
2. 点击 **Create** → **Worker**
3. 名字填 `pepitalk-api`，点击 **Deploy**
4. 进入 Worker 编辑页面，点击 **Edit Code**
5. 把 `worker/index.js` 的全部内容粘贴进去，替换默认代码
6. 点击 **Save and Deploy**

### 方法 B：通过 Wrangler CLI（推荐，后续更新更方便）

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 进入 worker 目录部署
cd worker
wrangler deploy
```

### 配置 API 密钥（重要！）

Worker 部署后，需要添加 API 密钥作为 **Secret**：

1. 在 Worker 页面 → **Settings** → **Variables and Secrets**
2. 点击 **Add** → **Secret**
3. 添加：
   - **Variable name**: `SILICONFLOW_API_KEY`
   - **Value**: 你的 SiliconFlow API Key（sk-开头的那个）
4. 点击 **Save**

部署成功后你的 Worker 地址类似：`https://pepitalk-api.你的账户.workers.dev`

---

## 第三步：连接前后端

前端需要知道后端 Worker 的地址。编辑 `index.html` 中的配置：

```html
<script>
  window.__PEPITALK_API__ = "https://pepitalk-api.你的账户.workers.dev";
</script>
```

把 `你的账户` 替换为你的 Cloudflare Workers 子域名，然后 push 更新：

```powershell
.\deploy.ps1 "配置Worker API地址"
```

---

## 日常更新流程

修改代码后，只需一条命令：

```powershell
# 在 pepitalk 项目目录下运行
.\deploy.ps1 "你的改动说明"
```

脚本会自动：
1. `git add` 所有改动
2. `git commit` 带上你的说明
3. `git push` 到 GitHub
4. Cloudflare Pages 自动检测并重新部署（通常 30 秒内完成）

如果不带参数，会自动生成带时间戳的提交信息：

```powershell
.\deploy.ps1
```

---

## 费用说明

| 服务 | 免费额度 | 说明 |
|------|---------|------|
| Cloudflare Pages | 无限站点，500次构建/月 | 静态托管完全免费 |
| Cloudflare Workers | 10万次请求/天 | 对话API代理，足够日常使用 |
| SiliconFlow API | 按量计费 | DeepSeek V3 模型调用费用 |

---

## 常见问题

**Q: Push 失败提示 proxy 错误？**
A: 脚本已自动清除代理设置。如果还是失败，手动运行：
```powershell
$env:http_proxy = ""; $env:https_proxy = ""
```

**Q: 聊天没反应？**
A: 检查 Worker 的 `SILICONFLOW_API_KEY` Secret 是否设置正确。

**Q: 如何查看部署日志？**
A: Cloudflare Dashboard → Workers & Pages → 你的项目 → Deployments
