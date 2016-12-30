To press maintainer
====================

The rest of the system only cares about `pressroll-all.csv` and `pressroll-featured.csv`. These are
updated by editing `pressroll.ods`. 

Each row of `pressroll.ods` is of the form 
    URL | Name of Source | Date of Publication | Title of Story | Who is Mentioned | Category | feature flag.

See `pressroll.ods` for examples for the last three columns; `Who is Mentioned` can be set to `all`, for general IC3-related news.

To update press, one

1. add / update news in `pressroll.ods.`
2. `make` to generate the aforementioned two CSV files
3. commit `pressroll-all.csv`, `pressroll-featured.csv`, and `pressroll.ods` and push

Travis-CI will do the rest (compilation, deployment, etc.)
