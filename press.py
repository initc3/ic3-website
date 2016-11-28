import time

class Press (object):
    def __init__(self, title, url, venue, date):
        self.title = title
        self.url = url
        self.venue = venue
        self.date = date
        self.date_str = time.strftime("%B %d, %Y", self.date)

    def __str__(self):
        return self.__unicode__()

    def __unicode__(self):
        return '- [%s](%s) by **%s** on %s' % (self.title, self.url, self.venue, self.date_str)

import codecs

def get_all_press():
    press_all = []

    with codecs.open('content/press/pressroll-all.csv', 'r', encoding='utf-8') as infile:
        for line in reversed(infile.readlines()):
            comps = line.split(';')
            url = comps[0].strip('"')
            venue = comps[1].strip('"')
            date = time.strptime(comps[2], "%m/%d/%y")
            title = comps[3].strip().strip('"')
            press_all.append(Press(title, url, venue, date))

    return sorted(press_all, key=lambda x: x.date, reverse=True)

def get_featured_press():
    press_featured = []
    with codecs.open('content/press/pressroll-featured.csv', 'r', encoding='utf-8') as infile:
        for line in reversed(infile.readlines()):
            comps = line.split(';')
            url = comps[0].strip('"')
            venue = comps[1].strip('"')
            date = time.strptime(comps[2], "%m/%d/%y")
            title = comps[3].strip().strip('"')
            press_featured.append(Press(title, url, venue, date))

    return sorted(press_featured, key=lambda x: x.date, reverse=True)
