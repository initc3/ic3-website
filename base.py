import re
from jinja2 import FileSystemLoader, Environment
import os
import copy
from os.path import exists
import shutil


def dateformat(value, format='%b %d, %Y'):
    return value.strftime(format)


class Engine (object):
    env = Environment(loader=FileSystemLoader('./templates/'))
    output_dir = os.path.join(os.path.dirname(__file__), 'output')

    def __init__(self, deploy=False):
        if deploy:
            self.def_cntx = dict(SITE_ROOT='http://www.initc3.org')
        else:
            self.def_cntx = dict(SITE_ROOT=Engine.output_dir)
        print 'deploy: ' + str(deploy)
        if exists(Engine.output_dir):
            shutil.rmtree(Engine.output_dir)
        os.mkdir(Engine.output_dir)

        self.env.filters['dateformat'] = dateformat

    def render(self, temp, cntx):
        x = copy.copy(cntx)
        x.update(self.def_cntx)
        return temp.render(x)

    def write(self, content, filename):
        with open(filename, 'w') as f:
            f.write(content)

    def write_utf8(self, content, filename):
        try:
            out = content.encode('utf-8')
        except:
            raise

        self.write(out, filename)

    def render_and_write(self, template, cntx, path):
        self.write_utf8(self.render(template, cntx), path)

    def default_context(self):
        return copy.copy(self.def_cntx)

    def calc_output_fullpath(self, fn):
        return os.path.join(self.output_dir, fn)

    def sanitize_filename(self, fn):
        s = re.sub('\s', '-', fn)
        return re.sub('[^0-9a-zA-Z-]', '', s)
