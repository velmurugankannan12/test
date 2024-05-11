const blogIntroSchema = {
    type: "object",
    properties: {
        blog_title: { type: "string", pattern: "^\\S", minLength: 1 },
        img: { type: ['object', 'string'], pattern: "^\\S", minLength: 1 },
        img_alt: { type: "string", pattern: "^\\S", minLength: 1 },
        description: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    description: { type: 'string', pattern: "^\\S", minLength: 1 }
                }
            }
        },
    },
    required: ["img", "img_alt", "description", 'blog_title'],
}

const categorySchema = {
    type: "string", pattern: "^\\S", minLength: 1
}

const authorSchema = {
    type: "object",
    properties: {
        id: { type: "string", pattern: "^\\S", minLength: 1 },
        // photo: { type: "string", pattern: "^\\S", minLength: 1 },
        email: { type: "string", pattern: "^\\S", minLength: 1 },
        firstname: { type: "string", pattern: "^\\S", minLength: 1 },
        lastname: { type: "string", pattern: "^\\S", minLength: 1 },
        // bio: { type: "string", pattern: "^\\S", minLength: 1 },
    },
}

const metaSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            content: {
                type: 'string', pattern: "^\\S", minLength: 1,
                // anyOf: [
                //     { maxLength: 100, minLength: 1 },
                //     { maxLength: 200, minLength: 1 },
                //     { maxLength: 50, minLength: 1 },
                //     { maxLength: 20, minLength: 1 },
                // ],
            },
        },
        required: ['type', 'content']
    }
};

const ogSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            content: {
                type: ['string', 'object'], pattern: "^\\S", minLength: 1
            },
        },
        // required: ['type', 'content']
    }
};

const twitterSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            content: {
                type: ['string', 'object'], pattern: "^\\S", minLength: 1
            },
        },
        // required: ['type', 'content']
    }
};

const articleSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            content: {
                type: 'string', pattern: "^\\S", minLength: 1
            },
        },
        required: ['type', 'content']
    }
};

const blogUrlSchema = {
    type: "object",
    properties: {
        url_slug: { type: "string", pattern: "^\\S", minLength: 1 },
        canonical: { type: "string", pattern: "^\\S", minLength: 1 },
    },
    required: ["url_slug", "canonical"],
    additionalProperties: false,
};

const blogAdditionalSchema = {
    type: "object",
    properties: {
        stick_to_top: { type: "boolean" },
        allow_comment: { type: "boolean" },
        schedule: { type: ["integer", 'string'], },
    },
    required: ["stick_to_top", "allow_comment", "schedule"],
    additionalProperties: false,
};

const sectionSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            title: { type: "string" },
            content: {
                type: ["string", 'array', 'object', 'null'],
                items: {
                    type: "string",
                    pattern: "^\\S",
                    minLength: 1
                },
                pattern: "^\\S", minLength: 1
            },
            titleTag: { type: "string" },
            alt: { type: "string", pattern: "^\\S", minLength: 1 },
            link: { type: "string", pattern: "^\\S", minLength: 1 }
        },
    }
};

const faqSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            question: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
            answer: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
        },
        required: ["question", "answer"]
    }
};

const rcSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            description: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
            link: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
        },
        required: ["description", "link"]
    }
};

const testiSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            description: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
            img: { type: ["string", "object"], },
            name: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
            role: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
        },
        required: ["description", "name", "role"]
    }
};



export { blogIntroSchema, metaSchema, ogSchema, twitterSchema, articleSchema, categorySchema, authorSchema, blogUrlSchema, blogAdditionalSchema, sectionSchema, faqSchema, rcSchema, testiSchema }