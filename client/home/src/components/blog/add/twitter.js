import React, { Component } from 'react'
import { blog_twitter_structure } from '../jsondata'
import AppStateContext from '../../../utils/AppStateContext'


export default class meta extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)

        this.state = {
            twitterData: blog_twitter_structure
        }
    }
    updateTwitterContent = (e, type) => {
        const { value, files } = e.target;
        if (!Array.isArray(this.state.twitterData)) {
            return;
        }

        const foundIndex = this.state.twitterData.findIndex(item => item.type === type);
        if (foundIndex !== -1) {
            const updatedTwitterData = [...this.state.twitterData];

            if (files && files.length > 0) {
                if (files[0].size <= 200 * 1024) {
                    updatedTwitterData[foundIndex].content = files[0];
                    const { setBlogTwitterData } = this.context;
                    if (setBlogTwitterData) {
                        setBlogTwitterData(updatedTwitterData);
                    }
                    this.setState({ twitterData: updatedTwitterData });
                } else {
                    e.target.value = ''
                    alert('File size should not be exceed 200 KB.');
                }
            } else {
                updatedTwitterData[foundIndex].content = value;
                const { setBlogTwitterData } = this.context;
                if (setBlogTwitterData) {
                    setBlogTwitterData(updatedTwitterData);
                }
                this.setState({ twitterData: updatedTwitterData });
            }
        }
    };

    render() {
        return (
            <div className='mt-2'>
                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                    Twitter
                </label>

                <div className='grid grid-cols-2 gap-x-6'>
                    {
                        blog_twitter_structure.map((section, index) => (
                            <div key={index} className='ml-6 my-3'>
                                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                                    {section.type && section.type.split('_')[1].replace(/\b\w/g, char => char.toUpperCase())}
                                </label>
                                <div className='relative'>
                                    {section.type === 'twitter_image' ?
                                        <input name='img'
                                            onChange={(e) => this.updateTwitterContent(e, section.type)} type='file' accept='.webp, .png'
                                            className={`block w-full rounded-md text-xs py-[9px] px-3.5 text-gray-900 shadow-sm ring-1 border-none bg-white `}
                                        /> :
                                        <input
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
