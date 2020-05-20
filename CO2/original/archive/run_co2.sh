#!bin/bash
mkdir results
../../cd++ -m"computer_lab.ma" -l"results/computer_lab.log" -t00:06:00:000
cp results/computer_lab.log01 ./computer_lab.log
rm -r results

