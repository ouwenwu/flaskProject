import json

import openpyxl
from flask import Flask, render_template, request, jsonify

from main import Step
from util.Utils import base64ToImg

stepCal = Step()
app = Flask(__name__, static_folder='static')


# 页面路线
@app.route('/test')
def index():
    return render_template("index.html")


@app.route('/')
def test():
    return render_template("three.html")


@app.route('/camera')
def camera():
    return render_template("camera.html")


@app.route('/vise')
def vise():
    return render_template("vise.html")


@app.route('/pdr')
def pdr():
    return render_template("pdr.html")


@app.route('/pdr_2')
def pdr_2():
    return render_template("pdr_2.html")


@app.route('/geotiff')
def geotiff():
    return render_template("geotiff.html")


@app.route('/openlayer')
def openlayer():
    return render_template("openlayer.html")


@app.route('/openlayer_point')
def openlayer_point():
    return render_template("openlayer_point.html")


@app.route('/three-ar')
def three_ar():
    return render_template("three-ar.html")


@app.route('/camera_2')
def camera_2():
    return render_template("camera_2.html")


@app.route('/a_frame')
def a_frame():
    return render_template("a_frame.html")


@app.route('/gltfLoader')
def gltfLoader():
    return render_template("gltfLoader.html")


@app.route('/nft')
def nft():
    return render_template("nft.html")


# ajax 路线
@app.route('/if_newStep')
def if_newStep():
    global step
    print(step)
    temp = request.args.get('jsd_y')
    time = request.args.get('time')
    print(temp)
    if temp == "":
        m = step.step
        step = Step()
        step.step = m
    step.timeOfNow = time
    step.step_run(temp)
    return jsonify({'status': True, 'step': step.step})


@app.route('/wx_step')
def wx_step():
    m = 5
    return jsonify({"data": 5})


@app.route('/upLoadImg', methods=['POST'])
def upLoadImg():
    base_64 = request.form.get('base64')
    base64ToImg(base_64)
    return jsonify({"data": 5})


@app.route('/cal_step', methods=['POST'])
def cal_step():
    # timeX = request.form.get('timeX')
    # OriValuesSqrt = request.form.get('OriValuesSqrt')
    #
    # timeXJSON = json.loads(timeX)
    # OriValuesSqrtJSON = json.loads(OriValuesSqrt)
    # keys = timeXJSON.keys()
    # wb = openpyxl.Workbook()
    # ws = wb.active
    # for i in keys:
    #     ws.append([timeXJSON[i], OriValuesSqrtJSON[i]])
    # wb.save("test.xlsx")

    oriValuesSqrt = request.form.get('oriValuesSqrt')
    time = request.form.get('time')
    stepCal.timeOfNow = float(time)
    stepCal.step_run(float(oriValuesSqrt), 0)
    return jsonify({"data": stepCal.step})

if __name__ == '__main__':
    app.run(debug=True, ssl_context=('E:/code/python/flaskProject/static/ssl/ar-test.app.wshunli.cc_bundle.pem', 'E:/code/python/flaskProject/static/ssl/ar-test.app.wshunli.cc.key'))
