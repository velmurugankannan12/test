import React, { Component } from 'react'
import { FolderIcon, UsersIcon } from '@heroicons/react/24/outline';
import AppStateContext from '../../utils/AppStateContext';

const navigation = [
    { name: 'Blog', href: 'blog', icon: FolderIcon, current: true },
    { name: 'Case-study', href: 'case-study', icon: FolderIcon, current: false },
    { name: 'Product Updates', href: 'product-updates', icon: FolderIcon, current: false },
    { name: 'Product User Manual', href: 'product-user-manual', icon: FolderIcon, current: false },
    { name: 'Users', href: 'users', icon: UsersIcon, current: false },
    { name: 'Category', href: 'category', icon: UsersIcon, current: false },
];


function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default class sidebar extends Component {

    static contextType = AppStateContext

    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            currentNavigation: '',
            filteredNavigation: []
        };
    }

    handleNavigationClick = (item) => {
        this.setState({ currentNavigation: item.href, sidebarOpen: false });

        this.props.redirect(item.href)
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
        const { currentNavigation } = this.state;

        return (
            <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col`}>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 items-center">
                        <img
                            className="lg:h-9 h-7 w-auto"
                            src="/img/logo.png"
                            alt="Your Company"
                        />
                    </div>
                    <nav className={` ${this.context.addBlogModal && 'pointer-events-none'} ${this.context.editBlogModal && 'pointer-events-none'} flex flex-1 flex-col`}>
                        <div className="flex flex-1 flex-col gap-y-7">
                            <div className="-mx-2 space-y-3">
                                {this.state.filteredNavigation.map((item) => (
                                    <div key={item.name}>
                                        <div
                                            href={item.href}
                                            onClick={() => this.handleNavigationClick(item)}
                                            className={classNames(
                                                currentNavigation === item.href
                                                    ? 'bg-gray-50 text-[#e84c3d]'
                                                    : 'text-gray-700 hover:text-[#e84c3d] hover:bg-gray-50',
                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer'
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    currentNavigation === item.href ? 'text-[#e84c3d]' : 'text-gray-400 group-hover:text-[#e84c3d]',
                                                    'h-6 w-6 shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* <div className="mt-auto">
                                <div className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
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
            </div>
        )
    }
}
