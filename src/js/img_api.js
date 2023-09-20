import axios from 'axios';
const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = '39494389-0cbffb7df999a91ec2d35df03';


export async function fetchImgs(query, page) {
  const params = {
    key: API_KEY,
    q: query, 
    image_type: 'photo',
    orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
      
  };

  try {
      const { data } = await axios(BASE_URL, { params });
      return data;
      
  } catch (error) {
    console.log(error);
  }
}