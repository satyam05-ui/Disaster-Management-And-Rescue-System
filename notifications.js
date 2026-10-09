const EventBus=(()=>{const map={};return{on(n,fn){(map[n]??=[]).push(fn)},emit(n,p){(map[n]||[]).forEach(fn=>fn(p))},off(n,fn){map[n]=(map[n]||[]).filter(x=>x!==fn)}}})();
function simulateIncidentEvent(){EventBus.emit("incident:new",{id:"INC-"+Date.now().toString().slice(-5),severity:"HIGH"})}
function connectWebSocket(url="ws://localhost:8080/ws"){try{const ws=new WebSocket(url);ws.onopen=()=>EventBus.emit("socket:open");ws.onmessage=e=>{try{EventBus.emit("socket:event",JSON.parse(e.data))}catch{}};ws.onclose=()=>EventBus.emit("socket:close");return ws}catch{return null}}
