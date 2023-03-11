<img src="services/site/public/images/a11yphant_Logo_Signet.png" height="138">

# [a11yphant.com](https://a11yphant.com)

The easy way to learn web accessibility

[![Twitter](https://img.shields.io/badge/-Twitter-7331FF)](https://twitter.com/a11yphant)
[![ProductHunt](https://img.shields.io/badge/-ProductHunt-7331FF)](https://www.producthunt.com/products/a11yphant)
![Open Source Project](https://img.shields.io/badge/-Open%20Source%20Project-121212)
![Launched 2022](https://img.shields.io/badge/-Launched%202022-121212)

<hr style="color:white; height:1.5px; width:100%;"/>


## Table of Contents

- [About a11yphant](#about-a11yphant)
- [Meet the Team](#meet-the-team)
- [Contributing to a11yphant](#contributing-to-a11yphant)
  - [Documentation](documentation.md)
  - [Reporting Bugs and Issues](#reporting-bugs-and-issues)
  - [Feature Requests](#feature-requests)
    - [Create a Pull Request](#create-a-pull-request)
  - [Writing Content](#writing-content)

<hr style="color:white; height:1.5px; width:100%;"/>

## About a11yphant

<p>
  <span aria-label="Allyphant">a11yphant</span> <span aria-hidden="true">(pronounced [ˈɛlifənt])</span> teaches developers the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes.
</p>

In an ideal world, all websites are designed and developed so everyone can use them. Sadly, many websites do not comply with web accessibility guidelines. Therefore, especially people with impairments and disabilities are barred from using them. One of the main problems is that many developers don't know enough about web accessibility. a11yphant wants to improve this situation by giving them a tool for learning accessibility in a fun, interactive way.

<img
  alt="The a11yphant website where users can complete interactive challenges on web accessibility."
  src="https://a11yphant.com/images/mockups-social-media.jpg"
  quality="100"
  sizes="100vw"
  style="objectFit:cover"
/>

<p>
  <span aria-label="Allyphant">a11yphant</span> is an interactive online course for web accessibility. In this course, you will revisit web
  development topics from an accessibility perspective. For example, how to make sure that assistive technologies like screen readers can
  interact with the website? Or, what is the purpose of the different semantic HTML elements? These are some of the things you will learn by
  writing meaningful markup and completing quizzes.
</p>

## Meet the Team

<p>
  <span aria-label="Allyphant">a11yphant</span> started as a master’s project created by six students at the
  <a href="https://www.fh-salzburg.ac.at/en/" target="_blank" rel="noopener noreferrer nofollow">
Salzburg University of Applied Sciences (Austria)</a>.
  <span className="font-medium">Concept and Development</span> by <a href="https://dnikub.dev">Daniela Kubesch</a>,
  <a href="https://lucapircher.at/" target="_blank" rel="noopener noreferrer nofollow">
    Luca Pircher
  </a>
  ,
  <a href="https://github.com/thomasdax98" target="_blank" rel="noopener noreferrer nofollow">
    Thomas Dax
  </a>
  and
  <a href="https://github.com/hntrhfr" target="_blank" rel="noopener noreferrer nofollow">
    Michael Hinterhofer</a>.
  <span className="font-medium">Interface and Corporate Design</span> by
  <a href="https://johannawicht.com/" target="_blank" rel="noopener noreferrer nofollow">
    Johanna Wicht
  </a>
  and
  <a href="https://www.fabianhellerdesign.com/" target="_blank" rel="noopener noreferrer nofollow">
    Fabian Heller</a>.
</p>

## Contributing to a11yphant

Looking to contribute something to a11yphant? **Here's how you can help.**

We decided to continue a11yphant as Open Source project. Our goal is to make the web a more accessible and inclusive place. We do not want to make profit. All money we might receive through sponsorships goes directly into developing a11yphant further.

### Read the Documentation

Everything you need to know to setup the project locally can be found in our [documentation](https://github.com/a11yphant/a11yphant/blob/develop/documentation.md). Please follow our [coding conventions](https://github.com/a11yphant/a11yphant/blob/develop/documentation.md/#coding-conventions).

### Reporting Bugs and Issues

If you think you've found a bug or accessibility issue, feel free to open an issue here on GitHub. Before opening a new issue, please answer this checklist for yourself:

1. I ensured that the problem is not just caused by a simple error in my own console
2. I checked that no GitHub issue was already filed for this bug

If you answered everything with yes, go ahead and [create a new GitHub issue](https://github.com/a11yphant/a11yphant/issues/new/choose). Be sure to include as much information as possible so we can reproduce the bug.

### Feature Requests

Feature requests are very welcome. But take a moment to find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince us of this feature. Please provide as much detail and context as possible.

As we are only a small team of developers and designers, you are invited to contribute by creating a pull request. Please discuss your proposed changes with us before starting implementation. Otherwise, they might collide with our plans. Also, remember to follow our [coding conventions](https://github.com/a11yphant/a11yphant/blob/develop/documentation.md/#coding-conventions). 

#### Create a Pull Request

The best way to create your pull request is:

1. Please contact us first, as we are might already working on your idea in the background

2. Fork the project & clone your fork.
```bash
# Clone your fork of the repo into the current directory
git clone https://github.com/<your-username>/a11yphant.git
```

3. Configure the remotes by adding an upstream to the original repository.
```bash
# Navigate to the newly cloned directory
cd a11yphant
# Assign the original repo to a remote called "upstream"
git remote add upstream https://github.com/a11yphant/a11yphant.git
```

4. If you cloned a while ago, please make sure your branch is up-to-date by pulling.
```bash
git checkout develop
git pull upstream develop
```

5. Create a new branch for your feature (or bugfix) off the development branch.
> **Please note:** `<type>` describes the kind of change this branch is providing. Allowed types are `feature`, `bugfix` and `renovate`.
```bash
git checkout -b <type>/<short-description-of-task>
```

6. Commit your changes in logical chunks. Please look into our [git commit message guidelines](https://github.com/a11yphant/a11yphant/blob/develop/documentation.md/#commit-messages) listed in our documentation. If you don't follow these guidelines your code is unlikely to be merged into the main project.

> **Note:** Don't forget to write tests for your feature. A pull request will only be accepted if it also has tests.

7. Locally merge (or rebase) the upstream development branch into the branch created for your topic.
```bash
git pull [--rebase] upstream master
```

8. Push your branch up to your fork.
```bash
git push origin <type>/<short-description-of-task>
```

9. Open a Pull Request with a clear title and description against the `master` branch.


### Writing Content

You are welcome to contribute to a11yphant by writing content (aka. new challenges). You can submit your new challenge via [pull request](#create-a-pull-request) or, if you are not familiar with Git, by [writing us an email](mailto:info@a11yphant.com).

> Please contact us first, as we might already work on your topic idea in the background.


<hr style="color:white; height:1.5px; width:100%;"/>

© 2022 - 2023, a11yphant.