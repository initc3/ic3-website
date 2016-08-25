import pyquery
import urllib2
import sys
import datetime
import time
from pyquery import PyQuery as pq
import os
import hashlib

argurl = 'http://hackingdistributed.com/tag/bitcoin/'
print 'Fetching: ', argurl

d = pq(url=argurl)

authors = []
for elem in d.find("h2.post-title a"):
    pubinfo = pq(elem).parent().parent().find(".post-metadata .post-published")
    author = pq(pubinfo).find(".post-authors").html().strip()
    authors.append(author)

with open('output/test.html', 'w') as f:
    f.write(': '.join(authors).encode('utf-8'))
