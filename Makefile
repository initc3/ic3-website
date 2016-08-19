site:
	python main.py -d

test:
	python main.py

deploy: site 
	aws s3 sync output s3://www.initc3.org
