all: pressroll-all.csv pressroll-featured.csv

pressroll-all.csv: pressroll.csv Makefile
	@cat pressroll.csv | sed 1,2d | grep IC3 > pressroll-all.csv

pressroll-featured.csv: pressroll.csv Makefile
	@cat pressroll.csv | sed 1,2d | grep IC3 | grep feature > pressroll-featured.csv

pressroll.csv: pressroll.ods
	@unoconv -f csv -e FilterOptions="59,34,0,1" $< 

clean:
	@rm -f *~

clobber: clean
	@rm -f pressroll-all.csv pressroll-featured.csv


