import csv

# read in the data from the provided dataset
with open('./res/rebalanced_per_month.csv', 'r') as file:
    reader = csv.DictReader(file)
    data = [row for row in reader]

# create a dictionary to store the total number of bikes rented each year
yearly_totals = {}

# iterate through the data and sum up the number of bikes rented for each year
for row in data:
    year = row['date'][:4]
    bikes = int(row['bikes'])
    if year in yearly_totals:
        yearly_totals[year] += bikes
    else:
        yearly_totals[year] = bikes

# write the yearly totals to a CSV file
with open('./output/re_bikes_per_year.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Year', 'Bikes'])
    for year, total in yearly_totals.items():
        writer.writerow([year, total])
