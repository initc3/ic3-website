
Template variables
=======================

Check out `page.html` for details.

- `title`: STRING the title of page
- `content`: STRING the main content in HTML
- `breadcrumb`: LIST of DICT('name': STRING, 'url': STRING). Note that
  the url can either be absolute (by prefixing SITE\_ROOT) or relative to
  the page being generated.
