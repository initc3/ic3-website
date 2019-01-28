#!/bin/bash

SITE_DIR=output
find $SITE_DIR \( -iname '*.html' -o -iname '*.css' -o -iname '*.js' \) -exec echo "gzipping" {}\; \
    -exec gzip -9 -n {} \; \
	-exec mv {}.gz {} \;
