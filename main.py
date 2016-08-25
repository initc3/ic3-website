import yaml
from jinja2 import FileSystemLoader, Environment
import os
import codecs
import markdown
from os.path import join, exists
from base import Engine

from optparse import OptionParser

parser = OptionParser()
parser.add_option("-d", "--deploy", action="store_true", dest="deploy", default=False)
(options, args) = parser.parse_args()

CWD = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(CWD, 'output')

e = Engine(deploy=options.deploy)

# event has to be imported after init
import event
import fetchall

N_NEWS_ON_INDEX = 4

def index():
    # news_f = open('content/news.yaml', 'r')
    # news = yaml.load_all(news_f)
    # news = list(news)[:N_NEWS_ON_INDEX]

    event_list = event.gen_event_list(e)
    news = event_list[:N_NEWS_ON_INDEX]

    # blogs_f = open('content/blogs.yaml', 'r')
    # blogs = yaml.load_all(blogs_f)

    if options.deploy:
        blogs, _ = fetchall.fetchall()
    else:
        blogs = []

    temp = e.env.get_template('index.html')
    output_fn = e.get_root_fn('index.html')
    e.render_and_write(temp, dict(news=news, blogs=blogs), output_fn)

    # news_f.close()
    # blogs_f.close()


def about():
    temp = e.env.get_template('page.html')

    with codecs.open('content/about.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    output = join(OUTPUT_DIR, 'about.html')
    e.render_and_write(temp, dict(title='About IC3', content=content), output)


def people():
    output = join(OUTPUT_DIR, 'people.html')
    temp = e.env.get_template('people.html')
    html = temp.render()

    page_temp = e.env.get_template('page.html')
    e.render_and_write(page_temp, dict(title='People', content=html), output)

def partners():
    output = os.path.join(OUTPUT_DIR, 'partners.html')
    temp = e.env.get_template('page.html')

    with codecs.open('./content/partners.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(title='Partners', content=content), output)

def projects():
    output = os.path.join(OUTPUT_DIR, 'projects.html')
    with open('./content/projects.yaml', 'r') as c:
        data = yaml.load(c)

    temp = e.env.get_template('projects.html')
    e.render_and_write(temp, dict(
        title='Projects',
        challenges=data['challenges'],
        projects=data['projects']),
        output)

def publications():
    output = e.get_root_fn('publications.html')
    temp = e.env.get_template('page.html')

    # TODO: Use real markdown instead of html here
    with open('./content/publications.md', 'r') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='Publications',
        content=content),
        output)

def blogs():
    output = e.get_root_fn("blogs.html")
    temp = e.env.get_template('blogs.html')
    if options.deploy:
        _, posts = fetchall.fetchall()
    else:
        posts = []
    e.render_and_write(temp, dict(title='IC3 - Blogs', blogs=posts), output)

def press():
    output = e.get_root_fn('press.html')
    temp = e.env.get_template('page.html')

    # TODO: Use real markdown instead of html here
    with codecs.open('./content/press.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='Press',
        content=content),
        output)


def page_not_found():
    output = e.get_root_fn('404.html')
    temp = e.env.get_template('page.html')

    with open('./content/404.html', 'r') as c:
        content = c.read()

    e.render_and_write(temp, dict(
        title='Publications',
        content=content),
        output)

def jobs():
    output = e.get_root_fn('jobs.html')
    temp = e.env.get_template('page.html')

    with codecs.open('./content/jobs/postdoc.md', 'r', encoding='utf-8') as c:
        content = c.read()
        content = markdown.markdown(content)

    e.render_and_write(temp, dict(
        title='Jobs',
        content=content),
        output)


import os
import shutil
import errno
import sys

if __name__ == '__main__':

    try:
        shutil.copytree('static', join(OUTPUT_DIR, 'static'))
        shutil.copytree('images', join(OUTPUT_DIR, 'images'))
        shutil.copytree('files', join(OUTPUT_DIR, 'files'))
    except OSError as e:
        if e.errno == errno.EEXIST:
            pass
        else:
            raise

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

    event.gen(e)

