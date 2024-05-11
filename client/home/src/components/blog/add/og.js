import React, { Component } from 'react'
import { blog_og_structure } from '../jsondata'
import AppStateContext from '../../../utils/AppStateContext'

export default class Og extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)

        this.state = {
            ogData: blog_og_structure
        }
    }
    updateOgContent = (e, type) => {
        const { value, files } = e.target;
        const foundIndex = this.state.ogData.findIndex(item => item.type === type);

        if (foundIndex !== -1) {
            const updatedOgData = [...this.state.ogData];

            if (files && files.length > 0) {
                if (files[0].size <= 200 * 1024) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        updatedOgData[foundIndex].content = files[0]

                        const { setBlogOgData } = this.context
                        setBlogOgData(updatedOgData)
                        this.setState({ ogData: updatedOgData });
                    };
                    reader.readAsDataURL(files[0]);
                } else {
                    e.target.value = ''
                    alert('File size should not be exceed 200 KB.');
                }
            } else {
                updatedOgData[foundIndex].content = value;
                const { setBlogOgData } = this.context
                setBlogOgData(updatedOgData)
                this.setState({ ogData: updatedOgData });
            }
        }
    }

    componentDidMount() {
        console.log(this.state.ogData)
    }

    render() {
        return (
            <div className='mt-2'>
                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                    Og
                </label>

                <div className='grid grid-cols-2 gap-x-6'>
                    {
                        this.state.ogData.map((section, index) => (
                            <div key={index} className='ml-6 my-3'>
                                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                                    {section.type.split('_').slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </label>
                                <div className='relative'>
                                    {section.type === 'og_image' || section.type === 'og_image_secure_url' ?
                                        <input
                                            onChange={(e) => this.updateOgContent(e, section.type)} type='file' accept='.webp, .png'
                                            className={`block w-full rounded-md text-xs py-[9px] px-3.5 text-gray-900 shadow-sm ring-1 border-none bg-white `}
                                        /> :
                                        <input
                                            onChange={(e) => this.updateOgContent(e, section.type)} pattern="[0-9]" type={section.type === 'og_image_width' || section.type === 'og_image_height' ? 'number' : 'text'}
                                            className={`block w-full rounded-md  py-2 px-3.5 text-gray-900 shadow-sm ring-1 border-none bg-white `}
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
