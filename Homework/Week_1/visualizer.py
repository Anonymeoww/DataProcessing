#!/usr/bin/env python
# Name:             Dilisha C. Jethoe
# Student number:   12523186
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data

data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}
with open('movies.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        rating = float(row['Rating'])
        data_dict[row['Year']].append(rating)

# Aquire relevant data for plot

totalrating = []
totalyear = []
for year in data_dict:
    average = sum(data_dict[year]) / len(data_dict[year])
    totalrating.append(average)
    totalyear.append(int(year))

x = totalyear
y = totalrating
plt.plot(x, y)
plt.title('Average rating of top 50 IMDb movies per year')
plt.xlabel('Year')
plt.ylabel('Average rating')
plt.axis([2008, 2017, 0, 10])


if __name__ == "__main__":
    plt.show()

