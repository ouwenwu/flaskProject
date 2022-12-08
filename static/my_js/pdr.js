

var oriValuesX = []
var oriValuesY = []

var oriValuesSqrt = []
var oriValuesZ = []
var timeX = []

var x=y=z=0

var startTime = new Date().getTime()

var string = '';
// import FFT from './fft'
const FFT = FFTJS
// const stepCal = new StepCal()
// let step = 0
if (window.DeviceMotionEvent){
    window.addEventListener('devicemotion', function (eventData){
        const f = new FFT(32);
        const out = f.createComplexArray();
        var currTime = new Date().getTime();

        var diffTimme = currTime-startTime;
        var showdata = ''

        timeX.push(diffTimme)
        var acceleration = eventData.accelerationIncludingGravity
        x = acceleration.x
        y = acceleration.y
        z = acceleration.z
        oriValuesX.push(x)
        oriValuesY.push(y)
        oriValuesZ.push(z)
        oriValuesSqrt.push(Math.sqrt(x*x+y*y+z*z))
        var _listTimeX = {}
        var _listOriValuesSqrt = {}
        if (timeX.length===1600){
            for (let i = 0; i < 1600; i++) {
                _listTimeX[i] = timeX[i]
                _listOriValuesSqrt[i] = oriValuesSqrt[i]
            }
            alert(_listTimeX)
            $.ajax({
                url:"https://ar-test.app.wshunli.cc//cal_step",
                type: "POST",
                data:{"timeX":JSON.stringify(_listTimeX),"OriValuesSqrt":JSON.stringify(_listOriValuesSqrt)}
            })
        }

        // stepCal.step_run(oriValuesSqrt[oriValuesSqrt.length-1],0)
        // if(step !== stepCal.step){
        //     step = stepCal.step
        //     console.log(step)
        // }
        // stepCal.timeOfNow = diffTimme
        // if(timeX.length===32){
        //     // line()
        //     for(var i = 0; i<oriValuesSqrt.length;i++){
        //         showdata = showdata + (timeX[i]+":"+oriValuesSqrt[i])
        //     }
        //     var oriValuesSqrt_dict = {"data":oriValuesSqrt}
        //     console.log(oriValuesSqrt)
        //     f.realTransform(out, oriValuesSqrt)
        //     console.log(out)
        //     const data = f.toComplexArray(oriValuesSqrt)
        //     f.inverseTransform(data, out);
        //     console.log(data)
        // }else if (timeX.length > 32){
        //     timeX.shift()
        //     oriValuesX.shift()
        //     oriValuesY.shift()
        //     oriValuesZ.shift()
        //     oriValuesSqrt.shift()
        //     // console.log(timeX[199],timeX.length)
        //     // line()
        //
        //     // const input = new Array(4096)
        //
        // }
    })
}

var line = function() {

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeX,
            datasets: [
                {
                    label: "x",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: oriValuesX,
                    spanGaps: false,
                },
                {
                    label: "y",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(255, 99, 132, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: oriValuesY,
                    spanGaps: false,
                },
                {
                    label: "z",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(153, 102, 255, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(153, 102, 255, 1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: oriValuesZ,
                    spanGaps: false,
                },
                {
                    label: "sqrt",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(54, 162, 235, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: oriValuesSqrt,
                    spanGaps: false,
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
};