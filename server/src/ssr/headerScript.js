
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'


const header = createApp({
    data() {
        return {
            proDropdownOpen: false,
            feaDropdownOpen: false,
            resDropdownOpen: false,
            openMenuMob: false,
            mobProDropdownOpen: false,
            mobFeaDropdownOpen: false,
            mobResDropdownOpen: false,
        }
    },
    mounted() {

        this.proDropdownOpen = false
        this.feaDropdownOpen = false
        this.resDropdownOpen = false

        this.openMenuMob = false
        this.mobProDropdownOpen = false
        this.mobFeaDropdownOpen = false
        this.mobResDropdownOpen = false
    },
    methods: {
        hoverProDropdown() {
            this.proDropdownOpen = true
        },
        notHoverProDropdown() {
            this.proDropdownOpen = false
        },
        hoverFeaDropdown() {
            this.feaDropdownOpen = true
        },
        notHoverFeaDropdown() {
            this.feaDropdownOpen = false
        },
        hoverResDropdown() {
            this.resDropdownOpen = true
        },
        notHoverResDropdown() {
            this.resDropdownOpen = false
        },
        toggleProDropdown() {
            this.proDropdownOpen = !this.proDropdownOpen;
            this.feaDropdownOpen = false
            this.resDropdownOpen = false
        },
        toggleFeaDropdown() {
            this.feaDropdownOpen = !this.feaDropdownOpen;
            this.proDropdownOpen = false
            this.resDropdownOpen = false
        },
        toggleResDropdown() {
            this.resDropdownOpen = !this.resDropdownOpen;
            this.proDropdownOpen = false
            this.feaDropdownOpen = false
        },
        toggleOpenMenuMob() {
            this.openMenuMob = !this.openMenuMob
        },
        toggleCloseMenuMob() {
            this.openMenuMob = false
        },
        toggleMobProDropdown() {
            this.mobProDropdownOpen = !this.mobProDropdownOpen;
            this.mobFeaDropdownOpen = false
            this.mobResDropdownOpen = false
        },
        toggleMobFeaDropdown() {
            this.mobFeaDropdownOpen = !this.mobFeaDropdownOpen;
            this.mobProDropdownOpen = false
            this.mobResDropdownOpen = false
        },
        toggleMobResDropdown() {
            this.mobResDropdownOpen = !this.mobResDropdownOpen;
            this.mobProDropdownOpen = false
            this.mobFeaDropdownOpen = false
        },
    }
})
header.mount('#header')


