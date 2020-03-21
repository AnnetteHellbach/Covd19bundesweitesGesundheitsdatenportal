const Collect = Vue.component('collect', {
    template: "<div><h2>Collect View</h2></div>",
});

const Graphs = Vue.component('graphs', {
    template: "<div><h2>Graphs View</h2></div>",
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
        title: 'Fancy name'
    }
});