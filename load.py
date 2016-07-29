import yaml
from jinja2 import FileSystemLoader, Environment
import os
import codecs
import markdown

env = Environment(loader=FileSystemLoader('./templates/'))
temp = env.get_template('index.html')


def index():
    with open('content/news.yaml', 'r') as c:
        news = yaml.load(c)

    with open('content/blogs.yaml', 'r') as c, open('index.html', 'w') as t:
        blogs = yaml.load_all(c)
        html = temp.render(news=news, blogs=blogs)
        t.write(html.encode('utf-8'))

def about():
    temp = env.get_template('page.html')

    with codecs.open('./content/about.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    with open('about.html', 'w') as f:
        html = temp.render(title='About IC3', content=content)
        f.write(html.encode('utf-8'))

def people():
    temp = env.get_template('people.html')
    page_temp = env.get_template('page.html')
    with open('people.html', 'w') as f:
        html = temp.render()
        page_html = page_temp.render(title='People', content=html)
        f.write(page_html.encode('utf-8'))

def partners():
    temp = env.get_template('page.html')

    with codecs.open('./content/partners.md', 'r', encoding='utf-8') as f:
        content = f.read()
        content = markdown.markdown(content)

    with open('partners.html', 'w') as f:
        html = temp.render(title='About IC3', content=content)
        f.write(html.encode('utf-8'))

if __name__ == '__main__':
    people()
    partners()
