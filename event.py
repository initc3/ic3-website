import markdown
import yaml
import glob

from base import Engine
import os
from os.path import join, exists

import frontmatter
import datetime

from operator import itemgetter

BASE_DIR = './content/events'

DATE_FORMAT = '%Y-%m-%d'


def process(e, filename):
    if not exists(filename):
        print filename, ' does not exists'
        raise

    front = ''
    content = ''
    temp = e.env.get_template('event.html')

    post = frontmatter.load(filename)

    front = post.metadata
    content = markdown.markdown(post.content, extensions=['markdown.extensions.tables'])

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



def format_date(event, icon='<i class="calendar icon"></i>'):
    date = ''
    s = event['start']
    t = event['end']

    full_format = '%A %B %e, %Y '
    short_full_format = '%B %e, %Y '
    if s == t:
        date = '%s%s' % (icon, s.strftime(full_format))
        return date

    if s.year != t.year:
        print 'Error?: year-long event'
        raise

    if s.month == s.month:
        date = '%s%s %d-%d, %d' % (icon, s.strftime("%B"),
                s.day, t.day, t.year)
        return date

    return '%s%s-%s' % (icon, s.strftime(short_full_format),
            t.strftime(short_full_format))

def gen_event_list(e):
    output_dir = join(e.output_dir, 'events')
    if not exists(output_dir):
        os.mkdir(output_dir)

    event_list = []
    for f in glob.glob(join(BASE_DIR, '*.md')):
        event_list.append(process(e, f))

    event_list = sorted(event_list, key=itemgetter('start'), reverse=True)

    for ev in event_list:
        ev['date_str'] = format_date(ev)

    return event_list

def gen(e):
    event_list = gen_event_list(e)

    ongoing = filter(lambda x: x['end'] >= datetime.date.today(), event_list)
    past = filter(lambda x: x['end'] < datetime.date.today(), event_list)

    event_index_temp = e.env.get_template('event_list.html')
    output = e.get_root_fn('events.html')

    breadcrumb = [{'name': 'Events', 'url': 'events.html'}]

    e.render_and_write(event_index_temp,
            dict(title='Events',
                ongoing=ongoing,
                past=past,
                breadcrumb=breadcrumb),
            output)
