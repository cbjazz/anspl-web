import pytest
from utils.environments import EnvManager

import os
import shutil

TEST_HOME="/home/splunk/ansible_tmp"

@pytest.fixture
def envManager():
    try:
        shutil.rmtree(TEST_HOME)
    except OSError as e:
        print("Error: %s: %s"%(TEST_HOME, e.strerror))

    os.makedirs(TEST_HOME + "/environments", exist_ok=True)
    envManager = EnvManager(TEST_HOME)
    return envManager

def test_environments(envManager):
    envManager.addEnv("pytest", "test description")
    envs = envManager.getEnvs()
    assert len(envs) > 0
    assert "pytest" in envs[0]['title']
    envManager.deleteEnv("pytest")
    assert len(envManager.getEnvs()) == 0
