import markdown
import os
from os.path import join, exists
import frontmatter
import datetime
from operator import attrgetter
import fnmatch
from dateutil import parser as dateparser

from base import StaticSiteGenerator

CONTENT_DIR = './content/events'
DEFAULT_DATE_FORMAT = '%Y-%m-%d'


def _recursive_glob(rootdir='.', pattern='*'):
    matches = []
    for root, dirnames, filenames in os.walk(rootdir):
      for filename in fnmatch.filter(filenames, pattern):
          matches.append(os.path.join(root, filename))

    return matches


class Tags:
    NOPAGE = 'nopage'
    NOLIST = 'nolist'
    LONGLIVE = 'longlive'
    FEATURED = 'featured'
    DRAFT = 'draft'


class Metadata:
    NAME = "name"
    START = "start"
    END = "end"

    LOCATION = "location"
    SUBTITLE = "subtitle"
    SUMMARY = "summary"
    URL = "url"
    TAGS = "tags"


class Event:
    @staticmethod
    def REQUIRED_FIELDS():
        return Metadata.NAME, Metadata.START, Metadata.END

    @staticmethod
    def OPTIONAL_FIELDS():
        return Metadata.LOCATION, Metadata.SUBTITLE, Metadata.SUMMARY, Metadata.URL, Metadata.TAGS

    @staticmethod
    def ALL_FIELDS():
        return Event.REQUIRED_FIELDS() + Event.OPTIONAL_FIELDS()

    @staticmethod
    def VALID_TAGS():
        return Tags.NOPAGE, Tags.NOLIST, Tags.LONGLIVE, Tags.FEATURED, Tags.DRAFT

    def __init__(self):
        # front matter fields
        for f in Event.ALL_FIELDS():
            setattr(self, f, None)

        # generated
        self.date_str = None
        self.output_path = None

        # XXX: hardcoded :/
        self.type = 'event'

    def __str__(self):
        return self.__unicode__()

    def __unicode__(self):
        s = u"- Event: [%s] (%s): " % (self.name, self._format_date(False))
        return s.encode('utf-8')

    def _parse_metadata(self, front_matter):
        # mandatory fields
        for mf in Event.REQUIRED_FIELDS():
            setattr(self, mf, front_matter[mf])

        # optional fields
        for of in Event.OPTIONAL_FIELDS():
            setattr(self, of, front_matter.get(of, ""))

        if front_matter.has_key('external'):
            print 'Warning: deprecated tags used'

        self.url = None
        self.tags = None

        if "url" in front_matter and front_matter[Metadata.URL] != '':
            self.url = front_matter[Metadata.URL]

        if "tags" in front_matter and len(front_matter[Metadata.TAGS]) > 0:
            self.tags = front_matter[Metadata.TAGS]

        # validate date format
        def parse_if_not_date_obj(obj):
            if not isinstance(obj, datetime.date):
                return dateparser.parse(obj).date()
            else:
                return obj
        self.start = parse_if_not_date_obj(self.start)
        self.end = parse_if_not_date_obj(self.end)

        self.date_str = self._format_date()

    def _format_date(self, attach_icon=True):
        s = self.start
        t = self.end

        if attach_icon:
            if self.end >= datetime.date.today():
                cal_icon = '<i class="add to calendar icon"></i>'
            else:
                cal_icon = '<i class="calendar icon"></i>'
        else:
            cal_icon = ''

        full_format = '%A %B %e, %Y '
        short_full_format = '%B %e, %Y '
        if s == t:
            date = '%s%s' % (cal_icon, s.strftime(full_format))
            return date.strip()

        if s.month == t.month and s.year == t.year:
            date = '%s%s %d-%d, %d' % (cal_icon, s.strftime("%B"), s.day, t.day, t.year)
            return date.strip()

        r = '%s%s-%s' % (cal_icon, s.strftime(short_full_format), t.strftime(short_full_format))
        return r.strip()

    def _start_date_str(self):
        return self.start.strftime(DEFAULT_DATE_FORMAT)

    def _end_date_str(self):
        return self.end.strftime(DEFAULT_DATE_FORMAT)

    def parse_md(self, ssg_engine, md_src):
        print 'processing %s' % md_src
        if not exists(md_src):
            raise Exception('%s does not exist' % md_src)

        post = frontmatter.load(md_src)

        front = post.metadata
        content = markdown.markdown(post.content, extensions=['markdown.extensions.tables'])

        self._parse_metadata(front)

        output_fn = self._start_date_str() + '-' + ssg_engine.sanitize_filename(self.name) + '.html'
        relative_path = join('events', output_fn)

        if self.url or self.has_tag(Tags.NOPAGE):
            self.output_path = None
        else:
            self.url = relative_path
            self.output_path = join(ssg_engine.output_dir, relative_path)

            self.render_cntx = ssg_engine.default_context()
            self.render_cntx['title'] = self.name
            self.render_cntx['metadata'] = self.to_dict()
            self.render_cntx['content'] = content

    def write_file(self, ssg_engine):
        if not self.output_path:
            return

        output_dir = join(ssg_engine.output_dir, 'events')
        if not exists(output_dir):
            os.mkdir(output_dir)

        if not self.render_cntx:
            raise Exception("render context not ready")

        temp = ssg_engine.env.get_template('event_details.html')
        html = temp.render(self.render_cntx)
        ssg_engine.write(html.encode('utf-8'), self.output_path)

    def has_tag(self, tag):
        if tag not in Event.VALID_TAGS():
            raise Exception("invalid tag: %s" % tag)
        return self.tags and tag in self.tags

    def has_expired(self, expire_in_days):
        if self.has_tag(Tags.LONGLIVE):
            # extend the life time by a week
            expire_in_days += 7

        today = datetime.date.today()
        tdiff = today - self.end
        return tdiff.days >= expire_in_days

    def to_dict(self):
        r = {}
        for f in Event.ALL_FIELDS():
            r[f] = getattr(self, f)

        r['date_str'] = getattr(self, 'date_str')

        return r


def get_event_list(env, expire_in_days, include_expired=False):
    events = []

    markdown_files = _recursive_glob(CONTENT_DIR, '*.md')
    for f in markdown_files:
        if f.endswith('template.md'):
            continue
        e = Event()
        e.parse_md(env, f)
        events.append(e)

    if not include_expired:
        events = filter(lambda ev: not ev.has_expired(expire_in_days=expire_in_days), events)

    event_metadata = sorted(events, key=attrgetter('start'), reverse=True)

    return event_metadata


def get_upcoming_events(e, expire_in_days):
    print 'Getting upcoming events'
    event_list = get_event_list(e, expire_in_days=expire_in_days, include_expired=False)
    ongoing = filter(lambda x: x.end >= datetime.date.today(), event_list)

    return ongoing


def get_featured_events(e, expire_in_days):
    """
    :param e: template engine needed here [why? I forgot]
    :return: a list of upcoming or featured events
    """
    print 'Getting featured events'
    event_list = get_event_list(e, expire_in_days)

    today = datetime.date.today()
    featured = filter(lambda ev: ev.has_tag('featured') or ev.end >= today, event_list)
    return featured


def write_event_list_page(e, expire_in_days):
    event_list = get_event_list(e, expire_in_days, include_expired=True)

    ongoing = filter(lambda x: x.end >= datetime.date.today() and (not x.has_tag(Tags.NOLIST)), event_list)
    past = filter(lambda x: x.end < datetime.date.today(), event_list)

    event_index_temp = e.env.get_template('event_list.html')
    output = e.calc_output_fullpath('events.html')

    breadcrumb = [{'name': 'Events', 'url': 'events.html'}]

    e.render_and_write(event_index_temp,
                       dict(title='Events',
                            ongoing=ongoing,
                            past=past,
                            breadcrumb=breadcrumb),
                       output)
