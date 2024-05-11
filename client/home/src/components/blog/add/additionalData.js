import React, { Component } from 'react'
import moment from 'moment';
import { CalendarIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import Calendar from 'react-calendar';
import AppStateContext from '../../../utils/AppStateContext';


export default class additionalData extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props)
        this.state = {
            addData: false,
            value: new Date(),
            sectionData: [],
        }
        this.addDataRef = React.createRef();
        this.handleOutsideClickAddData = this.handleOutsideClickAddData.bind(this);
    }
    onChangeDate = (e) => {
        this.setState({ selectDate: false });
        const { setPubDate } = this.context
        let date = parseInt(moment(e).format('x'))

        setPubDate(date)
    };
    calenderOpen = (e) => {
        e.stopPropagation();
        this.setState({ selectDate: true });
    }
    handleOutsideClickAddData(event) {
        const isCalendarClick = event.target.closest('.react-calendar') !== null;
        if (this.state.addData && this.addDataRef.current && !this.addDataRef.current.contains(event.target) && !isCalendarClick) {
            this.setState({ addData: false });
        }
    }

    stickCheckboxChange = () => {
        const { setStickTop, stickTop } = this.context
        setStickTop(!stickTop)
    };

    commentCheckboxChange = () => {
        const { setComment, comment } = this.context
        setComment(!comment)
    };

    handleEllipsisButtonClick = () => {
        this.setState(prevState => ({ addData: !prevState.addData }));
    };
    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClickAddData);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClickAddData);
    }
    render() {
        return (

            <div ref={this.addDataRef} className='p-3'>
                <button type="button" className="rounded-full bg-gray-500 p-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400" >
                    <EllipsisVerticalIcon onClick={this.handleEllipsisButtonClick} className='w-7 h-7 cursor-pointer' />
                </button>
                {
                    this.state.addData &&
                    <div className="w-1/5 ring-1 px-3 py-5 bg-slate-100 z-10 fixed right-4 mt-3 rounded-lg  h-auto">
                        <fieldset >
                            <div className="space-y-5">
                                <div className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input onChange={this.stickCheckboxChange} checked={this.context.stickTop} id="comments" aria-describedby="comments-description" name="comments" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-0" />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="comments" className="font-medium text-gray-900">
                                            Stick to top of the blog option
                                        </label>
                                    </div>
                                </div>
                                <div className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input onChange={this.commentCheckboxChange} checked={this.context.comment} id="candidates" aria-describedby="candidates-description" name="candidates" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-0" />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="candidates" className="font-medium text-gray-900">
                                            Allow comment option
                                        </label>
                                    </div>
                                </div>
                                <div className=" text-sm leading-10">
                                    <label className="font-medium text-gray-900">
                                        Select date for custom publish
                                    </label>
                                    {
                                        this.state.selectDate ?
                                            <div className=' max-w-[80%]'>
                                                <Calendar onChange={this.onChangeDate} value={this.context.pubDate ? moment(this.context.pubDate).format('MMMM DD,YYYY') : new Date()} />
                                            </div>
                                            :
                                            <div className="mt-0 flex items-center space-x-5">
                                                <CalendarIcon onClick={this.calenderOpen} className='w-6 h-6 text-slate-600 cursor-pointer' />
                                                <input className=' w-4/5 text-sm rounded-md' type="text" readOnly value={this.context.pubDate ? moment(this.context.pubDate).format('MMMM DD,YYYY') : ''} />
                                            </div>
                                    }
                                </div>
                            </div>
                        </fieldset>
                    </div>
                }
            </div>
        )
    }
}
