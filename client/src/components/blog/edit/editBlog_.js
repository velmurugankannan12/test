import React, { Component } from 'react';
import { XMarkIcon, ChevronUpIcon, ChevronDownIcon, EyeIcon } from '@heroicons/react/24/solid'
import { blog_structure, blog_intro } from '../jsondata'
import AppStateContext from '../../../utils/AppStateContext';
import { axiosInstance, serverURL } from '../../../services/apiconfig';
import BlogMetaData from './meta';
import BlogOgData from './og';
import BlogTwitterData from './twitter';
import BlogArtData from './art';
import AditionalData from './additionalData';
// import UserList from '../../../../services/userData';
import AuthorListMenu from './authorMenu';
import Category from './categoryMenu'
import { wordCount } from '../wordCount'
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import Progress from './progress';
// import _ from 'underscore'
import Tab from './table'
import 'react-calendar/dist/Calendar.css';
import ValidationPop from '../validationPop';
import Preview from './preview';
import { blogIntroSchema, metaSchema, ogSchema, twitterSchema, articleSchema, blogUrlSchema, categorySchema, authorSchema, sectionSchema, faqSchema, rcSchema, testiSchema } from '../validationSchema';
import Ajv from "ajv"

const ajv = new Ajv()


class Page extends Component {

    static contextType = AppStateContext

    constructor(props) {
        super(props);

        this.state = {
            data: blog_structure,
            blog_intro: blog_intro,
            blog_intro_title: '',
            blog_intro_img: '',
            blog_intro_img_alt: '',
            blog_intro_desc: [],
            category: '',
            value: new Date(),
            sectionData: [],
            sectionDataPre: [],
            blogData: [],
            additional_data: [],
            openIndex: false,
            addData: false,
            jsondata: { "url_slug": '', "canonical": '' },
            tag: ['h2', 'h3', 'h4', 'h5', 'h6'],
            validation: {
                metaValid: '',
                ogValid: '',
                twitterValid: '',
                articleValid: '',
                urlValid: '',
                introValid: '',
                sectionValid: '',
                rcValid: '',
                testiValid: '',
                faqValid: '',
            },
            userList: []
        };

        this.onChange = this.onChange.bind(this);
        this.tagRef = React.createRef();
        this.removeSecDataField = this.removeSecDataField.bind(this);
    }

    handleOutsideClick = (event) => {
        if (this.tagRef.current && !this.tagRef.current.contains(event.target)) {
            this.setState({ openIndex: false });
        }
    };
    onChange(value) {
        this.setState({ value, selectDate: false });
    }
    capitalize(str) {
        const capitalizedWords = str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords.join(' ');
    }
    addSection = (type) => {
        if (type === 'testimonials') {
            const newData = { type: "testimonials", id: this.generateUniqueId(), data: [{ description: '', img: '', name: '', role: '', id: this.generateUniqueId() }] }
            this.setState({ sectionData: this.state.sectionData.concat(newData) });
            this.setState({ sectionDataPre: this.state.sectionDataPre.concat(newData) });
        }
        else if (type === 'recommended_reading') {
            const newData = { type: "recommended_reading", id: this.generateUniqueId(), data: [{ description: '', link: '', id: this.generateUniqueId() }] }
            this.setState({ sectionData: this.state.sectionData.concat(newData) });
            this.setState({ sectionDataPre: this.state.sectionDataPre.concat(newData) });
        }
        else if (type === 'faq') {
            const newData = { type: 'faq', data: [{ question: '', answer: '', id: this.generateUniqueId() }], id: this.generateUniqueId() };
            this.setState({ sectionData: this.state.sectionData.concat(newData) });
            this.setState({ sectionDataPre: this.state.sectionDataPre.concat(newData) });
        }
        else if (type === 'cta') {
            const newData = { type: 'cta', data: [], id: this.generateUniqueId() };
            this.setState({ sectionData: this.state.sectionData.concat(newData) });
            this.setState({ sectionDataPre: this.state.sectionDataPre.concat(newData) });
        }
        else if (type === 'section') {
            const newData = { type: "section", id: this.generateUniqueId(), data: [{ title: "heading", content: '', titleTag: "h2", id: this.generateUniqueId() }, { title: "description", content: '', id: this.generateUniqueId() }] }
            this.setState({ sectionData: this.state.sectionData.concat(newData) });
            this.setState({ sectionDataPre: this.state.sectionDataPre.concat(newData) });
        } else {
            const newData = { type: type.includes('_') ? this.capitalize(type) : type, content: '', id: this.state.data.length + 1 };
            this.setState({ data: [...this.state.data, newData] });
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };
    updateContent = (key, value) => {
        this.setState(prevState => ({
            jsondata: {
                ...prevState.jsondata,
                [key]: value
            }
        }));
        this.setState(prevState => ({
            data: prevState.data.map(item => {
                if (item.type === key) {
                    return { ...item, content: value };
                }
                return item;
            })
        }));
    };
    updateFaqQuestion = (content, sectionId) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                question: secData.id === sectionId ? this.formatContent(content) : secData.question
            }))
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                question: secData.id === sectionId ? this.formatContent(content) : secData.question
            }))
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    };
    updateFaqAnswer = (content, sectionId) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                answer: secData.id === sectionId ? this.formatContent(content) : secData.answer
            }))
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                answer: secData.id === sectionId ? this.formatContent(content) : secData.answer
            }))
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    };
    formatContent = (e) => {
        const regex = /\[(.*?)\]\((.*?)\)/g;
        e = e.replace(regex, '<a claName="underline" target="_blank" href="$2">$1</a>');
        e = e.replace(/\*(.*?)\*/g, '<b>$1</b>');
        return e;
    };
    updateRCDesc = (content, sectionId) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data && blog.data.map(secData => ({
                ...secData,
                description: secData.id === sectionId ? content : secData.description
            }))
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data && blog.data.map(secData => ({
                ...secData,
                description: secData.id === sectionId ? content : secData.description
            }))
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    };
    updateRCLink = (content, sectionId) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data && blog.data.map(secData => ({
                ...secData,
                link: secData.id === sectionId ? content : secData.link
            }))
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data && blog.data.map(secData => ({
                ...secData,
                link: secData.id === sectionId ? content : secData.link
            }))
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    };
    updatetestiDesc = (content, sectionId) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                description: secData.id === sectionId ? content : secData.description
            }))
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                description: secData.id === sectionId ? content : secData.description
            }))
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    }
    updateTestiImg = (e, id) => {
        const file = e.target.files[0];

        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => {
                if (secData.id === id) {
                    return { ...secData, img: file }
                }
                return secData
            })
        }));
        this.setState({ sectionData: updatedSectionData });

        const reader = new FileReader();
        reader.onloadend = () => {
            const fileData = reader.result;
            const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
                ...blog,
                data: blog.data.map(secData => {
                    if (secData.id === id) {
                        return { ...secData, img: fileData }
                    }
                    return secData
                })
            }));
            this.setState({ sectionDataPre: updatedSectionDataPre });
        };
        if (file) {
            reader.readAsDataURL(file);
        }


    }
    updateTestiName = (content, sectionId) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                name: secData.id === sectionId ? content : secData.name
            }))
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                name: secData.id === sectionId ? content : secData.name
            }))
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    }
    updateTestiRole = (content, sectionId) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                role: secData.id === sectionId ? content : secData.role
            }))
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secData => ({
                ...secData,
                role: secData.id === sectionId ? content : secData.role
            }))
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    }
    secDataRemoveFaq = (removedSecData) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.filter(secData => secData.id !== removedSecData.id)
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.filter(secData => secData.id !== removedSecData.id)
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    };
    updateSecData = (e, secData) => {
        const regex = /\[(.*?)\]\((.*?)\)/g;
        e = e.replace(regex, '<a className="underline" target="_blank" href="$2">$1</a>');
        e = e.replace(/\*(.*?)\*/g, '<b>$1</b>');

        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secDataItem => {
                if (secDataItem.id === secData.id) {
                    return { ...secDataItem, content: e };
                }
                return secDataItem;
            })
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secDataItem => {
                if (secDataItem.id === secData.id) {
                    return { ...secDataItem, content: e };
                }
                return secDataItem;
            })
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    }
    updateSecButData = (e, secData) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secDataItem => {
                if (secDataItem.id === secData.id) {
                    return { ...secDataItem, link: e.target.value };
                }
                return secDataItem;
            })
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secDataItem => {
                if (secDataItem.id === secData.id) {
                    return { ...secDataItem, link: e.target.value };
                }
                return secDataItem;
            })
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    }
    handleFileUpload = (e, id) => {
        const file = e.target.files[0];

        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secDataItem => {
                if (secDataItem.id === id) {
                    return { ...secDataItem, content: file };
                }
                return secDataItem;
            })
        }));
        this.setState({ sectionData: updatedSectionData });

        const reader = new FileReader();
        reader.onloadend = () => {
            const fileData = reader.result;
            const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
                ...blog,
                data: blog.data.map(secDataItem => {
                    if (secDataItem.id === id) {
                        return { ...secDataItem, content: fileData };
                    }
                    return secDataItem;
                })
            }));
            this.setState({ sectionDataPre: updatedSectionDataPre });
        };
        if (file) {
            reader.readAsDataURL(file);
        }


    };
    altText = (e, secData) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secDataItem => {
                if (secDataItem.id === secData.id) {
                    return { ...secDataItem, alt: e.target.value };
                }
                return secDataItem;
            })
        }))
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data && blog.data.map(secDataItem => {
                if (secDataItem.id === secData.id) {
                    return { ...secDataItem, alt: e.target.value };
                }
                return secDataItem;
            })
        }))
        this.setState({ sectionDataPre: updatedSectionDataPre });
    }
    secDataRemove = (e) => {
        const updatedSectionData = this.state.sectionData.map(blog => ({
            ...blog,
            data: blog.data.filter(secData => secData.id !== e.id)
        }));
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.map(blog => ({
            ...blog,
            data: blog.data.filter(secData => secData.id !== e.id)
        }));
        this.setState({ sectionDataPre: updatedSectionDataPre });
    }
    titleTag = (e, section) => {
        this.state.sectionData.forEach((blog) => {
            blog.data.forEach((secData) => {
                if (secData.id === section) {
                    secData.titleTag = e
                }
            })
            this.setState({ openIndex: false })
        })
    }
    toggleMenu = (index) => {
        this.setState((prevState) => ({
            openIndex: prevState.openIndex === index ? null : index
        }));
    };
    sectionTitle = (e) => {
        e.data.push({ title: "heading", content: '', titleTag: "h2", id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionDesc = (e) => {
        e.data.push({ title: "description", content: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionImg = (e) => {
        e.data.push({ title: "image", content: '', alt: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionVid = (e) => {
        e.data.push({ title: "video", content: '', alt: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionTab = (e) => {
        e.data.push({ title: "table", content: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionButton = (e) => {
        e.data.push({ title: "button", content: '', link: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionCta = (e) => {
        e.data.push({ title: "cta", content: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionFaq = (e) => {
        e.data.push({ question: '', answer: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    sectionRC = (e) => {
        e.data.push({ description: '', link: '', id: this.generateUniqueId() })
        this.setState({ sectionData: this.state.sectionData })
        this.setState({ sectionDataPre: this.state.sectionDataPre })
    }
    removeField = (e) => {
        const newData = [...this.state.data];
        newData.splice(e, 1);
        this.setState({ data: newData });
    }
    removeSecDataField = (e) => {
        const updatedSectionData = this.state.sectionData.filter(item => item.id !== e.id);
        this.setState({ sectionData: updatedSectionData });

        const updatedSectionDataPre = this.state.sectionDataPre.filter(item => item.id !== e.id);
        this.setState({ sectionDataPre: updatedSectionDataPre });
    };
    moveItem = (parentId, childId, direction) => {
        this.setState(prevState => {
            const updatedData = prevState.sectionData.map(section => {
                if (section.id === parentId) {
                    const index = section.data.findIndex(child => child.id === childId);
                    if (direction === 'up' && index > 0) {
                        const newData = Array.from(section.data);
                        [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
                        return { ...section, data: newData };
                    }
                    if (direction === 'down' && index < section.data.length - 1) {
                        const newData = Array.from(section.data);
                        [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
                        return { ...section, data: newData };
                    }
                }
                return section;
            });
            return { sectionData: updatedData };
        });

        this.setState(prevState => {
            const updatedDataPre = prevState.sectionDataPre.map(section => {
                if (section.id === parentId) {
                    const index = section.data.findIndex(child => child.id === childId);
                    if (direction === 'up' && index > 0) {
                        const newData = Array.from(section.data);
                        [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
                        return { ...section, data: newData };
                    }
                    if (direction === 'down' && index < section.data.length - 1) {
                        const newData = Array.from(section.data);
                        [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
                        return { ...section, data: newData };
                    }
                }
                return section;
            });
            return { sectionDataPre: updatedDataPre };
        });
    };
    moveParent = (parentId, direction) => {
        this.setState(prevState => {
            const index = prevState.sectionData.findIndex(section => section.id === parentId);
            if (direction === 'up' && index > 0) {
                const newData = Array.from(prevState.sectionData);
                [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
                return { sectionData: newData };
            }
            if (direction === 'down' && index < prevState.sectionData.length - 1) {
                const newData = Array.from(prevState.sectionData);
                [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
                return { sectionData: newData };
            }
            return null; // No change if index is at the boundaries
        });

        this.setState(prevState => {
            const index = prevState.sectionDataPre.findIndex(section => section.id === parentId);
            if (direction === 'up' && index > 0) {
                const newData = Array.from(prevState.sectionDataPre);
                [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
                return { sectionDataPre: newData };
            }
            if (direction === 'down' && index < prevState.sectionDataPre.length - 1) {
                const newData = Array.from(prevState.sectionDataPre);
                [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
                return { sectionDataPre: newData };
            }
            return null; // No change if index is at the boundaries
        });
    }
    generateUniqueId() {
        const randomString = Math.random().toString(36).substr(2, 10);
        return `${new Date().getTime()}_${randomString}`;
    }
    validupdate = (e, data) => {
        this.setState(prevState => ({
            validation: {
                ...prevState.validation,
                [data]: e,
            }
        }));
    }
    submit = () => {

        const { blogMetaData, setEditBlogModal, blogArtData, blogOgData, blogTwitterData, blogTableData, stickTop, comment, pubDate, editBlogData } = this.context


        if (this.state.sectionData) {
            this.state.sectionData.forEach((e) => {
                if (e.type === 'section') {
                    e.data.forEach((lk) => {
                        if (lk.id === blogTableData.id) {
                            lk.content = blogTableData.data
                            lk.colm = blogTableData.colm
                        }
                    })
                }
            })
        }


        let blogIntro = {
            "img": this.state.blog_intro_img,
            "img_alt": this.state.blog_intro_img_alt,
            "description": this.state.blog_intro_desc,
            "blog_title": this.state.blog_intro_title
        }

        let additionalData = {
            "stick_to_top": stickTop,
            "schedule": pubDate,
            "allow_comment": comment,
        }

        let data = {
            "meta": blogMetaData,
            "article": blogArtData,
            "twitter": blogTwitterData,
            "og": blogOgData,
            "url_slug": this.state.jsondata.url_slug,
            "canonical": this.state.jsondata.canonical,
            "category": this.context.category,
            "author": this.context.author,
            "time_to_read": wordCount(this.state),
            "blog_data": this.state.sectionData,
            "additional_data": additionalData,
            "blog_intro": blogIntro,
            "_id": editBlogData._id,
            "id": editBlogData.id
        }

        const metaValidate = ajv.compile(metaSchema)
        const metaValid = metaValidate(blogMetaData)
        const ogValidate = ajv.compile(ogSchema)
        const ogValid = ogValidate(blogOgData)
        const twitterValidate = ajv.compile(twitterSchema)
        const twitterValid = twitterValidate(blogTwitterData)
        const articleValidate = ajv.compile(articleSchema)
        const articleValid = articleValidate(blogArtData)
        const blogIntroValidate = ajv.compile(blogIntroSchema)
        const blogIntroValid = blogIntroValidate(blogIntro)
        const blogUrlValidate = ajv.compile(blogUrlSchema)
        const blogUrlValid = blogUrlValidate(this.state.jsondata)
        const authorValidate = ajv.compile(authorSchema)
        const authorValid = authorValidate(this.context.author)
        const categoryValidate = ajv.compile(categorySchema)
        const categoryValid = categoryValidate(this.context.category)

        let sectionValidCheck = true;
        let faqValidCheck = true;
        let rcValidCheck = true;
        let testiValidCheck = true;

        if (this.state.sectionData) {
            this.state.sectionData.forEach((e) => {
                if (e.type === 'section') {
                    const sectionValidate = ajv.compile(sectionSchema)
                    const sectionValid = sectionValidate(e.data)
                    sectionValidCheck = sectionValid
                }
                else if (e.type === 'faq') {
                    const faqValidate = ajv.compile(faqSchema)
                    const faqValid = faqValidate(e.data)
                    faqValidCheck = faqValid
                }
                else if (e.type === 'recommended_reading') {
                    const rcValidate = ajv.compile(rcSchema)
                    const rcValid = rcValidate(e.data)
                    rcValidCheck = rcValid
                }
                else if (e.type === 'testimonials') {
                    const testiValidate = ajv.compile(testiSchema)
                    const testiValid = testiValidate(e.data)
                    testiValidCheck = testiValid
                }
            })
        }

        let validationSub = {
            Meta: metaValid, OG: ogValid, Twitter: twitterValid, Article: articleValid, URL: blogUrlValid, category: categoryValid, author: authorValid, introduction_section: blogIntroValid, Section: sectionValidCheck, FAQ: faqValidCheck, recommended_reading: rcValidCheck, Testimonial: testiValidCheck
        }

        if (validationSub.Meta && validationSub.OG && validationSub.Twitter && validationSub.Article && validationSub.URL && validationSub.category && validationSub.author && validationSub.introduction_section && validationSub.Section && validationSub.FAQ && validationSub.recommended_reading && validationSub.Testimonial) {

            let appendFormData = (data, parentKey, formData) => {
                if (Array.isArray(data)) {
                    data.forEach((item, index) => {
                        appendFormData(item, `${parentKey}[${index}]`, formData);
                    });
                } else if (data && typeof data === 'object' && !(data instanceof File)) {
                    Object.keys(data).forEach(key => {
                        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
                        if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
                            appendFormData(data[key], fullKey, formData);
                        } else if (data[key] !== undefined) {  // Ensure we don't append undefined values
                            formData.append(fullKey, data[key]);
                        }
                    });
                } else if (data !== undefined) {  // Ensure we don't append undefined values
                    formData.append(parentKey, data);
                }
            };

            const formData = new FormData();
            appendFormData(data, '', formData);


            const progress = {

                headers: { 'Content-Type': 'multipart/form-data' },

                onUploadProgress: (progressEvent) => {

                    const { setUploadProgress } = this.context

                    setUploadProgress(true)
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                    this.setState({ uploadProgress: percentCompleted })

                    if (percentCompleted === 100) {
                        setUploadProgress(false)
                    }
                }
            };

            axiosInstance.put('/blogEdit', formData, progress).then((res) => {
                if (res.data.code === 200) {
                    setEditBlogModal(false)
                    this.props.reload()
                }
            }).catch((err) => console.error(err))
        }
        else {
            const { setValidationPop } = this.context
            setValidationPop(true)
            this.setState({ validationErr: validationSub })
        }

    }
    cancel = () => {
        const { setEditBlogModal, setStickTop, setComment, setBlogMetaData, setBlogArtData, setBlogOgData, setBlogTwitterData, setPubDate } = this.context;
        setEditBlogModal(false);
        setStickTop(false);
        setComment(false);
        setPubDate(Date.now())
        setBlogMetaData(null)
        setBlogOgData(null)
        setBlogTwitterData(null)
        setBlogArtData(null)
        this.setState({ sectionData: [] })
        this.setState({ sectionDataPre: [] })
        // blog_structure.forEach((e) => {
        //     e.content = ''
        // })
        this.setState({ back: true })
    }
    preview = () => {

        const { blogMetaData, blogArtData, blogOgData, blogTwitterData, blogTableData, stickTop, comment, pubDate, setPreview } = this.context

        let updatedSectionDataPre = [...this.state.sectionDataPre];

        console.log(this.state.sectionDataPre)
        console.log(this.state.sectionDataPre)

        if (updatedSectionDataPre) {
            updatedSectionDataPre.forEach((e) => {
                if (e.type === 'section') {
                    e.data.forEach((lk) => {
                        if (lk.id === blogTableData.id) {
                            lk.content = blogTableData.data
                            lk.colm = blogTableData.colm
                        }
                    })
                }
            })
        }

        let blogIntro = {
            "img": this.state.intro_blog_img_upd ? this.state.blog_intro_img_preview : this.state.blog_intro_img,
            "img_alt": this.state.blog_intro_img_alt,
            "description": this.state.blog_intro_desc,
            "blog_title": this.state.blog_intro_title
        }

        let additionalData = {
            "stick_to_top": stickTop,
            "schedule": pubDate,
            "allow_comment": comment,
        }

        let data = {
            "meta": blogMetaData,
            "article": blogArtData,
            "twitter": blogTwitterData,
            "og": blogOgData,
            "url_slug": this.state.jsondata.url_slug,
            "canonical": this.state.jsondata.canonical,
            "category": this.context.category,
            "author": this.context.author,
            "time_to_read": wordCount(this.state),
            "blog_title": this.state.jsondata.blog_title,
            "blog_data": updatedSectionDataPre,
            "additional_data": additionalData,
            "blog_intro": blogIntro
        }
        this.setState({ previewData: data })

        setPreview(true)
        this.setState({ preview: true })

    }
    blog_intro_title = (e) => {
        this.setState({ blog_intro_title: e })
    }
    blog_intro_img = (e) => {
        const file = e.target.files[0];
        this.setState({ blog_intro_img: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            this.setState({ blog_intro_img_preview: reader.result });
        };
        if (file) {
            reader.readAsDataURL(file);
        }

        this.setState({ intro_blog_img_upd: true })
    }
    blog_intro_img_alt = (e) => {
        this.setState({ blog_intro_img_alt: e });
    }
    moveDesc = (e, dir) => {
        this.setState(prevState => {
            const index = prevState.blog_intro_desc.findIndex(section => section.id === e);
            if (dir === 'up' && index > 0) {
                const newData = Array.from(prevState.blog_intro_desc);
                [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
                return { blog_intro_desc: newData };
            }
            if (dir === 'down' && index < prevState.blog_intro_desc.length - 1) {
                const newData = Array.from(prevState.blog_intro_desc);
                [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
                return { blog_intro_desc: newData };
            }
            return null; // No change if index is at the boundaries
        });
    }
    removeBlogIntroDesc = (descData) => {
        const updatedDescData = this.state.blog_intro_desc.filter(desc => desc.id !== descData.id);
        this.setState({ blog_intro_desc: updatedDescData });
    }
    updateBlogIntroDesc = (e, descData) => {

        const regex = /\[(.*?)\]\((.*?)\)/g;
        e = e.replace(regex, '<a class="underline" target="_blank" href="$2">$1</a>');
        e = e.replace(/\*(.*?)\*/g, '<b>$1</b>');

        const updatedDescData = this.state.blog_intro_desc.map(desc => {
            if (desc.id === descData.id) {
                desc.description = e
            }
            return desc;
        });
        this.setState({ blogIntroDesc: updatedDescData });
    }
    addBlogIntroDesc = () => {
        this.setState(prevState => ({
            blog_intro_desc: [...prevState.blog_intro_desc, { description: '', id: this.generateUniqueId() }]
        }));
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick);

        // this.setState({ userList: UserList.user })

        const { editBlogData, setCategory, setAuthor, setStickTop, setComment, setPubDate } = this.context

        if (editBlogData) {
            let introData = editBlogData.blog_intro
            let sectionData = editBlogData.blog_data ? editBlogData.blog_data : []
            let sectionDataPre = editBlogData.blog_data ? editBlogData.blog_data : []
            let url = [{ type: 'canonical', content: editBlogData.canonical }, { type: 'url_slug', content: editBlogData.url_slug }]

            this.setState({
                blog_intro_title: introData.blog_title,
                blog_intro_img: introData.img,
                blog_intro_img_alt: introData.img_alt,
                blog_intro_desc: introData.description,
                sectionData: sectionData,
                sectionDataPre: sectionDataPre,
                data: url,
                jsondata: { 'url_slug': editBlogData.url_slug, 'canonical': editBlogData.canonical },
                category: editBlogData.category,
                additionalData: editBlogData.additionalData,

            })

        }

        setCategory(editBlogData.category)
        setAuthor(editBlogData.author)
        setStickTop(editBlogData.additional_data.stick_to_top)
        setComment(editBlogData.additional_data.allow_comment)
        setPubDate(editBlogData.additional_data.schedule)
    }

    render() {
        return (

            <div className='mx-8'>

                {this.context.uploadProgress && <Progress uploadProgress={this.state.uploadProgress} />}

                {this.state.preview && <Preview preview={this.state.preview} previewClose={() => this.setState({ preview: false })} previewData={this.state.previewData} />}

                {this.context.validationPop && <ValidationPop err={this.state.validationErr} />}

                <div className='h-10 fixed right-0 justify-end z-10 '>
                    <AditionalData additionalData={this.state.additionalData} popupOpen={this.state.addData} />
                </div>
                <div className='h-10 fixed right-3 top-16 justify-end '>
                    <button onClick={this.preview} type="button" className="rounded-full bg-gray-400 p-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400" >
                        <EyeIcon className='w4- h-4 cursor-pointer' />
                    </button>
                </div>
                <div className='h-10 fixed right-3 top-28 justify-end '>
                    <button onClick={this.cancel} type="button" className="rounded-full bg-gray-400 w-8 h-8 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 flex justify-center items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400" >
                        <XMarkIcon className='w-6 h-6 cursor-pointer font-bold' />
                    </button>
                </div>
                <div className="flex">

                    <div className="flex w-full overflow-y-auto">

                        <div className="p-10 w-full bg-gray-100  shadow-sm border rounded-xl my-4">

                            <div className=" gap-x-8 gap-y-6 ">

                                <BlogMetaData />

                                <BlogOgData />

                                <BlogTwitterData />

                                <BlogArtData />

                                {this.state.data.map((section, index) => (
                                    <div key={index} className="sm:col-span-2">
                                        <label className="mt-2 block text-sm font-semibold capitalize leading-6 text-gray-900">
                                            {section.type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                        </label>
                                        <div className="">
                                            <div className='relative'>
                                                <input value={section.content || ''} type='text' onChange={(e) => this.updateContent(section.type, e.target.value)} className={`block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {
                                    <div>
                                        <label className="mt-2 block text-sm font-semibold capitalize text-gray-900">
                                            Category
                                        </label>
                                        <Category category={this.state.category} />
                                    </div>
                                }
                                {
                                    <div>
                                        <label className="mt-2 block text-sm font-semibold capitalize text-gray-900">
                                            Author
                                        </label>
                                        <AuthorListMenu />
                                    </div>
                                }

                                <div>
                                    <label className="mt-2 block text-sm font-semibold capitalize leading-6 text-gray-900">
                                        Blog Into Title
                                    </label>
                                    <div className="">
                                        <div className='relative'>
                                            <input value={this.state.blog_intro_title} type='text' onChange={(e) => this.blog_intro_title(e.target.value)}
                                                className={`block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className='mt-2 block text-sm font-semibold capitalize leading-6 text-gray-900'>
                                        Blog Intro Image
                                    </label>
                                    <div className='flex flex-col ring-1 gap-y-4 p-3 rounded-lg'>
                                        <input onChange={(e) => this.blog_intro_img(e)} accept=".webp, .png" type='file' className={`block w-full rounded-md  text-xs  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none outline-none`} />
                                        <input value={this.state.blog_intro_img_alt} onChange={(e) => this.blog_intro_img_alt(e.target.value)} placeholder='ALT Text' type="text" className='block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none' />
                                    </div>
                                </div>

                                <div>
                                    <label className='mt-2 block text-sm font-semibold capitalize leading-6 text-gray-900'>
                                        Blog Intro Description
                                    </label>

                                    <div className='ring-1 flex flex-col gap-y-4 p-5 rounded-lg'>
                                        {
                                            this.state.blog_intro_desc.map((descData, index) => (
                                                <div key={index} className='ring-1 ring-slate-400 rounded-md relative p-5 mb-3'>
                                                    <textarea value={descData.description} onChange={(e) => this.updateBlogIntroDesc(e.target.value, descData)} rows={5} type="text" className='block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none' />
                                                    {this.state.blog_intro_desc.length > 1 &&
                                                        <div>
                                                            <div onClick={() => this.removeBlogIntroDesc(descData)} className=' absolute -right-[6px] -top-2 bg-gray-500 p-[1px] rounded-full cursor-pointer'>
                                                                <XMarkIcon className='w-3 text-white' />
                                                            </div>
                                                            <div className='absolute right-[32px] -top-2 flex gap-x-3'>
                                                                <div onClick={() => this.moveDesc(descData.id, 'up')} title='Move Up' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                    <ChevronUpIcon className='w-3 text-white font-bold' />
                                                                </div>
                                                                <div onClick={() => this.moveDesc(descData.id, 'down')} title='Move Down' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                    <ChevronDownIcon className='w-3 text-white font-bold' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            ))
                                        }
                                        <button onClick={this.addBlogIntroDesc} className=" w-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded">
                                            +
                                        </button>
                                    </div>
                                </div>

                                {this.state.sectionData &&
                                    this.state.sectionData.map((section, index) => (
                                        <div key={index} className="sm:col-span-2">
                                            <label className="mt-2 block text-sm font-semibold capitalize leading-6 text-gray-900">
                                                {section.type === 'faq' || section.type === 'cta' ?
                                                    (section.type && section.type.toUpperCase()) :
                                                    section.type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                            </label>
                                            <div className='relative ring-1 p-4 rounded-md'>
                                                <div className=' flex flex-col gap-x-6 justify-between'>
                                                    {section.type === 'section' ?
                                                        <div className='flex gap-x-4'>
                                                            <span onClick={() => this.sectionTitle(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                Title
                                                            </span>
                                                            <span onClick={() => this.sectionDesc(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                Description
                                                            </span>
                                                            <span onClick={() => this.sectionImg(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                Image
                                                            </span>
                                                            <span onClick={() => this.sectionVid(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                Video
                                                            </span>
                                                            <span onClick={() => this.sectionTab(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                Table
                                                            </span>
                                                            <span onClick={() => this.sectionButton(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                button
                                                            </span>
                                                        </div> :
                                                        section.type === 'faq' ?
                                                            <div className='flex gap-x-4'>
                                                                <span onClick={() => this.sectionFaq(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                    Add
                                                                </span>
                                                            </div> :
                                                            section.type === 'recommended_reading' ?
                                                                <div className='flex gap-x-4'>
                                                                    <span onClick={() => this.sectionRC(section)} className="inline-flex cursor-pointer bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                        Add
                                                                    </span>
                                                                </div> :
                                                                section.type === 'cta' ?
                                                                    <div className='flex gap-x-4'>
                                                                        <span className="inline-flex bg-white items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-400">
                                                                            CTA Button
                                                                        </span>
                                                                        <div>
                                                                            <div onClick={() => this.removeSecDataField(section)} className=' absolute -right-[6px] -top-2 bg-gray-500 p-[1px] rounded-full cursor-pointer'>
                                                                                <XMarkIcon className='w-4 text-white' />
                                                                            </div>
                                                                            <div className='absolute right-[32px] -top-2 flex gap-x-3'>
                                                                                <div onClick={() => this.moveParent(section.id, 'up')} title='Move Up' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                    <ChevronUpIcon className='w-3 text-white font-bold' />
                                                                                </div>
                                                                                <div onClick={() => this.moveParent(section.id, 'down')} title='Move Down' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                    <ChevronDownIcon className='w-3 text-white font-bold' />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div> : ''
                                                    }
                                                    <div className='w-full'>
                                                        {section.data &&
                                                            section.data.map((secData, secIndex) => (
                                                                <div key={secIndex}>
                                                                    <div className=' relative'>
                                                                        <div className='flex gap-x-2 mt-5 items-baseline'>

                                                                            <label className=" block text-sm font-semibold capitalize leading-6 text-gray-900">
                                                                                {secData.title}
                                                                            </label>

                                                                            {secData.title === 'heading' &&
                                                                                <div>
                                                                                    <Popover className="relative">
                                                                                        <Popover.Button onClick={() => this.toggleMenu(secData.id)} className=" justify-center flex items-center gap-x-1 text-sm p-1 font-medium text-gray-900">
                                                                                            <span>- {secData.titleTag ? secData.titleTag : ''}</span>
                                                                                            <ChevronDownIcon className="w-[14px]" aria-hidden="true" />
                                                                                        </Popover.Button>
                                                                                        <Transition show={this.state.openIndex === secData.id} as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1" >
                                                                                            <Popover.Panel ref={this.tagRef} className="absolute left-1/2 z-10  flex w-screen max-w-min -translate-x-1/2 px-4">
                                                                                                <div className="w-fit shrink rounded-xl bg-white py-1 px-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                                                                                                    {this.state.tag.map((tag, index) => (
                                                                                                        <p key={index} onClick={() => this.titleTag(tag, secData.id)} className="block p-2 cursor-pointer hover:text-indigo-600">
                                                                                                            {tag}
                                                                                                        </p>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </Popover.Panel>
                                                                                        </Transition>
                                                                                    </Popover>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                        {
                                                                            section.type === 'testimonials' ?
                                                                                <div className=' ring-slate-400 rounded-md'>
                                                                                    <div className='flex flex-col gap-y-3'>
                                                                                        <label className=' text-xs font-medium' >Description</label>
                                                                                        <textarea rows={3} value={secData.description} type={'text'} onChange={(e) => this.updatetestiDesc(e.target.value, secData.id)} className={`block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                        <label className=' text-sm font-medium'>Image</label>
                                                                                        <input type='file' onChange={(e) => this.updateTestiImg(e, secData.id)} className={`block w-full rounded-md text-sm px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                        <label className=' text-sm font-medium'>Name</label>
                                                                                        <input value={secData.name} type={'text'} onChange={(e) => this.updateTestiName(e.target.value, secData.id)} className={`block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                        <label className=' text-sm font-medium'>Role</label>
                                                                                        <input value={secData.role} type={'text'} onChange={(e) => this.updateTestiRole(e.target.value, secData.id)} className={`block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                    </div>
                                                                                </div> :
                                                                                section.type === 'faq' ?
                                                                                    <div className='ring-1 ring-slate-400 rounded-md p-5 mb-3'>
                                                                                        <div className='flex flex-col gap-y-4'>
                                                                                            <div>
                                                                                                <label className=' text-xs font-medium' >Question</label>
                                                                                                <textarea rows={2} value={secData.question} type={'text'} onChange={(e) => this.updateFaqQuestion(e.target.value, secData.id)} className={`block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                            </div>
                                                                                            <div>
                                                                                                <label className=' text-sm font-medium'>Answer</label>
                                                                                                <textarea rows={3} value={secData.answer} type={'text'} onChange={(e) => this.updateFaqAnswer(e.target.value, secData.id)} className={`block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                            </div>
                                                                                        </div>
                                                                                        {
                                                                                            section.data.length > 1 &&
                                                                                            <div>
                                                                                                <div onClick={() => this.secDataRemoveFaq(secData)} className=' absolute -right-[6px] -top-2 bg-gray-500 p-[1px] rounded-full cursor-pointer'>
                                                                                                    <XMarkIcon className='w-3 text-white' />
                                                                                                </div>
                                                                                                <div className='absolute right-[32px] -top-2 flex gap-x-3'>
                                                                                                    <div onClick={() => this.moveItem(section.id, secData.id, 'up')} title='Move Up' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                                        <ChevronUpIcon className='w-3 text-white font-bold' />
                                                                                                    </div>
                                                                                                    <div onClick={() => this.moveItem(section.id, secData.id, 'down')} title='Move Down' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                                        <ChevronDownIcon className='w-3 text-white font-bold' />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </div>
                                                                                    :
                                                                                    section.type === 'recommended_reading' ?
                                                                                        <div className='ring-1 ring-slate-400 rounded-md p-5'>
                                                                                            <div className='flex flex-col gap-y-3'>
                                                                                                <label className=' text-xs font-medium' >Description</label>
                                                                                                <input value={secData.description} type={'text'} onChange={(e) => this.updateRCDesc(e.target.value, secData.id)} className={`block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                                <label className=' text-sm font-medium'>Link</label>
                                                                                                <input value={secData.link} type={'text'} onChange={(e) => this.updateRCLink(e.target.value, secData.id)} className={`block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                            </div>
                                                                                            {section.data.length > 1 &&
                                                                                                <div>
                                                                                                    <div onClick={() => this.secDataRemoveFaq(secData)} className=' absolute -right-[6px] -top-2 bg-gray-500 p-[1px] rounded-full cursor-pointer'>
                                                                                                        <XMarkIcon className='w-3 text-white' />
                                                                                                    </div>
                                                                                                    <div className='absolute right-[32px] -top-2 flex gap-x-3'>
                                                                                                        <div onClick={() => this.moveItem(section.id, secData.id, 'up')} title='Move Up' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                                            <ChevronUpIcon className='w-3 text-white font-bold' />
                                                                                                        </div>
                                                                                                        <div onClick={() => this.moveItem(section.id, secData.id, 'down')} title='Move Down' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                                            <ChevronDownIcon className='w-3 text-white font-bold' />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                        :
                                                                                        <div>
                                                                                            {
                                                                                                secData.title === 'image' ?
                                                                                                    <div className='flex flex-col ring-1 gap-y-4 p-3 rounded-lg'>
                                                                                                        <input accept=".webp, .png" type='file' onChange={(e) => this.handleFileUpload(e, secData.id)} className={`block w-full rounded-md  text-xs  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none outline-none`} />
                                                                                                        <input onChange={(e) => this.altText(e, secData)} value={secData.alt} placeholder='ALT Text' type="text" className='block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none' />
                                                                                                    </div> :

                                                                                                    secData.title === 'video' ?

                                                                                                        <div className='flex flex-col ring-1 gap-y-4 p-3 rounded-lg'>
                                                                                                            <input accept=".mp4" type='file' onChange={(e) => this.handleFileUpload(e, secData.id)} className={`block w-full rounded-md  text-xs  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                                            <input onChange={(e) => this.altText(e, secData)} value={secData.alt} placeholder='ALT Text' type="text" className='block w-full rounded-md px-3.5 py-2 text-gray-900 bg-white ring-1 border-none' />
                                                                                                        </div> :

                                                                                                        secData.title === 'table' ?

                                                                                                            <div className='ring-1 rounded-lg p-3'>
                                                                                                                <Tab tableId={secData} />
                                                                                                            </div>
                                                                                                            :
                                                                                                            secData.title === 'button' ?
                                                                                                                <div className='flex flex-col ring-1 gap-y-4 p-3 pt-5 rounded-lg'>
                                                                                                                    <input onChange={(e) => this.updateSecData(e.target.value, secData)} value={secData.content} placeholder='Button Content' type="text" className='block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none' />
                                                                                                                    <input onChange={(e) => this.updateSecButData(e, secData)} value={secData.link} placeholder='Button Link' type="text" className='block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none' />
                                                                                                                </div> :
                                                                                                                secData.title === 'description' ?
                                                                                                                    <textarea rows={3} type='text' value={secData.content} onChange={(e) => this.updateSecData(e.target.value, secData)} className={`block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                                                    : <input type='text' value={secData.content} onChange={(e) => this.updateSecData(e.target.value, secData)} className={`block w-full rounded-md  px-3.5 py-2 text-gray-900 bg-white ring-1 border-none`} />
                                                                                            }

                                                                                            {
                                                                                                section.data.length > 1 &&
                                                                                                <div>
                                                                                                    <div onClick={() => this.secDataRemoveFaq(secData)} className=' absolute -right-[6px] top-4 bg-gray-500 p-[1px] rounded-full cursor-pointer'>
                                                                                                        <XMarkIcon className='w-3 text-white' />
                                                                                                    </div>
                                                                                                    <div className='absolute right-[32px] top-4 flex gap-x-3'>
                                                                                                        <div onClick={() => this.moveItem(section.id, secData.id, 'up')} title='Move Up' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                                            <ChevronUpIcon className='w-3 text-white font-bold' />
                                                                                                        </div>
                                                                                                        <div onClick={() => this.moveItem(section.id, secData.id, 'down')} title='Move Down' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                                            <ChevronDownIcon className='w-3 text-white font-bold' />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                        }
                                                                    </div>

                                                                    <div>
                                                                        <div onClick={() => this.removeSecDataField(section)} className=' absolute -right-[6px] -top-2 bg-gray-500 p-[1px] rounded-full cursor-pointer'>
                                                                            <XMarkIcon className='w-4 text-white' />
                                                                        </div>
                                                                        <div className='absolute right-[32px] -top-2 flex gap-x-3'>
                                                                            <div onClick={() => this.moveParent(section.id, 'up')} title='Move Up' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                <ChevronUpIcon className='w-3 text-white font-bold' />
                                                                            </div>
                                                                            <div onClick={() => this.moveParent(section.id, 'down')} title='Move Down' className=' bg-slate-600 p-[2px] rounded-full cursor-pointer'>
                                                                                <ChevronDownIcon className='w-3 text-white font-bold' />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="mt-10 gap-10 flex flex-wrap justify-center  pt-8">
                                <button onClick={() => this.addSection('section')} type="button" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    Section
                                </button>
                                <button onClick={() => this.addSection('recommended_reading')} type="button" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover-bg-gray-50">
                                    Recommended Reading
                                </button>
                                <button onClick={() => this.addSection('cta')} type="button" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover-bg-gray-50">
                                    CTA
                                </button>
                                <button onClick={() => this.addSection('testimonials')} type="button" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover-bg-gray-50">
                                    Testimonials
                                </button>
                                <button onClick={() => this.addSection('faq')} type="button" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover-bg-gray-50">
                                    FAQ
                                </button>
                            </div>
                            <div className="mt-10 flex justify-center space-x-6 pt-8">
                                <button onClick={() => this.submit()} className="rounded-md bg-[#e84c3d] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover-bg-[#e84c3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Submit
                                </button>
                                <button onClick={() => this.preview()} className="rounded-md border border-[#8b8585] bg-white px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm hover-bg-[#e84c3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Preview
                                </button>
                                <button onClick={() => this.cancel()} className="rounded-md border border-[#8b8585] bg-white px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm hover-bg-[#e84c3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Page;