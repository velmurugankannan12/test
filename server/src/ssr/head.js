import moment from 'moment'
import { serverURL } from '../config/config.js'

export const head = (e) => {

    let blog = e

    const headSeo = `
    <title>${blog.meta[0].content}</title>
    <meta name="description" content="${blog.meta['1'].content}" />
    <meta name="keywords" content="${blog.meta[2].content}" />
    <meta name="robots" content="${blog.meta[3].content}" />
    <meta property="og:locale" content="${blog.og[0].content}" />
    <meta property="og:type" content="${blog.og[1].content}" />
    <meta property="og:title" content="${blog.og[2].content}" />
    <meta property="og:description" content="${blog.og[3].content}" />
    <meta property="og:url" content="${blog.og[4].content}" />
    <meta property="og:site_name" content="${blog.og[5].content}" />
    <meta property="og:image" :content="${serverURL}${blog.og[6].content}" />
    <meta property="og:image:secure_url" :content="${serverURL}${blog.og[7].content}" />
    <meta property="og:image:width" content="${blog.og[8].content}" />
    <meta property="og:image:height" content="${blog.og[9].content}" />
    <meta property="og:image:alt" content="${blog.og[10].content}" />
    <meta property="og:image:type" content="${blog.og[11].content}" />
    <meta property="article:tag" content="${blog.article[0].content}" />
    <meta property="article:section" content="${blog.article[1].content}" />
    <meta property="og:updated_time" content="${moment(parseInt(blog.additional_data.schedule)).format('YYYY-MM-DDTHH:mm:ssZ')}" />
    <meta property="article:published_time" content="${moment(parseInt(blog.additional_data.schedule)).format('YYYY-MM-DDTHH:mm:ssZ')}" />
    <meta property="article:modified_time" content="${moment(parseInt(blog.additional_data.schedule)).format('YYYY-MM-DDTHH:mm:ssZ')}" />
    <meta name="twitter:card" content="${blog.twitter[0].content}" />
    <meta name="twitter:title" content="${blog.twitter[1].content}" />
    <meta name="twitter:description" content="${blog.twitter[2].content}" />
    <meta name="twitter:site" content="${blog.twitter[3].content}" />
    <meta name="twitter:creator" content="${blog.twitter[4].content}" />
    <meta name="twitter:image" :content="${serverURL}${blog.twitter[5].content}" />
    <meta name="twitter:label1" content="Written by" />
    <meta name="twitter:data1" content="${blog.author.firstname + " " + blog.author.lastname}" />
    <meta name="twitter:label2" content="Time to read" />
    <meta name="twitter:data2" content="${blog.time_to_read}" />
    <link rel="icon" type="imgage/png" href="${serverURL}/public/website/img/fav.png" >
    <script src="https://cdn.tailwindcss.com"></script>`

    return headSeo
}