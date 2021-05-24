import React from 'react';
import { Container, Item, Button } from 'semantic-ui-react';

import EnvironmentForm from './EnvironmentForm';

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
	};
}());

class EnvironmentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			envs: [], 
            componentName: 'Environments', 
            selectedEnv: '',
            viewMode: '',
		};
	};

	componentDidMount() {
		this.loadEnvsFromServer();
        this.updateComponent('Environments');
	}

	loadEnvsFromServer = () => {
		client.getEnvList( (envList) => {
			this.setState( { envs: envList })
		});
	};

    updateComponent = (opt) => {
        this.setState( {viewMode: "C", componentName: opt });
    };

    setSelectedEnv = (mode, val) => {
        if ( mode === "V" || mode === "E") { 
            this.setState({ 'selectedEnv': val, 'viewMode': mode, 'componentName': 'EnvironmentForm'});
        } else {
            this.setState({selectedEnv: val, viewMode: mode});
        }
    };

    handleCreateButtonClick = () => {
        this.updateComponent('EnvironmentForm');
    };

    defaultView() {
		const envComponents = this.state.envs.map((env) => (
			<Environment
				key		= {env.title}
				title	= {env.title}
				description = {env.description}
                sendData = {this.setSelectedEnv}
			/>
		));
            
        return ( 
            <Container textAlign='left'>
                <Button primary 
                    content='Create New Environment'
                    onClick={this.handleCreateButtonClick}
                    floated='right'/>
                <Item.Group divided>
	    	        {envComponents}
		        </Item.Group>
            </Container>
        );

    }

    renderView(opt) {
        if ( opt === 'Environments' ) {
            return this.defaultView();
        } else if ( opt === 'EnvironmentForm' ){
            return <EnvironmentForm 
                        env = {this.state.selectedEnv}
                        viewMode={this.state.viewMode} />
            
        } 
           
        return this.defaultView();
    }

	render() {
		return this.renderView(this.state.componentName);
	}
}

class Environment extends React.Component {

    handleEditEnv = (e) => {
        console.log(e.target.id);
        this.props.sendData("E", e.target.id);
    }

    handleViewEnv = (e) => {
        console.log(e.target.id);
        this.props.sendData("V", e.target.id);

    }

    handleDeleteEnv = (e) => {
        console.log(e.target.id);
        this.props.sendData("D", e.target.id);
    }

	render() {
		return (
			<Item>
				<Item.Content>
					<Item.Header> { this.props.title } </Item.Header>
                    <Item.Description> {this.props.description } </Item.Description>
					<Item.Extra>
						<Button positive floated='left'  id={this.props.title} onClick={(e) => this.handleViewEnv(e)}>VIEW</Button>
						<Button negative floated='right' id={this.props.title} onClick={(e) => this.handleDeleteEnv(e)}>DELETE</Button>
						<Button positive floated='right' id={this.props.title} onClick={(e) => this.handleEditEnv(e)}>EDIT</Button>
					</Item.Extra>
				</Item.Content>
			</Item>
		);
	}
}

export default EnvironmentList;
