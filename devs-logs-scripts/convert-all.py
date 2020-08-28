import os
import requests

from pathlib import WindowsPath

oFolder = WindowsPath("../devs-logs-outputs/")
iFolder = WindowsPath("../devs-logs-originals/")

for curr, dirs, files in os.walk(iFolder):
    curr = WindowsPath(curr)

    if len(files) < 1:
        continue

    files = list(map(lambda f: curr.joinpath(f), files))

    print("Parsing {0} results.".format(curr.stem))

    # From curr file, replace root folder by output folder
    replace = list(curr.parts[len(iFolder.parts):])
    replace[len(replace) - 1] += ".zip"
    oPath = oFolder.joinpath(*replace)

    WindowsPath(oPath.parent).mkdir(parents=True, exist_ok=True);

    body =[]

    for f in files:
        body.append(('files', open(f, 'rb')))

    url = "http://192.168.0.148:8081/parser/auto"

    r = requests.post(url, files=body, stream=True)

    for f in body:
        f[1].close()

    with open(oPath, 'wb') as fd:
        for chunk in r.iter_content(chunk_size=128):
            fd.write(chunk)