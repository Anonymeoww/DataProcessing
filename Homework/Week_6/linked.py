# !/usr/bin/env python
# Name:             Dilisha C. Jethoe
# Student number:   12523186
"""
This script cleans and preprocesses the data from the inputfile.
The cleaned data is written to a JSON file.
https://www.kaggle.com/rounakbanik/the-movies-dataset#movies_metadata.csv
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

INPUT_DATA = 'movies_metadata.csv'
OUTPUT_JSON = 'movies_data.json'


def data_cleaning(datafile):
    """
    This function selects and cleans the relevant data from the csv file.
    Subset includes: Country, Region, Pop. Density (per sq. mi.),
    Infant mortality (per 1000 births) and GDP ($ per capita) dollars.
    """

    # Load data from csv, create subset
    df = pd.read_csv(datafile)
    df = df[['budget', 'genres', 'original_language','original_title', 'production_countries', 'release_date']]
    df["adult"] = df['adult'].astype('bool')

    print(df.dtypes)

    # # Remove unwanted whitespace
    # df['Country'] = df['Country'].str.strip()
    # df['Region'] = df['Region'].str.strip()
    #
    # # Strip the word 'dollars' in this column
    # df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.strip(" dollars")
    #
    # # Find and replace all unknown values with nan
    # df = df.replace('unknown', np.nan)
    #
    # # Change commas into dots, change datatype from string to float
    # df = df.replace(',', '.', regex=True)
    # df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].astype(float)
    # df["Infant mortality (per 1000 births)"] = df["Infant mortality (per 1000 births)"].astype(float)
    #
    # # Visual analysis of data: the GDP for Surinam was incorrect. Value was manually changed to nan.
    # df.at[193, 'GDP ($ per capita) dollars'] = np.nan
    #
    # return df


def write_json(df):
    """
    Writes the cleaned data to a JSON file with a structured orientation.
    """

    df = df.set_index("Country").to_json(OUTPUT_JSON, orient='index')

if __name__ == "__main__":

    df = data_cleaning(INPUT_DATA)
    # write_json(df)
