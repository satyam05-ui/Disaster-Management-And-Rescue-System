function formatNumber(n){return Number(n||0).toLocaleString()}
function formatPercent(n){return `${Number(n||0).toFixed(1)}%`}
function formatDuration(m){m=Number(m||0);return m<60?`${Math.round(m)}m`:`${Math.floor(m/60)}h ${Math.round(m%60)}m`}
function formatDate(d){const x=new Date(d);return Number.isNaN(x.getTime())?String(d):x.toLocaleString()}
