import React, { Component } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AppStateContext from '../../utils/AppStateContext';

export default class Example extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            error: []
        };
    }

    popClose = () => {
        const { setValidationPop } = this.context
        setValidationPop(false)
    }

    componentDidMount() {
        if (this.props.err) {
            const falseValuesArray = Object.entries(this.props.err)
                .filter(([key, value]) => !value)
                .map(([key]) => {
                    const normalizedKey = key.replace(/_check$/, ''); // Remove "_check" if it exists at the end
                    return normalizedKey.split('_').map(word => word.charAt(0) + word.slice(1)).join(' ');
                });

            this.setState({ error: falseValuesArray });
        }
    }

    render() {

        return (
            <Transition.Root show={this.context.validationPop}>
                <Dialog as="div" className="relative z-10" onClose={this.popClose}>
                    <Transition.Child
                        as={React.Fragment}
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
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-base text-center font-semibold leading-6 text-gray-900">
                                                Error
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Please fill all the fields of below,
                                                </p>
                                                {
                                                    this.state.error.map((data, index) => (
                                                        <div className='mt-2 ml-2' key={index}>
                                                            <p className='text-sm text-gray-500 capitalize'>{index + 1 + '. '}{data}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={this.popClose}
                                        >
                                            Close
                                        </button>
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
