import React, { Component } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AppStateContext from '../../utils/AppStateContext';
import { axiosInstance } from '../../services/apiconfig';

const people = [
    { name: 'Admin' },
    { name: 'SEO' },
    { name: 'Content Writter' },
];


class Example extends Component {

    static contextType = AppStateContext

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            selected: people[0],
        };
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = (selected) => {
        this.setState({ selected });
    };

    userDelete = () => {
        const { setDeleteUserModal, editUserData } = this.context;

        axiosInstance.delete(`/userDelete/${editUserData._id}`, { data: editUserData }).then((e) => {
            if (e.data.code === 200) {
                setDeleteUserModal(false);
                this.props.reload()
            }
        }).catch((err) => console.log(err))
    }


    userCancel = () => {
        const { setDeleteUserModal } = this.context;

        setDeleteUserModal(false)
    }




    render() {

        return (
            <Transition appear show={this.context.deleteUserModal} as={Fragment} onClose={this.handleClose}>
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
                                        Would you like to delete this User ?
                                    </h4>
                                    <p className='mt-2'>
                                        Once you delete this User, It may affect your team !
                                    </p>
                                </div>
                                <div className="mt-5 sm:mt-8 flex space-x-10 justify-center">
                                    <button onClick={this.userDelete}
                                        type="button"
                                        className="mt-3 w-28 inline-flex justify-center  rounded-md bg-[#e84c3d] py-2 text-sm font-semibold text-white outline-none sm:mt-0"
                                    >
                                        Please Do It
                                    </button>
                                    <button onClick={this.userCancel}
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
