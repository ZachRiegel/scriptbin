prompt("Enter your name: ")
name=readPrompt()
print "Hello", name+"!"

prompt("Number of times to iterate: ")
thresh=int(readPrompt())
print("Fibonacci-ing:")
count=0
fprev=0
fcurrent=1
anchor("anchor-for-a-goto")
fnew=fcurrent+fprev
fprev=fcurrent
fcurrent=fnew
count+=1
print(fnew)
goto("anchor-for-a-goto") if count<thresh else skip()

print "\"Pathological monsters!\" cried a terrified mathematician."
minX = -2.0
maxX = 1.0
width = 120
height = 40
aspectRatio = 2
chars = " .,-:;i+hHM$*#@ "
yScale = (maxX-minX)*(float(height)/width)*aspectRatio

for y in range(height):
    line = ""
    for x in range(width):
        c = complex(minX+x*(maxX-minX)/width, y*yScale/height-yScale/2)
        z = c
        for char in chars:
            if abs(z) > 2:
                break
            z = z*z+c
        line += char
    print line