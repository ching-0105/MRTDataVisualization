import pandas as pd
import numpy as np
import os
from IPython.display import display

# Define a function to process each row
def process_row(row):
    date = row['日期']
    time = int(row['時段'])
    enter_station = row['進站']
    leave_station = row['出站']
    counts = int(row['人次'])

    # Append the results to the array
    result_array.append((f"{date} {time:02d}:00", enter_station, counts, 0))
    result_array.append((f"{date} {time:02d}:00", leave_station, 0, counts))

# create new dataframe
new_columns = ["DateTime", "Station", "EnterNum", "LeaveNum"]
final_df = pd.DataFrame(columns=new_columns)

directory = "datasets"
files = os.listdir(directory)
sort_files = sorted(files)

for filename in sort_files:
    filepath = os.path.join(directory, filename)
    print(filename)
    # if filename == "201702.csv":
    #     break
    
    original_df = pd.read_csv(filepath)

    # Create an array to store the results
    result_array = []

    # Apply the function to each row
    original_df.apply(process_row, axis=1)
    print("result",len(result_array))
    # Convert the array to a NumPy array
    result_array = np.array(result_array, dtype=[("DateTime", object), ("Station", object), ("EnterNum", int), ("LeaveNum", int)])

    # Create a new DataFrame from the NumPy array
    new_df = pd.DataFrame(result_array)

    # Group by station, DateTime, and sum the counts
    new_df = new_df.groupby(["DateTime", "Station"]).sum().reset_index()
    # new_df.head()
    # display(new_df)
    print("new_df", len(new_df))
    final_df = pd.concat([final_df,new_df],ignore_index=True)


final_df.to_csv("bigdata.csv",index = False)
# # Print the resulting dataframe
# print(new_df)
