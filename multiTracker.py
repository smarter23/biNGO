import sys
import cv2
from random import randint

cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame,1)
    if not ret:
        print('Error')
        sys.exit(1)
    cv2.imshow("Livestream",frame)
    k = cv2.waitKey(1) & 0xFF
    if k == 27:
        break

boundaries = []
colors = [] 
c = 0
while True:
    if c>=5:
        print("Limit is 5 at a time.")
        break
    boundary = cv2.selectROI('Livestream', frame)
    boundaries.append(boundary)
    colors.append((randint(64, 255), randint(64, 255), randint(64, 255)))
    print("> Press 'q' to exit selection mode.")
    print("> Press any other key to select next object")
    c+=1
    k = cv2.waitKey(0) & 0xFF
    if (k == ord('q')): 
      break

multiTracker = cv2.MultiTracker_create()

for boundary in boundaries:
    multiTracker.add(cv2.TrackerCSRT_create(), frame, boundary)


while cap.isOpened():
    ret, frame = cap.read()
    frame = cv2.flip(frame,1)
    if not ret:
        break
    
    ret, boxes = multiTracker.update(frame)

    for i, box in enumerate(boxes):
      p1 = (int(box[0]), int(box[1]))
      p2 = (int(box[0] + box[2]), int(box[1] + box[3]))
      cv2.rectangle(frame, p1, p2, colors[i], 3)

    cv2.imshow('Livestream', frame)
    
    if cv2.waitKey(1) & 0xFF == 27:  
      break

cap.release()
cv2.destroyAllWindows()