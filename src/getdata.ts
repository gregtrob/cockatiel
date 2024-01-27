import axios from "axios";

export const fetchData = async (
  port: string,
  random: boolean,
  code: number
) => {
  try {
    const response = await axios.post(`http://localhost:${port}`, {
      random,
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
