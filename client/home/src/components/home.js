import React, { Component } from 'react';
import UsersList from './user/users'
import BlogData from './blog/blog'
import Header from './layout/header'
import SideBar from './layout/sidebar'
import SideBarMob from './layout/sidebarMob';
import Category from './category/category';
import AppStateContext from '../utils/AppStateContext';
import isOnlineNow from 'is-online';
import { ToastContainer } from 'react-toastify';
import { offlineInfo, onlineInfo } from '../utils/notify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from '../services/apiconfig'

class Example extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            currentNavigation: '',
            addUserModal: false,
            editUserModal: false,
            deleteUserModal: false,
            current_network_status: true,
        };
    }

    network_status = (status) => {

        if (status.type === 'online') {

            if (!this.state.current_network_status) {
                onlineInfo('Your Are Online Now!')
                this.setState({ current_network_status: true });
            }

        } else {

            if (this._isMounted) {
                if (this.state.current_network_status) {
                    this.setState({ current_network_status: false });
                    offlineInfo('You are Offline Check Your Internet....!')

                }
            }

        }
    }

    componentDidMount() {

        // let user = localStorage.getItem('user') ? localStorage.getItem('user') : null

        // if (!user && window.location.pathname !== '/') {
        //     window.location.href = '/'
        // }
        // else if (user === null) {
        //     // window.location.href = '/'
        // }
        // else {
        //     let data = user === null && JSON.parse(user)
        //     let userData = { userid: data.email, password: data.password }
        //     axiosInstance.post('/login', userData).then((e) => {
        //         if (e.data.code === 200) {
        //             localStorage.setItem('user', JSON.stringify(e.data.user))
        //             this.setState({ navigate: true })
        //         } else {
        //             window.location.href = '/'
        //         }
        //     })
        // }

        // Retrieve the user data from local storage once
        let user = localStorage.getItem('user');

        // Check if the user data is not null and parse it
        let parsedUser = user ? JSON.parse(user) : null;

        // Check user authentication and handle redirections
        if (!parsedUser && window.location.pathname !== '/') {
            // Redirect to home if user data is absent and not already on the home page
            window.location.href = '/';
            return; // Stop further execution to avoid setting state after a redirect
        }

        if (parsedUser) {
            // Prepare user data for login verification
            let userData = { userid: parsedUser.email, password: parsedUser.password };

            // Post login data to verify it or re-authenticate
            axiosInstance.post('/login', userData).then((response) => {
                if (response.data.code === 200) {
                    // If login is successful, refresh user data in local storage
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    this.setState({ navigate: true }); // Navigate further or handle state
                } else {
                    // Handle login failure
                    window.location.href = '/';
                }
            }).catch((error) => {
                // console.error('Login error:', error);
                window.location.href = '/';
            });
        }

        this._isMounted = true;

        this.timerID = setInterval(async () => {

            if (this._isMounted) {
                if (await isOnlineNow()) {
                    this.network_status({ type: 'online' });

                } else {
                    this.network_status({ type: 'offline' });
                };
            } else {
                clearInterval(this.timerID)
            }

        }, 10000);

        const currentPath = window.location.pathname.substring(1);

        if (currentPath === 'home') {
            this.setState({ currentNavigation: 'blog' });
        } else {
            this.setState({ currentNavigation: 'blog' });
        }

        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData) {
            this.setState({ navigate: true })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        this._isMounted = false
    }

    redirect = (e) => {
        this.setState({ currentNavigation: e });
    }

    addUserModalBool = () => {
        this.setState({ addUserModal: true })
    }

    addUser = () => {
        this.setState({ addUserModal: false })
    }

    editUser = () => {
        this.setState({ editUserModal: true })
    }

    DeleteUser = () => {
        this.setState({ deleteUserModal: true })
    }



    render() {

        return (
            <>
                <ToastContainer containerId="home_toast" />

                <SideBarMob redirect={this.redirect} />

                <SideBar redirect={this.redirect} />

                <div className="lg:pl-72">

                    {this.context.addBlogModal || this.context.editBlogModal ? '' : <Header />}

                    <div className="px-2 sm:px-6 lg:px-8">
                        {
                            this.state.currentNavigation === 'blog' &&
                            <BlogData />
                        }
                        {
                            this.state.currentNavigation === 'category' &&
                            <Category />
                        }
                        {
                            this.state.currentNavigation === 'users' && <UsersList addUser={this.addUserModalBool} editUser={this.editUser} deleteUser={this.deleteUser} />
                        }
                    </div>
                </div>

            </>
        );
    }
}

export default Example;
