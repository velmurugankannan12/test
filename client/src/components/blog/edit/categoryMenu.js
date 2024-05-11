import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import AppStateContext from '../../../utils/AppStateContext';
import { axiosInstance } from '../../../services/apiconfig';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

class Example extends React.Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props);
        this.state = {
            selected: '',
            categoryList: [],
            open: false,
        };
    }

    selectAuthor = (e) => {
        this.setState({ selected: e })
        const { setCategory } = this.context
        setCategory(e)
    }

    componentDidMount() {
        axiosInstance.get('/categoryList').then((e) => {
            if (e.data.code === 200) {
                this.setState({ categoryList: e.data.category })
            }
        })
    }

    render() {
        return (
            <Listbox value={this.state.selected} >
                {({ open }) => (
                    <>
                        <div className="relative mt-2">
                            <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 h-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none  sm:text-sm sm:leading-6">
                                <span className="flex items-center">
                                    <span className="ml-1 block truncate">{this.state.selected || this.context.editBlogData.category}</span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {this.state.categoryList.map((name, index) => (
                                        <Listbox.Option
                                            key={index}
                                            onClick={() => this.selectAuthor(name.category)}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'bg-slate-400 text-white' : 'text-gray-900',
                                                    'relative cursor-pointer select-none py-2 pl-3 pr-9 capitalize'
                                                )
                                            }
                                            value={name.category}
                                        >
                                            <div >
                                                <div className="flex items-center capitalize">
                                                    {name.category}
                                                </div>
                                            </div>
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        );
    }
}

export default Example;