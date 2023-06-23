

( async function () {
    var vm = new Vue({
        el: document.querySelector(('#mount'+par.authorID)),
        data: {
            authors: [],
            groupKeys: ["Persönliche Daten","Ausbildung", "Berufstätigkeit", "Mitgliedschaft", "Literarische Tätigkeit", "Würdigung", "Lebensorte & Reisen"],
            counter: {"Persönliche Daten":"1","Ausbildung":"2", "Berufstätigkeit":"3",  "Mitgliedschaft":"4", "Literarische Tätigkeit":"5",  "Würdigung":"6", "Lebensorte & Reisen":"7", "Andere":"8"},
            author: {},
            publications: [],
            authorID: par.authorID,
            authorName: par.authorName,
            orderPers: par.orderPers,
            orderEdu: par.orderEdu,
            orderEmpl: par.orderEmpl,
            orderMemb: par.orderMemb,
            orderLitact: par.orderLitact,
            orderAwards: par.orderAwards,
            orderOther: par.orderOther,
            editMode: par.editMode
        },
        template:
            `<div>
                   <div v-for="author in authors">
                  
                        <div>
                        <div v-for="group in groupKeys">
                        <a v-if="author.events[group] && author.events[group].length > 0" data-toggle="collapse" :href="'#group'+counter[group]" role="button" aria-expanded="true"
                         aria-controls="'group'+counter[group]">
 <h3 >{{group}}<span v-if="editMode=='true'" class="id_style"> IDs</span></h3>
  </a>
                           
                     <div class="collapse" v-bind:id="'group'+counter[group]" >
                           <ul class="timeline">
                                <li v-for="event in author.events[group]" v-if="event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.institutionLabel || event.placeLabel">
                                <div :class="{'hidden-in-edit-mode' : event.hidden}">
                                <b>
                                   <span v-if="event.eventBeginYear && event.eventEndYear">
                                   <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">{{event.eventBeginYear.value}}</span> 
                                   bis <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">{{event.eventEndYear.value}}</span>
                                   </span>
                                   <span v-else-if="event.eventBeginYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">
                                   {{event.eventBeginYear.value}}</span>
                                   <span v-else-if="event.eventEndYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">
                                   bis {{event.eventEndYear.value}}</span>
                                   <span v-if="group=='Andere' || group=='Persönliche Daten' || group=='Lebensorte & Reisen'">{{event.eventTypeLabel}}</span></b>
                                   
                                   <span v-if="event.educationLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.educationLabel)">{{event.educationLabel.value}}</span>
                                   <span v-if="event.professionsOfEmployment && event.employmentLabel" 
                                   v-b-tooltip.html.v-secondary="getAllReferences(event.employmentLabel)">{{event.employmentLabel.value}}</span>
                                   <span v-if="event.grantedAwardLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.grantedAwardLabel)">{{event.grantedAwardLabel.value}}</span>
                                   <span v-if="event.institutionLabel && (event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.placeLabel)" v-b-tooltip.html.v-secondary="getAllReferences(event.institutionLabel)">, {{event.institutionLabel.value}}</span>
                                   <span v-else-if="event.institutionLabel && !(event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.placeLabel)" v-b-tooltip.html.v-secondary="getAllReferences(event.institutionLabel)">{{event.institutionLabel.value}}</span>
                                   <span v-if="event.placeLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.placeLabel)">in {{event.placeLabel.value}}</span>
                                   <span v-if="event.eventOfParticipationLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.eventOfParticipationLabel)">{{event.eventOfParticipationLabel.value}}</span>
                                   <span v-if="editMode=='true'" class="id_style">ID: {{event.id}}</span>
                                </div>
                                </li>
                            </ul>
                            </div>
                            </div>
                        </div>
                    <div>
<a v-if="author.events['Andere'].length > 0" data-toggle="collapse" href="#groupAndere" role="button" aria-expanded="true" aria-controls="'group'+counter['Andere']">

<h3>Andere</h3>
</a>
<div class="collapse" id="groupAndere">
<ul class="timeline-publications">
    <li v-for="event in author.events['Andere']" v-if="event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.institutionLabel || event.placeLabel">
        <div :class="{'hidden-in-edit-mode' : event.hidden}">
                                <b>
                                   <span v-if="event.eventBeginYear && event.eventEndYear">
                                   <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">{{event.eventBeginYear.value}}</span> 
                                   bis <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">{{event.eventEndYear.value}}</span>
                                   </span>
                                   <span v-else-if="event.eventBeginYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">
                                   {{event.eventBeginYear.value}}</span>
                                   <span v-else-if="event.eventEndYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">
                                   bis {{event.eventEndYear.value}}</span>
                                   <span>{{event.eventTypeLabel}}</span></b>
                                   
                                   <span v-if="event.educationLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.educationLabel)">{{event.educationLabel.value}}</span>
                                   <span v-if="event.professionsOfEmployment && event.employmentLabel" 
                                   v-b-tooltip.html.v-secondary="getAllReferences(event.employmentLabel)">{{event.employmentLabel.value}}</span>
                                   <span v-if="event.grantedAwardLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.grantedAwardLabel)">{{event.grantedAwardLabel.value}}</span>
                                   <span v-if="event.institutionLabel && (event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.placeLabel)" v-b-tooltip.html.v-secondary="getAllReferences(event.institutionLabel)">, {{event.institutionLabel.value}}</span>
                                   <span v-else-if="event.institutionLabel && !(event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.placeLabel)" v-b-tooltip.html.v-secondary="getAllReferences(event.institutionLabel)">{{event.institutionLabel.value}}</span>
                                   <span v-if="event.placeLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.placeLabel)">in {{event.placeLabel.value}}</span>
                                   <span v-if="event.eventOfParticipationLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.eventOfParticipationLabel)">{{event.eventOfParticipationLabel.value}}</span>
                                   <span v-if="editMode=='true'" class="id_style">ID: {{event.id}}</span>
                                </div>
    </li>
</ul>
</div>
 <hr>                  
<a v-if="publications.length > 0" data-toggle="collapse" href="#publicationGroup" role="button" aria-expanded="true" aria-controls="'group'+counter[group]">

<h3>Publikationen</h3>
</a>
<div class="collapse" id="publicationGroup">
<ul class="timeline-publications">
    <li v-for="publication in publications">
        {{publication.publicationTypeLabel}}:  
        <b>{{publication.titleLabel}}</b>,  
        {{publication.publicationYear}} 
        {{publication.publisherLabel}} 
        <span v-if="publication.authorRoles">({{publication.authorRoles}})</span>
    </li>
</ul>
</div>

</div>
</div>
</div>

`,
        mounted: await function () {
            console.log("SHOW ID", this.editMode)

            console.log("AuthorID:",par.authorID, "person", par.orderPers)
            console.log("Window location", window.location.href)
            //let url = new URL(window.location.href)
            //this.author = {name: new URLSearchParams(url.search).get('authorname'), id: new URLSearchParams(url.search).get('id')}

            let gender;

            let url = 'https://data.ddr-literatur.de/api/personevents/' + this.authorID;
            console.log(url)
            fetch(url, {method: "GET", mode: "cors"}).then((response) => {
                return response.json()
            }).then((data) => {

                let sortedData = data
                sortedData.sort((a, b) => {
                    //wenn Enddatum & kein Anfangsdatum, dann Einträge durchgehen & vor Eintrag platzieren, mit Anfangsdatum übereinstimmt
                    // oder davor /danach
                    if (a.eventBeginYear && b.eventBeginYear) {
                        console.log(a.eventBeginYear.value - b.eventBeginYear.value)
                        return a.eventBeginYear.value - b.eventBeginYear.value
                    } else if (a.eventBeginYear && !b.eventBeginYear) {
                        return -1
                    } else if (!a.eventBeginYear && b.eventBeginYear) {
                        return 1
                    } else if (!a.eventBeginYear && !b.eventBeginYear) {
                        return 0
                    }
                });
                const tempSortedData = sortedData;
                const eventEndYearEls =[];
                tempSortedData.forEach(el =>{
                    if(!el.eventBeginYear && el.eventEndYear){
                        eventEndYearEls.push(el);
                    }
                })

                eventEndYearEls.forEach(el =>{
                    console.log("Element",el)
                    for(let i = 0; i < sortedData.length-1; i++){
                        if(sortedData[i].eventEndYear && sortedData[i].eventEndYear.value > el.eventEndYear.value){
                            sortedData.splice(sortedData.indexOf(el),1)
                            sortedData.splice(i, 0, el);

                            return;
                        }else if(!sortedData[i].eventEndYear && sortedData[i].eventBeginYear && sortedData[i].eventBeginYear.value >el.eventEndYear.value ){
                            sortedData.splice(sortedData.indexOf(el),1)
                            sortedData.splice(i, 0, el);
                            return;
                        }

                    }
                })
                //frühstes Beginndatum, was nach Enddatum liegt und/oder die ohne Anfangsdatum, nur Enddatum

                const groups = {
                    "Persönliche Daten":[],
                    "Ausbildung": [],
                    "Literarische Tätigkeit": [],
                    "Berufstätigkeit": [],
                    "Mitgliedschaft":[],
                    "Würdigung": [],
                    "Lebensorte & Reisen":[],
                    "Andere": []
                }

                /*orderPers: par.orderPers,
            orderEdu: par.orderEdu,
            orderEmpl: par.orderEmpl,
            orderMemb: par.orderMemb,
            orderLitact: par.orderLitact,
            orderAwards: par.orderAwards,
            orderOther: par.orderOther*/
                console.log("this.orderPers,",par.orderPers)
                sortedData.forEach(event => {
                    if(!gender){
                        gender = event.protagonist && event.protagonist[0] && event.protagonist[0].entity && event.protagonist[0].entity.gender
                            && event.protagonist[0].entity.gender[0] ? event.protagonist[0].entity.gender[0].value : "MALE"
                    }
                    if (event.eventGroup && this.groupKeys.includes(event.eventGroup)) {
                        groups[event.eventGroup].push(event)
                        if(event.eventGroup == "Andere"){
                        }
                    } else {
                        groups["Andere"].push(event);
                    }
                })
                console.log(groups)
                const ORDERTOGROUPMAP = {orderPers : "Persönliche Daten", orderEdu : "Ausbildung", orderEmpl: "Berufstätigkeit",
                orderAwards: "Würdigung", orderMemb: "Mitgliedschaft", orderLitact: "Literarische Tätigkeit", orderOther: "Andere"}
                Object.keys(par).filter(key => key.startsWith("order")).forEach(key => {
                    if(par[key]){
                        const eventIds = par[key].split(",");
                        const groupName = ORDERTOGROUPMAP[key];
                        const groupEvents = groups[groupName];
                        groups[groupName] = [];
                        eventIds.forEach(id => {
                            groupEvents.forEach(gEvent => {
                                if(gEvent.id == id){
                                    groups[groupName].push(gEvent)
                                }
                            })
                        })
                        if(this.editMode == "true"){
                            groupEvents.forEach(gEvent => {
                                if(eventIds.indexOf(gEvent.id+"")== -1){
                                    gEvent.hidden = true;
                                    groups[groupName].push(gEvent)
                                }
                            })
                        }
                    }
                })
/*
                if(par.orderPers){
                    const persIds= par.orderPers.split(",");

                    const groupEvents = groups["Persönliche Daten"];
                    groups["Persönliche Daten"] = [];
                    persIds.forEach(id => {
                       groupEvents.forEach(gEvent => {
                           if(gEvent.id == id){
                               groups["Persönliche Daten"].push(gEvent)
                           }
                       })
                    })
                }

                if(par.orderEdu){
                    const persIds= par.orderEdu.split(",");
                    const groupEvents = groups["Ausbildung"];
                    groups["Ausbildung"] = [];
                    persIds.forEach(id => {
                        groupEvents.forEach(gEvent => {
                            if(gEvent.id == id){
                                groups["Ausbildung"].push(gEvent)
                            }
                        })
                    })
                }

                if(par.orderEmpl){
                    const persIds= par.orderEmpl.split(",");
                    const groupEvents = groups["Berufstätigkeit"];
                    groups["Berufstätigkeit"] = [];
                    persIds.forEach(id => {
                        groupEvents.forEach(gEvent => {
                            if(gEvent.id == id){
                                groups["Berufstätigkeit"].push(gEvent)
                            }
                        })
                    })
                }

                if(par.orderMemb){
                    const persIds= par.orderMemb.split(",");
                    const groupEvents = groups["Mitgliedschaft"];
                    groups["Mitgliedschaft"] = [];
                    persIds.forEach(id => {
                        groupEvents.forEach(gEvent => {
                            if(gEvent.id == id){
                                groups["Mitgliedschaft"].push(gEvent)
                            }
                        })
                    })
                }

                if(par.orderLitact){
                    const persIds= par.orderLitact.split(",");
                    const groupEvents = groups["Literarische Tätigkeit"];
                    groups["Literarische Tätigkeit"] = [];
                    persIds.forEach(id => {
                        groupEvents.forEach(gEvent => {
                            if(gEvent.id == id){
                                groups["Literarische Tätigkeit"].push(gEvent)
                            }
                        })
                    })
                }

                if(par.orderAwards){
                    const persIds= par.orderAwards.split(",");
                    const groupEvents = groups["Würdigung"];
                    groups["Würdigung"] = [];
                    persIds.forEach(id => {
                        groupEvents.forEach(gEvent => {
                            if(gEvent.id == id){
                                groups["Würdigung"].push(gEvent)
                            }
                        })
                    })
                }

                if(par.orderOther){
                    const persIds= par.orderOther.split(",");
                    const groupEvents = groups["Andere"];
                    groups["Andere"] = [];
                    persIds.forEach(id => {
                        groupEvents.forEach(gEvent => {
                            if(gEvent.id == id){
                                groups["Andere"].push(gEvent)
                            }
                        })
                    })
                }
*/
                this.authors.push({name:this.author.name, events: groups});

                const pubUrl = 'https://data.ddr-literatur.de/api/personpublications/'+this.authorID;
                fetch(pubUrl, {method: "GET", mode: "cors"}).then((response) => {
                    return response.json()
                }).then((data) => {
                    this.publications = data;
                    console.log("PUBLICATION GENDER", gender)
                    this.publications.forEach(pub => {
                        console.log("BEFORE EXTRACT AUTHORROLES GENDER", gender)
                        pub.authorRoles = this.extractAuthorRoles(pub,gender)[0]
                    })

                    this.publications.sort((a,b) => {
                        return (a.titleLabel || "").localeCompare(b.titleLabel || "")
                    })
                    this.publications.sort((a,b) => {
                        return (a.publicationTypeLabel || "").localeCompare(b.publicationTypeLabel || "")
                    })
                    this.publications.sort((a,b) => {
                        return (a.publicationYear || 0) - (b.publicationYear || 0)
                    })
                    console.log("publications", this.publications)
                });
            })




            /*var url = 'https://localhost:8395/api/test';
            fetch(url,{method: "GET", mode:"cors" }).then((response)=>{
                return response.json()
            }).then((data)=>{
                console.log(data)
                this.events = data;
            })*/
        },

        methods:{
            generateID: function(){
                this.counter++;
                return "#collapseExample"+this.counter;
            },
            getAllReferences: function(eventField){
                const references = eventField.references;
                references.sort((a,b) => a.localeCompare(b))
                let refString = "<b>Quellen</b><br>"
                references.forEach( ref => {
                    refString += ref+",<br>"
                })
                refString= refString.slice(0, refString.length-5)
                return refString
            },
            extractAuthorRoles: function(publication,gender){
                    console.log("Contributors",publication,  publication.contributors)
                const CONTRIBUTORROLEMAP = {"CREATOR": "Verfasser", "OTHER": "Andere Rolle", "EDITOR": "Herausgeber",
                    "ILLUSTRATOR": "Illustrator", "CENSOR": "Zensor", "LECTOR": "Lektor", "REVIEWER": "Rezensent",
                    "PREFACEAUTHOR":"Vorwortautor","POSTFACEAUTHOR":"Nachwortautor", "SUBJECT":"Thema", "CONTRIBUTOR": "Beiträger",
                    "TRANSLATOR": "Übersetzer", "PROCESSOR": "Bearbeiter", "COMPOSER" : "Komponist", "COLLECTOR": "Sammler",
                    "CELEBRATED": "Gewürdigter"}
                const GENDERISEMAP = {"Gewürdigter":"Gewürdigte", "Andere Rolle": "Andere Rolle", "Thema":"Thema"}
                function genderise(role,gender){
                       return gender=="MALE" ? role : GENDERISEMAP[role] || role+"in"
                }
                return publication.contributors.filter(contr => contr.entity && contr.entity.agent && contr.entity.agent.id == this.authorID)
                    .map(contr => genderise(CONTRIBUTORROLEMAP[contr.entity.role], gender));
            }
        }
    });
})();