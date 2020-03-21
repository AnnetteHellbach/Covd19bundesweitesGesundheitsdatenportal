const Collect = Vue.component('collect', {
    template: "<div><h2>Collect View</h2></div>",
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