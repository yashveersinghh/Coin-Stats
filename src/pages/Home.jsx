import { useEffect, useState } from "react";
import { fetchCrypto } from "../api/coinGecko";
import CryptoCard from "../components/CryptoCard";
const Home = () => {
    const [cryptoList, setCryptoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('market_cap_rank');
    const [searchQuery, setSearchQuery] = useState('')
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
    
    useEffect(() => {
        filterAndSort();
    }, [cryptoList, sortBy, searchQuery]);
    const filterAndSort = () => {
        let filtered = cryptoList.filter((crypto)=>
            crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
        filtered.sort((a, b) => {
            switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return a.current_price-b.current_price;
            case 'price_desc':
                return b.current_price-a.current_price;
            case 'change':
                return a.price_change_percentage_24h-b.price_change_percentage_24h;
            case 'market_cap':
                return a.market_cap-b.market_cap;
            default:
                return a.market_cap_rank-b.market_cap_rank;
            }
        });
        setFilteredList(filtered);
    };
    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>🚀 Crypto Tracker</h1>
                        <p>Real-time Cryptocurrency prices and market data</p>
                    </div>
                    <div className="search-section">
                        <input type="text" 
                               onChange={(e)=>{setSearchQuery(e.target.value)}} 
                               value={searchQuery}
                               placeholder="Search Cryptos..."
                               className="search-input" />
                    </div>
                </div>
            </header>
            <div className="controls">
                <div className="filter-group">
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e)=>{setSortBy(e.target.value)}}>
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
                    {filteredList.map((crypto, key) => (
                        <CryptoCard crypto={crypto} key={key} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home