
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'


const footer = createApp({
    data() {
        return {
            showFooter: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.showFooter = true;
        }, 500);
    },
    methods: {

    }
})
footer.mount('#footer')


