import React, {Component} from "react";

import {Table} from "antd";
import Asset from "./Asset"

import {Apis} from "bitsharesjs-ws";
import {ChainStore, FetchChain} from "bitsharesjs";
import BigNumber from "bignumber.js"

import axios from "axios";

const gatewayApi = "https://gateway.rudex.org/api/v0_3/coins";
const bitsharesApi = "wss://france.bitshares.apasia.tech/ws";


const coreToken = {
    id: "1.3.0",
    symbol: "BTS",
    precision: 5
};
const warnMinAmount = BigNumber(1);
const okAccAmount = BigNumber(100);
const warnAccountBalance = BigNumber(50);
const warnPoolBalance = BigNumber(50);
const okAccountBalance = BigNumber(100);
const okPoolBalance = BigNumber(100);


class Balances extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            prices: {},
            loading: false
        }
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        //this.setState({ loading: true });

        // Make a request for a user with a given ID
        axios.get(gatewayApi)
            .then((response) => {

                let tokens = [];
                response.data.forEach(token => {
                    tokens.push({
                        name: token.symbol,
                        minAmount: token.minAmount,
                        account: token.issuer,
                    });
                });

                this.fetchTokens(tokens);
                this.fetchPrices(tokens);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    fetchPrices(tokens) {
        tokens.forEach(token => {

            axios.get(`https://bitsharescan.com/api/asset/${token.name}/markets?currency=USD&page=1&perPage=10&sort=volume.base&sortDirection=-`)
                .then((response) => {

                    if (response.data.markets) {
                        let price = response.data.markets[0].price.USD;
                        let x = this.state.prices;
                        x[token.name] = price;
                        this.setState({
                            prices: x
                        });
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        });

    }


    fetchTokens(tokens) {
        let data = this.state.data;

        tokens.forEach(token => {
            data.push({
                token: token.name,
                account: token.account,
                balance: null,
                supply: null,
                feePool: null,
                accumulatedFees: null,
                minAmount: null
            });
        });

        this.setState({data});

        Apis.instance(bitsharesApi, true).init_promise.then(() => {
            ChainStore.init(false).then(() => {
                tokens.forEach(token => {
                    FetchChain("getAsset", token.name).then(asset => {
                        FetchChain("getAccount", token.account).then(account => {
                            FetchChain("getObject", account.getIn(["balances", coreToken.id])).then(balance => {
                                let data = this.state.data;
                                let x = data.find(i => i.token === token.name);

                                let amount = BigNumber(balance.get("balance")).shiftedBy(-coreToken.precision);
                                let asset = coreToken.symbol;

                                x.account = account.get("name");
                                x.balance = {amount, asset};
                                this.setState({data});
                            });
                        });

                        FetchChain("getObject", asset.get("dynamic_asset_data_id")).then(dynAssetData => {
                            let data = this.state.data;
                            let x = data.find(i => i.token === token.name);
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

                            // minamount
                            x.minAmount = {
                                amount: BigNumber(token.minAmount).shiftedBy(-asset.get("precision")),
                                asset: asset.get("symbol")
                            };
                            this.setState({data});
                        });
                    });
                });
            });
        });
    }

    render() {

        const {data, prices, loading} = this.state;

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
                title: 'Fee Pool (BTS)',
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
                title: 'Min Deposit',
                dataIndex: 'minAmount',
                key: 'minAmount',
                render: (val, record, index) => {
                    if (val) {

                        let price = prices[val.asset];
                        let priceLabel = null;
                        if (price) {
                            price = BigNumber(price).multipliedBy(val.amount);

                            let priceClassName = null;
                            if (price.isLessThan(warnMinAmount)) priceClassName = "warn";

                            priceLabel = <span className={priceClassName}>(${price.toFixed(4)})</span>;
                        } else {
                            priceLabel = <span>(?)</span>;
                        }

                        let className = null;
                        return <span className={className}>
                            <Asset
                                amount={val.amount}
                                asset={val.asset}
                            /> {priceLabel}
                        </span>;
                    }
                }
            }, {
                title: 'Accumulated Fees',
                dataIndex: 'accumulatedFees',
                key: 'accumulatedFees',
                render: (val, record, index) => {
                    if (val) {
                        let price = prices[val.asset];
                        let priceLabel = null;
                        if (price) {
                            price = BigNumber(price).multipliedBy(val.amount);

                            let priceClassName = null;
                            if (price.isGreaterThanOrEqualTo(okAccAmount)) priceClassName = "success";

                            priceLabel = <span className={priceClassName}>(${price.toFixed(2)})</span>;
                        } else {
                            priceLabel = <span>(?)</span>;
                        }

                        return <span>
                            <Asset
                                amount={val.amount}
                                asset={val.asset}
                            /> {priceLabel}
                        </span>;
                    }
                }
            }, {
                title: 'Supply',
                dataIndex: 'supply',
                key: 'supply',
                render: (val, record, index) => {
                    if (val) {
                        let price = prices[val.asset];
                        let priceLabel = null;
                        if (price) {
                            price = BigNumber(price).multipliedBy(val.amount);

                            priceLabel = <span>(${price.toFixed(2)})</span>;
                        } else {
                            priceLabel = <span>(?)</span>;
                        }

                        return <span>
                            <Asset
                                amount={val.amount}
                                asset={val.asset}
                            /> {priceLabel}
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
