import glob, os
import string


# For Task 1 (1), these definitions can be used for an IR model that classifies documents into two classes:
#   relevant and non-relevant (e.g., the output "binary_output.txt" of an IR model,
#   you can get it from the data file "rel_data.zip").
# For Task 1 (2), these definitions are useful (e.g., for calculating average precisions) for IR models that rank
#   documents (e.g., the output "ranked_output.txt" of an IR model, see the data file "rel_data.zip").

def wk7_input(inputpath):
    coll = {}    
    os.chdir(inputpath)
    # for Task 2
    A = {}
    B= {}
    # for Task 3
    C = {}
    R = {}
    
    # for Task 2
    for line in open("relevance_judgments.txt"):
        line = line.strip()
        line1 = line.split()
        A[line1[1]] = int(float(line1[2]))
    for line in open("binary_output.txt"):
        line = line.strip()
        line1 = line.split()
        B[line1[1]] = int(float(line1[2]))
    # for Task 3
    for line in open("ranked_output.txt"):
        line = line.strip()
        line1 = line.split()
        C[line1[1]] = float(line1[2])
    # get the top-10 document in terms of {rankingNO: documentID, ...}
    i=1
    for (k,v) in sorted(C.items(), key=lambda x:x[1], reverse=True):
        R[i] = k
        i = i+1
        if i>10:
            break
    #print(sorted(C.items(), key=lambda x: float(x[1])))
    print(R)
    return (A,B,R)

if __name__ == '__main__':

    import sys
    if len(sys.argv) != 2:
        sys.stderr.write("USAGE: %s <coll-file>\n" % sys.argv[0])
        sys.exit()
    (rel_doc, retrived_doc, ranked_doc) = wk7_input(sys.argv[1])

    # for task 2
    R = 0
    for (x,y) in rel_doc.items():
        if (y==1):
            R= R+1
    print("The number of relevant documents: " + str(R))
        
    R1 = 0
    for (x,y) in retrived_doc.items():
        if (y==1):
            R1= R1+1
    print("The number of retrieved documents: "+ str(R1))

    RR1 = 0
    for (x,y) in retrived_doc.items():
        if (y==1) & (rel_doc[x]==1):
            RR1= RR1+1
  
    print("The number of retrieved documents that are relevant: " + str(RR1))
    r = float(RR1)/float(R)
    p = float(RR1)/float(R1)
    F1 = 2*p*r/(p+r)
    print("recall = " + str(r))
    print("precision = " + str(p))
    print("F-Measure = " + str(F1))

    # code for task 3
    print("For task 3:")
    ri = 0
    ap1 = 0.0
    for (n,id) in sorted(ranked_doc.items(), key=lambda x: int(x[0])):
        if (rel_doc[id]==1):
            ri =ri+1
            pi = float(ri)/float(int(n))
            ap1 = ap1 + pi
            print("At position " + str(int(n)) + "docID: " + id + ", precision= " + str(pi))
    ap1 = ap1/float(ri)
    print("The average precision = " + str(ap1))
    
