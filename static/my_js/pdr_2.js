
var oriValuesX = []
var oriValuesY = []

var oriValuesSqrt = []
var oriValuesZ = []
var timeX = []

var x = 0
var y = 0
var z = 0

var startTime = new Date().getTime()

var string = '';
const stepCal = new StepCal()
let step = 0
document.getElementById('showStep').innerHTML = step
if (window.DeviceMotionEvent){
    window.addEventListener('devicemotion', function (eventData){
        var currTime = new Date().getTime();
        var diffTimme = currTime-startTime;

        var acceleration = eventData.accelerationIncludingGravity
        x = acceleration.x
        y = acceleration.y
        z = acceleration.z
        oriValuesX.push(x)
        oriValuesY.push(y)
        oriValuesZ.push(z)
        timeX.push(diffTimme)
        oriValuesSqrt.push(Math.sqrt(x*x+y*y+z*z)-9.7936)

        stepCal.step_run(oriValuesSqrt[oriValuesSqrt.length-1],0)
        if(step !== stepCal.step) {
            step = stepCal.step
            console.log(step)
            document.getElementById('showStep').innerHTML = step
        }
        stepCal.timeOfNow = diffTimme
        console.log(timeX.length)

        // else if ((timeX.length-400)%50===0) {
        //    var resultData = myFFT(oriValuesSqrt.slice(oriValuesSqrt.length-800))
        //     for (let i = -50; i < 0; i++) {
        //         stepCal.step_run(resultData[oriValuesSqrt.length+i],0)
        //         if(step !== stepCal.step) {
        //             step = stepCal.step
        //             console.log(step)
        //             document.getElementById('showStep').innerHTML = step
        //         }
        //         stepCal.timeOfNow = diffTimme
        //     }
        // }


        // if (diffTimme<13600){
        //     if (Math.abs(oriValuesSqrt[oriValuesSqrt.length-1])>1) {
        //         alert("请保持手机稳定")
        //         oriValuesX = []
        //         oriValuesY = []
        //         oriValuesSqrt = []
        //         oriValuesZ = []
        //         timeX = []
        //         x = 0
        //         y = 0
        //         z = 0
        //         startTime = new Date().getTime()
        //     }
        // }
        // if (diffTimme>13600){
        //     closeWindow()
        // }

        // var _listTimeX = {}
        // var _listOriValuesSqrt = {}
        // if (timeX.length===1600){
        //     for (let i = 0; i < 1600; i++) {
        //         _listTimeX[i] = timeX[i]
        //         _listOriValuesSqrt[i] = oriValuesSqrt[i]
        //     }
        //     alert(_listTimeX)
        //     $.ajax({
        //         url:"https://ar-test.app.wshunli.cc//cal_step",
        //         type: "POST",
        //         data:{"timeX":JSON.stringify(_listTimeX),"OriValuesSqrt":JSON.stringify(_listOriValuesSqrt)}
        //     })
        // }
    })
}


function showWindow(){
    console.log("灰")
    $('#showdiv').show();
    $('#cover').css('display','block')
    $('#cover').css('height',document.body.clientHeight + 'px')
}
    // 关闭弹窗
function closeWindow() {
    $('#showdiv').hide();  //隐藏弹窗
    $('#cover').css('display', 'none');   //显示遮罩层
}

function drawToCanvas(element_id, data, max, min) {
  const element = document.getElementById(element_id);
  const width = element.clientWidth;
  const height = element.clientHeight;
  const n = data.length;
  const canvas = document.getElementById(element_id+"_canvas")
  canvas.width = width;
  canvas.height = height;

  // element.appendChild(canvas);

  const context = canvas.getContext('2d');
  context.strokeStyle = 'blue';
  context.beginPath();
  data.forEach((c_value, i) => {
    context.lineTo(i * width / n, height * (max - c_value.real)/(max - min));
  });
  context.stroke();
}

function myFFT(inputDataReal){
    const data = new ComplexArray(inputDataReal.length)
    data.map((value, i)=>{
        value.real = inputDataReal[i]
        value.imag = 0
    })
    let max = Math.max(...inputDataReal)
    let min = Math.min(...inputDataReal)
    console.log(max)
    console.log(min)
    drawToCanvas("original", data, max, min)
    data.FFT();
    var maxFft = -9999
    data.map((value, i)=>{
        let temp = Math.sqrt(Math.pow(value.real, 2)+Math.pow(value.imag, 2));
        if (temp>maxFft){
            maxFft = temp
        }
    })
    drawToCanvas('fft', data, maxFft, -maxFft);
    data.map((value, i)=>{
        let temp = Math.sqrt(Math.pow(value.real, 2)+Math.pow(value.imag, 2));
        if (temp<2){
            value.real = 0
            value.imag = 0
        }
    })
    drawToCanvas('fft_filtered', data, maxFft, -maxFft)
    data.InvFFT()
    // drawToCanvas('original_filtered', data, max, min);
    console.log(data)
    var resultData = []
    data.map((value, i)=>{
        value.imag = 0
        resultData.push(value.real)
    })
    drawToCanvas('original_filtered', data, max, min);
    return resultData



}

