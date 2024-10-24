import errno
import hashlib
import logging
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from os.path import exists, dirname

import requests
import yaml
from pyquery import PyQuery as pq

logger = logging.getLogger('blog_crawler')


def fetchall(num_recent_blogs=4):
    # Fetch from Hacking Distributed
    exclude_urls = {"http://hackingdistributed.com/2015/08/17/coin-needs-a-board/",
                    "http://hackingdistributed.com/2014/12/17/changetip-must-die/",
                    "http://hackingdistributed.com/2014/11/30/reasonable-bitcoin-security-precautions/",
                    "http://hackingdistributed.com/2014/06/13/time-for-a-hard-bitcoin-fork/",
                    "http://hackingdistributed.com/2014/05/27/mtgox-willy-markus/",
                    "http://hackingdistributed.com/2014/03/22/just-so-mtgox/",
                    "http://hackingdistributed.com/2013/11/19/why-da-man-loves-bitcoin/",
                    "http://hackingdistributed.com/2013/11/10/clearest-description-of-bitcoin/",
                    "http://hackingdistributed.com/2013/11/09/no-you-dint/",
                    "http://hackingdistributed.com/2013/11/06/comment-policy/",
                    "http://hackingdistributed.com/2013/06/20/virtual-notary-intro/",
                    }

    # target = [
    #     "http://hackingdistributed.com/tag/bitcoin/",
    #     "http://hackingdistributed.com/tag/ethereum/",
    #     "http://hackingdistributed.com/tag/decentralization/",
    # ]

    target = []

    results = []

    for argurl in target:
        logging.info(f'Fetching blogs from {argurl}')

        r = requests.request('GET', argurl)
        r.encoding = 'utf-8'
        d = pq(r.text)

        for elem in d.find("h2.post-title a"):
            url = pq(elem).attr["href"]
            if url not in exclude_urls:
                title = pq(elem).text()

                pubinfo = pq(elem).parent().parent().find(".post-metadata .post-published")
                date = pq(pubinfo).find(".post-date").html().strip()
                authors = pq(pubinfo).find(".post-authors").html().strip()
                summary = pq(elem).parent().parent().parent().find(".post-summary").text()

                date_components = date.split()
                if len(date_components) == 6:
                    date_object = time.strptime(date, '%B %d, %Y at %I:%M %p')
                elif len(date_components) == 7:
                    date_object = time.strptime(date, '%A %B %d, %Y at %I:%M %p')
                else:
                    logger.fatal("cannot parse date str %s", date)
                results.append((date_object, url, title, date, authors, summary))

    # dedupe using url. note that p[1] is url
    results = list({p[1]: p for p in results}.values())

    # Read from yaml
    with open('./content/blogs.yaml', 'r') as c:
        data = yaml.safe_load(c)
        for post in data:
            date = post['date'].timetuple()
            results.append((date, post['url'], post['title'], post['date'].strftime('%B %d, %Y'), post['authors'],
                            post['summary']))

    results.sort(reverse=True)

    posts = []
    for date, url, title, date, authors, summary in results:
        posts.append(dict(date=date, url=url, title=title, authors=authors,
                          summary=summary))

    recent = []

    for date, url, title, date, authors, summary in results[:num_recent_blogs]:
        r = requests.request('GET', url)
        r.encoding = 'utf-8'
        d = pq(r.text)
        img = d.find("div.figure img")
        imgsrc = pq(img).attr["src"]
        # title = title.replace("'", "\\'")
        logger.info('Generating preview for recent blog: %s', title)
        # summary = summary.replace("'", "\\'")
        # try to get the first author's pic
        if imgsrc is None:
            img = d.find("div.pull-right img")
            imgsrc = pq(img).attr["src"]
        if imgsrc == "http://hackingdistributed.com/images/dinomark.png":
            imgsrc = "http://hackingdistributed.com/images/vzamfir.jpg"
        # go with the ic3 default
        if imgsrc is not None:
            response = urllib.request.urlopen(imgsrc)
            imagecontents = response.read()
            _, imageext = os.path.splitext(imgsrc)
            imagehash = hashlib.sha256()
            imagehash.update(imagecontents)
            imagename = imagehash.hexdigest()
            imgsrc = "images/hotlinks/" + imagename + imageext

            if not exists(dirname(imgsrc)):
                try:
                    os.makedirs(dirname(imgsrc))
                except OSError as e:
                    if e.errno != errno.EEXIST:
                        raise
            with open(imgsrc, "wb") as img:
                img.write(imagecontents)
        recent.append(dict(date=date, url=url, title=title, authors=authors, imgsrc=imgsrc, summary=summary))

    return recent, posts
