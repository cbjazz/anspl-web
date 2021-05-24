from os import listdir
from os.path import isfile, isdir, join
import os
import sys
import subprocess

ANSIBLE_HOME="/home/splunk/ansible-role-for-splunk_v2"
ENVS_DIR="environments"

class EnvManager:
    def __init__(self, ansible_home=ANSIBLE_HOME):
        self.ansible_home = ansible_home
        self.envs_home = join(ansible_home, ENVS_DIR)

    def getEnvs(self):
        envs = [ f for f in listdir(self.envs_home) if isdir(join(self.envs_home, f))]
        #TODO: Add description 
        envMap = []
        for e in envs:
            description = ""
            if not e.startswith("_"):
                try: 
                    f = open(join(self.envs_home, e) + "/inventory.yml", 'r')
                    line = f.readline()
                    f.close()
                    if line.startswith("#"):
                        description = line[1:]
                except FileNotFoundError:
                    print(e + "'s environment does not exist inventory file")
                    pass
                envMap.append( { 'title': e, 'description': description })

        return envMap

    def addEnv(self, envName, envDescription=""):
        envs = self.getEnvs()
        if envName in envs:
            raise Exception("Already %s envs exists"%(envName))

        os.mkdir(join(self.envs_home, envName))
        try:
            f = open(join(self.envs_home, envName) + "/inventory.yml", 'w')
            f.write("#" + envDescription)
            f.close()
        except FileNotFoundError: 
            pass

    def deleteEnv(self, envName):
        try: 
            os.rename(join(self.envs_home, envName), join(self.envs_home, "_" + envName))
        except FileNotFoundError:
            raise Exception("%s envs does not exist"%(envName))
