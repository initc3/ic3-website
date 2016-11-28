To press maintainer
====================

`pressroll-all.csv` and `pressroll-featured.csv` are the only two files 
that the other parts of the system care. So updating press is as simple as

1. add / update news in `pressroll.ods.`
2. `make` to generate the aforementioned two CSV files
3. commit both `pressroll-all.csv` and `pressroll-featured.csv` and push

Travis-CI will do the rest (compilation, deployment, etc.)
