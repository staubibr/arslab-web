import os
import json
import requests


def ProcessFiles(sim, output):
    for f in sim["files"]:
        sim["files"][f] = open(sim["files"][f], 'rb')

    url = "http://192.168.0.148:8081/parser/" + sim["simulator"] + "/" + sim["type"]

    r = requests.post(url, files=sim["files"], stream=True)

    with open(output + sim["id"] + ".zip", 'wb') as fd:
        for chunk in r.iter_content(chunk_size=128):
            fd.write(chunk)


output = "../devs-logs-outputs/"
path = "../devs-logs-originals/"

with open('simulations.json') as json_file:
    data = json.load(json_file)

    for sim in data:
        # names = os.listdir(sim["folder"])
        # files = list(map(lambda f: sim["folder"] + f, names))

        ProcessFiles(sim, output)
