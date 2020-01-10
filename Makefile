site:
	python main.py --deploy

test:
	python main.py

deploy: site
	aws s3 sync output s3://www.initc3.org --delete
