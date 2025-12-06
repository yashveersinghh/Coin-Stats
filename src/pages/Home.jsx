import { useEffect, useState } from "react";
import { fetchCrypto } from "../api/coinGecko";
import CryptoCard from "../components/CryptoCard";
const Home = () => {
    const [cyrptoList, setCryptoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
        <div className="min-h-screen bg-[#010203] p-0">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-[#e0e0e0] gap-4 p-10">
                    <div className="w-6 h-6 border-2 border-[rgba(173, 216, 230, 0.2)] border-t-[#add8e6] border-t rounded-full animate-spin"></div>
                    <p>Loading Crypto Data...</p>
                </div>
            ) : (
                <div className="max-w-3xl m-0 mx-auto p-8">
                    {cyrptoList.map((crypto, key) => (
                        <CryptoCard />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home