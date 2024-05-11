import React, { Component, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AppStateContext from '../../../utils/AppStateContext';


class Progress extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props);
        this.state = { open: true };
        this.setOpen = this.setOpen.bind(this);
    }

    setOpen(open) {

    }

    componentDidMount(){
        console.log('hi')
    }

    render() {

        return (
            <Transition.Root show={this.context.uploadProgress} as={Fragment}>
             {/* <Transition.Root show={true} as={Fragment}> */}
                <Dialog as="div" className="relative z-10" onClose={() => this.setOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 py-4 h-28 w-56 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">

                                    <div className="text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            {this.props.uploadProgress}% uploaded
                                        </Dialog.Title>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        );
    }
}

export default Progress;
