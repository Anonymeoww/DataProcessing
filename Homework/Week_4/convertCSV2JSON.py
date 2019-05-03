# !/usr/bin/env python
# Name:             Dilisha C. Jethoe
# Student number:   12523186
"""
This script parses data from csv files and writes them to JSON format.
"""

import csv
import json

INPUT_FILE = 'top2018.csv'
JSON_FILE = 'top2018.json'

#Read CSV File
def read_csv(INPUT_FILE, JSON_FILE):
    csv_rows = []
    with open(INPUT_FILE) as csvfile:
        reader = csv.DictReader(csvfile, delimiter = ',')
        title = reader.fieldnames

        for row in reader:
            csv_rows.extend([{title[i]:row[title[i]] for i in range(len(title))}])
        write_json(csv_rows, JSON_FILE)

#Convert csv data into json and write it
def write_json(data, JSON_FILE):
    with open(JSON_FILE, "w") as f:
            f.write(json.dumps(data))

if __name__ == "__main__":
    read_csv(INPUT_FILE, JSON_FILE)
