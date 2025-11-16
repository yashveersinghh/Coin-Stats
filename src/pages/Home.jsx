import { useEffect, useState } from "react";
import { fetchCrypto } from "../api/coinGecko"

export const Home = () => {

    const [cryptoList, setCryptoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCryptoData = async () => {
        try {
            const data = await fetchCrypto();
            setCryptoList(data); 
        } catch(err){
            console.error('Error fetching crypto currency data:', err);
        } finally {
            setIsLoading(false);
        }
        
    };
    
    useEffect(() => {
        fetchCryptoData();
    }, []);

    return <div className="min-h-screen bg-[#010203] p-0 text-white"></div>
}