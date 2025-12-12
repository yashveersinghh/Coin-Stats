import { useNavigate, useParams } from "react-router"
import { fetchChartData, fetchCoinData } from "../api/coinGecko";
import { useEffect, useState } from "react";
import { formatPrice } from "../utils/formatter";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    loadCoinData();
    loadChartData();
  }, [id])

  const loadCoinData = async() => {
    try{
      const data = await fetchCoinData(id);
      setCoin(data);
    } catch (err) {
        console.error('Error fetching crypto: ', err);
    } finally {
        setIsLoading(false);
    }
  }

  const loadChartData = async() => {
    try{
      const data = await fetchChartData(id);
      const formattedData = data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price.toFixed(2),
      }));
      setChartData(formattedData);
    } catch (err) {
        console.error('Error fetching crypto: ', err);
    } finally {
        setIsLoading(false);
    }
  }
  if(isLoading){
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
            <p>Loading Coin Data...</p>
        </div>
      </div>
    )
  }
  if(!coin){
    return (
      <div className="app">
        <div className="no-results">
          <p className="text-3xl">Coin Not Found</p>
          <button className="back-button" onClick={() => navigate("/")}>Go Back Home</button>
        </div>
      </div>
    )
  }
  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  return (
    <div className="app">
        <header className="header">
            <div className="header-content">
                <div className="logo-section">
                    <h1>🚀 Crypto Tracker</h1>
                    <p>Real-time Cryptocurrency prices and market data</p>
                </div>
                <button className="back-button" onClick={()=>navigate("/")}>⟵ Back to list</button>
            </div>
        </header>
        <div className="coin-detail">
          <div className="coin-header">
            <div className="coin-title">
              <img src={coin.image.large} alt={coin.name} />
              <div>
                <h1>{coin.name}</h1>
                <p className="symbol">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>
            <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
          </div>
          <div className="coin-price-section">
            <div className="current-price">
              <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
              <span 
                  className={`change-badge ${
                      isPositive ? 'positive' : 'negative'
                  }`}
                >
              {isPositive ? '↑' : '↓'}{" "}

                {Math.abs(priceChange).toFixed(2)}%
              </span>
          </div>
          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">{formatPrice(coin.market_data.high_24h.usd)}</span>
            </div>
            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">{formatPrice(coin.market_data.low_24h.usd)}</span>
            </div>
          </div>
        </div>
        <div className="chart-section">
          <h3>Price Chart(7 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={["auto", "auto"]}/>
              <Tooltip contentStyle={{
                backgroundColor: "rgba(20, 20, 40, 0.95",
                border: "1px solid rgba(255, 255, 255, 0.1",
                borderRadius: "8px",
                color: "#e0e0e0"
              }}/>
              <Line type="monotone" dataKey="price" stroke="#ADD8E6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">{formatPrice(coin.market_data.market_cap.usd)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Volume(24h)</span>
            <span className="stat-value">{formatPrice(coin.market_data.total_volume.usd)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">{coin.market_data.circulating_supply?.toLocaleString() || "N/A"}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Supply</span>
            <span className="stat-value">{coin.market_data.total_supply?.toLocaleString() || "N/A"}</span>
          </div>
        </div>
     </div>
     <footer className="footer">
                <p>Data Provided by CoinGecko API || Updated every 30 seconds</p>
            </footer>
    </div>
  )
}

export default CoinDetail