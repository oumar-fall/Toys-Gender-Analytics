import pandas as pd
import numpy as np
import os
import keras
import matplotlib.pyplot as plt
from keras.layers import Dense,GlobalAveragePooling2D
from keras.applications import MobileNet
from keras.preprocessing import image
from keras.applications.mobilenet import preprocess_input
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Model
from keras.optimizers import Adam
from PIL import Image
from skimage.transform import resize
##model
base_model=MobileNet(weights='imagenet',include_top=False, input_shape = (400, 400, 3)) #imports the mobilenet model and discards the last 1000 neuron layer.

x=base_model.output
x=GlobalAveragePooling2D()(x)
x=Dense(512,activation='relu')(x) #we add dense layers so that the model can learn more complex functions and classify for better results.
x=Dense(256,activation='relu')(x) #dense layer 2
x=Dense(128,activation='relu')(x) #dense layer 3
preds=Dense(1,activation='sigmoid')(x) #final layer with softmax activation

model=Model(inputs=base_model.input,outputs=preds)
#specify the inputs
#specify the outputs
#now a model has been created based on our architectur


for layer in model.layers[:20]:
    layer.trainable=False
for layer in model.layers[20:]:
    layer.trainable=True

print(model.summary())

##DataProcessing
path = "./Database_LGR/LaGrandeRecre/"

shape = (400, 400, 3)
size = shape[0]

train_dir = 'D://Telecom//2A//IGR//Seminar//Database_LGR//LaGrandeRecre'

"""labels_counter = 0
files_counter = 0
for subdir, dirs, files in os.walk(train_dir):
    #print(files)
    for file in files:
        if (files_counter%1000 == 0):
            print(files_counter)
        full_path = os.path.join(subdir, file)
        try :
            img = Image.open(full_path)
            img = img.resize((d_size, d_size))
            try :
                img.save(full_path)
            except :
                print("couldn't save ", file)
            files_counter += 1
        except :
            print("couldn't open : ", file)
    labels_counter+=1
    print(labels_counter)
        
print(files_counter)"""

##DataGenerator
train_datagen=ImageDataGenerator(preprocessing_function=preprocess_input) #included in our dependencies

train_generator=train_datagen.flow_from_directory(path, # path to the main data folder
                                                 target_size=(size,size),
                                                 color_mode='rgb',
                                                 batch_size=5,
                                                 class_mode='binary',
                                                 shuffle=True)
                                                 
##Model.compile

model.compile(optimizer='Adam',loss='binary_crossentropy',metrics=['accuracy'])
# Adam optimizer
# loss function will be categorical cross entropy
# evaluation metric will be accuracy

step_size_train=train_generator.n//train_generator.batch_size
history = model.fit_generator(generator=train_generator,
                   steps_per_epoch=step_size_train,
                   epochs=3)   
                   
##

filename = 'models/model_transfert' + '.h5'
model.save(filename)

_, train_acc = model.evaluate(train_generator, verbose=0)
plt.plot(history.history['accuracy'], label='train')
plt.legend()
plt.show()                                                 
                                                 
                                                 
                                                 
                                                 