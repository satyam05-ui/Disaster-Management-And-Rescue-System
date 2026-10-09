/* Reusable CRUD renderer used by every operational module. */
function makeCrud(config){
const records=data(config.key);
const cols=config.columns;
const fields=config.fields;
const kpis=config.kpis||[];
const kpiHtml=kpis.map(k=>`<div class="kpi"><div class="kpi-head"><span>${esc(k.label)}</span><span>${esc(k.note||"")}</span></div><div class="kpi-value ${k.cls||""}">${esc(k.value)}</div><div class="kpi-change">${esc(k.sub||"")}</div></div>`).join("");
function cell(r,c){
const v=r[c.key]??"—";
if(c.key==="severity"||c.key==="priority")return severity(v);
if(c.key==="status"||c.key==="availability")return status(v);
if(c.key==="quantity"||c.key==="affected"||c.key==="people"||c.key==="beds"||c.key==="occupied"||c.key==="members"||c.key==="allocated"||c.key==="reorder")return Number(v).toLocaleString();
if(c.key==="occupied"&&r.capacity)return `${v} / ${r.capacity}`;
return esc(v);
}
function render(list=records){
document.getElementById("tableBody").innerHTML=list.length?list.map((r,i)=>`<tr data-search="${esc(JSON.stringify(r))}">${cols.map(c=>`<td>${cell(r,c)}</td>`).join("")}<td><div class="mini-actions"><button data-act="view" data-i="${i}">View</button><button data-act="edit" data-i="${i}">Edit</button><button data-act="delete" data-i="${i}">Delete</button></div></td></tr>`).join(""):`<tr><td colspan="${cols.length+1}"><div class="empty"><b>No records found</b>Try a different search.</div></td></tr>`;
}
shell(`<div class="page-head"><div><div class="eyebrow">OPERATIONS MODULE</div><h1>${esc(config.title)}</h1><p>${esc(config.description||"Manage live operational records and coordinate response activity.")}</p></div><div class="actions"><button class="btn btn-primary" id="add">+ Add Record</button></div></div><div class="kpi-grid">${kpiHtml}</div><div class="panel" style="margin-top:12px"><div class="panel-body"><div class="searchbar"><input id="q" placeholder="Search records by ID, name, location…"><select id="filter"><option value="">All records</option><option>ACTIVE</option><option>AVAILABLE</option><option>DEPLOYED</option><option>CRITICAL</option><option>HIGH</option><option>RESOLVED</option><option>OPEN</option></select><button class="btn btn-ghost" id="export">⇩ Export CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr>${cols.map(c=>`<th>${esc(c.label)}</th>`).join("")}<th>ACTIONS</th></tr></thead><tbody id="tableBody"></tbody></table></div></div></div>`);
render();tableSearch("q","tableBody");
document.getElementById("filter").onchange=e=>{let q=e.target.value;render(q?records.filter(r=>Object.values(r).some(v=>String(v).toUpperCase().includes(q))):records)};
document.getElementById("export").onclick=()=>csv(records,config.key+".csv");
document.getElementById("add").onclick=()=>form(null,-1);
function form(existing,index){
openModal(existing?"Edit Record":"Create Record",getForm(fields,existing||{}),`<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="saveRecord">Save Record</button>`);
document.getElementById("saveRecord").onclick=()=>{let d=collect(fields);if(existing)records[index]={...existing,...d};else{d.id=config.prefix+"-"+Date.now().toString().slice(-6);records.unshift(d)}save(config.key,records);render();closeModal();toast(existing?"Record updated":"Record created",existing?"Changes saved successfully.":"New record added.")};
}
function view(r){openModal("Record Details",`<div class="profile-card"><div class="profile-avatar">${initials(r.name||r.title||r.type||r.id)}</div><div><h3>${esc(r.name||r.title||r.type||r.id)}</h3><p class="muted">${esc(r.location||r.status||"Operational record")}</p></div></div><div class="form-grid" style="margin-top:20px">${Object.entries(r).map(([k,v])=>`<div class="form-field"><label>${esc(k.replaceAll("_"," ").toUpperCase())}</label><div style="padding:9px 10px;border:1px solid var(--border);border-radius:8px;color:#cbd8de;font-size:11px">${esc(v)}</div></div>`).join("")}</div>`)}
document.getElementById("tableBody").onclick=e=>{let b=e.target.closest("[data-act]");if(!b)return;let i=+b.dataset.i;if(b.dataset.act==="view")view(records[i]);if(b.dataset.act==="edit")form(records[i],i);if(b.dataset.act==="delete")confirmAction("Delete record","The selected record will be removed.",()=>{records.splice(i,1);save(config.key,records);render();toast("Record deleted","The record was removed.","warning")})};
}
