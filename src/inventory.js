import React from 'react';
import { Item, Label, Button } from 'semantic-ui-react'

class InventoryList extends React.Component {
	render() {
		const envComponents = this.props.envs.map((env) => (
			<Env
				key	= {env}
			/>
		));

		return (
			<Item.Group>
				<Item>
					<Item.Content>
						<Item.Header> </Item.Header>
					</Item.Content>
				</Item>
			</Item.Group>
		);
	}
}
