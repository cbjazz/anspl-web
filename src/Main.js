import React, { Component } from 'react'
import { Container, Menu, Dropdown } from 'semantic-ui-react'

import EnvironmentList from './Environments'
import VariableList from './Variables'

export default class Main extends Component {

    state = { activeItem: 'environment' }

    handleItemClick = (e, {name}) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state;
        
        return (
        <div>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item as='a' header>
                        ANSPL
                    </Menu.Item>
                    <Dropdown item simple text='Ansible'>
                        <Dropdown.Menu>
                            <Dropdown.Item 
                                name="environment"
                                active={activeItem === 'environment'}
                                onClick={this.handleItemClick}> 
                                Environment 
                            </Dropdown.Item>
                            <Dropdown.Item
                                name="variable"
                                active={activeItem === 'variable'} 
                                onClick={this.handleItemClick}> 
                                Variable 
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown item simple text='Splunk'>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                name="action"
                                active={activeItem === 'action'}
                                onClick={this.handleItemClick}> 
                                Action 
                            </Dropdown.Item>
                            <Dropdown.Item
                                name="configuration"
                                active={activeItem === 'configuration'}
                                onClick={this.handleItemClick}> 
                                Configuration 
                            </Dropdown.Item>
                            <Dropdown.Item
                                name="monitoring"
                                active={activeItem === 'monitoring'}
                                onClick={this.handleItemClick}> 
                                Monitoring 
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Menu>
        <Container width={16} style= {{ margin: '7em 1.5em 1.5em' }}>
        { activeItem === 'environment' && (
            <EnvironmentList />
        )}
        { activeItem === 'variable' && (
            <VariableList />
        )}
        </Container>
        </div>
        )
    }
}
