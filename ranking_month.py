import pandas as pd
import os
from datetime import datetime


directory = "datasets"
files = os.listdir(directory)
sort_files = sorted(files)

columns = ['date', 'enter_station', 'leave_station', 'sum_counts', 'rank']
total_df = pd.DataFrame(columns=columns)
# print(f'total_df:{total_df}')

for file in sort_files:
    filepath = os.path.join(directory, file)
    print(f'Processing {file}...')

    df = pd.read_csv(filepath)
    df.rename(columns={'日期': 'date', '時段': 'time', '進站': 'enter_station', '出站': 'leave_station', '人次': 'counts'}, inplace=True)

    # 選擇其中一筆資料
    selected_row = df.iloc[0]

    # 從選擇的列中擷取年份和月份資料
    date_data = selected_row['date']
    # date_as_datetime = pd.to_datetime(date_data)
    # year = date_as_datetime.year
    # month = date_as_datetime.month
    date = date_data[0:7]
    filtered_df = df.drop(['time', 'date'], axis=1)

    grouped_columns = ['enter_station', 'leave_station']
    grouped_df = filtered_df.groupby(grouped_columns).sum().reset_index()
    grouped_df.rename(columns={'counts': 'sum_counts'}, inplace=True)

    tmp = grouped_df.sort_values(by=['sum_counts'], ascending=False).reset_index(drop=True)
    tmp['rank'] = tmp.index + 1
    tmp['date'] = date

    total_df = pd.concat([total_df, tmp.head(50)])
    print(f'累積到{file}, {total_df.shape}')
    


    # if file == "201701.csv":
    #     break

total_df = total_df.astype({'rank':'int'})
total_df = total_df.reset_index(drop=True)
print(f'total_df:\n{total_df}')
total_df.to_csv("ranking_month50.csv", index=False)

