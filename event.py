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
    print 'processing %s' % filename
    if not exists(filename):
        raise Exception('%s does not exist' % filename)

    temp = e.env.get_template('event_details.html')

    post = frontmatter.load(filename)

    front = post.metadata
    content = markdown.markdown(post.content, extensions=['markdown.extensions.tables'])

    # if front has external url, then no file will be generated
    if front.has_key('url') or front.has_key('external') or (front.has_key('tags') and ('nopage' in front['tags'])):
        return front

    output_fn = front['start'].strftime(DATE_FORMAT) + '-' + e.filename_sanitize(front['name']) + '.html'
    url = join('events', output_fn)
    output_fn = join(e.output_dir, url)

    front['url'] = url
    front['date_str'] = format_date(front)

    cntx = e.default_cntx()
    cntx['title'] = front['name']
    cntx['content'] = content
    cntx['metadata'] = front

    html = temp.render(cntx)
    e.write(html.encode('utf-8'), output_fn)

    return front


def format_date(event, icon='<i class="calendar icon"></i>'):
    s = event['start']
    t = event['end']

    full_format = '%A %B %e, %Y '
    short_full_format = '%B %e, %Y '
    if s == t:
        date = '%s%s' % (icon, s.strftime(full_format))
        return date

    if s.month == s.month:
        date = '%s%s %d-%d, %d' % (icon, s.strftime("%B"),
                s.day, t.day, t.year)
        return date

    return '%s%s-%s' % (icon, s.strftime(short_full_format),
            t.strftime(short_full_format))


def get_event_list(env, icon=None):
    output_dir = join(env.output_dir, 'events')
    if not exists(output_dir):
        os.mkdir(output_dir)

    event_metadata = []
    for f in glob.glob(join(BASE_DIR, '*.md')):
        if f.endswith('template.md'):
            continue
        event_metadata.append(process(env, f))

    event_metadata = sorted(event_metadata, key=itemgetter('start'), reverse=True)

    for ev in event_metadata:
        if icon:
            ev['date_str'] = format_date(ev, icon)
        else:
            ev['date_str'] = format_date(ev)

    return event_metadata


def get_upcoming_events(e):
    event_list = get_event_list(e, icon='<i class="add to calendar icon"></i>')
    ongoing = filter(lambda x: x['end'] >= datetime.date.today(), event_list)

    featured = filter(lambda x: x.has_key('tags') and 'featured' in x['tags'], ongoing)
    return featured


def get_featured_events(e):
    event_list = get_event_list(e)
    featured = filter(lambda x: x.has_key('tags') and 'featured' in x['tags'], event_list)
    return featured

def has_tag(event, tag):
    if not event.has_key('tags'):
        return False
    return tag in event['tags']

def output(e):
    event_list = get_event_list(e)

    ongoing = filter(lambda x: x['end'] >= datetime.date.today() and (not has_tag(x, 'nolist')), event_list)
    past = filter(lambda x: x['end'] < datetime.date.today(), event_list)

    event_index_temp = e.env.get_template('event_list.html')
    output = e.output_path('events.html')

    breadcrumb = [{'name': 'Events', 'url': 'events.html'}]

    e.render_and_write(event_index_temp,
                       dict(title='Events',
                            ongoing=ongoing,
                            past=past,
                            breadcrumb=breadcrumb),
                       output)
