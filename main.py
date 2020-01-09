#!/usr/bin/env python3

"""
A static website generator used by www.initc3.org.

Usage:
  main.py [options]

Options:
  -h --help                 Show this screen.
  -v,--verbose              Print debug messages.
  --deploy                  Build in deploy mode. Trigger a bunch of optimization, such as image compression.
  --disable-news            Skip building the news page.
  --version                 Show version.
"""

import codecs
import errno
import fnmatch
import logging
import os
import shutil
import sys
from os.path import join

import markdown
import yaml
from docopt import docopt

import blog_crawler
import event
import press as ic3press
from base import StaticSiteGenerator

# setup docopt and logging
args = docopt(__doc__)

logger_format = '%(asctime)s [%(levelname)s] - %(message)s'
logging.basicConfig(level=logging.DEBUG if args['--verbose'] else logging.INFO, format=logger_format)

CWD = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(CWD, 'output')

e = StaticSiteGenerator(deploy=args['--deploy'])

EVENT_EXPIRE_IN_DAYS = 40
PRESS_EXPIRE_IN_DAYS = 25
FEATURED_PRESS_EXPIRE_IN_DAYS = 45


def index():
    """ Let me explain the index news selection rule.
    First, we select recent news from all news regardless whether it's featured or not.
    Then, if we don't get enough of them, we draw from the less recent but featured ones.
    """
    events_toshow = event.get_event_list(e)

    if args['--disable-news']:
        recent_press = []
    else:
        recent_press = ic3press.get_all_press()

    press = recent_press

    # dedupe using url. note that p[1] is url
    press = {p.url: p for p in press}.values()

    # sort events and press together by date
    # only display first eight items
    items = events_toshow + list(press)

    def _get_date(item):
        if hasattr(item, 'date'):
            return item.date
        elif hasattr(item, 'end'):
            return item.end
        else:
            raise Exception('wrong item')

    items = sorted(items, key=_get_date, reverse=True)[:5]

    n_events = len(items)

    if n_events == 0:
        logging.fatal('too few events. cannot update the website')
        sys.exit(1)

    blogs, _ = blog_crawler.fetchall(n_events)

    for ev in events_toshow:
        ev.write_file(e)

    e.render_and_write(e.env.get_template('index.html'),
                       dict(items=items,
                            blogs=blogs),
                       e.calc_output_fullpath('index.html'))


def about():
    output = join(OUTPUT_DIR, 'about.html')
    temp = e.env.get_template('page.html')

    with codecs.open('content/about.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    breadcrumb = [{'name': 'About', 'url': 'about.html'}]
    e.render_and_write(temp, dict(
        title='IC3 - About IC3',
        content=content,
        breadcrumb=breadcrumb),
                       output)


def people():
    output = os.path.join(OUTPUT_DIR, 'people.html')
    with open('./content/people.yaml', 'r') as c:
        data = yaml.load(c)

    def _get_last_name(ppl_item):
        return ppl_item['name'].split(' ')[-1]

    # sort by last names
    for k, v in data.items():
        data[k] = sorted(v, key=_get_last_name)

    breadcrumb = [{'name': 'People', 'url': 'people.html'}]

    temp = e.env.get_template('people.html')
    e.render_and_write(temp, dict(
        title='IC3 - Projects',
        breadcrumb=breadcrumb,
        people=data),
                       output)


def partners():
    output = join(OUTPUT_DIR, 'partners.html')
    temp = e.env.get_template('page.html')

    with codecs.open('./content/partners.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    breadcrumb = [{'name': 'Partners', 'url': 'partners.html'}]
    e.render_and_write(temp,
                       dict(title='IC3 - Partners',
                            content=content,
                            breadcrumb=breadcrumb),
                       output)


def projects():
    output = os.path.join(OUTPUT_DIR, 'projects.html')
    with open('./content/projects.yaml', 'r') as c:
        data = yaml.load(c)

    breadcrumb = [{'name': 'Projects', 'url': 'projects.html'}]

    temp = e.env.get_template('projects.html')
    e.render_and_write(temp, dict(
        title='IC3 - Projects',
        breadcrumb=breadcrumb,
        challenges=data['challenges'],
        projects=data['projects']),
                       output)


def impact():
    output = join(OUTPUT_DIR, 'impact.html')
    temp = e.env.get_template('page.html')

    with codecs.open('content/impact.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    breadcrumb = [{'name': 'Impact', 'url': 'about.html'}]
    e.render_and_write(temp, dict(
        title='IC3 - IC3 Impact',
        content=content,
        breadcrumb=breadcrumb),
                       output)


def publications():
    output = e.calc_output_fullpath('publications.html')
    temp = e.env.get_template('page.html')

    breadcrumb = [{'name': 'Publications', 'url': 'publications.html'}]

    with codecs.open('./content/publications.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='IC3 - Publications',
        content=content,
        breadcrumb=breadcrumb),
                       output)


def policy():
    output = e.calc_output_fullpath('policy.html')
    temp = e.env.get_template('page.html')

    with codecs.open('./content/policy.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    breadcrumb = [{'name': 'Policy', 'url': 'policy.html'}]
    e.render_and_write(temp, dict(
        title='IC3 - COI Policy',
        content=content,
        breadcrumb=breadcrumb),
                       output)


def blogs():
    output = e.calc_output_fullpath("blogs.html")
    temp = e.env.get_template('blogs.html')

    breadcrumb = [{'name': 'Blogs', 'url': 'blogs.html'}]

    _, posts = blog_crawler.fetchall()
    logging.info("got {} blogs".format(len(posts)))
    for p in posts:
        logging.info(p["title"])

    e.render_and_write(temp, dict(
        title='IC3 - Blogs',
        blogs=posts,
        breadcrumb=breadcrumb),
                       output)


def press():
    output = e.calc_output_fullpath('press.html')
    temp = e.env.get_template('press.html')

    all_press = ic3press.get_all_press()
    featured_press = ic3press.get_featured_press(expire_in_days=180)

    breadcrumb = [{'name': 'Press', 'url': 'press.html'}]

    e.render_and_write(temp, dict(
        title='IC3 - Press',
        all_press=all_press,
        featured_press=featured_press,
        breadcrumb=breadcrumb),
                       output)


def page_not_found():
    output = e.calc_output_fullpath('404.html')
    temp = e.env.get_template('page.html')

    with open('./content/404.html', 'r') as c:
        content = c.read()

    e.render_and_write(temp, dict(
        title='IC3 - Publications',
        content=content),
                       output)


def jobs():
    temp = e.env.get_template('page.html')

    output = e.calc_output_fullpath('phd.html')
    breadcrumb = [{'name': 'Jobs', 'url': ''}, {'name': 'PhD', 'url': 'phd.html'}]
    with codecs.open('./content/jobs/phd.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='IC3 - PhD Positions',
        content=content,
        breadcrumb=breadcrumb),
                       output)


def video():
    output = e.calc_output_fullpath('video.html')
    temp = e.env.get_template('video_list.html')
    breadcrumb = [{'name': 'Video', 'url': 'video.html'}]

    with open('./content/videos/list.yaml', 'r') as c:
        video_list = yaml.load(c)

    context = dict(
        title='IC3 - Video',
        breadcrumb=breadcrumb,
        video_list=video_list,
    )

    e.render_and_write(temp, context, output)


def compress_image(dir='images/hotlinks', size=(80, 80)):
    for root, dirname, filenames in os.walk(dir):
        for filename in fnmatch.filter(filenames, '*.jpg') + \
                        fnmatch.filter(filenames, '*.jpeg') + \
                        fnmatch.filter(filenames, '*.png'):
            src = os.path.join(root, filename)
            dest = os.path.join(OUTPUT_DIR, src)
            if not os.path.exists(os.path.dirname(dest)):
                os.makedirs(os.path.dirname(dest))

            logging.info("compressing image %s", src)

            img = Image.open(src)
            img.thumbnail(size)

            img = img.convert("RGB")
            img.save(dest)
            logging.debug('compressed image written to %s', dest)


if __name__ == '__main__':
    index()
    about()
    people()
    partners()
    projects()
    impact()
    policy()
    blogs()
    publications()

    if args['--disable-news']:
        logging.warning('not building the press page because --disable-news is on')
    else:
        press()

    page_not_found()
    jobs()
    event.write_event_list_page(e)

    video()

    try:
        shutil.copytree('static', join(OUTPUT_DIR, 'static'))
        shutil.copytree('images', join(OUTPUT_DIR, 'images'))
        # compress images
        if args['--deploy']:
            from PIL import Image

            compress_image('images/hotlinks', (100, 100))
            compress_image('images/people', (500, 500))

        shutil.copytree('files', join(OUTPUT_DIR, 'files'))
    except OSError as e:
        if e.errno == errno.EEXIST:
            pass
        else:
            raise
