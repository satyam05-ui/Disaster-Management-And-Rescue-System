/* Spring Boot REST adapter. The UI calls the same domain concepts in demo mode. */
const APIClient={
get(path){return api(path,{method:"GET"})},
post(path,body){return api(path,{method:"POST",body:JSON.stringify(body)})},
put(path,body){return api(path,{method:"PUT",body:JSON.stringify(body)})},
delete(path){return api(path,{method:"DELETE"})},
login(body){return this.post("/auth/login",body)},
listDisasters(){return this.get("/disasters")},
listEmergencies(){return this.get("/emergencies")},
listTeams(){return this.get("/rescue-teams")},
listHospitals(){return this.get("/hospitals")},
listShelters(){return this.get("/shelters")},
listResources(){return this.get("/resources")},
listVolunteers(){return this.get("/volunteers")},
listAlerts(){return this.get("/alerts")},
analytics(){return this.get("/analytics/summary")}
};
