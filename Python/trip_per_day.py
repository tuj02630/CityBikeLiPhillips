import csv
from datetime import datetime

# read in the data from the CSV file
with open('./res/2013-12-Citi Bike trip data.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    data = list(reader)

# loop through the data and count the number of trips per day
trips_per_day = {}
for row in data:
    date_key = datetime.strptime(row['starttime'], '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
    if date_key not in trips_per_day:
        trips_per_day[date_key] = 1
    else:
        trips_per_day[date_key] += 1

print(trips_per_day)

with open('./output/test/trips_per_day_2013_12.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['date', 'trips'])
    for date, trips in trips_per_day.items():
        writer.writerow([date, trips])