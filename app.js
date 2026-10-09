const RESQ={
 apiBase:localStorage.getItem("resq_api_base")||"http://localhost:8080/api",
 demo:localStorage.getItem("resq_demo")!=="false",
 user:JSON.parse(localStorage.getItem("resq_user")||'{"name":"System Administrator","email":"admin@resq.local","role":"ADMIN"}')
};
const MOCK={
 disasters:[],
 emergencies:[],
 teams:[],
 hospitals:[],
 shelters:[],
 resources:[],
 volunteers:[],
 alerts:[],
 users:[],
 audit:[]
};
// Clear the previous seeded demo dataset once so the project starts with zero records.
if(localStorage.getItem("resq_empty_dataset_v1")!=="done"){["disasters","emergencies","teams","hospitals","shelters","resources","volunteers","alerts","users","audit"].forEach(k=>localStorage.removeItem("resq_"+k));localStorage.setItem("resq_empty_dataset_v1","done");}
const ROUTES={dashboard:"dashboard.html",disasters:"disasters.html",emergencies:"emergencies.html","rescue-teams":"rescue-teams.html",hospitals:"hospitals.html",shelters:"shelters.html",resources:"resources.html",volunteers:"volunteers.html",alerts:"alerts.html",map:"map.html",analytics:"analytics.html",users:"users.html",audit:"audit.html",settings:"settings.html"};
const TITLES={dashboard:"Command Dashboard",disasters:"Disaster Management",emergencies:"Emergency Reports","rescue-teams":"Rescue Teams",hospitals:"Hospitals & Medical",shelters:"Shelters & Evacuation",resources:"Resources & Inventory",volunteers:"Volunteer Network",alerts:"Emergency Alerts",map:"Live Operations Map",analytics:"Analytics & Reports",users:"User Management",audit:"Audit Logs",settings:"System Settings"};
const ICONS={dashboard:"⌂",disasters:"⚠",emergencies:"✚","rescue-teams":"🚑",hospitals:"🏥",shelters:"⌂",resources:"▣",volunteers:"♟",alerts:"◉",map:"⌖",analytics:"▥",users:"♙",audit:"◌",settings:"⚙"};
function slug(){return location.pathname.split("/").pop().replace(".html","")||"index";}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function initials(v){return String(v||"User").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();}
function severity(v){let x=String(v||"").toLowerCase();return `<span class="badge badge-${x}">${esc(v)}</span>`;}
function status(v){let s=String(v||""),c=/ACTIVE|AVAILABLE|DEPLOYED|OPEN|OPERATIONAL|ASSIGNED|IN PROGRESS|SENT/.test(s)?"active":/RESOLVED|GOOD/.test(s)?"success":/HIGH LOAD|NEAR FULL|PENDING|SCHEDULED/.test(s)?"pending":"offline";return `<span class="badge badge-${c}">${esc(s)}</span>`;}
function data(key){try{return JSON.parse(localStorage.getItem("resq_"+key))||MOCK[key]||[]}catch{return MOCK[key]||[]}}
function save(key,v){localStorage.setItem("resq_"+key,JSON.stringify(v))}
function shell(content){
 const p=slug(),u=RESQ.user;
 const ni=(key,label)=>`<a class="nav-item ${p===key?"active":""}" href="${ROUTES[key]||key+".html"}"><span class="nav-icon">${ICONS[key]||"•"}</span>${label}</a>`;
 document.getElementById("app").innerHTML=`<div class="app-layout"><aside class="sidebar" id="sidebar"><div class="sidebar-head"><a class="brand" href="dashboard.html"><span class="brand-mark">D</span><span>DMRS</span></a></div><nav class="sidebar-nav">
 <div class="nav-section">COMMAND</div>${ni("dashboard","Dashboard")}${ni("disasters","Disasters")}${ni("emergencies","Emergency Reports")}${ni("map","Live Operations Map")}
 <div class="nav-section">RESPONSE</div>${ni("rescue-teams","Rescue Teams")}${ni("hospitals","Hospitals & Medical")}${ni("shelters","Shelters & Evacuation")}${ni("resources","Resources & Inventory")}${ni("volunteers","Volunteers")}
 <div class="nav-section">COMMUNICATION</div>${ni("alerts","Emergency Alerts")}
 <div class="nav-section">INTELLIGENCE</div>${ni("analytics","Analytics & Reports")}
 <div class="nav-section">ADMINISTRATION</div>${ni("users","Users & Roles")}${ni("audit","Audit Logs")}${ni("settings","Settings")}
 </nav><div class="sidebar-foot"><div class="user-mini"><div class="avatar">${initials(u.name)}</div><div><b>${esc(u.name)}</b><span>${esc(u.role)}</span></div><button class="icon-btn" id="logout">↪</button></div></div></aside>
 <main class="main"><header class="topbar"><div class="topbar-left"><button class="icon-square mobile-menu" id="menu">☰</button><div><div class="page-title">${TITLES[p]||"Command Center"}</div><div class="breadcrumbs">Operations / ${TITLES[p]||""}</div></div></div><div class="top-actions"><span class="badge badge-active hide-small">● SYSTEM ONLINE</span><button class="icon-square" id="search">⌕</button><button class="icon-square" id="notify">♧<i class="notif-dot"></i></button><div class="avatar">${initials(u.name)}</div></div></header><section class="content">${content}</section></main></div><div id="modalRoot"></div><div id="toastContainer" class="toast-container"></div>`;
 bindShell();
}
function bindShell(){document.getElementById("menu")?.addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));document.getElementById("logout")?.addEventListener("click",()=>{localStorage.removeItem("resq_user");location.href="login.html"});document.getElementById("notify")?.addEventListener("click",()=>toast("Notifications","3 critical incidents require attention.","warning"));document.getElementById("search")?.addEventListener("click",()=>openModal("Global Search",`<div class="form-field"><label>SEARCH INCIDENTS, USERS, RESOURCES</label><input id="globalSearch" autofocus placeholder="Try DIS-26001 or Flood"></div><div id="globalResults" class="incident-list" style="margin-top:12px"></div>`));document.addEventListener("input",e=>{if(e.target.id==="globalSearch")globalSearch(e.target.value)},{once:false})}
function globalSearch(q){let el=document.getElementById("globalResults");if(!el)return;let all=[...data("disasters"),...data("emergencies"),...data("teams")];let r=all.filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase())).slice(0,8);el.innerHTML=r.map(x=>`<div class="incident"><b>${esc(x.name||x.title||x.type||x.id)}</b><div class="incident-meta">${esc(x.id)} · ${esc(x.location||x.status||"")}</div></div>`).join("")||`<div class="empty">No matching records.</div>`}
function toast(title,message,type="info"){let r=document.getElementById("toastContainer");if(!r)return;let e=document.createElement("div");e.className="toast";e.innerHTML=`<strong>${type==="warning"?"⚠":"✓"}</strong><div><b>${esc(title)}</b><p>${esc(message)}</p></div>`;r.appendChild(e);setTimeout(()=>e.remove(),4000)}
function openModal(title,body,footer=""){document.getElementById("modalRoot").innerHTML=`<div class="modal-backdrop" id="backdrop"><div class="modal"><div class="modal-head"><h3>${title}</h3><button class="icon-btn" data-close>✕</button></div><div class="modal-body">${body}</div><div class="modal-foot">${footer||'<button class="btn btn-ghost" data-close>Close</button>'}</div></div></div>`;document.querySelectorAll("[data-close]").forEach(x=>x.onclick=closeModal);document.getElementById("backdrop").onclick=e=>{if(e.target.id==="backdrop")closeModal()}}
function closeModal(){document.getElementById("modalRoot").innerHTML=""}
function confirmAction(title,msg,fn){openModal(title,`<p class="muted">${esc(msg)}</p>`,`<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="confirm">Confirm</button>`);document.getElementById("confirm").onclick=()=>{closeModal();fn()}}
function getForm(fields,existing={}){return `<div class="form-grid">${fields.map(f=>{let v=existing[f.key]??"";let input=f.type==="select"?`<select id="f_${f.key}">${(f.options||[]).map(o=>`<option ${String(o)===String(v)?"selected":""}>${esc(o)}</option>`).join("")}</select>`:f.type==="textarea"?`<textarea id="f_${f.key}">${esc(v)}</textarea>`:`<input id="f_${f.key}" type="${f.type||"text"}" value="${esc(v)}" placeholder="${esc(f.placeholder||"")}">`;return `<div class="form-field ${f.full?"full":""}"><label>${esc(f.label)}</label>${input}</div>`}).join("")}</div>`}
function collect(fields){let o={};fields.forEach(f=>o[f.key]=document.getElementById("f_"+f.key)?.value||"");return o}
function tableSearch(input,body){document.getElementById(input)?.addEventListener("input",e=>{let q=e.target.value.toLowerCase();document.querySelectorAll("#"+body+" tr[data-search]").forEach(r=>r.style.display=r.dataset.search.toLowerCase().includes(q)?"":"none")})}
function csv(rows,name){if(!rows.length)return;let keys=Object.keys(rows[0]),text=[keys.join(","),...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))].join("\n"),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/csv"}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function api(path,opts={}){let h={"Content-Type":"application/json",...(opts.headers||{})},t=localStorage.getItem("resq_token");if(t)h.Authorization="Bearer "+t;if(RESQ.demo)return Promise.resolve({demo:true});return fetch(RESQ.apiBase+path,{...opts,headers:h}).then(async r=>{if(!r.ok)throw Error("API "+r.status);return r.json()})}
