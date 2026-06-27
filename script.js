const stocks = [
  {rank:1, cat:"持股", code:"1718", name:"中纖", price:8.72, chg:"+3.44", eps:"0.12", pe:"72.7", yoy:"轉佳", foreign:"偏買", margin:"注意", tech:"量增突破", risk:"低價波動", plan:"分批、看量"},
  {rank:2, cat:"持股", code:"1905", name:"華紙", price:17.45, chg:"+1.16", eps:"0.34", pe:"51.3", yoy:"改善", foreign:"觀察", margin:"升高", tech:"強勢整理", risk:"漲多回檔", plan:"獲利分批鎖"},
  {rank:3, cat:"持股", code:"6116", name:"彩晶", price:8.80, chg:"+4.02", eps:"-0.22", pe:"虧損", yoy:"低基期", foreign:"偏買", margin:"高", tech:"面板輪動", risk:"基本面弱", plan:"短線不戀戰"},
  {rank:4, cat:"觀察", code:"1314", name:"中石化", price:7.98, chg:"-0.38", eps:"-0.18", pe:"虧損", yoy:"改善中", foreign:"曾大買", margin:"高", tech:"震盪換手", risk:"當沖多", plan:"只看支撐"},
  {rank:5, cat:"觀察", code:"1304", name:"台聚", price:13.20, chg:"+0.76", eps:"0.05", pe:"264", yoy:"待確認", foreign:"小買賣", margin:"普通", tech:"低位整理", risk:"獲利弱", plan:"等量再進"},
  {rank:6, cat:"ETF", code:"00406A", name:"低價ETF", price:10.05, chg:"+0.10", eps:"-", pe:"-", yoy:"-", foreign:"-", margin:"-", tech:"貼近成本", risk:"短線慢", plan:"偏配息持有"}
];

function render(list){
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = list.map(s => {
    const cls = String(s.chg).startsWith("+") ? "up" : String(s.chg).startsWith("-") ? "down" : "mid";
    return `<tr>
      <td>${s.rank}</td><td>${s.cat}</td><td>${s.code}</td><td>${s.name}</td><td>${s.price}</td>
      <td class="${cls}">${s.chg}%</td><td>${s.eps}</td><td>${s.pe}</td><td>${s.yoy}</td>
      <td>${s.foreign}</td><td>${s.margin}</td><td>${s.tech}</td><td>${s.risk}</td><td>${s.plan}</td>
    </tr>`;
  }).join("");
}
render(stocks);

document.querySelector("#search").addEventListener("input", e=>{
  const q = e.target.value.trim();
  render(stocks.filter(s => Object.values(s).join(" ").includes(q)));
});

document.querySelector("#themeBtn").addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
});

document.querySelector("#watchList").innerHTML = stocks.slice(0,4).map(s =>
  `<li><b>${s.code} ${s.name}</b>：${s.plan}，風險：${s.risk}</li>`
).join("");
