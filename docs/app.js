const Collect = Vue.component('collect', {
    template: "<template> <div> <h2>Collect View</h2> <div class='container fluid'> <div class='row'> <div class='col-md-3'> </div> <div class='col-md-6' style='border-color: #2d72bc; border-width:3px; border-style: solid; border-image: linear-gradient(to left, #61c69d 0%, #2d72bc 100%) 30; padding: 25px; border-radius: 1em;'> <form> <h2>Status</h2> <p>Wie fühle ich mich heute? | How do I feel today?</p> <div class='form-check form-check-inline'> <input class='form-check-input' type='radio' name='currentStatus' id='currentStatus' value='option1'> <label class='form-check-label' for='checkHappy' title='happy'> &#128516; </label> </div> <div class='form-check form-check-inline'> <input class='form-check-input' type='radio' name='currentStatus' id='checkNeutral' value='option2'> <label class='form-check-label' for='checkNeutral' title='neutral'> &#128528; </label> </div> <div class='form-check form-check-inline'> <input class='form-check-input' type='radio' name='currentStatus' id='checkSad' value='option3'> <label class='form-check-label' for='checkSad' title='schlecht'> &#128531; </label> </div> <div class='form-check form-check-inline'> <input class='form-check-input' type='radio' name='currentStatus' id='checkGoingInsane' value='option4'> <label class='form-check-label' for='checkGoingInsane' title='schrecklich'> &#128561; </label> </div> <hr> <p>Halskratzen? | Throat itches?</p> <div class='form-check'> <input class='form-check-input' type='checkbox' name='throatItch' id='throatItch' value='option5'> <label class='form-check-label' for='throatItch' title='Halskratzen'> &#129507; </label> </div> <hr> <p>Schnupfen? | Have a cold?</p> <div class='form-check'> <input class='form-check-input' type='checkbox' name='cold' id='cold' value='option6'> <label class='form-check-label' for='cold' title='Schnupfen'> &#129319; </label> </div> <hr> <p>Gliederschmerzen? | Limb pain?</p> <div class='form-check'> <input class='form-check-input' type='checkbox' name='limbPain' id='limbPain' value='option7'> <label class='form-check-label' for='limbPain' title='Gliederschmerzen'> &#128534; </label> </div> <hr> <p>Kopfschmerzen? | Headache?</p> <div class='form-check'> <input class='form-check-input' type='checkbox' name='headache' id='headache' value='option8'> <label class='form-check-label' for='headache' title='Kopfschmerzen'> &#129301; </label> </div> <hr> <p>Trockener Husten? | Dry cough?</p> <div class='form-check'> <input class='form-check-input' type='checkbox' name='cough' id='cough' value='option9'> <label class='form-check-label' for='cough' title='Trockener Husten'> &#128567; </label> </div> <hr> <p>Übelkeit? | Feeling nauseous?</p> <div class='form-check'> <input class='form-check-input' type='checkbox' name='nauseous' id='nauseous' value='option10'> <label class='form-check-label' for='nauseous' title='Übelkeit'> &#128565; </label> </div> <hr> <p>Fieber? | Fever?</p> <div class='form-group'> <label for='temperatureSelect'>Wähle eine Temperatur aus | Choose a temperature: &#129298;</label> <select class='form-control' id='temperatureSelect'> <option>37,6°C - 38,3°C</option> <option>38,4°C - 39,3°C</option> <option>39,4°C - 40,4°C</option> <option>40,5°C - 41,3°C</option> </select> </div> <hr> <p>Ich fühle mich gesund | I feel healthy</p> <div class='form-check'> <input class='form-check-input' type='checkbox' name='healthy' id='healthy' value='option12'> <label class='form-check-label' for='healthy' title='Gesund'> &#128519; </label> </div> <hr> <p>Postleitzahl | Postal Code <i>(optional)</i></p> <div class='form-check'> <input class='form-check-input' type='number' name='zipcode' id='zipcode' value='option13'> </div> <br> <hr> <button type='submit' class='btn btn-warning'>Submit</button> </form> </div> <div class='col-md-3'> </div> </div> </div> </template>",
});

// Graphs View
const Graphs = Vue.component('graphs', {
    template: "<div><template v-if='entries.length === 0'><p>No graphs are available yet</p></template><template v-else><div><div id='graph_boolean' style='width:100%;'></div><div id='graph_numbers' style='width:100%;'></div></div></template></div>",
    data: function () {
        return {
            entries: app.entries
        };
    },
    mounted: function () {
        var dates = [];
        var boolean_symptoms = get_boolean_symptom_names_from_root();
        var non_boolean_symptoms = {
            temperature: []
        };

        app.entries.forEach(entry => {
            dates.push(entry.date);
            var entry_symptom_names = [];
            var entry_symptom_values = [];

            entry.symptoms.forEach(symptom => {
                entry_symptom_names.push(Object.keys(symptom));
                entry_symptom_values.push(Object.values(symptom)[0]);
            });

            // create elements for the two data collections boolean_symptoms and non_boolean_symptoms with symptom name and corresponding value
            for (let index = 0; index < entry.symptoms.length; index++) {
                if (entry_symptom_names[index] in non_boolean_symptoms) {
                    // set the actual value here
                    non_boolean_symptoms.temperature.push(entry_symptom_values[index]);
                } else {
                    // replace the true values with the symptom name and false with undefined
                    if (entry_symptom_values[index]) {
                        boolean_symptoms[entry_symptom_names[index]].push(entry_symptom_names[index][0]);
                    } else if (!entry_symptom_values[index]) {
                        boolean_symptoms[entry_symptom_names[index]].push(undefined);
                    }
                }
            }
        });

        draw(dates, boolean_symptoms, 'graph_boolean');
        draw(dates, non_boolean_symptoms, 'graph_numbers');

        function get_boolean_symptom_names_from_root() {
            var boolean_symptoms = {};
            app.symptomnames.forEach(name => {
                if (name != 'temperature') {
                    boolean_symptoms[name] = [];
                }
            });
            return boolean_symptoms;
        }

        function draw(dates, symptoms, htmlcontainer) {
            CONTAINER = document.getElementById(htmlcontainer);
            var data = [];
            // for all symptoms create a trace
            for (const key in symptoms) {
                if (symptoms.hasOwnProperty(key)) {
                    var trace = {
                        x: dates,
                        y: symptoms[key],
                        type: 'markers',
                        name: key
                    };
                    data.push(trace);
                }
            }
            var layout = {
                showlegend: true,
                legend: {
                    x: 0.7,
                    y: 0.95
                }
            };
            Plotly.newPlot(CONTAINER, data, layout, {responsive: true});
        }
    }
});


Vue.component('graph_card', {
    template: "<div class='card'><div class='card-body'><h5 class='card-title'>{{graph.title}}</h5><button type='button' class='btn btn-outline-danger btn-sm' v-on:click='deleteGraph()'>x</button><div v-bind:id='graph.graphid' style='width:100%;'></div></div></div>",
    props: ['graph']
});

// adpated from https://router.vuejs.org/guide/#javascript accessed: 01.16.2020
const routes = [{
    name: 'home',
    path: '/',
    component: Collect
}, {
    name: 'collect',
    path: '/collect',
    component: Collect
}, {
    name: 'graphs',
    path: '/graphs',
    component: Graphs
}];

const router = new VueRouter({
    routes
});
// end of adapted from https://router.vuejs.org/guide/#javascript

//Vue root app
var app = new Vue({
    router,
    el: '#app', //id of html element in index.html
    data: {
        title: 'Fancy name',
        symptomnames: ['sniff', 'bodyache', 'headache', 'dryCaught', 'temperature'],
        entries: [{
                "id": "42857436740651e7cddbf0c2ba1c585d",
                "date": "21.03.2020",
                "zipCode": "90123",
                "symptoms": [{
                        "sniff": false
                    },
                    {
                        "bodyache": false
                    },
                    {
                        "headache": false
                    },
                    {
                        "dryCaught": false
                    },
                    {
                        "temperature": 39.7
                    }
                ]
            }, {
                "id": "42857436740651e7cddbf0c2ba1c585d",
                "date": "21.03.2020",
                "zipCode": "90123",
                "symptoms": [{
                        "sniff": false
                    },
                    {
                        "bodyache": true
                    },
                    {
                        "headache": false
                    },
                    {
                        "dryCaught": true
                    },
                    {
                        "temperature": 36.7
                    }
                ]
            }, {
                "id": "42857436740651e7cddbf0c2ba1c585d",
                "date": "20.03.2020",
                "zipCode": "90123",
                "symptoms": [{
                        "sniff": true
                    },
                    {
                        "bodyache": false
                    },
                    {
                        "headache": true
                    },
                    {
                        "dryCaught": false
                    },
                    {
                        "temperature": 39.7
                    }
                ]
            },
            {
                "id": "42857436740651e7cddbf0c2ba1c585d",
                "date": "19.03.2020",
                "zipCode": "90123",
                "symptoms": [{
                        "sniff": false
                    },
                    {
                        "bodyache": true
                    },
                    {
                        "headache": false
                    },
                    {
                        "dryCaught": true
                    },
                    {
                        "temperature": 36.7
                    }
                ]
            }
        ]
    }
});