import os
import ShapeDetection as SD

i=0
for element in os.listdir('images'):
    if os.path.isdir(element):
        print("'%s' un dossier" % element)
    else:
        SD.circleDetection(str('images/'+ element))
    i+=1

print(i)