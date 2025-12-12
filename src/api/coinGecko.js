const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCrypto = async() =>{
    const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );

    if(!response.ok){
        if (response.status === 429) {
            throw new Error('Rate limit reached (429). Please try again later.');
        }
        throw new Error('Failed to fetch cryptocurrency data');
    }

    return response.json(); 
}

export const fetchCoinData = async(id) =>{
    const response = await fetch(
        `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    if(!response.ok){
        throw new Error('Failed to fetch cryptocurrency data');
    }

    return response.json(); 
}

export const fetchChartData = async(id) =>{
    const response = await fetch(
        `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`
    );

    if(!response.ok){
        throw new Error('Failed to fetch cryptocurrency data');
    }

    return response.json(); 
}