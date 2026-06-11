# Wk 2 workshop solutions for task 2 and 3

import glob, os
import string


def parse_doc(inputpath, stop_ws):
    coll = {}    
    os.chdir(inputpath)
    # Example of "inputpath" when you Run...Customized in Mac:
    #   /Users/li/IFN647/wk2_workshop_solutions
    
    myfile=open('6146.xml')
  
    curr_doc = {}
    start_end = False
    
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
            line = line.replace("\\s+", " ")
            for term in line.split():
                word_count += 1 #wk2
                term = term.lower() #wk2
                if len(term) > 2 and term not in stop_words: #wk2
                    try:
                        curr_doc[term] += 1
                    except KeyError:
                        curr_doc[term] = 1
    myfile.close()
    return(word_count, {docid:curr_doc})
    # return a tuple, the first element is the number of words in <text> and
    # the second one is a dirctionary that includes only one pair of doc_id and a disctionary of term_frequency pairs 


if __name__ == '__main__':

    import sys
    if len(sys.argv) != 2:
        sys.stderr.write("USAGE: %s <coll-file>\n" % sys.argv[0])
        sys.exit()

    stopwords_f = open('common-english-words.txt', 'r') # wk2
    stop_words = stopwords_f.read().split(',')
    stopwords_f.close()

    # call the function by using Run...Customized
    x = parse_doc(sys.argv[1],stop_words) # you need to input the real "inputpath"
    
    print('--- Task2: The return value of function parse_doc ---')
    print(x)
    print('--- The outcomes of Task3 ---')
    for doc in x[1].items():
        print('Document itemid: '+ doc[0]+ ' contains: '+ str(x[0]) + ' words and ' + str(len(doc[1])) + ' terms')
            
