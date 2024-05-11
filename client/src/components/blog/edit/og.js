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
            const updatedOgData = [...this.state.ogData]; // Make a copy of the ogData array

            if (files && files.length > 0) {
                // Handle file data

                updatedOgData[foundIndex].content = files[0]; // Update the content with file data

                const { setBlogOgData } = this.context
                setBlogOgData(updatedOgData)
                this.setState({ ogData: updatedOgData }); // Update the state with the updated ogData array
                // Read the file as a data URL
            } else {
                // Handle text data
                updatedOgData[foundIndex].content = value; // Update the content with text data
                const { setBlogOgData } = this.context
                setBlogOgData(updatedOgData)
                this.setState({ ogData: updatedOgData }); // Update the state with the updated ogData array
            }

        }
    }

    fileUpload = (e, type) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const fileData = reader.result;
            const updatedSectionData = blog_og_structure.map(og => {
                if (og.type === type) {
                    return { ...og, content: fileData }
                }
                return og
            })
            const { setBlogOgData } = this.context
            setBlogOgData(updatedSectionData)
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    componentDidMount() {
        const { editBlogData, setBlogOgData } = this.context
        this.setState({ ogData: editBlogData.og })
        setBlogOgData(editBlogData.og)
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
                                            onChange={(e) => this.updateOgContent(e, section.type)} type='file'
                                            className={`block w-full rounded-md text-xs py-[9px] px-3.5 text-gray-900 shadow-sm ring-1 border-none bg-white `}
                                        /> :
                                        <input value={section.content || ''}
                                            onChange={(e) => this.updateOgContent(e, section.type)} pattern="[0-9]{10}" type={section.type === 'og_image_width' || section.type === 'og_image_height' ? 'number' : 'text'}
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
