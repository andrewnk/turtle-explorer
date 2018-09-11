import Vue from 'vue'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

const options = {
    datePickerTintColor: '#00853D'
};

Vue.use(VCalendar, options)