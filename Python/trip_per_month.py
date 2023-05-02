import os
import csv

# Set the directory path for your CSV files
csv_dir = "d:\Temple_IST\citidata\csv"


# Initialize an empty list to store the row counts for each file
row_counts = []

# Loop through each file in the directory
for filename in os.listdir(csv_dir):
    if filename.endswith('.csv'):
        # Open the file and count the number of rows (excluding the header row)
        with open(os.path.join(csv_dir, filename), 'r') as csv_file:
            reader = csv.reader(csv_file)
            num_rows = sum(1 for row in reader) - 1
            row_counts.append([filename, num_rows])

# Export the row counts to a new CSV file
with open('row_counts.csv', 'w', newline='') as output_file:
    writer = csv.writer(output_file)
    writer.writerow(['Filename', 'NumRows'])
    writer.writerows(row_counts)