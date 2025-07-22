# lucky-draw-full

Cloudflare Worker 全部部署的幸运抽奖小程序。

## 部署步骤

1. 创建 KV 命名空间：

```bash
wrangler kv:namespace create "DRAW_KV"
```

2. 修改 `wrangler.toml`，填写 KV 命名空间 ID。

3. 使用 wrangler 部署：

```bash
wrangler publish
```

4. 访问 Worker URL 即可使用。

---

支持用户输入用户名，每天限抽一次，中奖概率 20%。