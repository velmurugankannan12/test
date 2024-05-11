// wordCountHelper.js

const wordCount = (data) => {
    let wordcount = [];

    if (data.blog_intro_desc) {
        data.blog_intro_desc.forEach((e) => {
            wordcount.push(e.description)
        })
    }

    data.sectionData && data.sectionData.forEach((section) => {

        if (section.type === 'section') {
            section.data.forEach((secData) => {
                if (secData.title === 'table') {
                    secData.content.forEach((secTable) => {
                        wordcount.push(secTable)
                    })
                } else if (secData.title === 'video' || secData.title === 'image') {

                } else {
                    wordcount.push(secData.content);
                }
            })
        }
        if (section.type === 'recommended_reading') {
            section.data.forEach((secData) => {
                wordcount.push(secData.description)
            })
        }
        if (section.type === 'testimonials') {
            section.data.forEach((secData) => {
                wordcount.push(secData.description)
            })
        }
        if (section.type === 'faq') {
            section.data.forEach((secData) => {
                wordcount.push(secData.question)
                wordcount.push(secData.answer)
            })
        }
    })


    let count = wordcount.reduce((total, text) => {
        // Split the text on spaces, punctuation, and line breaks to count words.
        const words = text.split(/[\s,.!?;:()]+/).filter(Boolean);
        return total + words.length;
    }, 0);

    const wordsPerMinute = 200;
    const additionalTime = Math.ceil(count / wordsPerMinute);

    // If the additional time is 0, it means the reading time is less than a minute.
    // We can adjust the message accordingly.
    const totalTime = additionalTime > 0 ? `${additionalTime} mins read` : 'Less than a minute read';

    return totalTime;
}

export { wordCount };
