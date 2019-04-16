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
import statistics as st
import matplotlib.pyplot as plt

INPUT_DATA = 'input.csv'
#OUTPUT_JSON = ...


def data_cleaning(df):

    # Remove whitespace
    df['Region'] = df['Region'].str.strip()

    # Drop all irrelevant columns for this problem
    cols = [2, 3, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    df.drop(df.columns[cols], axis=1, inplace=True)
    # print(df.columns)

    # Find and drop all rows with one or more missing or unknown values
    numbercols = ['Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']

    null_data = df[df.isnull().any(axis=1)]
    df = df.drop([47, 221, 223])

    unknown = (df.loc[df['Pop. Density (per sq. mi.)'] == 'unknown'])
    # print(unknown)
    unknown = (df.loc[df['Infant mortality (per 1000 births)'] == 'unknown'])
    # print(unknown)
    unknown = (df.loc[df['GDP ($ per capita) dollars'] == 'unknown'])
    # print(unknown)

    df = df.drop([10, 52, 93, 126, 179, 53, 102, 113, 182])

    # Strip the letters in column
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.strip(" dollars")

    # See all columns when printing dataframe
    pd.set_option("display.max_columns", None)

    # Change commas into dots
    df = df.replace(',', '.', regex=True)

    # When visually analyzing the data, I found that the data for Surinam was incorrect. I therefore delete this row.

    print(df.at()

    df[numbercols] = df[numbercols].apply(pd.to_numeric)

    return df


def central_tendency(df):

    mean = df['GDP ($ per capita) dollars'].mean()
    median = df['GDP ($ per capita) dollars'].median()
    mode = df['GDP ($ per capita) dollars'].mode()[0]
    stdev = st.stdev(df['GDP ($ per capita) dollars'])

    print(f"Central Tendency values for the GDP per capita\n"
          f"Mean:    {mean}\nMedian:  {median}\nMode:    {mode}\nSt.dev.: {stdev}")


def create_boxplot(df):

    # Create a figure instance
    fig = plt.figure(1, figsize=(9, 6))

    # Create an axes instance
    ax = fig.add_subplot(111)

    # Create the boxplot
    bp = ax.boxplot(df['Infant mortality (per 1000 births)'])
    plt.title('Average infant mortality (per 1000 births)')
    plt.xlabel('x')
    plt.ylabel('Number of deaths')

    plt.show()

def create_histogram(df):
    df['GDP ($ per capita) dollars'].plot.hist()

    plt.show()

def write_json():

    pass


if __name__ == "__main__":

    df = pd.read_csv(INPUT_DATA)
    df = data_cleaning(df)
    central_tendency(df)
    create_boxplot(df)
    create_histogram(df)
