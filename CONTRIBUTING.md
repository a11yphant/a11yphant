<img src="services/site/public/images/a11yphant_Logo_Signet.png" height="138">

# Contributing to a11yphant

Looking to contribute something to a11yphant? **Here's how you can help.**


<hr style="color:white; height:1.5px; width:100%;"/>

## Table of Contents

- [Documentation](DOCUMENTATION.md)
- [Reporting Bugs and Issues](#reporting-bugs-and-issues)
- [Feature Requests](#feature-requests)
    - [Create a Pull Request](#create-a-pull-request)
- [Writing Content](#writing-content)

<hr style="color:white; height:1.5px; width:100%;"/>

We decided to continue a11yphant as Open Source project. Our goal is to make the web a more accessible and inclusive place. We do not want to make profit. All money we might receive through sponsorships goes directly into developing a11yphant further.

## Read the Documentation

Everything you need to know to setup the project locally can be found in our [documentation](DOCUMENTATION.md). Please follow our [coding conventions](DOCUMENTATION.md/#coding-conventions).

## Reporting Bugs and Issues

If you think you've found a bug or accessibility issue, feel free to open an issue here on GitHub. Before opening a new issue, please answer this checklist for yourself:

1. I ensured that the problem is not caused by my local environment (e.g., a browser plugin, a really old browser version or unusual browser settings)
2. I checked that no GitHub issue was already filed for this bug

If you answered everything with yes, go ahead and [create a new GitHub issue](https://github.com/a11yphant/a11yphant/issues/new/choose). Be sure to include as much information as possible so we can reproduce the bug.

## Feature Requests

Feature requests are very welcome. But take a moment to find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince us of this feature. Please provide as much detail and context as possible.

As we are only a small team of developers and designers, you are invited to contribute by creating a pull request. Please discuss your proposed changes with us before starting implementation. Otherwise, they might collide with our plans. Also, remember to follow our [coding conventions](DOCUMENTATION.md/#coding-conventions). 

### Create a Pull Request

The best way to create your pull request is:

1. Please contact us first via a GitHub issue to avoid collisions of your ideas with our plans and vision.

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

6. Commit your changes in logical chunks. Please look into our [git commit message guidelines](DOCUMENTATION.md/#commit-messages) listed in our documentation. If you don't follow these guidelines, your code is unlikely to be merged into the main project.

> **Note:** Don't forget to write tests for your feature. A pull request will only be accepted if it also has tests.

7. Locally merge (or rebase) the upstream development branch into your branch.
```bash
git pull [--rebase] upstream develop
```

8. Push your branch to your fork.
```bash
git push origin <type>/<short-description-of-task>
```

9. Open a Pull Request with a clear title and description against the `develop` branch.


## Writing Content

You are welcome to contribute to a11yphant by writing content (aka. new challenges). You can submit your new challenge via [pull request](#create-a-pull-request) or, if you are not familiar with Git, by [writing us an email](mailto:info@a11yphant.com).

> Please contact us first, as we might already work on your topic idea in the background.


<hr style="color:white; height:1.5px; width:100%;"/>

© 2022 - 2023, a11yphant.