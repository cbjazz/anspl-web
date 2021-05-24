import React from 'react';
import { Form, Button, Checkbox } from 'semantic-ui-react';

import Environments from './Environments';

const client = ( function() {
    function getEnvDetail(envName, success) {
        console.log("~~~~~~~~~~~~~~"+ envName);
        return fetch('/anspl/api/v1.0/env/' + envName, {
            method: 'GET',
            headers: {
                'Accept':'application/json', 
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
                'mode': 'no-cors'
            }
        }).then(checkStatus)
            .then(parseJSON)
            .then(success);
    }


	function createEnv(env, inventory, success) {
		console.log("HERE!!!");
		return fetch('/anspl/api/v1.0/env/' + env, {
			method: 'PUT',
            body: JSON.stringify(inventory),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Allow-Control-Allow-Origin': '*',
				'mode' : 'no-cors'
			},
		}).then(checkStatus)
			.then(parseJSON)
			.then(success);
	}

	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else {
			const error = new Error(`HTTP Error ${response.statusText}`);
			error.status = response.statusText;
			error.response = response;
			console.log(error);
			throw error;
		}
	}

	function parseJSON(response) {
        console.log(response);
		return response.json();
	}

	return{
		createEnv,
        getEnvDetail,
	};
}());

class EnvironmentForm extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            env: '',
            inventory: { 
                env_description: '',
                standalone: '',
                licensemaster: '', 
                clustermaster: '',
                deployment: '',
                deployer: '',
                mc: '',
                indexer: '',
                search: '',
                heavyforwarder: '',
                uf: ''},
            settings: {
                is_standalone: false,
                is_idxcluster: true,
                is_shcluster: false,
                is_forwarder: false
            },
            componentName: 'EnvironmentForm',
        }
	};

    componentDidMount() {
        if ( this.props.viewMode === "V" || this.props.viewMode === "E" ) {
            this.updateEnv(this.props.env);
            this.loadEnvFromServer(this.props.env);
        }
    }

    loadEnvFromServer(env) {
        client.getEnvDetail( env, (inventory) => {
            console.log(inventory)
            this.setState( {inventory: inventory })
        });
    }

    updateEnv = (env) => {
        this.setState( {env: env})
    }


    handleChange = (e) => {
        const newInventory = {...this.state.inventory, [e.target.name]: e.target.value};

        this.setState({ inventory: newInventory });
    }

    handleEnvChange = (e) => {
        console.log(e.target.value);
        this.setState({ env: e.target.value });
    };

    handleSettingChange = (e, { checked }) => {
        const newSettings = {...this.state.settings, [e.target.id]: checked };
        console.log(e.target.id);
        this.setState({ settings: newSettings }); 
    };

    handleSubmit = () => {
        const inventory = this.state.inventory;
        const env = this.state.env;
        this.setState({env: env});
        this.setState({inventory: inventory}); 

        client.createEnv( env, inventory, (result) => {
            console.log(result);
            this.setState({'componentName': 'Environments'});
        });
    }

    handleCancel = () => {
        this.setState({'componentName': 'Environments'});
    }

    renderView(opt) {
        if (opt === 'Environments' ) {
            return <Environments />
        }

        return this.defaultView();
    }

	defaultView() {
        const { env, inventory, settings } = this.state;
        const viewMode = this.props.viewMode
		return ( 
            <Form onSubmit={this.handleSubmit}>
                <Form.Field >
                    <label>Environment Name</label>
                    <input name="env" 
                        value={env} 
                        placeholder='new environment name' 
                        readOnly={viewMode==='V' || viewMode==='E'}
                        onChange={this.handleEnvChange}/>
                </Form.Field>
                <Form.Field >
                    <label>Environment Description</label>
                    <input name="env_description" 
                        value={inventory.env_description} 
                        placeholder='environment description' 
                        readOnly={viewMode==='V' || viewMode==='E'}
                        onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field
                        control={Checkbox}
                        label = {{ children: 'Standalone Setup' }}
                        id ="is_standalone"
                        checked={settings.is_standalone}
                        readOnly={viewMode==='V'}
                        onChange={this.handleSettingChange}
                />
                { settings.is_standalone && (
                    <Form.Field>
                        <label>Stand Alone Host</label>
                        <input name="standalone" 
                            value={inventory.standalone} 
                            placeholder='0.0.0.0' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { !settings.is_standalone && (
                    <Form.Field >
                        <label>License Master Server</label>
                        <input name="licensemaster" 
                            value={inventory.licensemaster} 
                            placeholder='0.0.0.0' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { !settings.is_standalone && (
                    <Form.Field >
                        <label>Monitoring Console Server</label>
                        <input name="mc" 
                            value={inventory.mc} 
                            placeholder='0.0.0.0' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { !settings.is_standalone && (
                    <Form.Field
                        control={Checkbox}
                        label = {{ children: 'Enable Indxer Cluster' }}
                        id ="is_idxcluster"
                        checked={settings.is_idxcluster}
                        readOnly={viewMode==='V'}
                        onChange={this.handleSettingChange}
                    />
                )}
                { !settings.is_standalone && settings.is_idxcluster && (
                    <Form.Field >
                        <label>Cluster Master Server</label>
                        <input name="clustermaster" 
                            value={inventory.clustermaster} 
                            placeholder='0.0.0.0' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { !settings.is_standalone && (
                    <Form.Field >
                        <label>Indexer Servers</label>
                        <input name="indexer" 
                            value={inventory.indexer} 
                            placeholder='0.0.0.0,0.0.0.1,0.0.0.2,...' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { !settings.is_standalone && (
                    <Form.Field
                        control={Checkbox}
                        label = {{ children: 'Enable Search Head Cluster' }}
                        id ="is_shcluster"
                        checked={settings.is_shcluster}
                        readOnly={viewMode==='V'}
                        onChange={this.handleSettingChange}
                    />
                )}
                { !settings.is_standalone && settings.is_shcluster && (
                    <Form.Field >
                        <label>Deployer Server</label>
                        <input name="deployer" 
                            value={inventory.deployer} 
                            placeholder='0.0.0.0' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { !settings.is_standalone && (
                    <Form.Field >
                        <label>Search Head Servers</label>
                        <input name="searchhead" 
                            value={inventory.searchhead} 
                            placeholder='0.0.0.0,0.0.0.1,0.0.0.2,...' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                <Form.Field
                    control={Checkbox}
                    label = {{ children: 'Enable Forwarder Settings' }}
                    id ="is_forwarder"
                    checked={settings.is_forwarder}
                    readOnly={viewMode==='V'}
                    onChange={this.handleSettingChange}
                />
                { settings.is_forwarder && (
                    <Form.Field>
                        <label>Deployment Server</label>
                        <input name="deployment" 
                            value={inventory.deployment} 
                            placeholder='0.0.0.0' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { settings.is_forwarder && (
                    <Form.Field>
                        <label>Heavy Forwarder Servers</label>
                        <input name="heavyforwarder" 
                            value={inventory.heavyforwarder} 
                            placeholder='0.0.0.0,0.0.0.1,0.0.0.2,...' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                { settings.is_forwarder && (
                    <Form.Field >
                        <label>Universal Forwarder Servers</label>
                        <input name="uf" 
                            value={inventory.uf} 
                            placeholder='0.0.0.0,0.0.0.1,0.0.0.2,...' 
                            readOnly={viewMode==='V'}
                            onChange={this.handleChange}/>
                    </Form.Field>
                )}
                <Button>Submit</Button>
                <Button onClick={this.handleCancel}>Cancel</Button>
			</Form>
		);
	}

    render() {
        return (
            this.renderView(this.state.componentName)
        );
    }
}

export default EnvironmentForm;
