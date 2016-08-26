
Template variables
=======================

Check out `page.html` for details.

- `title`: STRING the title of page
- `content`: STRING the main content in HTML
- `breadcrumb`: LIST of DICT('name': STRING, 'url': STRING). Note that
  the url can either be absolute (by prefixing SITE\_ROOT) or relative to
  the page being generated.



Adding Events
===============

1. Create a `.md` file in `content/events`
2. Pop the first few lines of the markdown file you just created with a YAML
   header like this:

    ```
    ---
    name: 'IC3 NYC Blockchain Meetup - "Town Crier: An Authenticated Data Feed for Smart Contracts" - Prof. Ari Juels'
    location: New York City, NY
    start: 2016-09-29
    end: 2016-09-29
    url: ''
    summary: blahblah.
    ---
      ```

    A fews things to note here:
    - if the content after the first `:` contains one or more `:`, they need
      to be quoted with an `'`.
    - `url` and `external` is optional. You don't have to mention them
      in the header at all. But should set any of them, the system will
      NOT generate a dedicate page for that event. Rather you should specify a
      external `url` (such as a link to meetup.com) to which the header of the
      event will link to.
