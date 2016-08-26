from pyquery import PyQuery as pq

argurl = 'http://hackingdistributed.com/tag/bitcoin/'

d = pq(url=argurl)

authors = []
for elem in d.find("h2.post-title a"):
    pubinfo = pq(elem).parent().parent().find(".post-metadata .post-published")
    author = pq(pubinfo).find(".post-authors").html().strip()
    print type(author)
    authors.append(author)

with open('output/test.html', 'w') as f:
    f.write(u'\ufeff'.encode('utf-8'))
    f.write(': '.join(authors).encode('utf-8'))
