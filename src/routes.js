import Account from './components/Account.vue';
import Header from './components/Header.vue'
import Calories from './components/calories/Calories.vue'
import Calendar from './components/calendar/Calendar.vue'
import Auth from './components/Auth.vue';

export const routes = [/* 
    { path: '/', component: Auth }, */
    { path: '/auth', component: Auth },
    { path: '/me', component: Account },
    { path: '/calories', component: Calories },
    { path: '/calendar', component: Calendar }
]

