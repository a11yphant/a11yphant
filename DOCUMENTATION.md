<img src="services/site/public/images/logo/a11yphant_Logo_pictorial-mark.png" height="138">

# Documentation

Everything you need to know to setup the project.

<hr style="color:white; height:1.5px; width:100%;"/>

## Table of Contents

- [General Information](#general-information)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Coding Conventions](#coding-conventions)
    - [HTML](#html)
        - [Class Order](#class-order)
    - [CSS](#css)
    - [Testing](#testing)
    - [Commit Messages](#commit-messages)
    - [Branches](#branches)

<hr style="color:white; height:1.5px; width:100%;"/>


## General Information

Technically, a11yphant is split into two applications:

1. The **API** (Backend)
2. The **Site** (Frontend)

Both applications are written in [Typescript](https://www.typescriptlang.org).
The **Site** uses the React framework [NextJS](https://nextjs.org), [GraphQL](https://graphql.org/) and [Tailwind](https://tailwindcss.com/).
The **API** uses the Node framework [NestJS](https://nestjs.com). The **API** also uses [Prisma](https://www.prisma.io) and GraphQL. [PostgreSQL](https://www.postgresql.org/) is used as the database. Recently the API was merged into the site application and is now running in a NextJS API route.

## Prerequisites

`nvm` must be installed for our setup script to work correctly ([Setup Instructions](https://github.com/nvm-sh/nvm#installing-and-updating)).

## Setup

To setup the project follow these steps:

1. Clone the repository.
```bash
git clone git@github.com:<your-username>/a11yphant.git
```

2. Make sure you completed all steps from the [prerequisites](#prerequisites).

3. Make sure that Docker is running.

4. Run the install script.
```bash
# Installs the correct node version, all packages and creates symlinks
./install.sh
```

> **Recommendation:** It is recommended to add one of the following scripts to your `.bashrc` or `.zshrc`: (1) [bash](https://github.com/nvm-sh/nvm#bash) or (2) [zsh](https://github.com/nvm-sh/nvm#zsh). These scripts automatically change to the correct Node version when entering this project.

5. Start the application.
```bash
# Start the app in dev mode
npm run dev
```

6. Import the existing challenges into the database.
```bash
# To load the existing challenges into the empty database, run the following command:
npm run import-challenges
```

7. Your application is now up and running at [http://localhost:3001](http://localhost:3001). You can also explore the API using GraphQL Playground at [http://localhost:3001/graphql](http://localhost:3001/graphql).

## Coding Conventions

We follow some coding conventions within this project. We try to use a uniform system for our commits and branch names. With this system we hope to achieve better readable, easy to follow and easy to understand messages when looking through the project history.


### HTML

Please always keep in mind to write accessible semantic HTML within your React components.

#### Class Order

When assigning Tailwind classes to an HTML element, they must be in a specific order. In addition, they must be wrapped and separated inside `clsx{("")}`, which is an npm package we use to have a more visually pleasing structure. 

```JSX
// an example:
<a
 className={clsx("my-8 font-sans", "hover:text-primary-light","focus-rounded-instead-of-underline", "md:my-0")}
>
    info@a11yphant.com
</a>
```

The order of classes within `clsx` is as follows:

1. classes that don't fit into any other bullet point category (like positioning, colors, fonts, etc.)
2. animation stuff like `group`, `transition`, etc.
3. `Hover` styles
4. `Focus` styles
5. custom Tailwind classes
6. Breakpoint `xs`
7. Breakpoint `sm`
8. Breakpoint `md`
9. Breakpoint `lg`
10. Breakpoint `xl`
11. Breakpoint `2xl`


Keep in mind to only use classes you really need. Additionally, always verify that your components are responsive. When implementing responsive styles, note that we use a mobile-first breakpoint system.

### CSS

We use Tailwind for styling. If you want to set global variables you can do so in the `tailwind.config.js` file. Some very specific custom stylings can be found in the folder *Styles* within the **Site** application. This folder contains: 
- a SCSS file that imports all fonts: `fonts.scss`
- a SCSS file for custom stylings (like media queries or custom focus styles): `custom.scss`
- a SCSS file that sets some global styles (for headings, text-length, etc.): `global.scss`

### Testing

We write tests in the frontend and the backend to ensure code quality. We primarily have the following tests across our two applications:
- **API**
    - Unit Tests
    - Integration Tests (with the DB and business logic)
    - Service Tests (for important GraphQL queries)
- **Site**
    - Component Tests
- **Global**
    - End-to-End Tests that test the core functionality of a11yphant

> **Note:** To get a feature merged, it is mandatory to write a meaningful test. 

To see if your written test passes or fails, you can go to the folder of the specific service you are working in (**API**, **Site**) and run the following command:
```bash
npm run test:watch
```

### Commit Messages

We try to commit changes in logical chunks. Our commit messages are formatted as follows:

```bash
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Please note that:**

- The HEADER is a single line of max. 50 characters that contains a succinct description of the change. It
contains 
    1. a type
    2. an optional scope
    3. and a subject
- `<type>` describes the kind of change that this commit is providing. Allowed types are:
    - `feat`: new feature for the user, not a new feature for build script
    - `fix`: bug fix for the user, not a fix to a build script
    - `docs`: changes to the documentation
    - `style`: formatting, missing semi colons, etc; no production code change
    - `refactor`: refactoring production code, eg. renaming a variable
    - `test`: adding missing tests, refactoring tests; no production code change
    - `chore`: updating grunt tasks etc; no production code change
- `<scope>` can be anything specifying the place of the commit change
- `<subject>` is a very short description of the change, in the following format:
    - imperative, present tense: “change” not “changed”/“changes"
    - no capitalized first letter
    - no dot (.) at the end
- The BODY should include the motivation
for the change and contrast this with previous behavior and must be
phrased in imperative present tense
- The FOOTER should contain any information about Breaking Changes and is also the place to reference GitHub issues that this commit closes

More information on [Git Commit Msg](https://karma-runner.github.io/4.0/dev/git-commit-msg.html).

### Branches

We never work on the `development` branch directly. All changes are made on a separate branch that will be merged into the development branch after a successful code review. Our branch names are formatted as follows:

```bash
<type>/<short-description-of-task>
```

- `<type>` describes the kind of change this branch is providing. Allowed types are:
    - **feature**
    - **bugfix**
    - **renovate**

- `<short-description-of-task>` should give a very short description what this branch does.

```

<hr style="color:white; height:1.5px; width:100%;"/>

© 2022 - 2023, a11yphant.
