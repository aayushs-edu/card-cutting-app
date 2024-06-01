from flask import Flask, jsonify
import spacy
import en_core_web_sm
import pytextrank
from math import sqrt
from operator import itemgetter
import numpy as np
from collections import OrderedDict

app = Flask(__name__)

nlp = en_core_web_sm.load()
nlp.add_pipe("textrank", last=True)

@app.route('/api/card')
def predict():
    text = """There are a number of narratives about China that feed anti-Asian racism. Attracting the greatest amount of attention is former President Trump’s use of phrases such as “Chinese virus” or “Kung flu.” This was part of a broader narrative strategy to scapegoat China for the pandemic and to displace blame for Trump’s catastrophic mishandling of this public health crisis. The point was not only to claim that COVID-19 came from China, but also that China should take all the blame for its impacts on the US. This contributed to many people in the US blaming anyone in the US who is of Chinese descent, or who “looks Chinese.” A significant proportion of incidents of anti-Asian racism have included language from the perpetrators that assign blame for the pandemic on the victims, or otherwise identify the victims as sources of disease.³ There are also a number of other narratives that, in different ways, identify China as a threat to the US and to ordinary Americans, and thereby feed racism. In addition to blaming China for the pandemic, leaders in US politics and media speak about China as an economic threat and/or a national security threat (through military power, espionage, or so-called “influence” campaigns), and accuse China of “cheating” the US. These narratives are not limited to Republicans or figures on the right like Trump, but are also popular among many Democratic and liberal figures. When these “China threat” narratives are repeated by leaders here in the US, it creates an environment in which many Americans feel encouraged to imagine that these threats are emanating not only from China (as in the country or the government) but also from individual people who are of Chinese descent, or who are perceived to be so. And it creates a sense of license for people to express these racist sentiments in both words and actions. Why is it so easy for people to hear these narratives about the country or the government of China and translate them into racist sentiments against individuals? First, it is a long standing feature of racism against people of Chinese descent (as well as people of many other Asian ethnicities) that they are imagined as being part of a single homogeneous collective, lacking in individuality. This implies that if the collective (“China”) is a threat, then any individual member of that collective is also a threat. In addition, connecting individuals of Asian descent in the US to a threat posed by China is sometimes an explicit feature of these narratives. For example, narratives about the supposed threat of espionage or “influence” from the Chinese government consistently portray individuals of Chinese descent in the US as part of the threat. For example, FBI Director Christopher Wray testified in a 2018 Senate hearing that the espionage threat from China is “not just a whole-of-government threat, but a whole-of-society threat.” He named students and academics from China as part of this “whole-of-society threat,” language that casts anyone of Chinese descent as a potential national security threat. Wray was severely criticized by Asian American civil rights organizations but has continued to make similar sweeping claims.4 Originally appointed by President Trump, Wray was kept in place by President Biden."""
    doc = nlp(text)

    sent_bounds = [ [s.start, s.end, set([])] for s in doc.sents ]

    limit_phrases = 10

    phrase_id = 0
    unit_vector = []

    for p in doc._.phrases:

        unit_vector.append(p.rank)

        for chunk in p.chunks:

            for sent_start, sent_end, sent_vector in sent_bounds:
                if chunk.start >= sent_start and chunk.end <= sent_end:
                    sent_vector.add(phrase_id)
                    break

        phrase_id += 1

        if phrase_id == limit_phrases:
            break

    sum_ranks = sum(unit_vector)

    unit_vector = [ rank/sum_ranks for rank in unit_vector ]

    sent_rank = {}
    sent_id = 0

    for sent_start, sent_end, sent_vector in sent_bounds:
        sum_sq = 0.0

        for phrase_id in range(len(unit_vector)):

            if phrase_id not in sent_vector:
                sum_sq += unit_vector[phrase_id]**2.0

        sent_rank[sent_id] = sqrt(sum_sq)
        sent_id += 1

    sorted(sent_rank.items(), key=itemgetter(1))

    limit_sentences = -1

    sent_text = {}
    sent_id = 0

    for sent in doc.sents:
        sent_text[sent_id] = sent.text
        sent_id += 1

    num_sent = 0

    ranked_sents = []

    for sent_id, rank in sorted(sent_rank.items(), key=itemgetter(1)):

        ranked_sents.append((sent_text[sent_id], rank))

        num_sent += 1

        if num_sent == limit_sentences:
            break
    
    ranked_sents = {sent : rank for sent, rank in sorted(ranked_sents, key=lambda x : x[1])}
    
    # final = OrderedDict({ sent.text : ranked_sents[sent.text] for sent in doc.sents})

    return jsonify({'sents': [sent.text for sent in doc.sents], 'rankedSents': ranked_sents})
