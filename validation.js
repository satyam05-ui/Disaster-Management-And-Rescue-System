const Validator={
required:v=>String(v??"").trim().length>0,
email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||"")),
positive:v=>Number.isFinite(Number(v))&&Number(v)>=0,
phone:v=>/^[0-9+()\-\s]{7,18}$/.test(String(v||"")),
severity:v=>["CRITICAL","HIGH","MEDIUM","LOW"].includes(String(v||"").toUpperCase()),
role:v=>["ADMIN","AUTHORITY","RESCUE","MEDICAL","VOLUNTEER","CITIZEN"].includes(String(v||"").toUpperCase())
};
function validateObject(object,rules){const errors={};for(const [key,rule] of Object.entries(rules)){if(!rule(object[key]))errors[key]=`Invalid ${key}`;}return errors}
