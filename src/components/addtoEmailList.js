import axios from "axios";

export async function addEmail (user_email) {
    try {
      console.log(`${user_email} is to be added to mailing list`);
      const response = await axios.post('https://cb-emailer-api-ochre.vercel.app/add-email', { email: user_email });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log("addEmail fin");
} 

