/* eslint-disable @typescript-eslint/no-unused-vars */
// API'den ülke verilerini çeken fonksiyon
export const fetchCountryData = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    const countries = data.map(
      (country: {name: {common: any}}) => country.name.common,
    );

    return countries;
  } catch (error) {
    console.error('Error fetching country data:', error);
    return [];
  }
};

export const fetchCityByCountry = async (country: any) => {
  try {
    const response = await fetch(
      'https://countriesnow.space/api/v0.1/countries/cities',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: country,
        }),
      },
    );
    const data = await response.json();
    if (response.ok) {
      return data.data; // Türkiye'nin şehirlerini döndür
    } else {
      throw new Error('Unable to fetch cities');
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};
