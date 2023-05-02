import csv
from datetime import datetime

# read in the data from the CSV file
with open('./res/2013-12-Citi Bike trip data.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    data = list(reader)

# format the data and sort by bike ID and trip start time
data = sorted(data, key=lambda x: (int(x['bikeid']), datetime.strptime(x['starttime'], '%Y-%m-%d %H:%M:%S')))

# loop through the data and identify instances where bikes were "teleported"
rebalanced_bikes = {}
for i in range(1, len(data)):
    current_trip = data[i]
    prev_trip = data[i-1]
    if current_trip['bikeid'] == prev_trip['bikeid']:
        if current_trip['start station id'] != prev_trip['end station id']:
            # bike was "teleported" - add it to the rebalanced_bikes dictionary
            date_key = datetime.strptime(prev_trip['starttime'], '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d')
            if date_key not in rebalanced_bikes:
                rebalanced_bikes[date_key] = 1
            else:
                rebalanced_bikes[date_key] += 1

# sort the rebalanced_bikes dictionary by date key
sorted_rebalanced_bikes = dict(sorted(rebalanced_bikes.items()))

# write the output to a CSV file
with open('./output/test/rebalance_per_day_2013_12.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['date', 'bikes'])
    for date, bikes in sorted_rebalanced_bikes.items():
        writer.writerow([date, bikes])
