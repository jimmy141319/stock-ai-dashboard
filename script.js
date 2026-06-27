const stocks = {
  heavy: [
    ['2330','台積電'],['2454','聯發科'],['2317','鴻海'],['2308','台達電'],['2382','廣達'],['3711','日月光投控'],['2303','聯電']
  ],
  etf: [
    ['0050','元大台灣50'],['006208','富邦台50'],['00878','國泰永續高股息'],['00919','群益台灣精選高息'],['00939','統一台灣高息動能']
  ],
  mine: [
    ['00403A','主動統一升級50','4000'],['00406A','主動中信台灣收益','3000'],['00916','國泰全球品牌50','5000'],['00939','統一台灣高息動能','1000'],['1304','台聚','4000'],['6116','彩晶','2000'],['2330','台積電零股','10']
  ]
};

const macro = [
  ['外資現貨','盤後更新','連續大賣＝提款壓力','yellow'],
  ['外資台指期空單','盤後更新','8萬口以上＝高壓力','red'],
  ['融資餘額','盤後更新','不減反增＝散戶槓桿未洗','yellow'],
  ['USD/TWD','即時需匯率API','台幣貶＝外資匯損壓力','yellow'],
  ['費半 / Nasdaq','美股盤中/收盤','AI半導體風向','yellow'],
  ['日股 / 韓股','盤中觀察','亞洲資金同步性','yellow']
];

function twseUrl(code){
  // TWSE MIS。免費資料可能有 CORS 或延遲，若失敗會顯示手動更新。
  return `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_${code}.tw|otc_${code}.tw&json=1&delay=0&_=${Date.now()}`;
}

async function fetchQuote(code){
  try{
    const r = await fetch(twseUrl(code), {cache:'no-store'});
    const j = await r.json();
    const item = (j.msgArray||[]).find(x => x.c === code || x.ch?.includes(code));
    if(!item) throw new Error('no quote');
    const price = parseFloat(item.z || item.y || 0);
    const prev = parseFloat(item.y || 0);
    const chg = prev ? ((price-prev)/prev*100) : 0;
    return {price, chg, time:item.t || '--', ok:true};
  }catch(e){
    return {price:null, chg:null, time:'--', ok:false};
  }
}

function clsByChg(v){ if(v===null) return 'gray'; if(v>0.5) return 'green'; if(v<-0.5) return 'red'; return 'yellow'; }
function riskText(score){ if(score>=80) return ['偏多','green']; if(score>=60) return ['震盪','yellow']; if(score>=40) return ['偏空','red']; return ['高風險','red']; }
function tag(text, color){ return `<span class="tag ${color}">${text}</span>`; }
function pct(v){ return v===null ? '--' : `${v>=0?'+':''}${v.toFixed(2)}%`; }
function price(v){ return v===null ? '--' : v.toFixed(v>100 ? 1 : 2); }

function renderMacro(){
  document.getElementById('macroTable').innerHTML = `<tr><th>指標</th><th>狀態</th><th>判斷</th></tr>` +
    macro.map(r=>`<tr><td>${r[0]}</td><td>${tag(r[1],r[3])}</td><td>${r[2]}</td></tr>`).join('');
}

async function renderQuoteTable(id, list, hasShares=false){
  const rows = await Promise.all(list.map(async r=>{
    const q = await fetchQuote(r[0]);
    const color = q.ok ? clsByChg(q.chg) : 'gray';
    return `<tr><td>${r[0]}</td><td>${r[1]}</td>${hasShares?`<td>${r[2]}</td>`:''}<td>${price(q.price)}</td><td class="num ${q.chg>0?'up':q.chg<0?'down':''}">${pct(q.chg)}</td><td>${tag(q.ok?'自動':'手動',color)}</td></tr>`;
  }));
  document.getElementById(id).innerHTML = `<tr><th>代號</th><th>名稱</th>${hasShares?'<th>持股</th>':''}<th>價格</th><th>漲跌%</th><th>資料</th></tr>` + rows.join('');
}

async function refresh(){
  renderMacro();
  await Promise.all([
    renderQuoteTable('heavyTable', stocks.heavy),
    renderQuoteTable('etfTable', stocks.etf),
    renderQuoteTable('myTable', stocks.mine, true)
  ]);
  // V1 分數：先以手動宏觀風險 + 報價成功率給基準；後續可接法人/融資API再精算。
  const score = 62;
  const [label,color] = riskText(score);
  const s = document.getElementById('riskScore');
  s.textContent = score;
  s.style.background = `var(--${color==='green'?'good':color==='yellow'?'warn':'bad'})`;
  document.getElementById('riskLabel').textContent = label;
  document.getElementById('riskNote').textContent = 'V1：盤中看價格；盤後補外資、期貨、融資。外資空單/融資未接API前請手動填入。';
  document.getElementById('updated').textContent = '更新時間：' + new Date().toLocaleString('zh-TW');
}

document.getElementById('refreshBtn').addEventListener('click', refresh);
refresh();
setInterval(refresh, 60_000);
