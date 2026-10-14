# AGENTS.md

## 是什么
「家庭手账本」——静态单页 PWA，`index.html` 一个文件（约 240KB），GitHub Pages 托管。
六大模块：🍳厨房 / 🛒采购 / ✅任务 / 📖手账 / 💰记账 / 👨‍👩‍👧‍👦家人。
数据存在浏览器 localStorage，键名 **`family_planner_v2`**。手机提醒走 ntfy.sh 公共推送（免注册）。

## 怎么启动
没有本地服务、没有端口。双击 `index.html` 也能开；完整功能（Service Worker / 真推送）要看线上：
**https://001huang.github.io/family-ledger/**

## 端口与网址（当前真相）
- 线上：https://001huang.github.io/family-ledger/
- 仓库：https://github.com/001huang/family-ledger ，分支 **main**
- 无后端、无端口。

## 踩过的坑
1. **git push 必须带本机代理**，否则必超时：本机 IE 代理开着（`127.0.0.1:7890`，加速器），git 直连 github.com 会卡 21 秒然后报 `Failed to connect`。推送一律用：
   `git -c http.proxy=http://127.0.0.1:7890 -c https.proxy=http://127.0.0.1:7890 push origin main`
2. **别用 SSH 推**：`~/.ssh/known_hosts` 里 github.com 的 ed25519 指纹是错的（`SHA256:Yvl8MpiZ...`，GitHub 官方应为 `+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU`），ssh 一上来就报 REMOTE HOST IDENTIFICATION HAS CHANGED。走 HTTPS + 凭据管理器（电脑里已存 001huang 的凭据）。
3. **云同步自带的两个免费服务已经死了**：npoint.io 报 500、jsonblob.com 被拦 403 → 页面上「＋新建一个云端地址」永远弹「暂时建不了」。要自动同步只能自己填一个能存 JSON 的地址（页面支持手填任意地址）。
4. 数据 localStorage 键是 `family_planner_v2`（不是 fp_data_v1）。
5. 弹窗的保存按钮是 **`#mOk`**（`modal()` 的确认回调挂在它身上）。用 Playwright 自动填表要点 `#mOk`，用 `text=保存` 有时不生效。
6. 手账弹窗勾「🔔 设置提醒」后，要先触发 `#r_on` 的 change 事件，`#r_at` 才会显示出来；否则 `fill('#r_at')` 会因为元素不可见而失败。
7. ntfy 单次最长预约 3 天，更远的提醒页面会自动补投。话题由 `genTopic()` **随机生成，换设备就换话题**——想让手机和电脑推同一个话题，必须：① 互发一次「同步码」合并（会把 push.topic 带过去），或 ② 两边手动填同一串话题。
8. 改完 `index.html`，GitHub Pages **约 45 秒**才生效；SW 对 HTML 是网络优先，刷新即可，但大改请把 `sw.js` 里的 `CACHE` 版本号 +1（会自动清掉旧缓存）。

## 最近5次改动
- 2026-10-15 云同步图标换色：**关=红 #C0392B、开=蓝 #1F6FD0、同步中=黄 #B8892B、出错=橙 #C2681A**（浅底深字，深色/浅色主题都看得清）；SW 缓存 v5→v6。真浏览器实测三档状态颜色正确。
- 2026-10-15 用 Playwright 建了 3 条手账并各挂一个提醒（45s / 222s / 460s），确认 ntfy 全都投递成功。

## 相关共享组件
无，独立单页。提醒推送 = ntfy.sh；兜底 = 生成 .ics 加到手机系统日历。

## 干活规矩
- 动代码前先打存档点：`git add -A` + `git -c user.name=pinju -c user.email=pinju@local commit -m "说明"`。
- 推完等 45 秒，用 `curl https://001huang.github.io/family-ledger/index.html` 核对线上内容真的变了再收工。
- 云端地址 = 全家数据的钥匙，禁止写进代码 / 文档 / 提交信息。
