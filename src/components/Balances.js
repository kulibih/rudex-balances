import React, {Component} from "react";

import {Table} from "antd";
import Asset from "./Asset"

import {Apis} from "bitsharesjs-ws";
import {ChainStore, FetchChain} from "bitsharesjs";
import BigNumber from "bignumber.js"

import axios from "axios";

const gatewayApi = "https://gateway.rudex.org/api/v0_3/coins";
const configUrl = "https://config.blckchnd.com/balances.json?"+Date.now();

const coreToken = {
    id: "1.3.0",
    symbol: "BTS",
    precision: 5
};

let bitsharesApi = "wss://btsfullnode.bangzi.info/ws";
let monitor = [];
let warnMinAmount = BigNumber(1);
let okAccumulatedFees = BigNumber(100);
let warnAccountBalance = BigNumber(50);
let warnPoolBalance = BigNumber(50);
let okAccountBalance = BigNumber(100);
let okPoolBalance = BigNumber(100);


class Balances extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            data2: [],
            prices: {},
            loading: false
        }
    }

    componentDidMount() {
        this.start();
    }

    start() {
        axios.get(configUrl)
            .then((response) => {
                let config = response.data;

                bitsharesApi = config.bitshares;


                if (config.gateway.warnMinAmount)
                    warnMinAmount = BigNumber(config.gateway.warnMinAmount);
                if (config.gateway.okAccumulatedFees)
                    okAccumulatedFees = BigNumber(config.gateway.okAccumulatedFees);
                if (config.gateway.warnAccountBalance)
                    warnAccountBalance = BigNumber(config.gateway.warnAccountBalance);
                if (config.gateway.warnPoolBalance)
                    warnPoolBalance = BigNumber(config.gateway.warnPoolBalance);
                if (config.gateway.okAccountBalance)
                    okAccountBalance = BigNumber(config.gateway.okAccountBalance);
                if (config.gateway.okPoolBalance)
                    okPoolBalance = BigNumber(config.gateway.okPoolBalance);

                config.accounts.forEach(account => {
                    monitor.push(account);
                });

                Apis.instance(bitsharesApi, true).init_promise.then(() => {
                    ChainStore.init(false).then(() => {
                        this.fetch();
                        this.fetchData2();
                    })
                });
            });

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

    fetchData2() {
        let data2 = this.state.data2;

        monitor.forEach(item => {
            data2.push({
                id: (item[0] + item[1]),
                account: item[0],
                token: item[1],
                balance: null,
                min: item[2]
            });
        });

        this.setState({data2});

        data2.forEach(item => {
            FetchChain("getAsset", item.token).then(asset => {
                FetchChain("getAccount", item.account).then(account => {
                    FetchChain("getObject", account.getIn(["balances", asset.get("id")])).then(balance => {
                        let data2 = this.state.data2;
                        let x = data2.find(i => i.id === item.id);

                        let amount = BigNumber(balance.get("balance")).shiftedBy(-asset.get("precision"));

                        x.balance = {amount, asset: item.token};
                        this.setState({data2});
                    });
                });
            });
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
    }

    render() {

        const {data, prices, loading, data2} = this.state;

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

                            priceLabel = <span className={priceClassName}><small>(${price.toFixed(3)})</small></span>;
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
                            if (price.isGreaterThanOrEqualTo(okAccumulatedFees)) priceClassName = "success";

                            priceLabel = <span className={priceClassName}><small>(${price.toFixed(0)})</small></span>;
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
                            price = BigNumber(price).multipliedBy(val.amount).dividedBy(1000);

                            priceLabel = <span><small>(${price.toFixed(0)}K)</small></span>;
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

        const columns2 = [
            {
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
                title: 'Balance',
                dataIndex: 'balance',
                key: 'balance',
                render: (val, record, index) => {
                    if (val) {
                        let className = null;
                        if (record.min) {
                            let min = BigNumber(record.min);
                            if (val.amount.isLessThan(min)) className = "warn";
                        }


                        return <span className={className}>
                            <Asset
                                amount={val.amount}
                                asset={val.asset}
                            />
                        </span>;
                    }
                }
            }
        ];

        return (
            <div>
                <h1>Gateways</h1>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    loading={loading}
                    size="small"
                />
                <h1>Monitoring</h1>
                <Table
                    dataSource={data2}
                    columns={columns2}
                    pagination={false}
                    loading={loading}
                    size="small"
                />
            </div>
        );
    }
}

export default Balances;
