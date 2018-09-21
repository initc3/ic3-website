all: pressroll-all.csv pressroll-featured.csv

pressroll-all.csv: pressroll.csv Makefile
	cat pressroll.csv | sed 1,2d > pressroll-all.csv

pressroll-featured.csv: pressroll.csv Makefile
	cat pressroll.csv | sed 1,2d | grep feature > pressroll-featured.csv

pressroll.csv: pressroll.ods Makefile
	unoconv -l &\
	unoconv -v -f csv -e FilterOptions="59,34,0,1" $<

clean:
	rm -f *~

clobber: clean
	rm -f pressroll.csv pressroll-all.csv pressroll-featured.csv


