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

## Pad and resize an image stored in tab variable

def resize(tab) :
  if tab.shape != shape :
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


## Load Images
path = "Database_LGR/LaGrandeRecre"


path_boy = str(path + '/Boy/')
path_girl = str(path + '/Girl/')
path_mixte = 'Images/Mixte/'

shape = (200,200,3) #reduce quality to simplify CNN
desired_size = shape[0]

n_boy = len(os.listdir(path_boy))
n_girl = len(os.listdir(path_girl))

X = np.empty((n_boy + n_girl, desired_size, desired_size, 3), dtype = 'uint8')


#Boy data
j = 0
for i in os.listdir(path_boy) :
    if (j%1000 == 0):
      print(j)
    imgpil = Image.open(str(path_boy + i))
    imgpil.thumbnail(shape, Image.ANTIALIAS) #With reduce the image quality
    tab = np.array(imgpil, dtype='uint8') #convert data into array
    X[j] = resize(tab)
    j+=1
    
#Girl data
for i in os.listdir(path_girl) :
    if (j%1000 == 0):
      print(j)
    imgpil = Image.open(str(path_girl + i))
    imgpil.thumbnail(shape, Image.ANTIALIAS) #With reduce the image quality
    tab = np.array(imgpil, dtype='uint8') #convert data into array    
    X[j] = resize(tab)
    j+=1

y = np.asarray([0 for i in range(n_boy)] + [1 for i in range(n_girl)])

print("Boy proportion : %.2f" % (n_boy/(n_boy + n_girl)*100), '%')


## Data processing

n = n_boy + n_girl

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

del X
del y

l = desired_size

X_train = np.asarray(X_train)
X_test = np.asarray(X_test)

#reshape data to fit model
X_train = X_train.reshape((len(X_train),l,l,-1))
X_test = X_test.reshape((len(X_test),l,l,-1))


X_train = (X_train - np.mean(X_train))/np.std(X_train)

X_test = (X_test - np.mean(X_test))/np.std(X_test)

## Building model
from keras.models import Sequential
from keras.layers import Dense, Conv2D, Flatten#create model

model = Sequential()#add model layers
model.add(Conv2D(64, kernel_size=3, activation='relu', input_shape=shape))
model.add(Conv2D(32, kernel_size=3, activation='relu'))
model.add(Flatten())
model.add(Dense(1, activation='sigmoid'))

## Model Compiling

#compile model using accuracy to measure model performance
model.compile(optimizer='adamax', loss='binary_crossentropy', metrics=['accuracy'])

#train the model
history = model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=5, batch_size = 20)

## Evaluate


# evaluating the model
_, train_acc = model.evaluate(X_train, y_train, verbose=0)
_, test_acc = model.evaluate(X_test, y_test, verbose=0)
print('Train: %.6f, Test: %.6f' % (train_acc, test_acc))

# learning curves of model accuracy
plt.plot(history.history['accuracy'], label='train')
plt.plot(history.history['val_accuracy'], label='test')
plt.legend()
plt.show()

## Save Model

filename = 'models/model_accuracy_' + str(train_acc) + '.h5'
model.save(filename)

##Predict
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw


path_test = "Images/mixte/"

n_test = len(os.listdir(path_test))
X_test = np.empty((n_test, desired_size, desired_size, 3), dtype = 'uint8')

#Test data
j = 0
for i in os.listdir(path_test) :
    if (j%1000 == 0):
      print(j)
    imgpil = Image.open(str(path_test + i))
    imgpil.thumbnail(shape, Image.ANTIALIAS) #With reduce the image quality
    tab = np.array(imgpil, dtype='uint8') #convert data into array    
    X_test[j] = resize(tab)
    j+=1


y_pred = model.predict(X_test)


font = ImageFont.truetype("Economica-Regular.ttf", 20)

for i in range (n_test) :
    if (y_pred[i]<0.4) :
        draw = ImageDraw.Draw(X_test_images[i])
        draw.text((5, 5),str(y_pred[i]),(0,0,0), font = font)
        try :
            X_test[i].save(str('results/boy/' + str(y_pred[i]) + '.jpg'))
        except :
            print("Could not save image. ", i)
    
    elif (y_pred[i]>0.6) :
        draw = ImageDraw.Draw(X_test_images[i])
        draw.text((5, 5),str(y_pred[i]),(0,0,0), font = font)
        try :
            X_test[i].save(str('results/girl/' + str(y_pred[i]) + '.jpg'))
        except :
            print("Could not save image. ", i)
        
    
    else :
        draw = ImageDraw.Draw(X_test_images[i])
        draw.text((5, 5),str(y_pred[i]),(0,0,0), font = font)
        try :
            X_test[i].save(str('results/mixte/' + str(y_pred[i]) + '.jpg'))
        except :
            print("Could not save image. ", i)
    









