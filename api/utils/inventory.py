from os import listdir
from os.path import isfile, isdir, join
import os
import sys
import subprocess
import yaml

ANSIBLE_HOME="/home/splunk/ansible-role-for-splunk_v2"
ENVS_DIR="environments"


'''
Inventory JSON <==> YAML
'''
class InventoryManager:
    def __init__(self, envName, ansible_home=ANSIBLE_HOME):
        self.envName = envName
        self.ansible_home = ansible_home
        self.env_home = join(ansible_home, ENVS_DIR, envName)

    def getInventory(self):
        with open(self.env_home + "/inventory.yml") as f:
            inventory = yaml.load(f, Loader=yaml.FullLoader)
        allhosts = []
        clusterhosts = {}
        for key in inventory.keys():
            if key.lower() == "all":
                allhosts = list(inventory["all"]["hosts"].keys())

            if key.lower() == "full":
                for k in inventory["full"]["children"].keys():
                    clusterhosts[k] = ','.join(list(inventory["full"]["children"][k]["hosts"].keys()))

        return allhosts, clusterhosts

    def setInventory(self, editedInventory):
        yamlInventory = {}
        allInventory = {}
        allInventory["hosts"] = {}
        fullInventory = {}
        childrenInventory = {}
        keyInventory = {}
        for k, v in editedInventory.items():
            hosts = {}
            for host in v.split(','):
                hosts[host] = None
                allInventory["hosts"][host] = None 
            keyInventory[k] = {}
            keyInventory[k]["hosts"] = hosts 
            print(keyInventory[k])
        childrenInventory["children"] = keyInventory
        yamlInventory["full"] = childrenInventory
        yamlInventory["all"] = allInventory
        print(yamlInventory)
        with open(self.env_home + "/inventory.yml", "r") as f:
            comment = f.readline()

        with open(self.env_home + "/inventory.yml", "w+") as f:
            f.write(comment)
            f.write("---\n")
            yamlAll = yaml.dump(yamlInventory)
            f.write(yamlAll)
