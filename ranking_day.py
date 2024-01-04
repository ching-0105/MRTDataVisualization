import pandas as pd
import os


directory = "datasets"
files = os.listdir(directory)
sort_files = sorted(files)

columns = ['date', 'enter_station', 'leave_station', 'sum_counts']
total_df = pd.DataFrame(columns=columns)
# print(f'total_df:{total_df}')

for file in sort_files:
    filepath = os.path.join(directory, file)
    print(f'Processing {file}...')

    df = pd.read_csv(filepath)
    df.rename(columns={'日期': 'date', '時段': 'time', '進站': 'enter_station', '出站': 'leave_station', '人次': 'counts'}, inplace=True)
    df = df.drop(['time'], axis=1)
    # print(df.head())

    grouped_columns = ['date', 'enter_station', 'leave_station']
    grouped_df = df.groupby(grouped_columns).sum().reset_index()
    grouped_df.rename(columns={'counts': 'sum_counts'}, inplace=True)
    print(f'grouped_df:{df}')

    dates_arr = grouped_df['date'].unique()
    tmp_grouped = grouped_df.groupby(['date'])
    for dates in dates_arr:
        tmp = tmp_grouped.get_group(dates)
        tmp = tmp.sort_values(by=['sum_counts'], ascending=False).reset_index(drop=True)
        tmp['rank'] = tmp.index + 1
        
        print(tmp.shape)

        total_df = pd.concat([total_df, tmp.head(50)])
    


    # if file == "201701.csv":
    #     break

print(f'total_df:\n{total_df}')
total_df = total_df.astype({'rank':'int'})
total_df = total_df.reset_index(drop=True)
total_df.to_csv("ranking_day.csv", index=False)

