import time
from flask import Flask, jsonify, request
from utils.environments import EnvManager
from utils.inventory import InventoryManager

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/anspl/api/v1.0/env', methods=['GET'])
def get_envs():
    envManager = EnvManager()
    envMap = envManager.getEnvs()
    return jsonify(envMap)

@app.route('/anspl/api/v1.0/env/<env>', methods=['GET'])
def get_inven(env):
    envManager = EnvManager()
    envList = envManager.getEnvs()
    description = ""
    for envMap in envList:
        if envMap["title"] == env:
            description = envMap["description"]
            break;
    invenManager = InventoryManager(env)
    allhosts, clusterhosts = invenManager.getInventory()
    clusterhosts["env_description"] = description
    print(clusterhosts)
    return jsonify(clusterhosts)

@app.route('/anspl/api/v1.0/env/<env>', methods=['PUT'])
def add_task(env):
    envManager = EnvManager()
    invenManager = InventoryManager()
    content = request.json
    print("New Environment: %s"%(env))
    print("Descritpion: %s"%(content['env_description']))
    try: 
        envManager.addEnv(env, content['env_description'])
        del content['env_description']
        invenManager.setInventory(content)
        return jsonify({'result': True})
    except Exception as e:
        print("Error: %s"%repr(e))
        return jsonify({'result': False})

