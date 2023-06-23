

( async function () {
    var vm = new Vue({
        el: document.querySelector(('#mount'+par.authorID)),
        data: {
            authors: [],
            groupKeys: ["Persönliche Daten","Ausbildung", "Berufstätigkeit",  "Mitgliedschaft", "Literarische Tätigkeit",  "Würdigung", "Andere"],
            counter: {"Persönliche Daten":"1","Ausbildung":"2", "Berufstätigkeit":"3",  "Mitgliedschaft":"4", "Literarische Tätigkeit":"5",  "Würdigung":"6", "Andere":"7"},
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
            orderOther: par.orderOther
        },
        template:
            `<div>
                   <div v-for="author in authors">
                  
                        <div>
                        <div v-for="group in groupKeys" v-if="author.events[group].length>0">
                        <a data-toggle="collapse" :href="'#group'+counter[group]" role="button" aria-expanded="true" aria-controls="'group'+counter[group]">
 <h3 >{{group}}</h3>
  </a>
                           
                     <div class="collapse" v-bind:id="'group'+counter[group]">
                           <ul class="timeline">
                                <li v-for="event in author.events[group]" v-if="event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.institutionLabel || event.placeLabel">
                                <div>
                                <b>
                                   <span v-if="event.eventBeginYear && event.eventEndYear">
                                   <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">{{event.eventBeginYear.value}}</span> 
                                   bis <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">{{event.eventEndYear.value}}</span>
                                   </span>
                                   <span v-else-if="event.eventBeginYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">
                                   {{event.eventBeginYear.value}}</span>
                                   <span v-else-if="event.eventEndYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">
                                   bis {{event.eventEndYear.value}}</span>
                                   <span v-if="group=='Andere' || group=='Persönliche Daten'">{{event.eventTypeLabel}}</span></b>
                                   
                                   <span v-if="event.educationLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.educationLabel)">{{event.educationLabel.value}}</span>
                                   <span v-if="event.professionsOfEmployment && event.employmentLabel" 
                                   v-b-tooltip.html.v-secondary="getAllReferences(event.employmentLabel)">{{event.employmentLabel.value}}</span>
                                   <span v-if="event.grantedAwardLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.grantedAwardLabel)">{{event.grantedAwardLabel.value}}</span>
                                   <span v-if="event.institutionLabel && (event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.placeLabel)" v-b-tooltip.html.v-secondary="getAllReferences(event.institutionLabel)">({{event.institutionLabel.value}})</span>
                                   <span v-else-if="event.institutionLabel && !(event.eventBeginYear || event.eventEndYear || event.educationLabel ||
                                event.employmentLabel || event.grantedAwardLabel || event.placeLabel)" v-b-tooltip.html.v-secondary="getAllReferences(event.institutionLabel)">{{event.institutionLabel.value}}</span>
                                   <span v-if="event.placeLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.placeLabel)">in {{event.placeLabel.value}}</span>
                                   <span v-if="event.eventOfParticipationLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.eventOfParticipationLabel)">{{event.eventOfParticipationLabel.value}}</span>
                                </div>
                                </li>
                            </ul>
                            </div>
                            </div>
                        </div>
                    <div>
<a data-toggle="collapse" href="#publicationGroup" role="button" aria-expanded="true" aria-controls="'group'+counter[group]">
<h3>Publikationen</h3>
</a>
<div class="collapse" id="publicationGroup">
<ul class="timeline-publications">
    <li v-for="publication in publications">
        {{publication.publicationTypeLabel}}:  
        <b>{{publication.titleLabel}}</b>,  
        {{publication.publicationYear}} 
        {{publication.publisherLabel}} 
        ({{publication.authorRoles}})
    </li>
</ul>
</div>

</div>
</div>
</div>

`,
        mounted: await function () {

            console.log("AuthorID:",par.authorID, "person", par.orderPers)
            console.log("Window location", window.location.href)
            //let url = new URL(window.location.href)
            //this.author = {name: new URLSearchParams(url.search).get('authorname'), id: new URLSearchParams(url.search).get('id')}


            const pubUrl = 'https://data.ddr-literatur.de/api/personpublications/'+this.authorID;
            fetch(pubUrl, {method: "GET", mode: "cors"}).then((response) => {
                return response.json()
            }).then((data) => {
                this.publications = data;
                this.publications.forEach(pub => {
                    console.log("Author Role", this.extractAuthorRoles(pub)[0])
                    pub.authorRoles = this.extractAuthorRoles(pub)[0]
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

            url = 'https://data.ddr-literatur.de/api/personevents/' + this.authorID;
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
                    if (event.eventGroup && this.groupKeys.includes(event.eventGroup)) {
                        groups[event.eventGroup].push(event)
                        if(event.eventGroup == "Andere"){
                        }
                    } else {
                        groups["Andere"].push(event);
                    }
                })
                console.log(groups)

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

                this.authors.push({name:this.author.name, events: groups});
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
            extractAuthorRoles: function(publication){
                if(publication.id == 5664){
                    console.log("Contributors",publication,  publication.contributors)
                }
                const CONTRIBUTORROLEMAP = {"CREATOR": "Verfasser", "OTHER": "Andere", "EDITOR": "Herausgeber", "ILLUSTRATOR": "Illustrator", "CENSOR": "Zensor", "LECTOR": "Lektor", "REVIEWER": "Rezensent", "PREFACEAUTHOR":"Vorwortautor","POSTFACEAUTHOR":"Nachwortautor", "SUBJECT":"Thema", "CONTRIBUTOR": "Beiträger", "TRANSLATOR": "Übersetzer", "PROCESSOR": "Bearbeiter", "COMPOSER" : "Komponist", "COLLECTOR": "Sammler", "CELEBRATED": "Gewürdigter"}
                return publication.contributors.filter(contr => contr.entity && contr.entity.agent && contr.entity.agent.id == this.author.id)
                    .map(contr => CONTRIBUTORROLEMAP[contr.entity.role]);
            }
        }
    });
})();