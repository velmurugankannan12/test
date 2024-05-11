---

# Project Structure

This document outlines the structure of the project, providing a clear view of where specific parts of the code reside. Our framework is divided into three main parts: the client-side application built with React and TailwindCSS, the server-side application powered by Node.js, and optionally, shared code that is used by both the client and server.

## High-Level Overview

```
your-blog-framework/
├── client/                  # React frontend application
├── server/                  # Node.js backend application
└── shared/                  # Shared code between client and server (if any)
```

## Client (React + TailwindCSS)

The client directory contains all the code related to the front-end React application, styled with TailwindCSS.

```
client/
├── public/                  # Static files like index.html, robots.txt
├── src/
│   ├── components/          # Reusable UI components (e.g., Header, Footer)
│   ├── pages/               # Components representing entire pages
│   ├── hooks/               # Custom React hooks
│   ├── app/                 # Core application setup and providers
│   ├── styles/              # TailwindCSS utility and component styles
│   ├── utils/               # Utility functions and helpers
│   ├── assets/              # Static assets like images, fonts
│   ├── services/            # Services for external API calls to the backend
│   └── index.js             # Entry point for the React application
├── tailwind.config.js       # TailwindCSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts for the client
```

## Server (Node.js + ScyllaDB)

The server directory hosts the Node.js backend application, including REST API endpoints, models, and connections to ScyllaDB.

```
server/
├── src/
│   ├── config/              # Configuration files and environment variables
│   ├── controllers/         # Route controllers (logic for handling requests)
│   ├── models/              # Database models (ScyllaDB schema definitions)
│   ├── routes/              # Express routes, mapping URLs to controllers
│   ├── services/            # Business logic (e.g., database operations)
│   ├── middleware/          # Express middleware (e.g., authentication)
│   ├── utils/               # Utility functions and helpers
│   └── app.js               # Entry point for the Node.js application
├── scripts/                 # Utility scripts (e.g., database seeding)
└── package.json             # Dependencies and scripts for the server
```

## Shared (Optional)

If there's code that both the client and server share, such as utility functions, constants, or validation schemas, it can be placed in the shared directory.

```
shared/
├── constants/               # Constants shared between client and server
├── validations/             # Validation schemas or rules shared across
└── utils/                   # Utility functions needed on both sides
```

## Contributing

Contributors are encouraged to familiarize themselves with the project structure to navigate and add to the project effectively. For specific guidelines on contributing, please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) document.

---
