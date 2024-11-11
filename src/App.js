import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Card, Layout, message } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

const { Header, Content } = Layout;

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => setAccount(accounts[0]))
        .catch(err => console.error(err));
      window.ethereum.on('accountsChanged', accounts => setAccount(accounts[0]));
    } else {
      message.error('请安装 MetaMask 等以太坊钱包扩展');
    }
  }, []);

  // 示例模型数据
  useEffect(() => {
    if (web3) {
      setModels([
        { id: 1, name: '模型 A', description: '高级数据分析模型', price: web3.utils.toWei('0.1', 'ether') },
        { id: 2, name: '模型 B', description: '机器学习预测模型', price: web3.utils.toWei('0.2', 'ether') },
        // 更多模型
      ]);
    }
  }, [web3]);

  const buyModel = async (id, price) => {
    if (!web3 || !account) {
      message.error('请连接钱包');
      return;
    }
    setLoading(true);
    try {
      // 模拟与智能合约交互的购买逻辑
      await web3.eth.sendTransaction({
        from: account,
        to: 'YOUR_CONTRACT_ADDRESS', // 替换为你的合约地址
        value: price
      });
      message.success('购买成功');
    } catch (err) {
      console.error(err);
      message.error('购买失败');
    }
    setLoading(false);
  };

  return (
    <Layout className="App">
      <Header className="App-header">
        <h1>LLM API 交易平台</h1>
        {account ? (
          <p>已连接钱包：{account}</p>
        ) : (
          <Button type="primary" onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
            连接钱包
          </Button>
        )}
      </Header>

      <Content className="App-main">
        <h2>可交易模型列表</h2>
        <div className="model-list">
          {models.map((model) => (
            <Card className="model-card" key={model.id} title={model.name}>
              <p>{model.description}</p>
              <p>价格：{web3.utils.fromWei(model.price, 'ether')} ETH</p>
              <Button type="primary" onClick={() => buyModel(model.id, model.price)} loading={loading}>
                购买模型
              </Button>
            </Card>
          ))}
        </div>
      </Content>
    </Layout>
  );
}

export default App;