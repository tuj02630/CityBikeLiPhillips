import csv
import datetime
import os
import glob

# define the directory path where the CSV files are located
csv_dir = 'd:\Temple_IST\citidata\csv'

# find all CSV files in the directory
csv_files = glob.glob(os.path.join(csv_dir, '*.csv'))

# create a dictionary to store the rebalanced bike numbers for each file
rebalanced_bikes_dict = {}

# loop through each CSV file and calculate rebalanced bike numbers
for csv_file in csv_files:
    # read in the data from the CSV file
    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        data = list(reader)
    # 2021-01-01 00:08:33.1490","2021-01-01 00:52:43.3860
    # format the data and sort by bike ID and trip start time
    data = sorted(data, key=lambda x: (int(x['bikeid']), datetime.datetime.strptime(x['starttime'], '%Y-%m-%d %H:%M:%S.%f')))
    # loop through the data and identify instances where bikes were "teleported"
    rebalanced_bikes = 0
    for i in range(1, len(data)):
        current_trip = data[i]
        prev_trip = data[i-1]
        if current_trip['bikeid'] == prev_trip['bikeid']:
            if current_trip['start station id'] != prev_trip['end station id']:
                # bike was "teleported" - increment the rebalanced_bikes count
                rebalanced_bikes += 1

    # add the file name and rebalanced bike count to the rebalanced_bikes_dict
    rebalanced_bikes_dict[os.path.basename(csv_file)] = rebalanced_bikes

# write the output to a new CSV file called rebalance_totals.csv
with open('rebalance_totals.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['file', 'rebalanced_bikes'])
    for file, bikes in rebalanced_bikes_dict.items():
        writer.writerow([file, bikes])
