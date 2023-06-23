

( async function () {
    var vm = new Vue({
        el: document.querySelector('#mount'),
        data: {
            authors: [],
            groupKeys: ["Persönliche Daten","Ausbildung", "Literarische Tätigkeit", "Berufstätigkeit",  "Mitgliedschaft", "Würdigung", "Andere"],
            counter: 0
        },
        template:
        /*`<div>

    <div v-for="author in authors">
    <a data-toggle="collapse" :href="'#collapseExample'+counter" role="button" aria-expanded="false" aria-controls="collapseExample">
               Name des Autors
    </a>
    <div v-for="group in groupKeys">
    <div v-for="event in author[group]">{{event.displayLabel}}</div>

</div>
</div></div>`*/
            `<div>
        
                   <div v-for="author in authors"><a data-toggle="collapse" :href="generateID()" role="button" aria-expanded="false" aria-controls="collapseExample">
                   Name des Autors
                   </a>
                        <div class="collapse" :id="'collapseExample'+counter">
                        <div v-for="group in groupKeys">
                            <h3>{{group}}</h3>

                           <ul class="timeline">
                                <li v-for="event in author[group]" >
                                <div >
                                <b><span v-if="group=='Andere'">{{event.eventTypeLabel}} - </span>
                                   <span v-if="event.eventBeginYear && event.eventEndYear">
                                   <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">{{event.eventBeginYear.value}}</span> 
                                   bis <span v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">{{event.eventEndYear.value}}:</span>
                                   </span>
                                   <span v-else-if="event.eventBeginYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventBeginYear)">
                                   {{event.eventBeginYear.value}}:</span>
                                   <span v-else-if="event.eventEndYear" v-b-tooltip.html.v-secondary="getAllReferences(event.eventEndYear)">
                                   bis {{event.eventEndYear.value}}:</span></b>
                                   <span v-if="event.educationLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.educationLabel)">{{event.educationLabel.value}}</span>
                                   <span v-if="event.professionsOfEmployment && event.employmentLabel" 
                                   v-b-tooltip.html.v-secondary="getAllReferences(event.employmentLabel)">{{event.employmentLabel.value}}</span>
                                   <span v-if="event.grantedAwardLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.grantedAwardLabel)">{{event.grantedAwardLabel.value}}</span>
                                   <span v-if="event.institutionLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.institutionLabel)">({{event.institutionLabel.value}})</span>
                                   <span v-if="event.placeLabel" v-b-tooltip.html.v-secondary="getAllReferences(event.placeLabel)">in {{event.placeLabel.value}}</span>
                                </div>
                                </li>
                            </ul>
                            </div>
                        </div>
                    </div>
</div>`,
        mounted: await function () {
            const authorIds = ['4', "6"]
            authorIds.forEach(id => {
                const url = 'https://localhost:8395/api/personevents/' + id;
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
                    sortedData.sort((a,b)=>{
                        if(!a.eventBeginYear && a.eventEndYear){
                            if(b.eventEndYear){
                                return a.eventEndYear.value - b.eventEndYear.value
                            }else if(!b.eventEndYear && b.eventBeginYear){
                                return a.eventEndYear.value - b.eventBeginYear.value
                            }else {
                                return 0;
                            }

                        }else{
                            return 0;
                        }
                    })
                    console.log("sortedData", sortedData)

                    const tempSortedData = sortedData;
                    tempSortedData.forEach(el =>{
                        if(!el.eventBeginYear && el.eventEndYear){
                            console.log(el)
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
                    sortedData.forEach(event => {
                        if (event.eventGroup && this.groupKeys.includes(event.eventGroup)) {
                            groups[event.eventGroup].push(event)
                        } else {
                            groups["Andere"].push(event);
                        }
                    })
                    console.log(groups)

                    this.authors.push(groups);
                })
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
            sortAlphabetical: function(arr){

            }
        }
    });
})();