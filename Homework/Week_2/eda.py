# !/usr/bin/env python
# Name:             Dilisha C. Jethoe
# Student number:   12523186
"""
This script does something.
"""

import csv
import pandas


if __name__ == "__main__":

    df = pandas.read_csv('input.csv')

    #find all rows with one or more missing values
    null_data = df[df.isnull().any(axis=1)]
    print(null_data)