import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import moment from 'moment'
import { serverURL, fileURL } from '../config/config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))


export const renderHtml = async (res, blog) => {

    try {

        // Define the paths for the header and body HTML files
        const headerPath = path.join(__dirname, './templateHeader.html');
        const bodyPath = path.join(__dirname, './template.html');
        const footerPath = path.join(__dirname, './templateFooter.html');

        // Read the header and body HTML files asynchronously
        const [header, body, footer] = await Promise.all([
            fs.promises.readFile(headerPath, { encoding: 'utf-8' }),
            fs.promises.readFile(bodyPath, { encoding: 'utf-8' }),
            fs.promises.readFile(footerPath, { encoding: 'utf-8' })
        ]);

        res.send(`
        <html>
            <head>
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
                <meta property="og:image" :content="${fileURL}${blog.og[6].content}" />
                <meta property="og:image:secure_url" :content="${fileURL}${blog.og[7].content}" />
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
                <meta name="twitter:image" :content="${fileURL}${blog.twitter[5].content}" />
                <meta name="twitter:label1" content="Written by" />
                <meta name="twitter:data1" content="${blog.author.firstname + " " + blog.author.lastname}" />
                <meta name="twitter:label2" content="Time to read" />
                <meta name="twitter:data2" content="${blog.time_to_read}" />
                <link rel="icon" type="imgage/png" href="${serverURL}/public/website/img/fav.png" >
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="/public/website/css/blogHome.css" >
                <style>
.active {
  color: red; /* Highlight color */
  font-weight: bold;
}
</style>
            </head>

            <body>
                ${header}

                ${body}

                ${footer}

                <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/axios@1.6.8/dist/axios.min.js"></script>
                <script> let blogJson = ${JSON.stringify(blog)}  </script>
                <script type="module" src="/src/ssr/blogInnerScript.js"></script>
                <script type="module" src="/src/ssr/headerScript.js"></script>
                <script type="module" src="/src/ssr/footerScript.js"></script>
                
            </body>

        </html>
                    `);
    } catch {

    }

}

export const renderHtml404 = async (res) => {

    try {
        // Define the paths for the header and body HTML files
        const headerPath = path.join(__dirname, './templateHeader.html');
        const bodyPath = path.join(__dirname, './template404.html');
        const footerPath = path.join(__dirname, './templateFooter.html');

        // Read the header and body HTML files asynchronously
        const [header, body, footer] = await Promise.all([
            fs.promises.readFile(headerPath, { encoding: 'utf-8' }),
            fs.promises.readFile(bodyPath, { encoding: 'utf-8' }),
            fs.promises.readFile(footerPath, { encoding: 'utf-8' })
        ]);

        res.send(`
        <html>
        <head>
            <title>Page not found</title>
           
            <link rel="icon" type="imgage/png" href="${serverURL}/public/website/img/fav.png" >
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="/public/website/css/blogHome.css" >
        </head>

        <body>
            ${header}

            ${body}

            ${footer}

            <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/axios@1.6.8/dist/axios.min.js"></script>
            <script type="module" src="/src/ssr/blogInnerScript.js"></script>
            <script type="module" src="/src/ssr/headerScript.js"></script>
            <script type="module" src="/src/ssr/footerScript.js"></script>

        </body>

    </html>
        `)
    } catch {

    }

}