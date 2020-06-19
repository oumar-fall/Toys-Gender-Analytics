import numpy as np
from skimage.io import imread, imsave
import keras
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import os
from PIL import Image

import tensorflow as tf
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw
from keras.models import load_model

## Pad and resize an image stored in tab variable

def resize(tab, shape) :
  if tab.shape != shape :
      
    desired_size = shape[0]
    height = tab.shape[0]
    width = tab.shape[1]
    if ((desired_size-height)%2 == 1) :
        ratio_height1 = (desired_size-height)//2
        ratio_height2 = (desired_size-height)//2 + 1
    else :
        ratio_height1 = (desired_size-height)//2
        ratio_height2 = (desired_size-height)//2
        
    if ((desired_size-width)%2 == 1) :
        ratio_width1 = (desired_size-width)//2
        ratio_width2 = (desired_size-width)//2 + 1
    else :
        ratio_width1 = (desired_size-width)//2
        ratio_width2 = (desired_size-width)//2
    
    tab = np.pad(tab, ((ratio_height1,ratio_height2), (ratio_width1,ratio_width2), (0,0)), 'constant', constant_values = 0)
    
  return(tab[:,:,:3])
  
## Predict

def predict(image) :
    
    shape = (200,200,3) #reduce quality to simplify CNN
    desired_size = shape[0]
    
    X_test = np.empty((1, desired_size, desired_size, 3), dtype = 'uint8')
    
    model = load_model('model/model.h5')
    
    imgpil = Image.open(str(image))
    imgpil.thumbnail(shape, Image.ANTIALIAS) #With reduce the image quality
    tab = np.array(imgpil, dtype='uint8') #convert data into array    
    img = resize(tab, shape)
    X_test[0] = img
    
    y_pred = model.predict(X_test)
    
    if(y_pred < 0.5) :
        return(b"Boy !")
    else :
        return(b"Girl !")
    
    
    
    
    
    
    
    
    
    
    