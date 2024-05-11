import React, { Component, Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { axiosInstance } from '../../services/apiconfig';
import { Dialog, Transition } from '@headlessui/react';
import _ from 'underscore'
import { errorNotify } from '../../utils/notify';


export default class category extends Component {
    constructor(props) {
        super(props)

        this.state = {
            category: '',
            subCategory: '',
            currCategory: '',
            categoryList: [],
            subCategoryList: [],
            subCatModal: false
        }
    }
    category = (e) => {
        this.setState({ category: e })
    }
    subCategory = (e) => {
        this.setState({ subCategory: e })
    }
    generateUniqueId = () => {
        const randomString = Math.random().toString(36).substr(2, 10);
        return `${new Date().getTime()}_${randomString}`;
    }
    onEnter = async (e) => {
        if (e.code === 'Enter' && !_.isEmpty(this.state.category)) {
            let data = { category: this.state.category, subCategory: [] };
            await axiosInstance.post('/categoryAdd', data)
                .then((res) => {
                    if (res.data.code === 200) {
                        setTimeout(() => {
                            this.categoryList();
                            this.setState({ category: '' });
                        }, 1000);
                    } else {
                        errorNotify(res.data.msg)
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    subCatonEnter = async (e) => {
        if (e.code === 'Enter' && !_.isEmpty(this.state.subCategory)) {

            let updData = this.state.currCategory

            updData.subCategory.push(this.state.subCategory)

            await axiosInstance.put('/categoryUpdate', updData)
                .then((res) => {
                    if (res.data.code === 200) {
                        setTimeout(() => {
                            this.refreshSubCat();
                            this.setState({ subCategory: '' });
                            // this.setState({ subCatModal: false })
                        }, 1000);
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    removeCategory = (e) => {
        this.setState({ subCatModal: false })

        axiosInstance.delete(`/categoryDelete/${e}`).then((res) => {
            if (res.data.code === 200) {
                setTimeout(() => {
                    this.categoryList();
                }, 1000);
            }
        }).catch((err) => console.log(err))
    }

    removeSubCategory = async (e) => {

        let updData = this.state.currCategory

        updData.subCategory = updData.subCategory.filter(item => item !== e)

        await axiosInstance.put('/categoryUpdate', updData)
            .then((res) => {
                if (res.data.code === 200) {
                    setTimeout(() => {
                        this.refreshSubCat();
                        this.setState({ subCategory: '' });
                        // this.setState({ subCatModal: false })
                    }, 1000);
                }
            })
            .catch((err) => console.log(err));
    }

    subCat = (cat) => {
        this.setState({ subCatModal: true, currCategory: cat })

        axiosInstance.get('/categoryList').then((e) => {

            if (e.data.category) {
                e.data.category.forEach(element => {
                    if (element.category === cat.category && element.subCategory) {
                        this.setState({ subCategoryList: element.subCategory })
                    }
                });
            }

        }).catch((err) => console.log(err))
    }

    refreshSubCat = () => {

        axiosInstance.get('/categoryList').then((e) => {

            if (e.data.category) {
                e.data.category.forEach(element => {
                    if (element.category === this.state.currCategory.category && element.subCategory) {
                        this.setState({ subCategoryList: element.subCategory })
                    }
                });
            }

        }).catch((err) => console.log(err))
    }

    closeSubCat = () => {
        this.setState({ subCatModal: false, currCategory: '' })

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
                <div >
                    <label htmlFor="name" className="block text-md font-medium leading-6 text-gray-900">
                        Add Blog Category
                    </label>

                    <div className='flex flex-wrap gap-x-4 mt-5'>
                        {this.state.categoryList.map((e, index) => (
                            <div key={index} onClick={() => this.subCat(e)} className='mt-5 mb-2 cursor-pointer relative border border-slate-400 px-4 py-0.5 rounded-md w-fit'>
                                <p className=' capitalize'>{e.category}</p>
                                <div onClick={() => this.removeCategory(e._id)} className=' z-10 absolute -right-[6px] -top-2 bg-red-400 p-[1px] rounded-full cursor-pointer'>
                                    <XMarkIcon className='w-3 text-white' />
                                </div>
                            </div>

                        ))}
                    </div>

                    <div className="relative mt-2">
                        <input value={this.state.category} onKeyDown={this.onEnter} onChange={(e) => this.category(e.target.value)} type="text" className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6" />
                        <div className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-red-300" aria-hidden="true" />
                    </div>

                    <Transition.Root show={this.state.subCatModal} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={() => this.setState({ subCatModal: true })}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed  bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-lg border transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                            <div>
                                                <label htmlFor="name" className="block text-md font-medium leading-6 text-gray-900">
                                                    {'Add Sub Category for ' + this.state.currCategory.category}
                                                </label>

                                                <div className='flex flex-wrap gap-x-4 mt-5'>
                                                    {this.state.subCategoryList.map((e, index) => (
                                                        <div key={index} className='mt-5 mb-2  relative border border-slate-400 px-4 py-0.5 rounded-md w-fit'>
                                                            <p className='text-black capitalize'>{e}</p>
                                                            <div onClick={() => this.removeSubCategory(e)} className=' absolute -right-[6px] -top-2 bg-red-400 p-[1px] rounded-full cursor-pointer'>
                                                                <XMarkIcon className='w-3 text-white' />
                                                            </div>

                                                        </div>

                                                    ))}
                                                </div>

                                                <div className="relative mt-2">
                                                    <input value={this.state.subCategory} onKeyDown={this.subCatonEnter} onChange={(e) => this.subCategory(e.target.value)} type="text" className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6" />
                                                    <div className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-red-300" aria-hidden="true" />
                                                </div>

                                                <div className='mt-6 flex justify-center'>
                                                    <button onClick={() => this.setState({ subCatModal: false })} className='bg-[#e84c3d] text-white rounded-md py-1 px-3' >Close</button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </div>
            </div>
        )
    }
}
