import cv2
import numpy as np
import matplotlib.pyplot as plt
import sys
import os

def circleDetection(image) :
    # load the image
    print(image)
    img = cv2.imread(image)
    
    # convert BGR to RGB to be suitable for showing using matplotlib library
    img2 = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # make a copy of the original image
    cimg = img2.copy()
    img = img2.copy()
    
    # convert image to grayscale
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # apply a blur using the median filter
    
    
    img = cv2.Canny(img, 180,200)
    img = cv2.medianBlur(img, 11)
    
    plt.imshow(img)
    plt.show()
    
    # finds the circles in the grayscale image using the Hough transform
    circles = cv2.HoughCircles(image=img, method=cv2.HOUGH_GRADIENT, dp=1, 
                                minDist=40, param1=80, param2=35, minRadius = 10, maxRadius=80)
    
    try :
        for co, i in enumerate(circles[0, :], start=1):
            # draw the outer circle
            cv2.circle(cimg,(i[0],i[1]),i[2],(0,255,0),2)
            # draw the center of the circle
            cv2.circle(cimg,(i[0],i[1]),2,(0,0,255),3)
        
        # print the number of circles detected
        print("Number of circles detected:", co)
        
    except :
        print("No circle was detected.")
        
    grayscale = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    # perform edge detection
    edges = cv2.Canny(grayscale, 100, 200)

    
    # detect lines in the image using hough lines technique
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 60, np.array([]), 50, 5)
    
    try :
        # iterate over the output lines and draw them
        for line in lines:
            for x1, y1, x2, y2 in line:
                cv2.line(cimg, (x1, y1), (x2, y2), color=(20, 220, 20), thickness=3)
        print("Number of lines detected :", len(lines))
    except :
        print("No line detected")
    
    # save the image, convert to BGR to save with proper colors
    #path = 'Analyse'
    path = "D:/Telecom/2A/IGR/Seminar/analyse"
    cv2.imwrite(os.path.join(path , image), cimg)
    #cv2.imwrite("coins_circles_detected.png", cimg)
    # show the image
    #plt.imshow(cimg)
    #plt.show()