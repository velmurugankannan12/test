exports.blogIntroSchema = {
    type: "object",
    properties: {
        blog_title: { type: "string", pattern: "^\\S", minLength: 1 },
        img: { type: "object" },
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
    additionalProperties: false,
}

exports.categorySchema = {
    type: "string", pattern: "^\\S", minLength: 1
}

exports.authorSchema = {
    type: "object",
    properties: {
        id: { type: "string", pattern: "^\\S", minLength: 1 },
        email: { type: "string", pattern: "^\\S", minLength: 1 },
        firstname: { type: "string", pattern: "^\\S", minLength: 1 },
        lastname: { type: "string", pattern: "^\\S", minLength: 1 },
    },
}

exports.metaSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            content: {
                type: 'string', pattern: "^\\S", minLength: 1,
            },
        },
        required: ['type', 'content']
    }
};

exports.ogSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            content: {
                type: 'string', pattern: "^\\S", minLength: 1
            },
        },
    }
};

exports.twitterSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: { type: 'string', minLength: 1 },
            content: {
                type: 'string', pattern: "^\\S", minLength: 1
            },
        },
    }
};

exports.articleSchema = {
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

exports.blogUrlSchema = {
    type: "object",
    properties: {
        url_slug: { type: "string", pattern: "^\\S", minLength: 1 },
        canonical: { type: "string", pattern: "^\\S", minLength: 1 },
    },
    required: ["url_slug", "canonical"],
    additionalProperties: false,
};

exports.blogAdditionalSchema = {
    type: "object",
    properties: {
        stick_to_top: { type: "boolean" },
        allow_comment: { type: "boolean" },
        schedule: { type: "integer", },
    },
    required: ["stick_to_top", "allow_comment", "schedule"],
    additionalProperties: false,
};

exports.sectionSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            title: { type: "string" },
            content: {
                type: ["string", 'array', 'null'],
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

exports.faqSchema = {
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

exports.rcSchema = {
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

exports.testiSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            description: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
            img: { type: ["string", "null"], },
            name: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
            role: { type: ["string", "null"], pattern: "^\\S", minLength: 1 },
        },
        required: ["description", "name", "role"]
    }
};



