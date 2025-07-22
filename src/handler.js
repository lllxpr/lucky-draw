const indexHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>幸运抽奖</title>
<style>
body { font-family: sans-serif; text-align: center; padding: 40px; }
input { font-size: 1rem; padding: 8px; margin: 4px; }
button { font-size: 1rem; padding: 8px 16px; margin: 4px; }
</style>
</head>
<body>
<h1>幸运抽奖活动</h1>
<p><input id="username" placeholder="请输入用户名"/></p>
<p><button id="draw">抽奖</button></p>
<p id="result"></p>

<script>
document.getElementById('draw').onclick = async () => {
  const username = document.getElementById('username').value.trim();
  const res = await fetch('/api/draw', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username})
  });
  const data = await res.json();
  document.getElementById('result').textContent = data.message;
};
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/draw" && request.method === "POST") {
      const { username } = await request.json();
      if (!username || typeof username !== "string") {
        return new Response("用户名无效", { status: 400 });
      }
      const today = new Date().toISOString().slice(0, 10);
      const key = `${username}_${today}`;
      const hasDrawn = await env.DRAW_KV.get(key);
      if (hasDrawn) {
        return new Response(JSON.stringify({ message: "你今天已经抽过奖啦！" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      const win = Math.random() < 0.2;
      await env.DRAW_KV.put(key, win ? "win" : "lose", { expirationTtl: 86400 });
      return new Response(JSON.stringify({
        message: win ? "🎉 恭喜你中奖了！" : "很遗憾，未中奖~",
        win,
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 返回首页
    return new Response(indexHtml, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  }
};