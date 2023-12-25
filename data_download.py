import requests
import pandas as pd
import os

def download_csv(url, fname ,output_folder='datasets'):
    # 檢查輸出文件夾是否存在，如果不存在，則創建它
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 文件名
    file_name = str(fname) + '.csv'

    # 設置輸出文件的完整路徑
    output_path = os.path.join(output_folder, file_name)

    # 下載文件
    response = requests.get(url)
    with open(output_path, 'wb') as file:
        file.write(response.content)
    
    print(f'{file_name} 下載完成')

 
response = requests.get('https://data.taipei/api/dataset/63f31c7e-7fc3-418b-bd82-b95158755b4d/resource/eb481f58-1238-4cff-8caa-fa7bb20cb4f4/download')

with open('urls.csv', 'wb') as file:
	file.write(response.content)
	file.close()
	
df = pd.read_csv('urls.csv')
# loop through the rows using iterrows()
for index, row in df.iterrows():
  download_csv(row['URL'], row['年月'])