import pyquery
import urllib2
import sys
import datetime
import time
from pyquery import PyQuery as pq
import os
import hashlib

results=[]
for line in reversed(sys.stdin.readlines()):
    comps = line.split(';')
    url = comps[0].strip('"')
    venue = comps[1].strip('"')
    date = time.strptime(comps[2], "%m/%d/%y")
    title = comps[3].strip().strip('"')
    print '- [%s](%s) by **%s** on %s' % (title, url, venue, time.strftime("%B %d, %Y", date))
