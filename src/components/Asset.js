import React, {Component} from 'react';

class Asset extends Component {

    shouldComponentUpdate(np) {
        return (
            this.props.precision !== np.precision ||
            this.props.replace !== np.replace ||
            this.props.asset !== np.asset ||
            this.props.amount !== np.amount
        );
    }

    render() {
        let {precision, asset, amount} = this.props;
        if (!asset) return null;

        amount = precision !== undefined ? amount.toFixed(precision) : amount.toFixed();

        return (
            <span>{amount} <small>{asset.replace("RUDEX.", "")}</small></span>
        );
    }
}

export default Asset;

// AssetName = AssetWrapper(AssetName);

// export default class AssetNameWrapper extends React.Component {
//     render() {
//         return <AssetName {...this.props} asset={this.props.name} />;
//     }
// }
