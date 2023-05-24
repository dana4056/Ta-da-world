#! /usr/bin/env python3
#
# %BANNER_BEGIN%
# ---------------------------------------------------------------------
# %COPYRIGHT_BEGIN%
#
#  Magic Leap, Inc. ("COMPANY") CONFIDENTIAL
#
#  Unpublished Copyright (c) 2020
#  Magic Leap, Inc., All Rights Reserved.
#
# NOTICE:  All information contained herein is, and remains the property
# of COMPANY. The intellectual and technical concepts contained herein
# are proprietary to COMPANY and may be covered by U.S. and Foreign
# Patents, patents in process, and are protected by trade secret or
# copyright law.  Dissemination of this information or reproduction of
# this material is strictly forbidden unless prior written permission is
# obtained from COMPANY.  Access to the source code contained herein is
# hereby forbidden to anyone except current COMPANY employees, managers
# or contractors who have executed Confidentiality and Non-disclosure
# agreements explicitly covering such access.
#
# The copyright notice above does not evidence any actual or intended
# publication or disclosure  of  this source code, which includes
# information that is confidential and/or proprietary, and is a trade
# secret, of  COMPANY.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION,
# PUBLIC  PERFORMANCE, OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS
# SOURCE CODE  WITHOUT THE EXPRESS WRITTEN CONSENT OF COMPANY IS
# STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE LAWS AND
# INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE
# CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
# TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE,
# USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
#
# %COPYRIGHT_END%
# ----------------------------------------------------------------------
# %AUTHORS_BEGIN%
#
#  Originating Authors: Paul-Edouard Sarlin
#                       Daniel DeTone
#                       Tomasz Malisiewicz
#
# %AUTHORS_END%
# --------------------------------------------------------------------*/
# %BANNER_END%
import cv2
import os
import numpy as np
import torch
import torchvision.transforms as transforms
import boto3
from PIL import Image, ImageOps

from models.matching import Matching

torch.set_grad_enabled(False)

transform = transforms.Compose([
    transforms.Resize([360, 360]),
    transforms.Grayscale(),
    transforms.ToTensor(),
])

session = boto3.Session(
  aws_access_key_id='AWS_ACCESS_KEY_ID',
  aws_secret_access_key='AWS_SECRET_ACCESS_KEY'
)

client = session.client('s3')
bucket = 'ssafytada'

def inference(answerUrl, treasureUrl):

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print('Running inference on device \"{}\"'.format(device))

    nms_radius = 4
    keypoint_threshold = 0.005
    max_keypoints = -1
    superglue = 'indoor'
    sinkhorn_iterations = 20
    match_threshold = 0.05

    config = {
        'superpoint': {
            'nms_radius': nms_radius,
            'keypoint_threshold': keypoint_threshold,
            'max_keypoints': max_keypoints
        },
        'superglue': {
            'weights': superglue,
            'sinkhorn_iterations': sinkhorn_iterations,
            'match_threshold': match_threshold,
        }
    }

    matching = Matching(config).eval().to(device)
    keys = ['keypoints', 'scores', 'descriptors']

    input_path = './img/answer/'+answerUrl.split("/")[-1]
    target_path = './img/treasure/'+treasureUrl.split("/")[-1]

    print("input_path:"+input_path)
    print("target_path:"+target_path)

    client.download_file(bucket, treasureUrl[50:], target_path)
    client.download_file(bucket, answerUrl[50:], input_path)

    target_origin = cv2.imread(target_path, cv2.IMREAD_GRAYSCALE)
    input_origin = cv2.imread(input_path, cv2.IMREAD_GRAYSCALE)

    target_h, target_w = target_origin.shape[:2]
    input_h, input_w = input_origin.shape[:2]

    # target_origin = cv2.resize(target_origin, (int(target_w * 0.1), int(target_h * 0.1)))
    # input_origin = cv2.resize(input_origin, (int(input_w * 0.1), int(input_h * 0.1)))


    target_img = Image.fromarray(target_origin)
    input_img = Image.fromarray(input_origin)

    target_ = transform(target_img).to(device).unsqueeze(1)
    input_ = transform(input_img).to(device).unsqueeze(1)

    last_data = matching.superpoint({'image' : target_})
    last_data = {k+'0' : last_data[k] for k in keys}
    last_data['image0'] = target_


    matches, confidence = matching({**last_data, 'image1': input_})


    valid = matches > -1
    confidence = torch.mean(confidence[valid])

    print("예측값: {}".format(confidence.item()))
    conf_threshold = 0.6

    if torch.isnan(confidence):
        result = False
        similarity = 0
    elif confidence.item() < conf_threshold:
        result = False
        similarity = confidence.item()
    else:
        result = True
        similarity = confidence.item()


    # text = [
    #     'confidence: {}'.format(confidence.item()),
    #     'is same: {}'.format(result)
    # ]
    # k_thresh = matching.superpoint.config['keypoint_threshold']
    # m_thresh = matching.superglue.config['match_threshold']
    # out = make_matching_plot_fast(target_origin, input_origin,text)
    #
    # cv2.imshow('SuperGlue matches', out)
    # key = chr(cv2.waitKey(1) & 0xFF)
    #
    # cv2.waitKey(0)

    os.remove(target_path)
    os.remove(input_path)

    return result

if __name__ == '__main__':
    inference()