import { useEffect, useState, useRef } from "react";
import { fetchCrypto } from "../api/coinGecko";
import CryptoCard from "../components/CryptoCard";
const Home = () => {
    const [cryptoList, setCryptoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('market_cap_rank');
    const [searchQuery, setSearchQuery] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [retryIn, setRetryIn] = useState(0);
    const retryTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    const fetchCryptoData = async (isRetry = false) =>{
        // Clear any existing retry timers
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }

        if (!isRetry) {
            setIsLoading(true);
        }

        try{
            const data = await fetchCrypto();
            setCryptoList(data);
            setError(null);
            setRetryCount(0);
            setRetryIn(0);
        } catch (err) {
            console.error('Error fetching crypto: ', err);
            const isRateLimit = err.message.includes('429') || err.message.includes('rate limit');
            
            if (isRateLimit && retryCount < 5) {
                // Calculate exponential backoff: 10s, 20s, 40s, 80s, 160s
                const delay = Math.min(10 * Math.pow(2, retryCount), 160);
                setError(`Rate limit reached. Retrying in ${delay} seconds...`);
                setRetryIn(delay);
                
                // Start countdown
                countdownIntervalRef.current = setInterval(() => {
                    setRetryIn(prev => {
                        if (prev <= 1) {
                            if (countdownIntervalRef.current) {
                                clearInterval(countdownIntervalRef.current);
                                countdownIntervalRef.current = null;
                            }
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                // Schedule retry
                retryTimeoutRef.current = setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    fetchCryptoData(true);
                }, delay * 1000);
            } else if (isRateLimit) {
                setError('Rate limit exceeded. Please try again later or reload the page.');
            } else {
                setError('Data fetch limit reached. Try again after a minute.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCryptoData();
        
        // Cleanup on unmount
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
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
            ) : error ? (
                <div className="no-results">
                    <p>{error.replace(/\d+ seconds/, `${retryIn} seconds`)}</p>
                    {retryIn === 0 && (
                        <button className="back-button" onClick={() => {
                            setRetryCount(0);
                            fetchCryptoData();
                        }}>Retry Now</button>
                    )}
                </div>
            ) : (
                <div className={`crypto-container ${viewMode}`}>
                    {filteredList.map((crypto, key) => (
                        <CryptoCard crypto={crypto} key={key} />
                    ))}
                </div>
            )}

            <footer className="footer">
                <p>Data Provided by CoinGecko API | Updated every 30 seconds</p>
            </footer>
        </div>
    )
}

export default Home