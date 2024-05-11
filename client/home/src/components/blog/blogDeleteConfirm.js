import React, { Component } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AppStateContext from '../../utils/AppStateContext';
import { axiosInstance } from '../../services/apiconfig';



class Example extends Component {

    static contextType = AppStateContext

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleClose = () => {
    };

    blogDelete = () => {
        const { setDeleteBlogModal, deleteBlogData } = this.context;
        setDeleteBlogModal(false);
        axiosInstance.delete(`/blogDelete/${deleteBlogData._id}`, { data: deleteBlogData }).then((res) => {
            if (res.data.code === 200) {
                this.props.reload()
            }
        }).catch((err) => { })
    }


    blogCancel = () => {
        const { setDeleteBlogModal } = this.context;

        setDeleteBlogModal(false)
    }

    componentDidMount() {

    }


    render() {

        return (
            <Transition appear show={this.context.deleteBlogModal} as={Fragment} onClose={this.handleClose}>
                <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-md sm:p-6">

                                <div>
                                    <h4 className=' font-semibold'>
                                        Would you like to delete this blog ?
                                    </h4>
                                    <p className='mt-2'>
                                        Once you delete this blog, It can't be revert !
                                    </p>
                                </div>
                                <div className="mt-5 sm:mt-8 flex space-x-10 justify-center">
                                    <button onClick={this.blogDelete}
                                        type="button"
                                        className="mt-3 w-28 inline-flex justify-center  rounded-md bg-[#e84c3d] py-2 text-sm font-semibold text-white outline-none sm:mt-0"
                                    >
                                        Please Do It
                                    </button>
                                    <button onClick={this.blogCancel}
                                        type="button"
                                        className="mt-3 w-20 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 sm:mt-0 ring-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        );
    }
}

export default Example;
