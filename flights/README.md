```python
import pandas
df = pandas.read_csv('/content/drive/MyDrive/flights.csv')
slim = df[["MONTH","DAY","ORIGIN_AIRPORT", "DESTINATION_AIRPORT", "ARRIVAL_DELAY", "ELAPSED_TIME", "DIVERTED", "CANCELLED"]].copy()
for i in range(1,13):
  monthly = slim.loc[slim["MONTH"] == i ]
  monthly.to_csv('flights.monthly.' + str(i) + '.csv')
```
