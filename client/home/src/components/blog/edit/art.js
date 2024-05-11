import React, { Component } from 'react'
import AppStateContext from '../../../utils/AppStateContext'

export default class Art extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)

        this.state = {
            art: []
        }
    }
    updateArtContent = (value, type) => {
        const updatedArt = this.state.art.map(item => {
            if (item.type === type) {
                return { ...item, content: value };
            }
            return item;
        });

        this.setState({ art: updatedArt }, () => {
            const { setBlogArtData } = this.context;
            setBlogArtData(this.state.art);
        });
    };
    componentDidMount() {
        const { editBlogData, setBlogArtData } = this.context
        this.setState({ art: editBlogData.article })
        setBlogArtData(editBlogData.article)
    }
    render() {
        return (
            <div className='mt-2'>
                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                    Article
                </label>
                <div className='grid grid-cols-2 gap-x-6'>
                    {
                        this.state.art.map((section, index) => (
                            <div key={index} className='ml-6 my-3'>
                                <label className="block text-sm font-semibold capitalize leading-6 text-gray-900">
                                    {section.type.split('_')[1].replace(/\b\w/g, char => char.toUpperCase())}
                                </label>
                                <div className='relative'>
                                    <input value={section.content || ''}
                                        onChange={(e) => this.updateArtContent(e.target.value, section.type)}
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
