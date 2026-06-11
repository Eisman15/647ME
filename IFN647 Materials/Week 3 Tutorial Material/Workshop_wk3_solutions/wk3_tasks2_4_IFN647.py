import glob, os
import string
from stemming.porter2 import stem  ## for week 3 (wk3)

#Node class of document
class Doc_Node:
    def __init__(self, data, next=None):
        self.data=data
        self.next=next

#Linked List calss   
class List_Docs:
    def __init__(self, hnode):
        self.head=hnode

    def insert(self, nnode):
        if self.head != None:
            p = self.head
            while p.next != None:
                p=p.next
            p.next=nnode
            
    def lprint(self):
        if self.head != None:
            p = self.head
            while p!= None:
                print('(ID-'+p.data[0] + ':',end =" " )
                print(str(len(p.data[1]))+' terms)',end =" " )
                if p.next != None:
                    print ('-->', end=" ")
                p=p.next
        else:
            print('The list is empty!')



def parse_doc(fn, stop_ws):
    coll = {}    
    #os.chdir(inputpath)
    #myfile=open('741299newsML.xml')
    myfile=open(fn)
    #myfile=open('C:\\python27\\py_CAB431_201\\data\\741299newsML.xml', 'r')
    curr_doc = {}
    start_end = False
    #docid='741299'
    file_=myfile.readlines()
    #word_count = 0 #wk2
    for line in file_:
        line = line.strip()
        #print(line)
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
            line = line.replace("\\s+", " ")
            for term in line.split():
                #word_count += 1 #wk2
                term = stem(term.lower()) ## for wk3
                #term = term.lower() #wk2
                if len(term) > 2 and term not in stop_words: #wk2
                    try:
                        curr_doc[term] += 1
                    except KeyError:
                        curr_doc[term] = 1
    myfile.close()
    dn=Doc_Node((docid,curr_doc), None)
    return(dn)

    # Return a Doc_Node object initialized with a tuple as its data. The tuple consists of two elements: the first element is the document ID,
    # and the second element is a dictionary containing term–frequency pairs.


if __name__ == '__main__':

    import sys
    if len(sys.argv) != 2:
        sys.stderr.write("USAGE: %s <coll-file>\n" % sys.argv[0])
        sys.exit()

    stopwords_f = open('common-english-words.txt', 'r') # wk2
    stop_words = stopwords_f.read().split(',')
    stopwords_f.close()
    os.chdir(sys.argv[1]) # Customized parameter is the data folder name
    fn1='6146.xml'
    fn2='741299newsML.xml'
    fn3='5650.xml'
    # test Task 2
    xn = parse_doc(fn1,stop_words)
    print('------Stems and Their Frequencies in doc '+ fn1 +'-----')
    doc = (xn.data)[1]
    #doc = {k: v for k, v in sorted(doc.items(), reverse=False)}
    for stem1, freq in doc.items(): #cannot use stem as it is a reserved word
        print(stem1 + ' : '+ str(freq))
    #Test Task 3 and Task 4
    xn1 = parse_doc(fn1,stop_words)
    xn2 = parse_doc(fn2,stop_words)
    xn3 = parse_doc(fn3,stop_words)
    
    ll= List_Docs(xn1)
    ll.insert(xn2)
    ll.insert(xn3)
    print('----- The linked list for docs '+ fn1 +', ' + fn2 +' and ' + fn3 +'------')
    ll.lprint()
    

    

   


    

        
