import pytest
from utils.inventory import InventoryManager

import os
import shutil

TEST_HOME="/home/splunk/ansible_tmp"
TEST_ENV="inven_test"
TEST_INVEN= """# Splunk Cluster Install Test 
---
all:
  hosts:
    172.31.0.191: null
    172.31.18.167: null
    172.31.19.123: null
    172.31.22.216: null
full:
  children:
    clustermaster:
      hosts:
        172.31.22.216: null
    indexer:
      hosts:
        172.31.0.191: null
        172.31.18.167: null
    licensemaster:
      hosts:
        172.31.22.216: null
    searchhead:
      hosts:
        172.31.19.123: null
"""

@pytest.fixture
def invenManager():
    try:
        shutil.rmtree(TEST_HOME)
    except OSError as e:
        print("Error: %s: %s"%(TEST_HOME, e.strerror))

    os.makedirs(TEST_HOME + "/environments/" + TEST_ENV, exist_ok=True)
    with open(TEST_HOME + "/environments/" + TEST_ENV + "/inventory.yml", "w") as f:
        f.write(TEST_INVEN)
    invenManager = InventoryManager(TEST_ENV, TEST_HOME)
    return invenManager

def test_inventory(invenManager):
    allhosts, clusterhosts = invenManager.getInventory()
    assert len(allhosts) == 4
    assert len(clusterhosts.keys()) == 4 
    invenManager.setInventory(clusterhosts)
