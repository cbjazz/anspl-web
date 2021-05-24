import React from 'react';
import { Container, Item, Dropdown, Label } from 'semantic-ui-react';

const client = ( function() {
    function getEnvList(success) {
        return fetch('/anspl/api/v1.0/env', {
            method: 'GET',
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


	function getVarList(envname, success) {
		return fetch('/anspl/api/v1.0/'  + envname + "/var", {
			method: 'GET',
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
		return response.json();
	}

	return{
        getEnvList,
		getVarList,
	};
}());

class VariableList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            envs: [],
			variables: {}, 
            selectedEnv: '',
            viewMode: '',
		};
	};

	componentDidMount() {
        this.loadEnvsFromServer();
	}

    loadEnvsFromServer = () => {
        client.getEnvList( (envList) => {
            this.setState( { envs: envList })
        });
    };

	loadVarsFromServer = () => {
		client.getVarList( (varList) => {
			this.setState( { variables: varList })
		});
	};

    setSelectedEnv = (val, mode) => {
        this.setState({selectedEnv: val, viewMode: mode});
    };

    defaultView() {
        const options = this.state.envs.map((env) => (
            { key: env.title, text: env.title, value: env.title }
        ));

        return ( 
            <Container textAlign='left'>
                <Dropdown 
                    placeholder="Select Environment" 
                    selection 
                    options={options} />
            </Container>
        );

    }

	render() {
		return this.defaultView();
	}
}

export default VariableList;
