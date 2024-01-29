# Redlining 

The rise of redlining as a structural force dates to a pre-World War II drive to categorize areas by how risky an investment in real estate in those areas would be. The maps that were drawn as a part of this process overwhelmingly rated areas containing African-American neighborhoods as risky investments. Post-war, these same maps were effectively codified by the government as it saught to address the housing boom, with insurance companies quickly following suit. Understanding the profound effects of this practice today is an important step into understanding structural racism in America. 

## The Data

To explore the impacts of the original HOLC[^1] grades (and thus, redlining), we need a few things things:

* An idea of what and where we want to explore
* HOLC data for a given location
* Data for that same location

### HOLC Data 

The HOLC data cuts across neighborhoods, zip codes, and other convenient lines of demarcation, and thus surfaces a common problem when attempting to connect data. How can we connect different data sources. One solution here is the use of a data source from  [diversitydatakids.org](https://data.diversitydatakids.org/dataset/holc_census_tracts-home-owner-loan-corporation--holc--neighborhood-grades-for-us-census-tracts) which is: 

> a comprehensive research program to monitor the state of wellbeing, diversity, opportunity and equity of U.S. children. The project is housed at the Institute for Child, Youth and Family Policy at the Heller School for Social Policy and Management at Brandeis University. The project is funded by the W.K. Kellogg Foundation and the Robert Wood Johnson Foundation.

The data here uses _Census Tracts_, the way that the US Census draws neighborhoods, as the area of interest. 

> In the U.S., census tracts are "designed to be relatively homogeneous units with respect to population characteristics, economic status, and living conditions" and "average about 4,000 inhabitants". [Wikipedia](https://en.wikipedia.org/wiki/Census_tract#cite_note-4)

The rating that is given for a particular tract is a plurality of the census tract, but it also includes more granular ratings such as "Mostly B, some C," as well as the numerical data that gave rise to the ratings. Using census tracts is extremely convenient because of their broad use.[^2]

### Other Data

Now that we have HOLC data by census tract, any data source we find that _also uses census tracts_ can now be tied together and an exploration can occur. For this example, the other data source is data about housing prices called the [Housing Price Index](https://www.fhfa.gov/DataTools/Downloads/Pages/House-Price-Index.aspx) for that tract. The HPI is a metric that: 

> serves as a timely, accurate indicator of house price trends at various geographic levels. Because of the breadth of the sample, it provides more information than is available in other house price indexes. It also provides housing economists with an improved analytical tool that is useful for estimating changes in the rates of mortgage defaults, prepayments and housing affordability in specific geographic areas

So now we are tying current housing prices to these historical mappings to see what the relationship is. Visualizing this could be a powerful reckoning with the past. 

## The Example 

The code that is here actually doesn't do a very good job of this, becuase I've chosen to show the data on a state-wide basis, whereas the original data was more about cities. Still, the connecting the information is the key skill here. One could imagine, instead, of finding _another_ data source that contains, say, [shape information data for census tracts](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html), and then visualize housing prices in those areas. 

Even though the visualization here doesn't show granular detail, I think it still shows some interesting information. A far better example:

[The Legacy of Structural Racism in Philadelphia](https://controller.phila.gov/philadelphia-audits/mapping-the-legacy-of-structural-racism-in-philadelphia/)

<!--- Footnotes -->
# Footnotes

[^1]: The company originally involved in making these maps was the Home Owners' Loan Corporation (HOLC).
[^2]: Especially with governmental data, which is free (in that we've already paid for it).
