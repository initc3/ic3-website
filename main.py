# encoding: utf-8

import fnmatch
import yaml
import codecs
import markdown
from os.path import join
from base import StaticSiteGenerator
import os
import shutil
import errno
from optparse import OptionParser
import event
import fetchall
import press as ic3press

parser = OptionParser()
parser.add_option("-d", "--deploy", action="store_true", dest="deploy", help="trigger compression of images", default=False)
parser.add_option("-f", "--fetchall", action="store_true", dest="fetchall", help="trigger fetching blogs from HD",
                  default=False)
(options, args) = parser.parse_args()

CWD = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(CWD, 'output')

e = StaticSiteGenerator(deploy=options.deploy)

EVENT_EXPIRE_IN_DAYS = 45
PRESS_EXPIRE_IN_DAYS = 45


def index():
    events_toshow = event.get_featured_events(e, expire_in_days=EVENT_EXPIRE_IN_DAYS)
    featured_press = ic3press.get_featured_press(expire_in_days=PRESS_EXPIRE_IN_DAYS)

    items = events_toshow + featured_press
    def _get_date(item):
        if hasattr(item, 'date'):
            return item.date
        elif hasattr(item, 'end'):
            return item.end
        else:
            raise Exception('wrong item')

    # sort events and press together by date
    # only display first eight items
    items = sorted(items, key=_get_date, reverse=True)[:6]

    if options.deploy or options.fetchall:
        blogs, _ = fetchall.fetchall(5)
    else:
        blogs = []

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
    output = join(OUTPUT_DIR, 'people.html')
    temp = e.env.get_template('people.html')
    html = temp.render()

    page_temp = e.env.get_template('page.html')

    breadcrumb = [{'name': 'People', 'url': 'people.html'}]
    e.render_and_write(page_temp,
                       dict(title='IC3 - People',
                            content=html,
                            breadcrumb=breadcrumb),
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


def blogs():
    output = e.calc_output_fullpath("blogs.html")
    temp = e.env.get_template('blogs.html')

    breadcrumb = [{'name': 'Blogs', 'url': 'blogs.html'}]

    if options.deploy or options.fetchall:
        _, posts = fetchall.fetchall()
    else:
        posts = []
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

    output = e.calc_output_fullpath('postdoc.html')
    breadcrumb = [{'name': 'Jobs', 'url': ''}, {'name': 'Postdoc', 'url': 'postdoc.html'}]
    with codecs.open('./content/jobs/postdoc.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='IC3 - Postdoc Positions',
        content=content,
        breadcrumb=breadcrumb),
                       output)

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

    context = dict(
        title='IC3 - Video',
        breadcrumb=breadcrumb,
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

            img = Image.open(src)
            img.thumbnail(size)
            img.save(dest)
            print 'Compressing %s' % dest


if __name__ == '__main__':
    index()
    about()
    people()
    partners()
    projects()
    blogs()
    publications()
    press()
    page_not_found()
    jobs()
    event.write_event_list_page(e, EVENT_EXPIRE_IN_DAYS)

    video()

    try:
        shutil.copytree('static', join(OUTPUT_DIR, 'static'))
        shutil.copytree('images', join(OUTPUT_DIR, 'images'))
        # compress images
        if options.deploy:
            from PIL import Image

            compress_image('images/hotlinks', (100, 100))
            compress_image('images/people', (200, 200))

        shutil.copytree('files', join(OUTPUT_DIR, 'files'))
    except OSError as e:
        if e.errno == errno.EEXIST:
            pass
        else:
            raise
