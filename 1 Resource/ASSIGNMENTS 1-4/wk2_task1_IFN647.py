# Week 2 workshop solution for task 1

import string

#myfile=open('C:\\Teaching\\Units\\IFN647\\workshops\\wk2_solutions\\data\\741299newsML.xml', 'r')
myfile=open('741299newsML.xml', 'r') # data in the current folder

start_end = False
file_=myfile.readlines()
word_count = 0 #wk2
for line in file_:
    line = line.strip()
    if(start_end == False):
        if line.startswith("<newsitem "):
            for part in line.split():
                if part.startswith("itemid="):
                    docid = part.split("=")[1].split("\"")[1]
                    break  
        if line.startswith("<text>"):
            start_end = True  
    elif line.startswith("</text>"):
        break
    else:
        line = line.replace("<p>", "").replace("</p>", "")
        line = line.translate(str.maketrans('','', string.digits)).translate(str.maketrans(string.punctuation, ' '*len(string.punctuation)))
        for term in line.split():
            word_count += 1 #wk2
myfile.close()
print('Document itemid: '+ docid+ ' contains: '+ str(word_count) + ' words')
    
        
