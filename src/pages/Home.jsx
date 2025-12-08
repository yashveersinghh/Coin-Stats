import { useEffect, useState } from "react";
import { fetchCrypto } from "../api/coinGecko";
import CryptoCard from "../components/CryptoCard";
const Home = () => {
    const [cyrptoList, setCryptoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const fetchCryptoData = async () =>{
        try{
            const data = await fetchCrypto();
            setCryptoList(data);
        } catch (err) {
            console.error('Error fetching crypto: ', err);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchCryptoData();
    }, []);
    return (
        <div className="app">
            <div className="controls">
                <div className="filter-group">
                    <label>Sort By:</label>
                    <select>
                        <option value="market_cap_rank">Rank</option>
                        <option value="name">Name</option>
                        <option value="price">Price(low to high)</option>
                        <option value="price_desc">Price(high to low)</option>
                        <option value="change">24h Change</option>
                        <option value="market_cap">Market Cap</option>
                    </select>
                </div>
                <div className="view-toggle">
                    <button className={viewMode === "grid" ? 'active' : ''} 
                        onClick={()=>setViewMode('grid')}>Grid</button>
                    <button className={viewMode === "list" ? 'active' : ''}
                        onClick={()=>setViewMode('list')}>List</button>
                </div>
            </div>
            {isLoading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading Crypto Data...</p>
                </div>
            ) : (
                <div className={`crypto-container ${viewMode}`}>
                    {cyrptoList.map((crypto, key) => (
                        <CryptoCard crypto={crypto} key={key} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home