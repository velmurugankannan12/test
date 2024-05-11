import React, { Component, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { FolderIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AppStateContext from '../../utils/AppStateContext';

const navigation = [
    { name: 'Blog', href: 'blog', icon: FolderIcon, current: true },
    { name: 'Case-study', href: 'case-study', icon: FolderIcon, current: false },
    { name: 'Product Updates', href: 'product-updates', icon: FolderIcon, current: false },
    { name: 'Product User Manual', href: 'product-user-manual', icon: FolderIcon, current: false },
    { name: 'Users', href: 'users', icon: UsersIcon, current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default class sidebarMob extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            currentNavigation: '',
            filteredNavigation: []
        };
    }
    closeMenu = () => {
        const { setSidebarMenu } = this.context
        setSidebarMenu(false)
    }
    handleNavigationClick = (item) => {
        this.setState({ currentNavigation: item.href, sidebarOpen: false });
        this.props.redirect(item.href)
        const { setSidebarMenu } = this.context
        setSidebarMenu(false)
    };
    componentDidMount() {
        // Set initial state based on the current URL or any other logic
        const currentPath = window.location.pathname.substring(1); // Assuming your URLs don't have leading '/'
        if (currentPath) {
            this.setState({ currentNavigation: currentPath === 'home' ? 'blog' : '' });
        } else {
            this.setState({ currentNavigation: 'blog' });
        }

        let userData = JSON.parse(localStorage.getItem('user'))

        let filteredNavigation

        if (userData) {
            filteredNavigation = userData.role === 'Admin' ? navigation : navigation.filter(item => item.name !== 'Users');

            this.setState({ filteredNavigation: filteredNavigation })
        }
    }
    render() {

        return (
            <Transition.Root show={this.context.sidebarMenu} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={() => this.closeMenu()}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => this.closeMenu()}>
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">

                                    <nav className="flex flex-1 flex-col">
                                        <div className="flex h-16 items-center">
                                            <img
                                                className="lg:h-9 h-7 w-auto"
                                                src="/img/logo.png"
                                                alt="Your Company"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-y-7">
                                            <div className="-mx-2 space-y-1">
                                                {navigation.map((item) => (
                                                    <div key={item.name}>
                                                        <div
                                                            href={item.href}
                                                            onClick={() => this.handleNavigationClick(item)}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-gray-50 text-[#e84c3d]'
                                                                    : 'text-gray-700 hover:text-[#e84c3d] hover:bg-gray-50',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer'
                                                            )}
                                                        >
                                                            <item.icon
                                                                className={classNames(
                                                                    item.current ? 'text-[#e84c3d]' : 'text-gray-400 group-hover:text-[#e84c3d]',
                                                                    'h-6 w-6 shrink-0'
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            {item.href}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* <div className="mt-auto">
                                                <div   className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                                >
                                                    <Cog6ToothIcon
                                                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                                        aria-hidden="true"
                                                    />
                                                    Settings
                                                </div>
                                            </div> */}
                                        </div>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        )
    }
}
