class StepCal{
    step = 0  // 步数
    num = 5  // 数组大小
    diffValue = [0,0,0,0,0]  // 实际波峰波谷差值的变量
    diffCount = 0  // 实际波峰波谷差值的数量
    Up = false  // 波形上升标识位
    UpCount = 0  // 上升次数
    UpCount_before = 0  // 上一点持续上升的次数
    DownCount_before = 0  // 上一次持续下降的次数
    DownCount = 0  // 下降次数
    State_before = false  // 上一点的状态，上升还是下降
    peak = 0  // 波峰值
    valley = 0  // 波谷值
    peakTime_now = 0  // 此次波峰的时间
    peakTime_before = 0  // 上次波峰的时间
    timeOfNow = 0  // 当前的时间
    sensor_old = 0  // 上次传感器的值

    // 控制参数
    init_limit_value = 0.3   // 初始阈值
    Auto_limit_value = 0.3  // 动态阈值需要动态的数据，这个值用于这些动态数据的阈值
    PEAK_TIME_DIFF = 400  // 满足条件--两个波峰的时间差
    UP_DOWN_COUNT = 10 // 满足条件--上升或者下降的连续次数
    Es = [0]  // 当前横坐标
    Ns = [0]  // 当前纵坐标
    angle = 0.0  // 角度
    num_of_one_type = 0

    cheack_peak(new_value,old_value) {
      this.State_before = this.Up
      if(new_value>=old_value){
        this.Up = true
        this.UpCount = this.UpCount + 1
        this.DownCount_before = this.DownCount
        this.DownCount = 0
      }else{
        this.UpCount_before = this.UpCount
        this.UpCount = 0
        this.DownCount = this.DownCount + 1
        this.Up = false
      }
      if(this.Up === false && (this.UpCount_before>=this.UP_DOWN_COUNT)){
        this.peak = old_value
        return true
      }else if(this.State_before === false && this.Up === true && this.DownCount_before >= this.UP_DOWN_COUNT){
        this.valley = old_value
        return false
      }else{
        return false
      }
    }
    average_value(value,n){
      var ave = 0
      for (let index = 0; index < n; index++) {
        ave = ave + value[index]
      }
      ave = ave/n
      return ave
    }
    limit_value_upDate(value){
      var temp = this.Auto_limit_value
      if(this.diffCount < this.num) {
        this.diffValue[this.diffCount] = value
        this.diffCount = this.diffCount + 1
      }else{
        temp = this.average_value(this.diffValue,this.num)
        for (let index = 1; index < this.num; index++) {
          this.diffValue[index-1] = this.diffValue[index]
        }
        this.diffValue[this.num-1] = value
      }
      return temp
    }

    step_run(values,angle){
      if(this.sensor_old !== 0){
        this.num_of_one_type = this.num_of_one_type + 1
        this.angle = this.angle + angle
        if(this.cheack_peak(values,this.sensor_old)){
          this.peakTime_before = this.peakTime_now
          if(this.timeOfNow-this.peakTime_before>=this.PEAK_TIME_DIFF && (this.peak - this.valley>=this.Auto_limit_value)){
            this.peakTime_now = this.timeOfNow
            this.step = this.step + 1
            console.log(this.UpCount_before)
          }
          if(this.timeOfNow - this.peakTime_before>=this.PEAK_TIME_DIFF &&(this.peak-this.valley>this.init_limit_value)){
            this.peakTime_now = this.timeOfNow
            // this.Auto_limit_value = this.limit_value_upDate(this.peak-this.valley)
          }
        }
      }else{
        this.peakTime_now = this.timeOfNow
        this.peakTime_before = this.peakTime_now
        this.peak = values
      }
      this.sensor_old = values
    }
}