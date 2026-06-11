
#Question 1. Parsing of Documents & Queries
#EISEN ED C. BRIONES
#12300098

#Workshop 2 and 3
  # word: any token obtained from splitting on whitespace after removing digits and punctuation
  # term: a word that has been lowercased, stemmed,longer than 2 characters, and not a stop word

import glob, os
import string
from stemming.porter2 import stem


#Class Doc - Bag-of-Words representation
class Doc:
    def __init__(self, docID):
        self.docID = docID
        self.terms = {}       
        self.doc_size = 0     

    def get_docID(self):
        return self.docID

    def get_termList(self):
        return sorted(self.terms.keys())

    def get_doc_size(self):
        return self.doc_size

    def set_doc_size(self, size):
        self.doc_size = size

    def add_term(self, term):
        # Addition of term or increment if it already exists.
        try:
            self.terms[term] += 1
        except KeyError:
            self.terms[term] = 1


# Task 1.1 - docParser
def docParser(stop_words, folder):
    
    #Parse all XML documents in the folder and return a dictionary {docID: Doc}.
    coll = {}
    curr_path = os.getcwd()
    os.chdir(folder)

    for file_ in glob.glob("*.xml"):
        curr_doc = Doc('')
        start_end = False
        word_count = 0

        for line in open(file_):
            line = line.strip()

            if(start_end == False):
                if line.startswith("<newsitem "):
                    for part in line.split():
                        if part.startswith("itemid="):
                            docid = part.split("=")[1].split("\"")[1]
                            curr_doc.docID = docid
                            break
                if line.startswith("<text>"):
                    start_end = True
            elif line.startswith("</text>"):
                break
            else:
                # Remove <p> and </p> tags
                line = line.replace("<p>", "").replace("</p>", "")
                # Remove digits and replace punctuations with spaces
                line = line.translate(str.maketrans('', '', string.digits)).translate(
                    str.maketrans(string.punctuation, ' ' * len(string.punctuation)))

                for term in line.split():
                    word_count += 1  # count all words for doc_size
                    term = stem(term.lower())
                    if len(term) > 2 and term not in stop_words:
                        curr_doc.add_term(term)

        curr_doc.set_doc_size(word_count)
        coll[curr_doc.docID] = curr_doc

    os.chdir(curr_path)
    return coll


# Task 1.2 - queryParser
def queryParser(query, stop_words):
    # Parse a query string using the same preprocessing as docParser and returns a dictionary {term: frequency}.
    query_terms = {}
    query = query.translate(str.maketrans('', '', string.digits)).translate(
        str.maketrans(string.punctuation, ' ' * len(string.punctuation)))

    for term in query.split():
        term = stem(term.lower())
        if len(term) > 2 and term not in stop_words:
            try:
                query_terms[term] += 1
            except KeyError:
                query_terms[term] = 1

    return query_terms


# Task 1.3 - Main
if __name__ == '__main__':

    # Load stop words
    stopwords_f = open('common-english-words.txt', 'r') # wk2
    stop_wordList = stopwords_f.read().split(',')
    stopwords_f.close()

    # Add extra stop words 
    stop_wordList += ["quot", "amp", "reuter", "reuters"]

    # Parse documents
    coll = docParser(stop_wordList, 'Subset_RCV1v2')

    # Write results to output file
    out = open('EisenEdBriones_Q1.txt', 'w')

    for docID in sorted(coll.keys(), key=lambda x: int(x)):
        doc = coll[docID]

        header = "Document " + docID + " contains " + str(len(doc.terms)) + " indexing terms and have total " + str(doc.doc_size) + " words"
        print(header)
        out.write(header + '\n')

        # Sort terms by frequency descending
        sorted_terms = sorted(doc.terms.items(), key=lambda x: (-x[1], x[0]))
        for term, freq in sorted_terms:
            line = term + ' : ' + str(freq)
            print(line)
            out.write(line + '\n')
        print()
        out.write('\n')

    # Test query parsing 
    queries = [
        "The British-Fashion Awards",
        "US EPA ranks Geo Metro car most fuel-efficient 1997 car",
        "UK: Britain's Channel 5 to broadcast Fashion Awards."
    ]

    for q in queries:
        parsed = queryParser(q, stop_wordList)
        print("Query: " + q)
        print("The parsed query:")
        print(parsed)
        print()
        out.write("Query: " + q + '\n')
        out.write("The parsed query:\n")
        out.write(str(parsed) + '\n\n')

    out.close()
    print("Results saved to EisenEdBriones_Q1.txt")
