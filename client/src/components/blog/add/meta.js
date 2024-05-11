import React, { Component } from 'react'
import { blog_meta_structure } from '../jsondata'
import AppStateContext from '../../../utils/AppStateContext'

export default class Meta extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    updateMetaContent = (value, type) => {
        const foundIndex = blog_meta_structure.findIndex(item => item.type === type);
        if (foundIndex !== -1) {
            blog_meta_structure[foundIndex].content = value;
            const { setBlogMetaData } = this.context
            setBlogMetaData(blog_meta_structure)
        }
    }
    render() {
        return (
            <div className='mt-2 '>
                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                    Meta
                </label>
                <div className='grid grid-cols-2 gap-x-6'>
                    {
                        blog_meta_structure.map((section, index) => (
                            <div key={index} className='ml-6 my-3 '>
                                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                                    {section.type.split('_')[1].replace(/\b\w/g, char => char.toUpperCase())}
                                </label>
                                <div className='relative'>
                                    <input
                                        onChange={(e) => this.updateMetaContent(e.target.value, section.type)}
                                        className={`block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 border-none bg-white `}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}
