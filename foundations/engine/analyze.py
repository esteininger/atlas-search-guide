import Stemmer
import re
import string


def tokenize(text):
    return text.split()

def lowercase_filter(tokens):
    return [token.lower() for token in tokens]

def stem_filter(tokens):
    STEMMER = Stemmer.Stemmer('english')
    return STEMMER.stemWords(tokens)

def punctuation_filter(tokens):
    PUNCTUATION = re.compile('[%s]' % re.escape(string.punctuation))
    return [PUNCTUATION.sub('', token) for token in tokens]

# top 25 most common words in English and "wikipedia":
# https://en.wikipedia.org/wiki/Most_common_words_in_English
def stopword_filter(tokens):
    STOPWORDS = set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
                     'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
                     'do', 'at', 'this', 'but', 'his', 'by', 'from', 'wikipedia'])
    return [token for token in tokens if token not in STOPWORDS]

def analyze(text):
    tokens = tokenize(text)
    tokens = lowercase_filter(tokens)
    tokens = punctuation_filter(tokens)
    tokens = stopword_filter(tokens)
    tokens = stem_filter(tokens)

    return [token for token in tokens if token]

def main():
    a = analyze("hello world my name is Ethan")
    print(a)

if __name__ == '__main__':
    main()
