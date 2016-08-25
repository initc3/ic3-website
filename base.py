import yaml
import re
from jinja2 import FileSystemLoader, Environment
import os
import codecs
import markdown

import copy

from os.path import exists
import shutil


CWD = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(CWD, 'output')

def dateformat(value, format='%b %d, %Y'):
    return value.strftime(format)

class Engine (object):
    env = Environment(loader=FileSystemLoader('./templates/'))
    output_dir = OUTPUT_DIR

    def __init__(self, deploy=False):
        if deploy:
            SITE_ROOT='http://www.initc3.org'
            self.def_cntx = dict(SITE_ROOT=SITE_ROOT)
        else:
            self.def_cntx = dict(SITE_ROOT=OUTPUT_DIR)
        print 'deploy: ' + str(deploy)
        if exists(OUTPUT_DIR):
            shutil.rmtree(OUTPUT_DIR)
        os.mkdir(OUTPUT_DIR)

        self.env.filters['dateformat'] = dateformat


    def render(self, temp, cntx):
        x = copy.copy(cntx)
        x.update(self.def_cntx)
        return temp.render(x)

    def write(self, content, filename):
        with open(filename, 'w') as f:
            f.write(content)

    def write_utf8(self, utf8, filename):
        try:
            # out = utf8.encode('utf-8')
            out = utf8.encode('ascii', 'xmlcharrefreplace')
        except:
            print 'Already encoded'
            out = utf8

        self.write(out, filename)

    def render_and_write(self, template, cntx, path):
        self.write_utf8(self.render(template, cntx), path)

    def get_def_cntx(self):
        return copy.copy(self.def_cntx)

    def get_root_fn(self, fn):
        return os.path.join(self.output_dir, fn)

    def fn_sanitize(self, fn):
        s = re.sub('\s', '-', fn)
        return re.sub('[^0-9a-zA-Z-]', '', s)
