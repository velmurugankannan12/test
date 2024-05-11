
import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import moment from 'https://cdn.skypack.dev/moment'
import { fileURL, serverURL } from '../config/config.js'


const app = createApp({
    data() {
        return {
            isLoading: true,
            commentSection: null,
            commentMsgData: null,
            commentNameData: null,
            commentEmailData: null,
            item: blogJson,
            frpBlogs: [],
            relatedBlogs: [],
            currentIndex: 0,
            toc: [],
            search: false,
            selectTabIndex: 0,
            currentPage: 1,
            tableHeader: null,
            tableBody: null,
            colm: null,
            openFAQIndex: null,
            videoPlay: false,
            videoPlayOnce: false,
            videoPlayer: ref(false),
            isPlaying: ref(false),
            thumbnailSrc: null,
            currentActive: 'Inroduction',
            pubDate: '',
            fileURL: fileURL,
            authorInfo: false
        }
    },
    mounted() {

        this.pubDate = moment(parseInt(this.item.additional_data.schedule)).format('MMM DD, YYYY')

        let _id = blogJson._id
        let sub_category = blogJson.sub_category

        setTimeout(() => {
            axios.post('/blogReadCount', { _id: _id }).then((e) => {
            }).catch((err) => console.log(err))
        }, 1000)

        axios.post('/blogFrp', { _id: _id }).then((e) => {
            this.frpBlogs = e.data.blogs
        }).catch((err) => console.log(err))

        axios.post('/blogRelated', { _id: _id, sub_category: sub_category }).then((e) => {
            this.relatedBlogs = e.data.blogs
        }).catch((err) => console.log(err))

        blogJson.blog_data && blogJson.blog_data.map((subItem) => {
            if (subItem.type === 'section') {

                subItem.data.map(nesItem => {

                    if (nesItem.title === 'heading' && nesItem.titleTag === 'h2') {
                        this.toc.push(nesItem.content)
                    }

                    if (nesItem.title === 'table') {

                        this.tableHeader = nesItem.content.slice(0, parseInt(nesItem.colm));

                        let bodyRows = [];
                        const bodyItems = nesItem.content.slice(parseInt(nesItem.colm)); // Exclude the header items

                        for (let i = 0; i < bodyItems.length; i += parseInt(nesItem.colm)) {
                            bodyRows.push(bodyItems.slice(i, i + parseInt(nesItem.colm)));
                        }

                        this.tableBody = bodyRows;

                    }
                })
            }
        })

        window.addEventListener('scroll', this.onScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
        reverseMessage() {
            // console.log(toc)
        },
        toggle(index) {
            this.openFAQIndex = this.openFAQIndex === index ? null : index;
        },
        scrollToSection(id) {
            const section = document.getElementById(id);
            const headerHeight = 60;
            if (section) {
                section.style.scrollMarginTop = headerHeight + 'px';
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    section.style.scrollMarginTop = '';
                }, 600);
            }
        },
        isActiveSection(sectionId) {
            return this.currentActive === sectionId;
        },
        handleScroll() {
            this.currentActive = null;
            for (let sectionName of this.toc) {
                const section = document.getElementById(sectionName);
                if (section && window.scrollY >= section.offsetTop - 50 && window.scrollY < section.offsetTop + section.offsetHeight - 50) {
                    // console.log(sectionName)
                    this.currentActive = sectionName;
                    break;
                }
            }
        },
        commentMsg(e) {
            this.commentMsgData = e.target.value
        },
        commentName(e) {
            this.commentNameData = e.target.value
        },
        commentEmail(e) {
            this.commentEmailData = e.target.value
        },
        commentPost() {
            let data = {
                msg: this.commentMsgData,
                name: this.commentNameData,
                email: this.commentEmailData
            }
        },
        relatedBlogclick(data) {
            let removeServerURL = 'https://telecmi.com/'
            axios.get(`/blog/${data.url_slug}`).then((e) => {

                window.location.href = `/blog/${data.url_slug}`
            }).catch((err) => console.log(err))
        },
        videoPlayBtn() {
            const video = document.getElementById('videoElement');
            if (this.videoPlay) {
                this.videoPlay = false
                video.removeAttribute('controls');
                // console.log('pause')
                video.pause()
            } else {
                this.videoPlay = true
                this.videoPlayOnce = true
                video.setAttribute('controls', '');
                // video.currentTime = 0;
                video.play()
                this.thumbnailSrc = null
            }
        },
        videoPause() {
            const video = document.getElementById('videoElement');
            this.videoPlay = false
            video.removeAttribute('controls');

        },
        seekToTime() {
            const video = document.getElementById('thumbnailElement');
            if (video.duration > 5) {
                video.currentTime = 3; // Seek to 5 seconds, or adjust to desired timestamp
            } else {
                video.currentTime = video.duration / 2; // If video is shorter than 5 seconds
            }
            video.addEventListener('seeked', this.captureThumbnail, { once: true });
        },
        captureThumbnail() {
            const video = document.getElementById('thumbnailElement');
            const canvas = document.getElementById('canvasElement');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.thumbnailSrc = canvas.toDataURL('image/jpeg'); // Convert to image URL
            // console.log(canvas.toDataURL('image/jpeg'))
        },
        subCategoryClick() {
            // window.location.href = '/blog'
            // axios.get(`${serverURL}/blogGet?filterCat=${blogJson.category}&filterSubCat=${JSON.stringify(blogJson.sub_category)}`)
            //     .then(response => {
            //         this.blogs = response.data.blog.map(item => ({
            //             ...item,
            //             pubDate: moment(parseInt(item.additional_data.schedule)).format('MMM DD, YYYY'),
            //         }));
            //         this.pages = Math.ceil(response.data.count / 12)
            //         this.scrollToSection()
            //         this.currentPage = e
            //         this.pageLoading = false

            //     })
            //     .catch(error => {

            //     });
        },
        authorInfoOpen() {
            this.authorInfo = !this.authorInfo
        }
    }
})
app.mount('#app')


