import os
import requests

from pathlib import WindowsPath


def ProcessFiles(simulator, type, files, output):
    WindowsPath(output.parent).mkdir(parents=True, exist_ok=True);

    for f in files:
        files[f] = open(files[f], 'rb')

    url = "http://192.168.0.148:8081/parser/" + simulator + "/" + type

    r = requests.post(url, files=files, stream=True)

    for f in files:
        files[f] = files[f].close()

    with open(output, 'wb') as fd:
        for chunk in r.iter_content(chunk_size=128):
            fd.write(chunk)


def GetByExtension(files, ext):
    filtered = filter(lambda f: ext in f.suffix.lower(), files)

    first = next(filtered, None)

    if first is None:
        print("** WARNING: Did not find any file with " + ext + " extension. **")

    if next(filtered, None) is not None:
        print("** WARNING: Found multiple files with " + ext + " extension, using the first one. **")

    return first


def GetCDppFiles(files):
    out = {
        'ma': GetByExtension(files, ".ma"),
        'log': GetByExtension(files, ".log")
    }

    val = GetByExtension(files, ".val")

    if val is not None:
        out["val"] = val

    return out


def GetLopezFiles(files):
    return {
        'ma': GetByExtension(files, ".ma"),
        'log': GetByExtension(files, ".log")
    }


oFolder = WindowsPath("../devs-logs-outputs/")
iFolder = WindowsPath("../devs-logs-originals/")

for curr, dirs, files in os.walk(iFolder):
    curr = WindowsPath(curr)

    if len(curr.parts) == len(iFolder.parts) + 1:
        simulator = curr.parts[len(curr.parts) - 1].lower()

    if len(curr.parts) == len(iFolder.parts) + 2:
        type = curr.parts[len(curr.parts) - 1].lower()

    if len(curr.parts) - len(iFolder.parts) <= 2 or len(files) < 1:
        continue;

    files = list(map(lambda f: curr.joinpath(f), files))

    print("Parsing {0} results for {1}, {2}.".format(curr.stem, simulator, type))

    # TODO: Implement cadmium, validate number of files
    if simulator == "cadmium":
        print("ERROR: Parsing for Cadmium results is not supported yet.")
        continue;

    # CDpp requires ma and log at least
    if simulator == "cdpp" and len(files) > 1:
        files = GetCDppFiles(files)

    if simulator == "lopez" and len(files) > 1:
        files = GetLopezFiles(files)

    # From curr file, replace root folder by output folder
    replace = list(curr.parts[len(iFolder.parts):])
    replace[len(replace) - 1] += ".zip"
    oPath = oFolder.joinpath(*replace)

    ProcessFiles(simulator, type, files, oPath)