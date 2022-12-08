import numpy as np
import pandas as pd
import xlrd
import math


class Step(object):
    # 变量
    step = 0  # 步数
    num = 5  # 数组大小
    diffValue = np.zeros(num, dtype="float32")  # 实际波峰波谷差值的变量
    diffCount = 0  # 实际波峰波谷差值的数量
    Up = False  # 波形上升标识位
    UpCount = 0  # 上升次数
    UpCount_before = 0  # 上一点持续上升的次数
    DownCount_before = 0  # 上一次持续下降的次数
    DownCount = 0  # 下降次数
    State_before = False  # 上一点的状态，上升还是下降
    peak = 0  # 波峰值
    valley = 0  # 波谷值
    peakTime_now = 0  # 此次波峰的时间
    peakTime_before = 0  # 上次波峰的时间
    timeOfNow = 0  # 当前的时间
    sensor_old = 0  # 上次传感器的值

    # 控制参数
    init_limit_value = 0.05  # 初始阈值
    Auto_limit_value = 0.05 # 动态阈值需要动态的数据，这个值用于这些动态数据的阈值
    PEAK_TIME_DIFF = 400  # 满足条件--两个波峰的时间差
    UP_DOWN_COUNT = 2  # 满足条件--上升或者下降的连续次数

    def check_peak(self, new_value, old_value):
        self.State_before = self.Up
        if new_value >= old_value:
            self.Up = True
            self.UpCount = self.UpCount + 1
            self.DownCount_before = self.DownCount
            self.DownCount = 0
        else:
            self.UpCount_before = self.UpCount
            self.UpCount = 0

            self.DownCount = self.DownCount + 1
            self.Up = False
        # or old_value >= -0.9
        if self.Up is False and (self.UpCount_before >= self.UP_DOWN_COUNT):  # 当前下降之前上升位波峰
            self.peak = old_value
            return True
        elif self.State_before is False and self.Up is True and self.DownCount_before >= self.UP_DOWN_COUNT:  # 当前下降之前下降为波谷
            self.valley = old_value
            return False
        else:
            return False

    def limit_value_update(self, value):
        temp = self.Auto_limit_value
        if self.diffCount < self.num:
            self.diffValue[self.diffCount] = value
            self.diffCount = self.diffCount + 1
        else:
            temp = self.average_value(self.diffValue, self.num)
            for i in range(1, self.num):
                self.diffValue[i - 1] = self.diffValue[i]
            self.diffValue[self.num - 1] = value;
        return temp

    def average_value(self, value, n):
        ave = 0
        for i in range(n):
            ave = ave + value[i]
        ave = ave / n
        if ave >= 8:
            ave = 6.5
        elif 7 <= ave < 8:
            ave = 5.5
        elif 6 <= ave < 7:
            ave = 4.5
        else:
            ave = 3.5
        return ave

    def step_run(self, values):
        if self.sensor_old != 0:
            if self.check_peak(values, self.sensor_old):
                self.peakTime_before = self.peakTime_now
                if self.timeOfNow - self.peakTime_before >= self.PEAK_TIME_DIFF and (
                        self.peak - self.valley >= self.Auto_limit_value):
                    self.peakTime_now = self.timeOfNow
                    self.step = self.step + 1
                if self.timeOfNow - self.peakTime_before >= self.PEAK_TIME_DIFF and (
                        self.peak - self.valley > self.init_limit_value):
                    self.peakTime_now = self.timeOfNow
                    self.limit_value_update(self.peak - self.valley)
        else:
            self.peakTime_now = self.timeOfNow
            self.peakTime_before = self.timeOfNow
            self.peak = values
        self.sensor_old = values


step = Step()
# data_frame = pd.read_excel("E:/code/data1.xlsx", sheet_name="1663831798280-20220922-153133")
# data_frame.values
data_excel = xlrd.open_workbook("E:/code/python/flaskProject/test.xlsx")
table = data_excel.sheet_by_name("Sheet")
n_rows = table.nrows
n_cols = table.ncols
for i in range(800, n_rows):
    if i % 3 != 0:
        continue
    cols_list = table.row(rowx=i)
    temp = cols_list[1].value
    if temp == "":
        m = step.step
        step = Step()
        step.step = m
        continue
    step.timeOfNow = cols_list[0].value

    step.step_run(temp)
print(step.step)
