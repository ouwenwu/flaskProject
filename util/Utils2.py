import base64
import math
import os
import shutil
import xml.etree.ElementTree as ET
from pyquaternion import Quaternion

import numpy


def base64ToImg(base_64):
    base_64_array = base_64.split(",")[1]
    imgdata = base64.b64decode(base_64_array)
    file = open('static/img/1.jpeg', 'wb')
    file.write(imgdata)
    file.close()


def test():
    path = "E:/qunloufloor3/Pro1/all"
    des_path = "E:/qunloufloor3/Pro1/all_2"
    last_num = 181
    flag = True
    path_list = os.listdir(path)
    path_list.sort(key=lambda x: int(x.split("_")[1]))
    for filename in path_list:
        file_name_array = filename.split("_")
        now_num = int(file_name_array[1])
        if now_num == last_num:
            flag = True
            shutil.copy(os.path.join(path, filename), os.path.join(des_path, filename))
        elif flag is True:
            last_num = last_num + 60
            flag = False


def CLoud2Colmap_findInfo(Root):
    Block = Root.find("Block")
    Photogroups = Block.find("Photogroups")
    Photogroup = Photogroups.find("Photogroup")
    ImageDimensions_array = Photogroup.find("ImageDimensions")
    camerasWidth = int(ImageDimensions_array.find("Width").text)
    camerasHeight = int(ImageDimensions_array.find("Height").text)

    f_array = Photogroup.find("FocalLengthPixels")
    f = float(f_array.text)

    PrincipalPoint = Photogroup.find("PrincipalPoint")
    PrincipalPoint_x = float(PrincipalPoint.find("x").text)
    PrincipalPoint_y = float(PrincipalPoint.find("y").text)

    Distortion = Photogroup.find("Distortion")
    Distortion_k1 = Distortion.find("K1").text
    Distortion_k2 = Distortion.find("K2").text

    with open("E:/colmap/qunlouPro_3/camera/cameras1.txt", "w") as file:
        file.write('# Camera list with one line of data per camera:\n#   CAMERA_ID, MODEL, WIDTH, '
                   'HEIGHT, PARAMS[]\n# Number of cameras: 1\n')
        info = '1 RADIAL {0} {1} {2} {3} {4} {5} {6}\n'.format(
            camerasWidth, camerasHeight, f, PrincipalPoint_x,
            PrincipalPoint_y, Distortion_k1, Distortion_k2)
        file.write(info)
    # return camerasWidth, camerasHeight, PrincipalPoint_x, PrincipalPoint_y, Distortion_k1, Distortion_k2


def CLoud2Colmap_findPhoto(Root):
    PIS = []
    PNs = []

    Omegas = []
    Phis = []
    Kappas = []

    Xs = []
    Ys = []
    Zs = []

    imageList = []
    tiePointList = []
    dList = []
    Block_s = Root.findall("Block")
    for Block in Block_s:
        print("imageList")
        Photogroups_s = Block.findall("Photogroups")
        for Photogroups in Photogroups_s:
            Photogroup_s = Photogroups.findall("Photogroup")
            for Photogroup in Photogroup_s:
                Photo_s = Photogroup.findall("Photo")
                for Photo in Photo_s:
                    # image???????????????Id,camera_id,R,QW,QX,QY,QZ,C,tx,ty,tz, imageName,point2D

                    image = []
                    # ????????????ID
                    PIS.append(int(Photo[0].text) + 1)
                    image.append(int(Photo[0].text) + 1)
                    image.append(1)
                    # ??????????????????
                    PImgId = (Photo[1].text).split("/")[5].strip('.jpg')
                    PNs.append(PImgId)
                    # ????????????????????????????????????
                    M = []
                    for m in ['M_00', 'M_01', 'M_02', 'M_10', 'M_11', 'M_12', 'M_20', 'M_21', 'M_22']:
                        M.append(float(Photo[3].find('Rotation').find(m).text))
                    R = numpy.zeros([3, 3], dtype=float)
                    for i in range(3):
                        for j in range(3):
                            R[i, j] = M[i * 3 + j]
                    tran = numpy.zeros([3, 3], dtype=float)
                    tran[0, 1] = 1
                    tran[1, 1] = -1
                    tran[2, 2] = -1
                    RYZ = numpy.dot(tran, R)
                    q = Quaternion(matrix=R)
                    image.append(R)
                    image.append(q.w)
                    image.append(q.x)
                    image.append(q.y)
                    image.append(q.z)
                    # ??????????????????????????????
                    C = numpy.zeros(3, dtype=float)
                    C[0] = float(Photo[3].find('Center').find('x').text)
                    C[1] = float(Photo[3].find('Center').find('y').text)
                    C[2] = float(Photo[3].find('Center').find('z').text)
                    T = numpy.dot(-R, C)
                    image.append(C)
                    image.append(T[0])
                    image.append(T[1])
                    image.append(T[2])

                    imagePath = Photo.find("ImagePath").text
                    imageName = imagePath.split("/")
                    imageName = imageName[len(imageName) - 1]
                    image.append("mapping/" + imageName)
                    imageList.append(image)
        print("tiePointList")
        TiePoints_s = Block.findall("TiePoints")
        for TiePoints in TiePoints_s:
            TiePoint_s = TiePoints.findall("TiePoint")
            for TiePoint in TiePoint_s:
                # tiePoint:Id, x,y,z,r,g,b,xyz,truck, error
                tiePoint = []
                tiePoint.append(len(tiePointList) + 1)
                tiePoint.append(TiePoint.find("Position").find("x").text)
                tiePoint.append(TiePoint.find("Position").find("y").text)
                tiePoint.append(TiePoint.find("Position").find("z").text)

                tiePoint.append(math.floor(float(TiePoint.find("Color").find("Red").text)*255+0.5))
                tiePoint.append(math.floor(float(TiePoint.find("Color").find("Green").text)*255+0.5))
                tiePoint.append(math.floor(float(TiePoint.find("Color").find("Blue").text)*255+0.5))

                Measurement_s = TiePoint.findall("Measurement")
                XYZ = [tiePoint[1], tiePoint[2], tiePoint[3]]
                XYZ = numpy.array(XYZ)
                tiePoint.append(XYZ.T)
                # truck:IMAGE_ID([]),POINT2D_IDX([])
                # IMAGE_ID: SID([])
                Truck = []
                IMAGE_ID = []
                for Measurement in Measurement_s:
                    D = numpy.zeros(4, dtype=float)
                    D[0] = len(tiePointList) + 1
                    D[1] = int(Measurement.find("PhotoId").text) + 1
                    SID = int(Measurement.find("PhotoId").text) + 1
                    D[2] = float(Measurement.find("x").text)
                    D[3] = float(Measurement.find("y").text)
                    dList.append(D)
                    IMAGE_ID.append(SID)
                Truck.append(IMAGE_ID)
                tiePoint.append(Truck)
                tiePoint.append(1)
                tiePointList.append(tiePoint)
    C = []
    print("point2D")
    for i in range(len(imageList)):
        print("point2D:{0}/{1}".format(i, len(imageList)))
        a = []
        for j in range(len(dList)):
            if dList[j][1] == imageList[i][0]:
                a.append(j)
        r = len(a)
        # point2D:x,y,Point3D_ID
        point2D = []

        for j in range(r):
            point2D.append([dList[a[j]][2], dList[a[j]][3], int(dList[a[j]][0])])
            C.append([imageList[i][0], j + 1, dList[a[j]][0]])
        imageList[i].append(point2D)
    for i in range(len(tiePointList)):
        print("POINT2D_IDX:{0}/{1}".format(i, len(tiePointList)))
        a = []
        for j in range(len(C)):
            if C[j][2] == tiePointList[i][0]:
                a.append(j)
        r = len(a)
        POINT2D_IDX = []
        for j in range(r):
            POINT2D_IDX.append(C[a[j]][1])
        tiePointList[i][8].append(POINT2D_IDX)
    print("writeFile")
    with open("E:/colmap/qunlouPro_3/camera/images1.txt", "w") as file:
        file.write('# Image list with two lines of data per image:\n#   IMAGE_ID, QW, QX, QY, QZ, TX, TY, TZ, CAMERA_ID'
                   ', NAME\n#   POINTS2D[] as (X, Y, POINT3D_ID)\n# Number of images: {0}, mean observations '
                   'per image: 2370.29\n'.format(len(imageList)))
        for i in range(len(imageList)):
            print("write_images:{0}/{1}".format(i,len(imageList) ))
            file.write('{0} {1} {2} {3} {4} {5} {6} {7} {8} {9}\n'.format(imageList[i][0], imageList[i][3],
                                                                          imageList[i][4], imageList[i][5],
                                                                          imageList[i][6], imageList[i][8],
                                                                          imageList[i][9], imageList[i][10],
                                                                          imageList[i][1], imageList[i][11]))
            for j in range(len(imageList[i][12])):
                file.write(
                    '{0} {1} {2} '.format(imageList[i][12][j][0], imageList[i][12][j][1], imageList[i][12][j][2]))
            file.write("\n")

    with open("E:/colmap/qunlouPro_3/camera/points3D1.txt", "w") as file:
        file.write('# 3D point list with one line of data per point:\n#   POINT3D_ID, X, Y, Z, R, G, B, ERROR, '
                   'TRACK[] as (IMAGE_ID, POINT2D_IDX)\n# Number of points: {0}, mean track length: 4.18148\n'.format(
            len(tiePointList)))
        for i in range(len(tiePointList)):
            print("write_point3d:{0}/{1}".format(i, len(tiePointList)))
            file.write('{0} {1} {2} {3} {4} {5} {6} {7} '.format(tiePointList[i][0], tiePointList[i][1],
                                                                 tiePointList[i][2], tiePointList[i][3],
                                                                 tiePointList[i][4], tiePointList[i][5],
                                                                 tiePointList[i][6], tiePointList[i][9]))
            for j in range(len(tiePointList[i][8][0])):
                file.write('{0} {1} '.format(tiePointList[i][8][0][j], tiePointList[i][8][1][j]))
            file.write('\n')


def CLoud2Colmap_findTiePoint(Root, TiePoint_list):
    Block_s = Root.findall("Block")
    for Block in Block_s:
        TiePoints_s = Block.findall("TiePoints")
        for TiePoints in TiePoints_s:
            TiePoint_s = TiePoints.findall("TiePoint")
            for TiePoint in TiePoint_s:
                x = float(TiePoint.find("Position").find("x").text())
                y = float(TiePoint.find("Position").find("y").text())
                z = float(TiePoint.find("Position").find("y").text())
                r = float(TiePoint.find("Color").find("Red").text())
                g = float(TiePoint.find("Color").find("Green").text())
                b = float(TiePoint.find("Color").find("Blue").text())


if __name__ == "__main__":
    # rotate_matrix = [[-0.0174524064372832, -0.999847695156391, 0.0],
    #                  [0.308969929589947, -0.00539309018185907, -0.951056516295153],
    #                  [0.950911665781176, -0.0165982248672099, 0.309016994374948]]
    # q = Quaternion(matrix=numpy.array(rotate_matrix))
    # print(q)

    tree = ET.parse("E:/colmap/qunlouPro_3/dsat2.xml")
    root = tree.getroot()

    CLoud2Colmap_findInfo(root)

    CLoud2Colmap_findPhoto(root)
