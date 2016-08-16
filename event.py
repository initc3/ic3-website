import markdown
import yaml
import glob

from base import Engine
import os
from os.path import join, exists

import frontmatter
import datetime

e = Engine()

BASE_DIR = './content/events'

DATE_FORMAT = '%Y-%m-%d'

output_dir = join(e.output_dir, 'events')
if not exists(output_dir):
    os.mkdir(output_dir)

def process(filename):
    if not exists(filename):
        print filename, ' does not exists'
        raise

    front = ''
    content = ''
    temp = e.env.get_template('event.html')

    post = frontmatter.load(filename)

    front = post.metadata
    content = markdown.markdown(post.content)

    # if front has external url, then no file will be generated
    if front.has_key('url') or front.has_key('external'):
        return front

    output_fn = front['start'].strftime(DATE_FORMAT) + '-' + e.fn_sanitize(front['name']) + '.html'

    url = join('events', output_fn)
    front['url'] = url

    output_fn = join(e.output_dir, url)

    cntx = e.get_def_cntx()
    cntx['title'] = front['name']
    cntx['content'] = content

    html = temp.render(cntx)
    e.write(html.encode('utf-8'), output_fn)

    return front

event_list = []
for f in glob.glob(join(BASE_DIR, '*.md')):
    event_list.append(process(f))

from operator import itemgetter

event_list = sorted(event_list, key=itemgetter('start'), reverse=True)

ongoing = filter(lambda x: x['end'] >= datetime.date.today(), event_list)
past = filter(lambda x: x['end'] < datetime.date.today(), event_list)


def gen():

    cntx = e.get_def_cntx()
    cntx['ongoing'] = ongoing
    cntx['past'] = past

    event_index_temp = e.env.get_template('event_list.html')
    html = event_index_temp.render(cntx)
    e.write(html.encode('utf-8'), e.get_root_fn('events.html'))
