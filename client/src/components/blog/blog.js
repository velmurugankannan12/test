import React, { Component } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { blog } from '../../../services/blogData';
import AppStateContext from '../../utils/AppStateContext';
import AddBlog from './add/addBlog'
import EditBlog from './edit/editBlog'
import BlogDeleteConfirm from './blogDeleteConfirm'
import { axiosInstance } from '../../services/apiconfig';
import moment from 'moment';

export default class blogComponent extends Component {

    static contextType = AppStateContext

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            nav: false,
            userRole: ''
        }
    }

    addBlog = () => {
        const { setAddBlogModal } = this.context
        setAddBlogModal(true)
        this.setState({ nav: true })
    }

    editBlog = (e) => {
        const { setEditBlogModal, setEditBlogData } = this.context
        setEditBlogModal(true)
        setEditBlogData(e)
    }

    deleteBlog = (e) => {
        const { setDeleteBlogModal, setDeleteBlogData } = this.context
        setDeleteBlogModal(true)
        setDeleteBlogData(e)
    }

    reload = () => {
        setTimeout(() => {
            axiosInstance.get('/blogGet').then((e) => {
                this.setState({ data: e.data.blog })
            }).catch((e) => { })
        }, 1000)
    }

    componentDidMount() {
        axiosInstance.get('/blogGet').then((e) => {
            this.setState({ data: e.data.blog })
        }).catch((e) => { })

        let userData = JSON.parse(localStorage.getItem('user'))

        if (userData) {
            this.setState({ userRole: userData.role })
        }

    }

    render() {

        return (
            <div className="bg-white">
                {
                    <BlogDeleteConfirm reload={this.reload} />
                }
                {
                    this.context.addBlogModal ?
                        <AddBlog reload={this.reload} /> : this.context.editBlogModal ? <EditBlog reload={this.reload} /> :
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                                    <div onClick={this.addBlog} style={{ height: this.state.data.length === 0 ? '346px' : 'auto', }} className=' space-x-3 rounded-2xl cursor-pointer border border-[#f58f8f] h-full'>
                                        <div className=' flex flex-col space-y-5 justify-center items-center h-full' >
                                            <div className=' bg-[#f0f1f2] p-3 rounded-2xl'>
                                                <PlusIcon className="h-14 w-14 text-gray-900" aria-hidden="true" />
                                            </div>
                                            <div>
                                                Add Blog
                                            </div>
                                        </div>
                                    </div>

                                    {this.state.data.map((blog, index) => (
                                        <div key={index}>
                                            <div>
                                                <img style={{ aspectRatio: 1.75 }} className=" w-full rounded-2xl object-contain" src={'http://localhost:4000' + blog.blog_intro.img} alt="Blog Images" />
                                                <h3 className="mt-5 text-lg font-semibold leading-8 tracking-tight text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">{blog.blog_intro.blog_title ? blog.blog_intro.blog_title : ""}</h3>
                                                <p className="text-base leading-7 text-gray-600">{moment(blog.additional_data ? JSON.parse(blog.additional_data.schedule) : new Date()).format('MMMM DD, YYYY')}</p>
                                                <div className='flex justify-between items-end'>
                                                    <div className=' overflow-hidden'>
                                                        <p className=' overflow-hidden whitespace-nowrap text-ellipsis capitalize'>{blog.author.firstname + ' ' + blog.author.lastname}</p>
                                                    </div>
                                                    <div className=' space-x-6 mt-2 pl-3 flex justify-end'>
                                                        <button onClick={() => this.editBlog(blog)} type="button" className="" >
                                                            <span className="sr-only">Edit</span>
                                                            <PencilSquareIcon className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                                        </button>

                                                        {
                                                            this.state.userRole === 'Admin' &&
                                                            <button onClick={() => this.deleteBlog(blog)} type="button" className="">
                                                                <span className="sr-only">Delete</span>
                                                                <TrashIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                }
            </div>
        )
    }
}


