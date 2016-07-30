import yaml
from jinja2 import FileSystemLoader, Environment
import os
import codecs
import markdown

env = Environment(loader=FileSystemLoader('./templates/'))
temp = env.get_template('index.html')

CWD = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(CWD, 'output')


def index():
    output = os.path.join(OUTPUT_DIR, 'index.html')
    with open('content/news.yaml', 'r') as c:
        news = yaml.load(c)

    with open('content/blogs.yaml', 'r') as c, open(output, 'w') as t:
        blogs = yaml.load_all(c)
        html = temp.render(news=news, blogs=blogs)
        t.write(html.encode('utf-8'))

def about():
    output = os.path.join(OUTPUT_DIR, 'about.html')
    temp = env.get_template('page.html')

    with codecs.open('./content/about.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    with open(output, 'w') as f:
        html = temp.render(title='About IC3', content=content)
        f.write(html.encode('utf-8'))

def people():
    output = os.path.join(OUTPUT_DIR, 'people.html')
    temp = env.get_template('people.html')
    page_temp = env.get_template('page.html')
    with open(output, 'w') as f:
        html = temp.render()
        page_html = page_temp.render(title='People', content=html)
        f.write(page_html.encode('utf-8'))

def partners():
    output = os.path.join(OUTPUT_DIR, 'partners.html')
    temp = env.get_template('page.html')

    with codecs.open('./content/partners.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    with open(output, 'w') as f:
        html = temp.render(title='About IC3', content=content)
        f.write(html.encode('utf-8'))

def projects():
    output = os.path.join(OUTPUT_DIR, 'projects.html')
    with open('./content/projects.yaml', 'r') as c:
        data = yaml.load(c)

    temp = env.get_template('projects.html')
    with open(output, 'w') as f:
        html = temp.render(challenges=data['challenges'], projects=data['projects'])
        f.write(html.encode('utf-8'))

import os
import shutil
import errno

if __name__ == '__main__':
    if not os.path.exists(OUTPUT_DIR):
        os.mkdir(OUTPUT_DIR)

    index()
    about()
    people()
    partners()
    projects()

    try:
        shutil.copytree('static', os.path.join(OUTPUT_DIR, 'static'))
        shutil.copytree('images', os.path.join(OUTPUT_DIR, 'images'))
    except OSError as e:
        if e.errno == errno.EEXIST:
            pass
        else:
            raise
