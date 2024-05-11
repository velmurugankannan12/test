import React, { Component } from 'react'
import _ from 'underscore'
import { axiosInstance } from '../../services/apiconfig'
import { errorNotify } from '../../utils/notify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userid: '',
            password: ''
        }
    }
    userid = (e) => {
        this.setState({ userid: e })
    }
    password = (e) => {
        this.setState({ password: e })
    }
    login = () => {
        let data = { userid: this.state.userid, password: this.state.password }
        if (_.isEmpty(this.state.userid) || _.isEmpty(this.state.password)) {
            errorNotify('please fill the details')
        } else {
            axiosInstance.post('/login', data).then((e) => {
                if (e.data.code === 200) {
                    localStorage.setItem('user', JSON.stringify(e.data.user))
                    window.location.href = e.data.redirect
                } else {
                    errorNotify('wrong user ID or Password')
                }
            })
        }
    }
    autoLogin = () => {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (userData && window.location.pathname !== '/home') {
            let data = { userid: userData.email, password: userData.password }
            axiosInstance.post('/login', data).then((e) => {
                if (e.data.code === 200) {
                    window.location.href = '/home'
                    localStorage.setItem('user', JSON.stringify(e.data.user))

                } else {
                    errorNotify('wrong user ID or Password')
                }
            })
        }
    }
    componentDidMount() {
        this.autoLogin()
    }
    render() {
        return (
            <div>
                <ToastContainer containerId="home_toast" />
                <div className='flex justify-center items-center h-screen'>
                    <div className='flex flex-col items-center justify-evenly h-80 w-auto px-8 border border-gray-200  rounded-lg shadow-lg'>
                        <img className='w-20 h-auto' src="/img/logo.png" alt="Logo" />
                        <input onChange={(e) => this.userid(e.target.value)} className='rounded-md border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0' type="text" placeholder='User ID' />
                        <input onChange={(e) => this.password(e.target.value)} className='rounded-md border border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-0' type="password" placeholder='Password' />
                        <button className='bg-red-400 py-2 text-white w-fit px-5 rounded' onClick={() => this.login()}>login</button>
                    </div>
                </div>
            </div>
        )
    }
}