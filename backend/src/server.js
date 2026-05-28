const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 数据文件路径
const dataFile = path.join(__dirname, '../data/dashboard-data.json');

// 初始化默认数据
const defaultData = {
  industryChain: {
    years: ['2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年', '2025年9月'],
    values: [29, 90, 232, 618, 1140, 2100, 3086, 4600, 6600, 8347]
  },
  userRegistration: {
    years: ['2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年', '2025年9月'],
    values: [2663, 6758, 16113, 39262, 75079, 137386, 227081, 365000, 557000, 678627]
  },
  cooperationBank: {
    years: ['2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年', '2025年9月'],
    values: [1, 7, 55, 263, 642, 1226, 1745, 2700, 3600, 4301]
  },
  industryDistribution: [
    { name: '批发和零售业', value: 194080, percent: '28.60%' },
    { name: '建筑业', value: 167724, percent: '24.72%' },
    { name: '制造业', value: 127678, percent: '18.81%' },
    { name: '租赁和商务服务业', value: 59258, percent: '8.73%' },
    { name: '科学研究和技术服务业', value: 57551, percent: '8.48%' },
    { name: '交通运输、仓储和邮政业', value: 20932, percent: '3.08%' },
    { name: '信息传输、软件和信息技术服务业', value: 15117, percent: '2.23%' },
    { name: '未知行业', value: 8880, percent: '1.31%' },
    { name: '居民服务、修理和其他服务业', value: 5233, percent: '0.77%' },
    { name: '金融业', value: 4905, percent: '0.72%' }
  ],
  financing: {
    years: ['2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'],
    industryConfirmation: [89, 165, 279, 642, 1283, 2414, 3482, 5170, 6160],
    financingLoan: [29, 87, 154, 346, 812, 1769, 2574, 3700, 4430]
  },
  bankLoan: [
    { name: '农业银行', value: 5226.05, percent: '30.46%' },
    { name: '工商银行', value: 3240.55, percent: '18.89%' },
    { name: '云链（天津）商业保理有限公司', value: 1440.28, percent: '8.39%' },
    { name: '中信银行', value: 1160.09, percent: '6.76%' },
    { name: '交通银行', value: 1078.00, percent: '3.22%' },
    { name: '民生银行', value: 571.08, percent: '3.33%' },
    { name: '浙商银行', value: 486.15, percent: '2.83%' },
    { name: '中国银行', value: 394.88, percent: '2.30%' },
    { name: '北京银行', value: 377.70, percent: '2.20%' },
    { name: '青岛银行', value: 311.33, percent: '1.81%' }
  ]
};

// 确保数据文件存在（每次部署都从代码更新数据）
// 这样代码推送更新数据，后台修改也实时生效
try {
  // 读取代码中的最新数据
  const codeData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  // 写入到服务器数据文件
  fs.writeFileSync(dataFile, JSON.stringify(codeData, null, 2));
  console.log('已从代码加载最新数据');
} catch (error) {
  console.error('加载数据文件失败:', error);
  // 如果加载失败，使用默认数据
  fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  console.log('已使用默认数据');
}

// API路由

// 获取所有数据
app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 更新产业链长数据
app.put('/api/data/industry-chain', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    data.industryChain = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '更新数据失败' });
  }
});

// 更新用户注册数据
app.put('/api/data/user-registration', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    data.userRegistration = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '更新数据失败' });
  }
});

// 更新合作银行数据
app.put('/api/data/cooperation-bank', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    data.cooperationBank = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '更新数据失败' });
  }
});

// 更新行业分布数据
app.put('/api/data/industry-distribution', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    data.industryDistribution = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '更新数据失败' });
  }
});

// 更新融资数据
app.put('/api/data/financing', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    data.financing = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '更新数据失败' });
  }
});

// 更新银行放款数据
app.put('/api/data/bank-loan', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    data.bankLoan = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '更新数据失败' });
  }
});

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
  console.log(`数据文件路径: ${dataFile}`);
});
