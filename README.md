# 家庭手账本

静态单页应用（GitHub Pages）：https://001huang.github.io/family-ledger/

## 手机提醒 / 真推送

本版采用 **ntfy.sh**（免费公共推送，无需再注册 OneSignal / Firebase）：

1. 手机安装 [ntfy（安卓）](https://play.google.com/store/apps/details?id=io.heckel.ntfy) 或 [ntfy（iOS）](https://apps.apple.com/app/ntfy/id1625396347)
2. 打开手账本 → **设置** → 点绿色 **🧪 发送测试提醒（约12秒）**，或进 **🔔 手机提醒 / 真推送** → 开启并复制「家庭推送话题」
3. 在 ntfy App 里订阅该话题（服务器 `ntfy.sh`）
4. 新建任务 / 手账时勾选「🔔 设置提醒」并选时间
5. 可点「📅 加到手机日历」作系统级兜底

### 限制（请知晓）

- **关网页也能响**：依赖手机上的 **ntfy App** 订阅话题（这是真推送通道）。
- ntfy 公共服务器单次预约最长 **3 天**；更远的提醒会在临近 3 天内由页面自动补投，建议同时加日历。
- **PWA / 添加到主屏幕**：安卓 Chrome、iOS Safari（建议 iOS 16.4+）可用；微信内置浏览器请用系统浏览器打开。
- 纯浏览器 Web Push（不装 ntfy、关网页也推）需要自建推送服务或 OneSignal 等账号；本版优先免注册方案。

## 本地文件

`index.html` 也可直接用浏览器打开；真推送与 Service Worker 在 `file://` 下受限，线上地址最完整。
