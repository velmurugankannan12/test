import React, { Component } from 'react';
import { Dialog, Transition, Disclosure } from '@headlessui/react';
import { CalendarIcon, ClockIcon, XMarkIcon, MinusSmallIcon, PlusSmallIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import AppStateContext from '../../../utils/AppStateContext';
import '../../../assets/scroll.css'
import moment from 'moment';
import { serverURL } from '../../../services/apiconfig'


class Example extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            blog_data: [],
            blog_faq: [],
            headers: [],
            bodyContent: [],
            toc: [],
            intro_img: null
        };
    }

    close = () => {
        const { setPreview } = this.context
        // setPreview(false)
        this.props.previewClose()
    }

    convertFileToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            return reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        }

    }

    componentDidMount() {


        if (this.props.previewData.blog_data) {

            if (typeof this.props.previewData.blog_intro.img === 'string' && this.props.previewData.blog_intro.img.includes('/public/blog')) {

                this.setState({ intro_img: this.props.previewData.blog_intro.img })

            } else {
                let file = this.props.previewData.blog_intro.img
                const reader = new FileReader();
                reader.onloadend = () => {
                    const fileData = reader.result;

                    this.setState({ intro_img: fileData })

                };
                if (file) {
                    reader.readAsDataURL(file);
                }
            }


            this.props.previewData.blog_data.forEach((e) => {
                if (e.type === 'faq') {
                    this.setState({ blog_faq: e.data })
                }
            })


            this.props.previewData.blog_data.forEach((e) => {
                if (e.type === 'section') {
                    e.data.forEach((secData) => {
                        if (secData.title === 'table') {
                            let data = secData.content
                            const colSize = secData.colm;
                            const headers = data.slice(0, colSize);
                            const bodyContent = data.slice(colSize);
                            this.setState({ headers: headers, bodyContent: bodyContent, tableBodyCount: bodyContent.length / parseInt(secData.colm), })
                        }
                        if (secData.title === 'heading' && secData.titleTag === 'h2') {
                            this.state.toc.push(secData.content)
                        }
                        if (typeof secData.content === 'object' && !Array.isArray(secData.content)) {

                            let file = secData.content
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const fileData = reader.result;

                                secData.content = fileData

                            };
                            if (file) {
                                reader.readAsDataURL(file);
                            }

                        }
                    })
                }
                if (e.type === 'testimonials') {
                    e.data.forEach((secData) => {
                        if (typeof secData.img === 'string' && secData.img.includes('/public/blog')) {
                            // If it's a string and includes '/public/blog', use it as is.
                            secData.img = secData.img;
                        } else if (secData.img instanceof Blob || secData.img instanceof File) {
                            // If it's a Blob or File, read it.
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const fileData = reader.result;
                                secData.img = fileData;
                            };
                            reader.readAsDataURL(secData.img);
                        }
                    });
                }
            })

        }


        this.setState({ blog_data: this.props.previewData.blog_data && this.props.previewData.blog_data })

    }

    render() {

        return (
            <Transition.Root show={this.props.preview}>
                <Dialog as="div" className="relative z-10 w-full" onClose={() => this.close()}>
                    <Transition.Child enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed left-72 inset-0 z-10 overflow-y-auto">
                        <div className="flex relative min-h-full h-full justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" className='w-[95%] h-[95%] relative rounded-lg  px-12 bg-[#f7f7f7] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pb-10' >
                                <div className=' fixed -ml-14 -mt-4 w-8 h-8 right-4 shadow-md rounded-full bg-white flex justify-center items-center cursor-pointer z-10' onClick={this.close}>
                                    <XMarkIcon className='w-5' />
                                </div>

                                {/* intro */}
                                <div className='flex flex-col gap-y-14 mt-5' >

                                    {/* title & posted time*/}
                                    <div className='flex'>
                                        <div className='w-3/4 flex'>
                                            <div className='w-11/12 pr-10'>
                                                <h1 className=' text-left text-[#2b2e33] text-[40px] font-medium leading-[1.25]'>
                                                    {this.props.previewData ? this.props.previewData.blog_intro.blog_title : ''}
                                                </h1>
                                            </div>
                                        </div>
                                        <div className='w-1/4 flex flex-col items-center justify-center'>
                                            <div className='gap-y-1 flex flex-col'>
                                                <div className='flex gap-x-2'>
                                                    <ClockIcon className='w-4 text-[#2BAC58]' />
                                                    <p className='text-xs text-[#898e99]'>{this.props.previewData ? this.props.previewData.time_to_read : ''}</p>
                                                </div>
                                                <div className='flex gap-x-2'>
                                                    <CalendarIcon className='w-4 text-[#2BAC58]' />
                                                    <p className='text-xs text-[#898e99]'>Posted on {moment(this.context.pubDate ? parseInt(this.context.pubDate) : new Date()).format('MMM DD, YYYY')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* blog intro img & author info */}
                                    <div className='flex'>
                                        <div className='w-3/4 flex'>
                                            {
                                                <div className='w-11/12 rounded-3xl overflow-hidden'>
                                                    {typeof this.state.intro_img === 'string' && this.state.intro_img.includes('/public/') ?
                                                        <img style={{ aspectRatio: '1.75' }} className='w-full object-contain' src={
                                                            serverURL + this.state.intro_img
                                                        } alt='' /> :
                                                        <img style={{ aspectRatio: '1.75' }} className='w-full object-contain' src={
                                                            this.state.intro_img} alt='' />
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div className='w-1/4 flex flex-col items-center justify-end'>
                                            <div className='flex flex-col gap-y-8'>
                                                <div className='bg-white w-16 h-40 rounded-lg shadow-md flex flex-col justify-evenly items-center'>
                                                    <img className='w-4 ' src="/img/soc_twi.webp" alt="twitter" />
                                                    <img className='w-4' src="/img/soc_ins.webp" alt="instagram" />
                                                    <img className='w-4' src="/img/soc_lin.webp" alt="linkedin" />
                                                    <img className='w-4' src="/img/soc_fac.webp" alt="facebook" />
                                                </div>
                                                {this.props.previewData.author &&
                                                    <div className='flex flex-col items-center justify-center gap-y-3 bg-white w-32 h-32 rounded-xl shadow-md'>
                                                        <div className='w-12 h-12 rounded-full overflow-hidden'>
                                                            {
                                                                this.props.previewData.author.photo ?

                                                                    <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={serverURL + this.props.previewData.author.photo} alt="Author" />

                                                                    : <UserCircleIcon className='w-full h-full text-[#e1e3e5]' />
                                                            }
                                                        </div>
                                                        <div className='text-center w-24 flex flex-col gap-y-1'>
                                                            <p className='text-xs font-medium whitespace-nowrap capitalize overflow-hidden overflow-ellipsis'>{this.props.previewData.author.firstname + ' ' + this.props.previewData.author.lastname}</p>
                                                            <p className='text-[11px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{this.props.previewData.author.role}</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex justify-around  gap-14 mt-20' >

                                    {/* Left table of contents & CTA */}
                                    <div className='w-1/4 flex flex-col gap-y-6'>
                                        {this.state.toc.length > 0 &&
                                            <div className='py-10 px-8 flex flex-col gap-y-4 bg-white shadow-md rounded-2xl text-left'>
                                                <p className='text-[#898e99] text-base font-medium'>Introduction</p>
                                                {this.state.toc.map((e, index) => (
                                                    <p key={index} className='text-[#898e99] text-base font-medium'>{e}</p>
                                                ))
                                                }
                                            </div>
                                        }
                                        <div className='bg-gradient-to-br from-[#15aa51] to-[#2489f3] h-64 w-full flex flex-col p-8 justify-between rounded-lg'>
                                            <p className='text-white text-base text-left'>Make your <br /> business call now</p>
                                            <p className='text-white text-2xl font-bold text-left'>
                                                Get started with our free trial
                                            </p>
                                            <div className='flex justify-start'>
                                                <button className='text-[#2b2e33] h-10 bg-white px-4 rounded-md uppercase text-sm font-bold'>
                                                    Book a free demo
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-3/4 gap-y-8 flex flex-col items-start'>

                                        {/* blog intro section */}
                                        <div className='flex flex-col justify-start gap-y-4'>
                                            {this.props.previewData.blog_intro ? this.props.previewData.blog_intro.description &&
                                                this.props.previewData.blog_intro.description.map((e, index) => (
                                                    <p key={index} className='text-left text-[#2b2e33] text-base'>
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: e.description
                                                                .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                                                                .replace(/(-- )(.*)[^:]/g, '<li style="padding-left: 10px; list-style-type: disc;">$2</li>')
                                                        }} />
                                                    </p>
                                                ))
                                                : ''}
                                        </div>

                                        {/* section */}
                                        {this.state.blog_data ?

                                            this.state.blog_data.map((e, index) => (
                                                <div key={index} className='flex flex-col gap-y-3 w-full'>

                                                    {e.type === 'recommended_reading' &&
                                                        <div className='flex w-full h-36'>
                                                            <div className='bg-gradient-to-br from-[#10d7e2] via-[#45b5e9]  to-[#9358f7] w-[180px] flex flex-col justify-end items-center rounded-l-xl'>
                                                                <img src="/img/blog_rec_read.png" className='h-auto w-14' alt="Recommended reading" />
                                                            </div>
                                                            <div className='bg-[#2b2e33] flex flex-col justify-center pl-8 gap-y-2 w-full rounded-r-xl'>
                                                                <div>
                                                                    <h2 className='text-[#f0f1f2] text-lg font-bold text-left'>
                                                                        Recommended reading
                                                                    </h2>
                                                                </div>
                                                                {
                                                                    e.data.map((e, index) => (
                                                                        <ul key={index} className='flex flex-col list-disc pl-8 gap-y-3'>
                                                                            <li className='text-[#f0f1f2] text-base text-left'>
                                                                                <a target='_blank' rel='noreferrer' href={e.link}>{e.description}</a>
                                                                            </li>
                                                                        </ul>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    }

                                                    {e.type === 'cta' &&
                                                        <div className='flex w-full my-4'>
                                                            <div className='bg-gradient-to-br from-[#15aa51] to-[#2489f3] h-36 w-full flex justify-evenly   rounded-xl'>
                                                                <div className=' flex flex-col justify-center items-start'>
                                                                    <p className='text-white'>Make your business call now</p>
                                                                    <h3 className='text-white text-3xl font-bold'>
                                                                        Get started with our free trial
                                                                    </h3>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <button className='cursor-pointer uppercase text-sm text-[#2b2e33] font-bold bg-white w-fit h-10 px-4 rounded-[4px]'>
                                                                        start free TRail
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                    {e.type === 'testimonials' &&
                                                        <div className='flex w-[90%] h-auto py-10 px-5 my-6 gap-x-5 border-t-[2px] border-b-[2px]'>
                                                            <div className='flex items-start'>
                                                                {/* <AtSymbolIcon className='w-10' /> */}
                                                                <img src="/img/testimonial.png" className='w-40' alt="Testimonial" />
                                                            </div>
                                                            <div className='flex flex-col gap-y-5'>
                                                                <div>
                                                                    <p className='text-[#222222] text-2xl font-semibold font-dmsans text-left'>
                                                                        {e.data[0].description}
                                                                    </p>
                                                                </div>

                                                                <div className='flex gap-x-5'>
                                                                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                                                                        {typeof e.data[0].img === 'string' && e.data[0].img.includes('/public/blog') ?
                                                                            <img className='w-full h-full object-contain' src={serverURL + e.data[0].img} alt="" />
                                                                            :
                                                                            <img className='w-full h-full object-contain' src={e.data[0].img} alt="" />

                                                                        }
                                                                    </div>
                                                                    <div className='flex flex-col gap-y-1 items-start'>
                                                                        <p className='text-[#222222] font-semibold'>{e.data[0].name}</p>
                                                                        <p className='text-[#6b727f] text-sm'>
                                                                            {e.data[0].role}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                    {
                                                        e.type === 'section' ?
                                                            <>
                                                                {e.data.map((secData, secIndex) => (
                                                                    <div key={secIndex}>
                                                                        {
                                                                            secData.title === 'heading' ?
                                                                                <secData.titleTag className={`text-[#2b2e33] ${secData.titleTag === 'h2' ? 'text-2xl' : 'text-xl'} font-bold text-left`}>
                                                                                    {secData.content}
                                                                                </secData.titleTag>
                                                                                :
                                                                                secData.title === 'description' ? (
                                                                                    <p className='text-[#2b2e33] text-left'>
                                                                                        <span dangerouslySetInnerHTML={{
                                                                                            __html: secData.content
                                                                                                .replace(/\*(.*?)\*/g, '<strong>$1</strong>') // Bold text enclosed in '*'
                                                                                                .replace(/(-- )(.*)[^:]/g, '<li style="padding-left: 10px; list-style-type: disc;">$2</li>') // '-. ' followed by content
                                                                                            // Reduce space between '.' and content starting letter
                                                                                        }} />
                                                                                    </p>
                                                                                )
                                                                                    :
                                                                                    secData.title === 'image' ?
                                                                                        <div className='w-11/12 overflow-hidden rounded-2xl my-2'>

                                                                                            {
                                                                                                typeof secData.content === 'string' && secData.content.includes('/public/blog') ?
                                                                                                    <img className='' src={serverURL + secData.content} alt="" />
                                                                                                    :
                                                                                                    <img className='' src={secData.content} alt="" />

                                                                                            }
                                                                                        </div>
                                                                                        :
                                                                                        secData.title === 'video' ?
                                                                                            <div className='w-11/12 overflow-hidden rounded-2xl my-2'>
                                                                                                {
                                                                                                    typeof secData.content === 'string' && secData.content.includes('/public/blog') ?
                                                                                                        <video controls className='' src={serverURL + secData.content} alt="" />
                                                                                                        :
                                                                                                        <video controls className='' src={secData.content} alt="" />
                                                                                                }
                                                                                            </div>
                                                                                            :
                                                                                            secData.title === 'table' ?

                                                                                                <div className="flow-root">
                                                                                                    <div className="overflow-x-auto">
                                                                                                        <div className="inline-block min-w-full py-2">
                                                                                                            <div className="overflow-hidden shadow rounded-lg">
                                                                                                                <table className="min-w-full">
                                                                                                                    <thead className="bg-[#2b2e33]">
                                                                                                                        <tr className='divide-x'>
                                                                                                                            {this.state.headers.map((header, index) => (
                                                                                                                                <th key={index} scope="col" className={`w-[${100 / secData.colm}%] p-4 text-center text-base font-bold text-white`}>{header}</th>
                                                                                                                            ))}
                                                                                                                        </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody className="divide-x divide-y border-green-600 bg-white">
                                                                                                                        {[...Array(this.state.tableBodyCount)].map((_, rowIndex) => (
                                                                                                                            <tr key={rowIndex} className='divide-x'>
                                                                                                                                {this.state.bodyContent
                                                                                                                                    .slice(rowIndex * parseInt(secData.colm), rowIndex * parseInt(secData.colm) + parseInt(secData.colm))
                                                                                                                                    .map((item, colIndex) => (
                                                                                                                                        <td key={colIndex} className={`w-${100 / secData.colm} text-sm text-gray-900 p-4`}>{item}</td>
                                                                                                                                    ))}
                                                                                                                            </tr>
                                                                                                                        ))}
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                :
                                                                                                secData.title === 'button' &&
                                                                                                <div className='flex justify-start mt-3'>
                                                                                                    <button className=' uppercase text-white text-sm font-bold rounded-[4px] py-3 px-4 font-heebo bg-gradient-to-r from-[#18b04c] to-[#288df9]'>
                                                                                                        try your free trial
                                                                                                    </button>
                                                                                                </div>

                                                                        } </div>
                                                                ))}
                                                            </> : ''}
                                                </div>
                                            )) : ''
                                        }

                                        {/* FAQ */}
                                        {
                                            this.state.blog_faq.length > 0 &&
                                            <div className="w-full divide-y divide-gray-900/10 my-6">
                                                <h2 className="text-2xl text-left font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions (FAQ)</h2>
                                                <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                                                    {this.state.blog_faq.map((faq, index) => (
                                                        <Disclosure as="div" key={index} className="pt-6">
                                                            {({ open }) => (
                                                                <>
                                                                    <dt>
                                                                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-[#2b2e33]">
                                                                            <span className="text-xl font-medium leading-7">{faq.question}</span>
                                                                            <span className="ml-6 flex h-7 items-center">
                                                                                {open ? (
                                                                                    <MinusSmallIcon className="h-6 w-6 text-[#77bf49]" aria-hidden="true" />
                                                                                ) : (
                                                                                    <PlusSmallIcon className="h-6 w-6 text-[#77bf49]" aria-hidden="true" />
                                                                                )}
                                                                            </span>
                                                                        </Disclosure.Button>
                                                                    </dt>
                                                                    <Disclosure.Panel as="dd" className="mt-2 pr-12 text-left">
                                                                        <p className="text-base leading-7 text-[#2b2e33]">{faq.answer}</p>
                                                                    </Disclosure.Panel>
                                                                </>
                                                            )}
                                                        </Disclosure>
                                                    ))}
                                                </dl>
                                            </div>
                                        }
                                    </div>
                                </div>

                                {/* comment section */}

                                {
                                    this.props.previewData.additional_data.allow_comment === 'true' &&
                                    <div className='bg-white w-full h-auto shadow-sm rounded-xl py-5 gap-y-5 my-14 flex  flex-col px-8'>
                                        <div className='flex justify-start'>
                                            <h3 className='text-2xl text-[#2b2e33] font-bold font-heebo'>
                                                Leave a comment
                                            </h3>
                                        </div>
                                        <div className='flex flex-col gap-y-3 items-start w-full'>
                                            <label className='text-[#6b727f]'>
                                                Comment*
                                            </label>
                                            <textarea className='w-full bg-[#f6f6f6] border-[#e1e3e5] rounded-[10px]' rows="5">

                                            </textarea>
                                        </div>
                                        <div className='flex gap-x-12'>
                                            <div className='flex flex-col gap-y-3 items-start w-full'>
                                                <label className='text-[#6b727f]'>
                                                    Name*
                                                </label>
                                                <input className='w-full bg-[#f6f6f6] border-[#e1e3e5] rounded-[10px]'>

                                                </input>
                                            </div>
                                            <div className='flex flex-col gap-y-3 items-start w-full'>
                                                <label className='text-[#6b727f]'>
                                                    Email*
                                                </label>
                                                <input className='w-full bg-[#f6f6f6] border-[#e1e3e5] rounded-[10px]'>

                                                </input>
                                                <label className='text-[#a6aab2]'>
                                                    The email address you provide will not be published
                                                </label>
                                            </div>
                                        </div>
                                        <div className='flex justify-start'>
                                            <button className=' uppercase text-white text-sm font-bold rounded-[4px] py-4 px-10 font-heebo bg-gradient-to-r from-[#18b04c] to-[#288df9]'>
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                }

                            </Transition.Child>
                        </div>
                    </div>
                </Dialog >
            </Transition.Root >
        );
    }
}

export default Example;
