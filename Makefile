all:
	make -C content/press -f Makefile.travis
	python3 main.py --deploy

deploy:
	aws s3 sync output s3://staging.initc3.org --delete