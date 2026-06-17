export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const symbols = req.query.symbols || 'QQQ,NVDA,MSFT,QQQM,SMH,VOO,JEPI,AAPL,META,GOOGL,AMZN,LLY,MNQ1!,NQ1!';
  const key = 'd8oobn1r01qn89hsnlpg';
  const list = symbols.split(',');
  
  const results = await Promise.allSettled(
    list.map(async sym => {
      const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${key}`);
      const d = await r.json();
      return { sym, c: d.c, pc: d.pc };
    })
  );

  const data = {};
  results.forEach(r => {
    if (r.status === 'fulfilled' && r.value.c > 0) {
      const { sym, c, pc } = r.value;
      data[sym] = { price: c, pct: pc > 0 ? ((c - pc) / pc) * 100 : 0 };
    }
  });

  res.status(200).json(data);
}
