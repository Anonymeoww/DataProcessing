# !/usr/bin/env python
# Name:             Dilisha C. Jethoe
# Student number:   12523186
"""
This script cleans and preprocesses the data from the inputfile.
It then analyzes the data, using central tendency and a five number summary as boxplot.
The cleaned data is written to a JSON file.
Running this script will generate all central tendency elements and a boxplot.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

INPUT_DATA = 'input.csv'
OUTPUT_JSON = 'data.json'


def data_cleaning(datafile):
    """
    This function selects and cleans the relevant data from the csv file.
    Subset includes: Country, Region, Pop. Density (per sq. mi.),
    Infant mortality (per 1000 births) and GDP ($ per capita) dollars.
    """

    # Load data from csv, create subset
    df = pd.read_csv(datafile)
    df = df[['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)',
             'GDP ($ per capita) dollars']]

    # Remove unwanted whitespace
    df['Country'] = df['Country'].str.strip()
    df['Region'] = df['Region'].str.strip()

    # Strip the word 'dollars' in this column
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.strip(" dollars")

    # Find and replace all unknown values with nan
    df = df.replace('unknown', np.nan)

    # Change commas into dots, change datatype from string to float
    df = df.replace(',', '.', regex=True)
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].astype(float)
    df["Infant mortality (per 1000 births)"] = df["Infant mortality (per 1000 births)"].astype(float)

    # Visual analysis of data: the GDP for Surinam was incorrect. Value was manually changed to nan.
    df.at[193, 'GDP ($ per capita) dollars'] = np.nan

    return df

def central_tendency(df):
    """
    Calculates and prints the central tendency for the data about GDP.
    """

    mean = df['GDP ($ per capita) dollars'].mean(skipna=True)
    median = df['GDP ($ per capita) dollars'].median(skipna=True)
    mode = df['GDP ($ per capita) dollars'].mode()[0]

    print(f"\nCentral Tendency values for the GDP per capita")
    print('Mean:    %.2f' % mean)
    print('Median:  %i' % median)
    print('Mode:    %i\n' % mode)

def fn_summary(df):
    """
    Calculates and prints the Five Number Summary for the data about infant mortality.
    """

    quartiles = np.nanpercentile(df["Infant mortality (per 1000 births)"], [25, 50, 75])
    data_min, data_max = df["Infant mortality (per 1000 births)"].min(skipna=True), \
                         df["Infant mortality (per 1000 births)"].max(skipna=True)

    print(f"Five number summary for infant mortality")
    print('Min:    %.2f' % data_min)
    print('Q1:     %.2f' % quartiles[0])
    print('Median: %.2f' % quartiles[1])
    print('Q3:     %.2f' % quartiles[2])
    print('Max:    %.2f' % data_max)

def create_boxplot(df):
    """
    Create boxplot showing the distribution of infant mortality worldwide, and per region.
    """

    df.boxplot(column = ['Infant mortality (per 1000 births)'])
    plt.title('Distribution of worldwide infant mortality')
    plt.ylabel('Deaths per 1000 births')
    plt.show()

    df.boxplot(column = ['Infant mortality (per 1000 births)'], by = 'Region')
    plt.title('Distribution of infant mortality per region')
    plt.xticks(rotation='vertical')
    plt.suptitle("")
    plt.ylabel('Deaths per 1000 births')
    plt.show()

def create_histogram(df):
    """
    Create histogram showing the distribution of infant mortality worldwide.
    """

    df['GDP ($ per capita) dollars'].plot.hist(bins = 100, grid = True)
    plt.axis([0, 60000, 0, 28])
    plt.title('Distribution of GDP per country')
    plt.show()

def write_json(df):
    """
    Writes the cleaned data to a JSON file with a structured orientation.
    """

    df = df.set_index("Country").to_json(OUTPUT_JSON, orient='index')

if __name__ == "__main__":

    df = data_cleaning(INPUT_DATA)
    central_tendency(df)
    fn_summary(df)
    create_boxplot(df)
    create_histogram(df)
    write_json(df)
