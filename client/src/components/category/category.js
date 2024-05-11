import React, { Component } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { axiosInstance } from '../../services/apiconfig';
import _ from 'underscore'
export default class category extends Component {
    constructor(props) {
        super(props)

        this.state = {
            category: '',
            categoryList: []
        }
    }
    category = (e) => {
        this.setState({ category: e })
    }
    generateUniqueId = () => {
        const randomString = Math.random().toString(36).substr(2, 10);
        return `${new Date().getTime()}_${randomString}`;
    }
    onEnter = async (e) => {
        if (e.code === 'Enter' && !_.isEmpty(this.state.category)) {
            let data = { id: this.generateUniqueId(), category: this.state.category };
            await axiosInstance.post('/categoryAdd', data)
                .then((res) => {
                    if (res.data.code === 200) {
                        setTimeout(() => {
                            this.categoryList();
                            this.setState({ category: '' });
                        }, 1000);
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    removeCategory = (e) => {
        axiosInstance.delete(`/categoryDelete/${e}`).then((res) => {
            if (res.data.code === 200) {
                setTimeout(() => {
                    this.categoryList();
                }, 1000);
            }
        }).catch((err) => console.log(err))
    }

    categoryList = () => {
        axiosInstance.get('/categoryList').then((e) => {
            this.setState({ categoryList: e.data.category })
        }).catch((err) => console.log(err))
    }

    componentDidMount() {
        setInterval((
            this.categoryList()
        ), 3000)
    }

    render() {
        return (
            <div className='p-4'>
                <label htmlFor="name" className="block text-md font-medium leading-6 text-gray-900">
                    Add Blog Category
                </label>

                <div className='flex flex-wrap gap-x-4 mt-5'>
                    {this.state.categoryList.map((e, index) => (
                        <div key={index} className='mt-5 mb-2 relative border border-slate-400 px-4 py-0.5 rounded-md w-fit'>
                            <p className=' capitalize'>{e.category}</p>
                            <div onClick={() => this.removeCategory(e._id)} className=' absolute -right-[6px] -top-2 bg-red-400 p-[1px] rounded-full cursor-pointer'>
                                <XMarkIcon className='w-3 text-white' />
                            </div>
                        </div>

                    ))}
                </div>

                <div className="relative mt-2">
                    <input value={this.state.category} onKeyDown={this.onEnter} onChange={(e) => this.category(e.target.value)} type="text" className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6" />
                    <div className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-red-300" aria-hidden="true" />
                </div>
            </div>
        )
    }
}
