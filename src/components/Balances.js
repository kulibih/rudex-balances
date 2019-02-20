import React, {Component} from "react";

import {Table} from "antd";
import Asset from "./Asset"

import {Apis} from "bitsharesjs-ws";
import {ChainStore, FetchChain} from "bitsharesjs";
import BigNumber from "bignumber.js"

const tokens = [
    "PPY",
    "RUDEX.WLS",
    "RUDEX.SMOKE",
    "RUDEX.STEEM",
    "RUDEX.SBD",
    "RUDEX.GOLOS",
    "RUDEX.GBG",
    "RUDEX.BTC",
    "RUDEX.ETH",
    "RUDEX.EOS",
    "RUDEX.KRM",
    "RUDEX.GRC",
    "RUDEX.SCR",
    // "RUDEX.VIZ",
    // "RUDEX.TT",
    // "RUDEX.PPC",
    // "RUDEX.DGB",
    // "RUDEX.MUSE",
];

const coreToken = {
    id: "1.3.0",
    symbol: "BTS",
    precision: 5
};
const warnAccountBalance = BigNumber(50);
const warnPoolBalance = BigNumber(50);
const okAccountBalance = BigNumber(100);
const okPoolBalance = BigNumber(100);


class Balances extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false
        }
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        //this.setState({ loading: true });

        let data = this.state.data;

        tokens.forEach(token => {
            data.push({
                token,
                account: null,
                balance: null,
                supply: null,
                feePool: null,
                accumulatedFees: null
            });
        });

        this.setState({data});

        Apis.instance("wss://api.bts.blckchnd.com", true).init_promise.then(() => {
            ChainStore.init().then(() => {
                tokens.forEach(token => {
                    FetchChain("getAsset", token).then(asset => {
                        FetchChain("getAccount", asset.get("issuer")).then(issuer => {
                            FetchChain("getObject", issuer.getIn(["balances", coreToken.id])).then(balance => {
                                let data = this.state.data;
                                let x = data.find(i => i.token === token);

                                let amount = BigNumber(balance.get("balance")).shiftedBy(-coreToken.precision);
                                let asset = coreToken.symbol;

                                x.account = issuer.get("name");
                                x.balance = {amount, asset};
                                this.setState({data});
                            });
                        });

                        FetchChain("getObject", asset.get("dynamic_asset_data_id")).then(dynAssetData => {
                            let data = this.state.data;
                            let x = data.find(i => i.token === token);
                            x.supply = {
                                amount: BigNumber(dynAssetData.get("current_supply")).shiftedBy(-asset.get("precision")),
                                asset: asset.get("symbol")
                            };
                            x.accumulatedFees = {
                                amount: BigNumber(dynAssetData.get("accumulated_fees")).shiftedBy(-asset.get("precision")),
                                asset: asset.get("symbol")
                            };
                            x.feePool = {
                                amount: BigNumber(dynAssetData.get("fee_pool")).shiftedBy(-coreToken.precision),
                                asset: coreToken.symbol
                            };
                            this.setState({data});
                        });
                    });
                });
            });
        });
    }

    render() {

        const {data, loading} = this.state;

        const columns = [
            {
                title: 'Token',
                dataIndex: 'token',
                key: 'token',
                render: (val, record, index) => {
                    if (val) {
                        return <a href={`https://market.rudex.org/#/asset/${val}`} target="_blank"
                                  rel="noopener noreferrer">
                            {val}
                        </a>;
                    }
                }
            }, {
                title: 'Account',
                dataIndex: 'account',
                key: 'account',
                render: (val, record, index) => {
                    if (val) {
                        return <a href={`https://market.rudex.org/#/account/${val}`} target="_blank"
                                  rel="noopener noreferrer">
                            {val}
                        </a>;
                    }
                }
            }, {
                title: 'Balance (BTS)',
                dataIndex: 'balance',
                key: 'balance',
                render: (val, record, index) => {
                    if (val) {
                        let className = null;
                        if (val.amount.isLessThan(warnAccountBalance)) className = "warn";
                        else if (val.amount.isGreaterThan(okAccountBalance)) className = "success";
                        return <span className={className}>
                            <Asset
                                precision={0}
                                amount={val.amount}
                                asset={val.asset}
                            />
                        </span>;
                    }
                }
            }, {
                title: 'Pool (BTS)',
                dataIndex: 'feePool',
                key: 'feePool',
                render: (val, record, index) => {
                    if (val) {
                        let className = null;
                        if (val.amount.isLessThan(warnPoolBalance)) className = "warn";
                        else if (val.amount.isGreaterThan(okPoolBalance)) className = "success";
                        return <span className={className}>
                            <Asset
                                precision={0}
                                amount={val.amount}
                                asset={val.asset}
                            />
                        </span>;
                    }
                }
            }, {
                title: 'Accumulated Fees',
                dataIndex: 'accumulatedFees',
                key: 'accumulatedFees',
                render: (val, record, index) => {
                    if (val) {
                        return <span>
                            <Asset
                                amount={val.amount}
                                asset={val.asset}
                            />
                        </span>;
                    }
                }
            }, {
                title: 'Supply',
                dataIndex: 'supply',
                key: 'supply',
                render: (val, record, index) => {
                    if (val) {
                        return <span>
                            <Asset
                                amount={val.amount}
                                asset={val.asset}
                            />
                        </span>;
                    }
                }
            },
        ];

        return (
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                loading={loading}
                size="small"
            />
        );
    }
}

export default Balances;