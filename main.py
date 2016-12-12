# encoding: utf-8

import yaml
import codecs
import markdown
from os.path import join
from base import Engine
import os
import shutil
import errno

from optparse import OptionParser

parser = OptionParser()
parser.add_option("-d", "--deploy", action="store_true", dest="deploy", default=False)
parser.add_option("-f", "--fetchall", action="store_true", dest="fetchall", default=False)
(options, args) = parser.parse_args()

CWD = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(CWD, 'output')

e = Engine(deploy=options.deploy)

# event has to be imported after init
import event
import fetchall
import press as ic3press


def index():
    upcoming_events = event.get_upcoming_events(e)
    if len(upcoming_events) > 2:
        upcoming_events = upcoming_events[:2]

    featured_press = ic3press.get_featured_press()[:3]

    if options.deploy or options.fetchall:
        blogs, _ = fetchall.fetchall()
    else:
        blogs = []

    temp = e.env.get_template('index.html')
    output_fn = e.output_path('index.html')
    e.render_and_write(temp, dict(events=upcoming_events, featured_press=featured_press, blogs=blogs), output_fn)


def about():
    output = join(OUTPUT_DIR, 'about.html')
    temp = e.env.get_template('page.html')

    with codecs.open('content/about.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    breadcrumb = [{'name': 'About', 'url': 'about.html'}]
    e.render_and_write(temp, dict(
        title='About IC3',
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
            dict(title='People',
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
            dict(title='Partners',
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
        title='Projects',
        breadcrumb=breadcrumb,
        challenges=data['challenges'],
        projects=data['projects']),
        output)


def publications():
    output = e.output_path('publications.html')
    temp = e.env.get_template('page.html')

    breadcrumb = [{'name': 'Publications', 'url': 'publications.html'}]

    with codecs.open('./content/publications.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='Publications',
        content=content,
        breadcrumb=breadcrumb),
        output)


def blogs():
    output = e.output_path("blogs.html")
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
    output = e.output_path('press.html')
    temp = e.env.get_template('press.html')

    all_press = ic3press.get_all_press()
    featured_press = ic3press.get_featured_press()

    breadcrumb = [{'name': 'Press', 'url': 'press.html'}]

    e.render_and_write(temp, dict(
        title='Press',
        all_press=all_press,
        featured_press=featured_press,
        breadcrumb=breadcrumb),
        output)


def page_not_found():
    output = e.output_path('404.html')
    temp = e.env.get_template('page.html')

    with open('./content/404.html', 'r') as c:
        content = c.read()

    e.render_and_write(temp, dict(
        title='Publications',
        content=content),
        output)


def jobs():
    output = e.output_path('jobs.html')
    temp = e.env.get_template('page.html')

    breadcrumb = [{'name': 'Jobs', 'url': 'jobs.html'}]

    with codecs.open('./content/jobs/postdoc.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='Jobs',
        content=content,
        breadcrumb=breadcrumb),
        output)

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
    event.output(e)

    try:
        shutil.copytree('static', join(OUTPUT_DIR, 'static'))
        shutil.copytree('images', join(OUTPUT_DIR, 'images'))
        shutil.copytree('files', join(OUTPUT_DIR, 'files'))
    except OSError as e:
        if e.errno == errno.EEXIST:
            pass
        else:
            raise
