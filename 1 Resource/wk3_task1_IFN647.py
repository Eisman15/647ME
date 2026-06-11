import glob, os
import string
#from stemming.porter2 import stem  ## for week 3


def parse_doc(inputpath, stop_ws):
    coll = {}    
    os.chdir(inputpath)
    #myfile=open('741299newsML.xml')
    myfile=open('6146.xml')
    #myfile=open('C:\\python27\\py_CAB431_201\\data\\741299newsML.xml', 'r')
    curr_doc = {}
    start_end = False
    #docid='741299'
    file_=myfile.readlines()
    word_count = 0 #wk2
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
            #print(line)
            #print('-----------')
            line = line.replace("\\s+", " ")
            for term in line.split():
                word_count += 1 #wk2
                #term = stem(term.lower()) ## for wk 3
                term = term.lower() #wk2
                if len(term) > 2 and term not in stop_words: #wk2
                    try:
                        curr_doc[term] += 1
                    except KeyError:
                        curr_doc[term] = 1
    myfile.close()
    return(word_count, {docid:curr_doc})
    # return a tuple, the first element is the number of words in <text> and
    # the second one is a dictionary that includes only one pair of doc_id and a dictionary of term_frequency pairs 


if __name__ == '__main__':

    import sys
    if len(sys.argv) != 2:
        sys.stderr.write("USAGE: %s <coll-file>\n" % sys.argv[0])
        sys.exit()

    stopwords_f = open('common-english-words.txt', 'r') # wk2
    stop_words = stopwords_f.read().split(',')
    stopwords_f.close()

    x = parse_doc(sys.argv[1],stop_words)
    #for doc in x[1].items():
    #    print('Document itemid: '+ doc[0]+ ' contains: '+ str(x[0]) + ' words and ' + str(len(doc[1])) + ' terms')
   
    print('------Terms and Their Frequencies-----')
    for doc in x[1].items():
        doc1 = {k: v for k, v in sorted(doc[1].items(), reverse=False)}
        for term, freq in doc1.items():
            print(term + ' : '+ str(freq))

        
