import React, { Component } from 'react'
import { PlusIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import AppStateContext from '../../utils/AppStateContext';
import AddUserModal from './addUser';
import UserEditConfirm from './userEditConfirm';
import UserDeleteConfirm from './userDeleteConfirm';
import { axiosInstance } from '../../services/apiconfig';
export default class users extends Component {

    static contextType = AppStateContext;

    constructor(props) {
        super(props)

        this.state = {
            userData: '',
            user: []
        }
    }

    addUser = () => {
        const { setAddUserModal } = this.context;
        setAddUserModal(true)
    }

    editUser = (e) => {
        const { setEditUserModal, setEditUserData } = this.context;
        setEditUserModal(true)
        setEditUserData(e)
    }

    deleteUser = (e) => {
        const { setDeleteUserModal, setEditUserData } = this.context;
        setDeleteUserModal(true)
        setEditUserData(e)
    }

    reload = () => {
        setTimeout(() => {
            axiosInstance.get('/userList').then((e) => {
                this.setState({ user: e.data.users })
            }).catch((e) => { })
        }, 1000)
    }

    componentDidMount() {
        axiosInstance.get('/userList').then((e) => {
            this.setState({ user: e.data.users })
        }).catch((e) => { })
    }

    render() {
        return (
            <div className="bg-white">
                {
                    <AddUserModal reload={this.reload} />
                }
                {
                    <UserDeleteConfirm reload={this.reload} />
                }
                {
                    <UserEditConfirm reload={this.reload} />
                }
                <div className="mx-auto max-w-8xl px-6 lg:px-8">
                    <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        <div style={{ height: this.state.user.length === 0 ? '230px' : 'auto' }} onClick={this.addUser} className=' sm:h-auto cursor-pointer'>
                            <div className=' space-x-3 rounded-2xl cursor-pointer border border-[#f58f8f] h-full'>
                                <div className=' flex flex-col space-y-5 justify-center items-center h-full' >
                                    <div className=' bg-[#f0f1f2] p-2 rounded-2xl'>
                                        <PlusIcon className="h-12 w-12 text-gray-900" aria-hidden="true" />
                                    </div>
                                    <div>
                                        Add User
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.user.map((person, index) => (
                            <div key={index} className=' h-full px-3 py-4 flex flex-col justify-center rounded-2xl border border-gray'>
                                {
                                    person.photo ?
                                        <div className='mb-2 mt-[7px] w-full flex justify-center'>
                                            <div className=' rounded-full overflow-hidden'>
                                                <img className='h-16 w-16 object-contain' src={'http://localhost:4000' + person.photo} alt='user profile' />
                                            </div>
                                        </div>
                                        :
                                        <UserCircleIcon className=' h-20 w-auto text-[#e1e3e5]' />
                                }

                                <div className='flex flex-col justify-center items-center'>
                                    <h3 className=" capitalize text-lg font-semibold leading-8 tracking-tight text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">{person.firstname + ' ' + person.lastname}</h3>
                                    <p className=" capitalize text-base leading-7 text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{person.role}</p>
                                </div>
                                <div className=' space-x-3 mt-3 flex justify-center'>
                                    <button onClick={() => this.editUser(person)} type="button" className=" p-2.5" >
                                        <span className="sr-only">Edit</span>
                                        <PencilSquareIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                                    </button>
                                    <button onClick={() => this.deleteUser(person)} type="button" className=" p-2.5">
                                        <span className="sr-only">Delete</span>
                                        <TrashIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
