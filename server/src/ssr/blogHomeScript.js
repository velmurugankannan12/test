
// const { createApp } = Vue;
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { serverURL, fileURL } from '../config/config.js'

createApp({
    data() {
        return {
            isLoading: true,
            blogs: [],
            carBlogs: [],
            frpBlogs: [],
            currentIndex: 0,
            autoPlayTimer: null,
            search: false,
            selectTabIndex: 0,
            currentPage: 1,
            pageLoading: false,
            pages: null,
            filteredCategory: null,
            filteredSubCategory: [],
            subCategory: [],
            newsletter: false,
            newsletterEmail: null,
            newsletterBtnContent: "Subscribe",
            showNewsletterModal: false,
            showNewsletterModalMsg: null,
            tabs: [
                { category: 'All', current: true },
            ],
            fileURL: fileURL

            // general: [{ cat: 'News & Updates', check: false }, { cat: 'Success Stories', check: false }, { cat: 'Tech Talk', check: false }, { cat: 'How to', check: false }, { cat: 'Comparison', check: false }, { cat: 'Integration', check: false }, { cat: 'Product', check: false }, { cat: 'Insights & Trends', check: false }],
            // products: [{ cat: 'PBX', check: false }, { cat: 'Conatct center', check: false }, { cat: 'Phone System', check: false }, { cat: 'IVR', check: false }, { cat: 'VOIP', check: false }, { cat: 'Telephony', check: false }, { cat: 'Click to Call', check: false }, { cat: 'Webrtc', check: false }, { cat: 'Voice AI', check: false }]
        };
    },
    mounted() {
        this.fetchData();
        this.startAutoPlay();
        this.getTabs()
    },
    beforeUnmount() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
        }
    },
    methods: {
        fetchData() {
            axios.get(`${serverURL}/blogGet`)
                .then(response => {

                    this.blogs = response.data.blog.map(item => ({
                        ...item,
                        pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                    }));
                    this.carBlogs = response.data.blog.map(item => ({
                        ...item,
                        pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                    }));
                    this.frpBlogs = response.data.blog.map(item => ({
                        ...item,
                        pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                    }));
                    this.pages = Math.ceil(response.data.count / 12)
                    this.isLoading = false;
                    this.pageLoading = false
                })
                .catch(error => {
                    // console.log(error);
                    this.isLoading = false;
                });
        },

        getTabs() {
            axios.get(`${serverURL}/categoryList`).then((e) => {

                if (e.data.category) {
                    let tabData = e.data.category.map(item => ({
                        category: item.category,
                        current: false,
                        subCategory: item.subCategory.map(subCat => ({ item: subCat, check: false }))
                    }));

                    this.tabs.push(...tabData)

                }
            }).catch((err) => { })
        },

        blogItem() {
            this.currentIndex = (this.currentIndex + 1) % this.blogs.slice(0, 5).length;
            // this.resetAutoPlay();
        },
        customCarasoul(e) {
            this.currentIndex = (e) % this.blogs.slice(0, 5).length;
            // this.resetAutoPlay();
        },
        resetAutoPlay() {
            // Clear the existing interval and set a new one
            clearInterval(this.autoPlayTimer);
            this.startAutoPlay();
        },
        startAutoPlay() {
            // Automatically switch to the next item every 5 seconds
            this.autoPlayTimer = setInterval(this.blogItem, 5000);
        },
        pauseAutoPlay() {
            clearInterval(this.autoPlayTimer);
        },
        resumeAutoPlay() {
            this.startAutoPlay();
        },
        selectTab(selectedIndex) {
            this.tabs.forEach((tab, index) => {
                tab.current = index === selectedIndex;
            });
            this.selectTabIndex = selectedIndex

            this.subCategory = this.tabs[selectedIndex].subCategory



            if (selectedIndex !== 0) {

                const filterCat = this.tabs[selectedIndex].category
                const filterSubCat = this.tabs[selectedIndex].subCategory.filter(item => item.check).map(item => encodeURIComponent(item.item))

                this.blogs = []
                // this.pageLoading = true

                axios.get(`${serverURL}/blogGet?filterCat=${filterCat}&filterSubCat=${JSON.stringify(filterSubCat)}`)
                    .then(response => {
                        this.blogs = response.data.blog.map(item => ({
                            ...item,
                            pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                        }));
                        this.pages = Math.ceil(response.data.count / 12)
                        this.scrollToSection()
                        this.currentPage = e
                        this.pageLoading = false

                    })
                    .catch(error => {

                    });
            }
            else {
                this.blogs = []
                // this.pageLoading = true
                this.scrollToSection()
                this.fetchData()
            }
        },
        searchFun() {
            this.search = true
        },
        closeFun() {
            this.blogs = []
            if (this.selectTabIndex !== 0) {
                this.filterBlogs()
            } else {
                this.fetchData()
            }
            this.search = false
        },
        generalCheckbox(index) {
            this.general[index].check = !this.general[index].check;
        },
        productsCheckbox(index) {
            this.products[index].check = !this.products[index].check;
        },
        firstPage() {
            if (this.currentPage > 1) {
                this.blogs = []
                this.pageLoading = true

                let page = 1

                axios.get(`${serverURL}/blogGet?page=${page}`)
                    .then(response => {
                        this.blogs = response.data.blog.map(item => ({
                            ...item,
                            pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                        }));
                        this.pages = Math.ceil(response.data.count / 12)
                        this.scrollToSection()
                        this.currentPage = page
                        this.pageLoading = false

                    })
                    .catch(error => {

                    });
            }
        },
        previousPage() {

            this.blogs = []
            this.pageLoading = true

            let page = this.currentPage - 1

            axios.get(`${serverURL}/blogGet?page=${page}`)
                .then(response => {
                    this.blogs = response.data.blog.map(item => ({
                        ...item,
                        pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                    }));
                    this.pages = Math.ceil(response.data.count / 12)
                    this.scrollToSection()
                    this.currentPage = page
                    this.pageLoading = false

                })
                .catch(error => {

                });
        },
        nextPage() {
            this.blogs = []
            this.pageLoading = true

            let page = this.currentPage + 1

            axios.get(`${serverURL}/blogGet?page=${page}`)
                .then(response => {
                    this.blogs = response.data.blog.map(item => ({
                        ...item,
                        pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                    }));
                    this.pages = Math.ceil(response.data.count / 12)
                    this.scrollToSection()
                    this.currentPage = page
                    this.pageLoading = false

                })
                .catch(error => {

                });
        },
        lastPage() {

        },
        goToPage(e) {

            if (this.currentPage !== e) {
                this.blogs = []
                this.pageLoading = true

                axios.get(`${serverURL}/blogGet?page=${e}`)
                    .then(response => {
                        this.blogs = response.data.blog.map(item => ({
                            ...item,
                            pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                        }));
                        this.pages = Math.ceil(response.data.count / 12)
                        this.scrollToSection()
                        this.currentPage = e
                        this.pageLoading = false

                    })
                    .catch(error => {

                    });
            }
        },
        scrollToSection() {
            const section = document.getElementById('blogPaginationDisplay');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        },
        searchBlog(e) {

            if (e.target.value) {
                this.blogs = []
                // this.pageLoading = true

                axios.get(`${serverURL}/blogGet?search=${JSON.stringify(e.target.value)}`)
                    .then(response => {
                        this.blogs = response.data.blog.map(item => ({
                            ...item,
                            pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                        }));
                        this.pages = Math.ceil(response.data.count / 12)
                        this.scrollToSection()
                        this.currentPage = e
                        // this.pageLoading = false
                    })
                    .catch(error => {

                    });
            }
        },
        extractPathFromUrl(url) {
            const splitUrl = url.split('.com');

            return splitUrl[1] && splitUrl[1];
        },
        blogClick(data) {

            let url = this.extractPathFromUrl(data.url_slug)

            // axios.get(this.extractPathFromUrl(data.url_slug)).then((e) => {

            //     window.location.href = this.extractPathFromUrl(data.url_slug)
            // }).catch((err) => console.log(err))

            axios.get(`/blog/${data.url_slug}`).then((e) => {

                window.location.href = `/blog/${data.url_slug}`
            }).catch((err) => console.log(err))
        },
        filterBlogs() {

            setTimeout(() => {
                const filterCat = this.tabs[this.selectTabIndex].category
                const filterSubCat = this.tabs[this.selectTabIndex].subCategory.filter(item => item.check).map(item => encodeURIComponent(item.item))

                this.blogs = []
                // this.pageLoading = true

                axios.get(`${serverURL}/blogGet?filterCat=${filterCat}&filterSubCat=${JSON.stringify(filterSubCat)}`)
                    .then(response => {
                        this.blogs = response.data.blog.map(item => ({
                            ...item,
                            pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
                        }));
                        this.pages = Math.ceil(response.data.count / 12)
                        this.scrollToSection()
                        this.currentPage = e
                        // this.pageLoading = false
                    })
                    .catch(error => {

                    });
            }, 200)
        },
        newsletterEmailValid() {
            const regex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
            return regex.test(this.newsletterEmail);
        },

        newsletterSubmit() {
            this.newsletter = true

            if (this.newsletterEmailValid()) {

                this.newsletterBtnContent = "Loading..."

                axios.post(`${serverURL}/newsletter`, { newsletterEmail: this.newsletterEmail }).then((e) => {
                    if (e.data.code === 200) {
                        this.newsletter = false

                        this.showNewsletterModal = true
                        this.showNewsletterModalMsg = 'Successfully subscribed to the TeleCMI newsletter'
                        this.newsletterEmail = null
                        setTimeout(() => {
                            this.showNewsletterModal = false
                            this.newsletterBtnContent = "Subscribe"
                        }, 3000)
                    } else if (e.data.code === 409) {
                        this.newsletter = false

                        this.showNewsletterModal = true
                        this.showNewsletterModalMsg = 'You have already subscribed'
                        this.newsletterEmail = null
                        setTimeout(() => {
                            this.showNewsletterModal = false
                            this.newsletterBtnContent = "Subscribe"
                        }, 3000)
                    }
                }).catch((err) => { })
            } else {
                this.newsletter = false

                this.showNewsletterModalMsg = 'Invalid Email'
                this.showNewsletterModal = true


                setTimeout(() => {
                    this.showNewsletterModal = false
                }, 2000)
            }
        }

    }
}).mount('#app');