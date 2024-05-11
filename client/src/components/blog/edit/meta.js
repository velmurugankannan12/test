import React, { Component } from 'react'
import AppStateContext from '../../../utils/AppStateContext'

export default class Meta extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)

        this.state = {
            meta: []
        }
    }
    updateMetaContent = (value, type) => {
        const updatedMeta = this.state.meta.map(item => {
            if (item.type === type) {
                return { ...item, content: value };
            }
            return item;
        });

        this.setState({ meta: updatedMeta }, () => {
            const { setBlogMetaData } = this.context;
            setBlogMetaData(this.state.meta);
        });
    };
    componentDidMount() {
        const { editBlogData, setBlogMetaData } = this.context
        this.setState({ meta: editBlogData.meta })
        setBlogMetaData(editBlogData.meta)

    }
    render() {
        return (
            <div className='mt-2 '>
                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                    Meta
                </label>
                <div className='grid grid-cols-2 gap-x-6'>
                    {
                        this.state.meta.map((section, index) => (
                            <div key={index} className='ml-6 my-3 '>
                                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                                    {section.type.split('_')[1].replace(/\b\w/g, char => char.toUpperCase())}
                                </label>
                                <div className='relative'>
                                    <input value={section.content || ''}
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
