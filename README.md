[![Netlify Status](https://api.netlify.com/api/v1/badges/97920e10-7fbf-4a8b-b23d-ba87d4814979/deploy-status)](https://app.netlify.com/sites/ic3/deploys)

Guidelines For Editors
=======================

One of the major motivation for revamping the website is to separate the content from implementation and to present a streamlined process for editors to update the content with ease. Now this feature is available.

How it works
-------------

The actual contents (e.g. people, publications) are documented in a writer-friendly format, mostly in **Markdown**. A Python script has been written to parse the content and generate the final website. [Travis-CI](http://travis-ci.com) is used to build automatically on every git push.


Before Start
---------------

Prerequisites are:

- git
- a text editor (best with Markdown preview, e.g. [MacDown](http://macdown.uranusjr.com/))
- proper write access to the repo

You can find a Markdown cheat sheet [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) and much more online.


Updating contents -- the easy way
----------------------

1. Clone the repository
2. Apply whatever editing you want to files under the `content` directory (note that renaming files or creating new files are not yet supported, and would fail the building.)
3. Commit the changes and `git push`
4. Give Travis-CI 2 minutes to finish deployment and you should find the website updated.

__Note that__ your editing will take effect as soon as your push is accepted by GitHub. So please double check before pushing. If you'd like to generate a local preview first, please read the next section.

Generating local preview
-------------------------

You don't have to generate a local preview but you can:

1. Install the required dependencies indicated in requirements.txt, e.g.

        pip install -r requirements.txt

2. Run `python main.py` to generate a `output` directory and `output/index.html` is the homepage.


**Note that** when a local preview is generated, blogs will be left blank by default (since curling the blogs takes some time and generate unnecessary network traffic). If you do want the script to download the latest blogs from the source, please use `python main.py -f`.

**Don't forget to push** to make the editing effective.


Adding Events
--------------

It takes some extra steps to add new events.

1. Create a `.md` file in `content/events`
2. Starting from Line 1, please specify metadata in a __YAML header__, starting and ending with a `---`.
3. Following the YAML header, please add more content in Markdown.

A short example is:

    ---
    name: 'blah: b'
    location: New York City, NY
    start: 2016-09-29
    end: 2016-09-29
    url: ''
    external: true
    summary: blahblah.
    tags:
      - featured
    ---

    # Markdown starts here

Unless specified (see below), each event contributes two types of output: 1) the metadata is used to generate an entry on the [events page](www.initc3.org/events.html), and 2) the markdown part is transformed to a dedicated event page such as [this one](http://www.initc3.org/events/2016-07-20-IC3-Ethereum-Crypto-Boot-Camp-and-Workshop.html).

More notes on the YAML header:

- If the value string after the first colon (`:`) has one or more colons in it, it needs
to be quoted within a pair of `'`. See `name` above.
- `url` and `external` is optional. But should any of them set,
NO event page for that event will be generated (but an entry on the events page will still be generated). Usually, you want to
specify an `url` (such as a link to meetup.com) to which the entry on the events page will link to.
- `tags` are optional. If marked as `featured`, a event will be displayed on the home page regardless of the space constraint (TODO: _maybe we want to change this later_).

Documents for Developer
=======================

A few random notes for internal use.

Template variables
-------------------


Check out `page.html` for details.

- `title`: STRING the title of page
- `content`: STRING the main content in HTML
- `breadcrumb`: LIST of DICT('name': STRING, 'url': STRING). Note that
  the url can either be absolute (by prefixing SITE\_ROOT) or relative to
  the page being generated.
