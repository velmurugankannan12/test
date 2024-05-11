import React, { Component } from 'react'
import { blog_art_structure } from '../jsondata'
import AppStateContext from '../../../utils/AppStateContext'

export default class Art extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    updateArtContent = (index, value, type) => {
        const foundIndex = blog_art_structure.findIndex(item => item.type === type);
        if (foundIndex !== -1) {
            blog_art_structure[foundIndex].content = value;
            const { setBlogArtData } = this.context
            setBlogArtData(blog_art_structure)
        }
    }
    render() {
        return (
            <div className='mt-2'>
                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                    Article
                </label>
                <div className='grid grid-cols-2 gap-x-6'>
                    {
                        blog_art_structure.map((section, index) => (
                            <div key={index} className='ml-6 my-3'>
                                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                                    {section.type.split('_')[1].replace(/\b\w/g, char => char.toUpperCase())}
                                </label>
                                <div className='relative'>
                                    <input
                                        onChange={(e) => this.updateArtContent(index, e.target.value, section.type)}
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
