import React, { Component } from 'react'
import AppStateContext from '../../../utils/AppStateContext'


export default class meta extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)

        this.state = {
            twitterData: []
        }
    }
    updateTwitterContent = (e, type) => {
        const { value, files } = e.target;
        const foundIndex =  this.state.twitterData.findIndex(item => item.type === type);

        if (foundIndex !== -1) {
            const updatedTwitterData = [...this.state.twitterData]; // Make a copy of the twitterData array

            if (files && files.length > 0) {
                // Handle file data

                updatedTwitterData[foundIndex].content = files[0]; // Update the content with file data

                const { setBlogTwitterData } = this.context
                setBlogTwitterData(updatedTwitterData)
                // this.setState({ twitterData: updatedTwitterData }); // Update the state with the updated twitterData array
                // Read the file as a data URL
            } else {
                // Handle text data
                updatedTwitterData[foundIndex].content = value; // Update the content with text data
                const { setBlogTwitterData } = this.context
                setBlogTwitterData(updatedTwitterData)
                this.setState({ twitterData: updatedTwitterData }); // Update the state with the updated twitterData array
            }

        }
    }
    componentDidMount() {
        const { editBlogData, setBlogTwitterData } = this.context
        this.setState({ twitterData: editBlogData.twitter })
        setBlogTwitterData(editBlogData.twitter)
    }
    render() {
        return (
            <div className='mt-2'>
                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                    Twitter
                </label>

                <div className='grid grid-cols-2 gap-x-6'>
                    {
                        this.state.twitterData.map((section, index) => (
                            <div key={index} className='ml-6 my-3'>
                                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                                    {section.type.split('_')[1].replace(/\b\w/g, char => char.toUpperCase())}
                                </label>
                                <div className='relative'>
                                    {section.type === 'twitter_image' ?
                                        <input name='img'
                                            onChange={(e) => this.updateTwitterContent(e, section.type)} type='file' accept='.webp, .png'
                                            className={`block w-full rounded-md text-xs py-[9px] px-3.5 text-gray-900 shadow-sm ring-1 border-none bg-white `}
                                        /> :
                                        <input value={section.content || ''}
                                            onChange={(e) => this.updateTwitterContent(e, section.type)}
                                            className={`block w-full rounded-md  px-3.5 py-2 text-gray-900 shadow-sm ring-1 border-none bg-white `}
                                        />
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}
